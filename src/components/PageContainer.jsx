import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  FileButton,
  Group,
  Loader,
  Menu,
  Modal,
  NumberInput,
  PasswordInput,
  ScrollAreaAutosize,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconLogout,
  IconMenu,
  IconMenu2,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import supabase, { getAccount } from "../supabase";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";
import { useDrawer } from "../context/DrawerContext";
import { useForm } from "@mantine/form";
import { useState } from "react";

function PageContainer({ children, title, rightSection, outsideChildren }) {
  const account = getAccount();
  const navigate = useNavigate();
  const { setIsOpen } = useDrawer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [number, Setnumber] = useState("");


  const Number = (event) => {
    Setnumber(event.target.value);
  };

  const accountForm = useForm({
    mode: "controlled",
    initialValues: {
      Email: account?.Email || "",
      Password: "",
    },
  });
  const [img, setImg] = useState(account?.profile || "");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);

  async function uploadProfileImage(file, userId) {
    const fileExt = file.name.split(".").pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error.message);
      return "";
    }

    const { data: urlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || "";
  }

  async function saveAccountEventHandler(values) {
    try {
      setLoadingUpdate(true);
  
  
      if (values.Password && values.Password.trim() === "") {
        window.alert("Password cannot be empty or spaces only.");
        setLoadingUpdate(false);
        return;
    }
  
      // Step 2: Update record if email is unique
      const { data: updatedData, error: updateError } = await supabase
        .from("User")
        .update({
          email: values.Email,
          password: values.Password ? values.Password : undefined,
        })
        .eq("id", "1")
        .select()
        .single();
  
      if (updateError) {
        console.error(updateError);
        window.alert("Error updating account.");
        setLoadingUpdate(false);
        return;
      }
  
      accountForm.setFieldValue("Password", "");
      localStorage.setItem("data", JSON.stringify(updatedData));
      window.alert("Update Account Successfully!");
      setIsModalOpen(false)
    } catch (err) {
      console.error(err);
      window.alert("An error occurred.");
    } finally {
      setLoadingUpdate(false);
    }
  }

  async function logoutEventHandler() {
    const conf = await new Promise((resolve, reason) => {
      modals.openConfirmModal({
        title: "Confirmation",
        children: <div className='pt-3'>Are you sure you want to logout?</div>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
    if (!conf) return;
    localStorage.removeItem("data");
    navigate("/login");
  }

  return (
    <div className='h-full w-full relative flex flex-col gap-2'>
      {outsideChildren}

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Box className='max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6'>
          <div className='flex items-center justify-center flex-col space-y-2'>
            <div className='relative'>
              <div className='absolute z-[1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                {loadingImg && <Loader />}
              </div>
              <Avatar
                size={100}
                radius='2'
                src={img}
                alt='User avatar'
                style={{ border: "1px solid #0005" }}
              />
            </div>
            <FileButton
              onChange={async (f) => {
                if (!account) {
                  window.alert("No Account Found");
                  return;
                }

                try {
                  setLoadingImg(true);
                  const url = await uploadProfileImage(f, account.id);
                  let newAccount = {
                    ...account,
                    profile: url,
                  };
                  await supabase
                    .from("User")
                    .update({
                      profile: url,
                    })
                    .eq("id", account.id);
                  localStorage.setItem("data", JSON.stringify(newAccount));
                  setImg(url);
                } catch (err) {
                  console.error(err);
                } finally {
                  setLoadingImg(false);
                }
              }}
              accept='image/png,image/jpeg'
            >
              {(props) => (
                <Button
                  leftSection={<IconUpload size={18} />}
                  variant='light'
                  {...props}
                >
                  Upload new photo
                </Button>
              )}
            </FileButton>
          </div>

          <Divider my='sm' />

          <form
            className='space-y-4'
            onSubmit={accountForm.onSubmit(saveAccountEventHandler)}
          >
            <TextInput
              type="email"
              label='Email'
              required
              placeholder='Enter your email'
              {...accountForm.getInputProps("Email")}
            />
            <PasswordInput
              label='New Password'
              placeholder='Enter New Password'
              minLength={8}
              {...accountForm.getInputProps("Password")}
            />

            <Group
              position='right'
              mt='md'
            >
              <Button
                loading={loadingUpdate}
                type='submit'
              >
                Save Changes
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <div className='flex items-center justify-between border-b border-slate-400 h-14 bg-[#FF6900] px-5 text-white'>
        <div className='flex items-center gap-x-2'>
          <div className='h-[1.8rem] block md:hidden'>
            <ActionIcon
              variant='subtle'
              color='white'
              onClick={() => setIsOpen(true)}
            >
              <IconMenu2 size={25} />
            </ActionIcon>
          </div>
          <Text
            fw='bold'
            title={title}
          >
            {title}
          </Text>
        </div>
        <div className='flex items-center gap-x-2'>
          {rightSection}
          <Menu
            withArrow
            styles={{
              arrow: {
                borderTop: "1px solid #0005",
                borderLeft: "1px solid #0005",
              },
            }}
          >
            <Menu.Target>
              <div className='flex items-center gap-x-2 pl-2 rounded-sm cursor-pointer hover:opacity-90 active:opacity-60 select-none'>
                <Text size='sm'>
                  {account ? account.Last_Name : "No Account Found"}
                </Text>
                <Avatar
                  src={account?.profile || ""}
                  variant='transparent'
                  color='white'
                  size={32}
                />
              </div>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                width: 180,
                boxShadow: "1px 2px 3px #0005",
                border: "1px solid #0005",
              }}
            >
              <Menu.Item
                onClick={() => setIsModalOpen(true)}
                leftSection={<IconUser size={18} />}
              >
                Account
              </Menu.Item>
              <Menu.Item
                onClick={logoutEventHandler}
                leftSection={<IconLogout size={18} />}
              >
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
      <ScrollAreaAutosize
        w='100%'
        h='calc(100% - 3.5rem)'
        px={15}
        py={15}
      >
        {children}
      </ScrollAreaAutosize>
    </div>
  );
}

export default PageContainer;
