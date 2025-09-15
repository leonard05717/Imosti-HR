import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, key);

/**
 * Retrieves the account data from localStorage.
 *
 * @returns {Object|null} The account object if found, otherwise null.
 */
export function getAccount() {
  const json = localStorage.getItem("data");
  if (!json) return null;
  const obj = JSON.parse(json);
  delete obj.Password;
  return obj;
}

export async function autoCancelAppointment() {}

export default supabase;
