// Setup Supabase Edge Runtime & SMTP
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SmtpClient } from "jsr:@xtool/smtp";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Add Deno types
/// <reference types="https://deno.land/x/deno@v1.36.4/lib/deno.ns.d.ts" />

// Expanded CORS headers to cover all expected ones
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Replace with frontend URL in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, X-Client-Info, x-client-info, X-Supabase-Client-Info",
};

// Start Edge Function
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { email, url } = await req.json();

    if (!email || !url) {
      return new Response(
        JSON.stringify({ error: "Missing email or URL." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fixedUrl = url.replace("/login", "");

    // Generate token + link
    const resetToken = crypto.randomUUID();
    const resetLink = `${fixedUrl}/reset-password/${resetToken}`;

    // @ts-ignore
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Save token
    const { error: insertError } = await supabase
      .from("password_resets")
      .insert({
        email,
        token: resetToken,
        expires_at: new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString(), // Current date + 1 hour
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store reset token." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email
    const client = new SmtpClient();
    await client.connect({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("SENDER_USERNAME")!,
      password: Deno.env.get("SENDER_PASSWORD")!,
      tls: true,
    });

    await client.send({
      from: Deno.env.get("SENDER_USERNAME")!,
      to: email,
      subject: "Reset your password",
      html: `
        <p>Hi ${email},</p>
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <br/>
        <p>— Imosti</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Password reset email sent." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
