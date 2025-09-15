import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import {
  AspectRatio,
  Image,
  PasswordInput,
  TextInput,
  Button,
  Modal,
} from "@mantine/core";
import supabase, { getAccount } from "./supabase";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { getFirstLink } from "./AdminSide/AdminMainPage";

function LoginPage() {
  const account = getAccount();
  const navigate = useNavigate();
  const [forgotState, setForgotState] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const accountForm = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
    },
  });

  const forgotForm = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
    },
  });

  const [loadingAccount, setLoadingAccount] = useState(false);

  async function submitForgotPassword(data) {
    try {
      const { email } = data;

      setForgotLoading(true);

      const { error: errorEmail, data: emailData } = await supabase
        .from("User")
        .select()
        .eq("Email", email);

      if (errorEmail) {
        window.alert(`Something Error: ${errorEmail.message}`);
        return;
      }

      if (emailData.length === 0) {
        window.alert("Account Not Found");
        return;
      }

      const url = window.location.href;
      await supabase.functions.invoke("forgot-password", {
        body: { email, url },
      });

      window.alert("Password Reset Email Sent Successfully!");
      forgotForm.reset();
    } catch (error) {
      console.log(error);
      window.alert(`Something Error: ${error.toString()}`);
    } finally {
      setForgotLoading(false);
    }
  }

  async function submitAccount(data) {
    try {
      setLoadingAccount(true);
      const { email, password } = data;

      const { error: loginError, data: loginData } = await supabase
        .from("User")
        .select()
        .eq("email", email)
        .eq("status","Active")
        .eq("password", password);

      if (loginError) {
        window.alert(`Something Error: ${loginError.message}`);
        return;
      }

      if (loginData.length === 0) {
        window.alert("Account Not Found");
        return;
      }

      const json = JSON.stringify(loginData[0]);
      window.localStorage.setItem("data", json);
      navigate("/admin/analytics");
    } catch (error) {
      window.alert(`Something Error: ${error.toString()}`);
    } finally {
      setLoadingAccount(false);
    }
  }

  if (account) {
    if (account.Role === "superadmin") {
      return <Navigate to='/admin/analytic' />;
    }

    const access = account.access || [];
    const firstLink = getFirstLink(access);

    return <Navigate to={`/admin/${firstLink}`} />;
  }

  return (
    <div className='w-full h-screen relative'>
      <Modal
        title='Forgot Password'
        opened={forgotState}
        onClose={() => setForgotState(false)}
      >
        <form
          onSubmit={forgotForm.onSubmit(submitForgotPassword)}
          className='pt-2'
        >
          <TextInput
            type='email'
            {...forgotForm.getInputProps("email")}
            label='Email Address'
            placeholder='Enter Email Address'
            required
          />
          <Button
            mt={7}
            type='submit'
            size='xs'
            loading={forgotLoading}
          >
            Submit
          </Button>
        </form>
      </Modal>

      <div style={{height:'20%' , width: '100vw'}} className='bg-black flex items-center justify-center pb-4'>
        <Link to='/'>
          <AspectRatio>
            <Image
              h='100%'
              src='../images/Admin-Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
        </Link>
      </div>

      <div className='w-full flex items-center justify-center h-[calc(100%-10rem)]'>
        <div className='login-box'>
          <p className='text-xl font-black'>Log In Account</p>
          <hr />
          <form onSubmit={accountForm.onSubmit(submitAccount)}>
            <TextInput
              type='email'
              size='lg'
              label='Email Address'
              placeholder='Enter Email Address'
              {...accountForm.getInputProps("email")}
              required
            />
            <PasswordInput
              required
              label='Password'
              size='lg'
              placeholder='Enter Password'
              {...accountForm.getInputProps("password")}
            />

            <div className='forgot-password'>
              <Button
                size='xs'
                variant='transparent'
                px={0}
                onClick={() => setForgotState(true)}
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type='submit'
              loading={loadingAccount}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
