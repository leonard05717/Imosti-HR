import { Link, useParams } from "react-router-dom";
import {
  AspectRatio,
  Image,
  TextInput,
  Button,
  Container,
  Card,
  Divider,
  Text,
  PasswordInput,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const [userId, setUserId] = useState(undefined);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 characters" : null,
      confirmPassword: (value) =>
        value !== form.values.password ? "Passwords do not match" : null,
    },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await supabase
        .from("Staff-Info")
        .update({
          Password: values.password,
        })
        .eq("id", userId);

      const { error: updateError } = await supabase
        .from("password_resets")
        .update({
          is_done: true,
        })
        .eq("token", token);

      if (updateError) {
        setUserId(null);
        return;
      }

      window.alert("Password Reset Successfully!");
      navigate("/login");
    } catch (error) {
      window.alert(error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const { data: resetData, error } = await supabase
        .from("password_resets")
        .select("*")
        .eq("token", token)
        .single();

      if (error) {
        setUserId(null);
        return;
      }

      const expiresAt = new Date(resetData.expires_at);
      const now = new Date();

      if (now > expiresAt || resetData.is_done) {
        setUserId(null);
      } else {
        const { data: emailData, error: emailError } = await supabase
          .from("Staff-Info")
          .select("id")
          .eq("Email", resetData.email)
          .single();

        if (emailError) {
          setUserId(null);
          return;
        }

        setUserId(emailData.id);
      }
    };
    checkToken();
  }, []);

  return (
    <div>
      <div className='bg-black flex items-center justify-center pb-4'>
        <Link to='/admin/analytics'>
          <AspectRatio>
            <Image
              h='100%'
              src='../images/Admin-Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
        </Link>
      </div>
      <Container>
        <Card
          withBorder
          p='md'
          radius='md'
          shadow='md'
          style={{
            maxWidth: "400px",
            margin: "auto",
          }}
          mt={20}
        >
          {userId === undefined ? (
            <div className='flex items-center justify-center gap-2 flex-col h-[10rem]'>
              <Loader color='dark' />
              <Text
                c='dark'
                ff='montserrat-bold'
              >
                Loading...
              </Text>
            </div>
          ) : userId === null ? (
            <div className='flex items-center justify-center gap-2 flex-col h-[10rem]'>
              <Text ff='montserrat-black'>Invalid or Expired Token</Text>
            </div>
          ) : (
            <div>
              <Text ff='montserrat-black'>Reset Password</Text>
              <Divider
                mt={10}
                mb={20}
              />
              <form
                className='space-y-2 '
                onSubmit={form.onSubmit(onSubmit)}
              >
                <PasswordInput
                  label='New Password'
                  placeholder='New Password'
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  label='Confirm Password'
                  placeholder='Confirm Password'
                  {...form.getInputProps("confirmPassword")}
                />
                <Button
                  mt={10}
                  type='submit'
                  ff='montserrat-black'
                  loading={loading}
                >
                  Reset Password
                </Button>
              </form>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default ResetPassword;
