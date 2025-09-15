import './App.css';
import { createClient } from '@supabase/supabase-js'
import {ActionIcon, Image, Menu} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconMenu2, IconUser } from '@tabler/icons-react';







function sample() {
    

    return(
        <div >
        <Header leftSection={(
        <div className="pl-3 flex items-center gap-x-3">
          <div className="block md:hidden">
            <ActionIcon onClick={() => setDrawerState(curr => !curr)} variant="transparent" color="dark">
              <IconMenu2 />
            </ActionIcon>
          </div>
          <Text ff="montserrat-bold" size="lg">Administrator</Text>
        </div>
      )} title="Admin" rightSection={(
        <div className="pr-5">
          <Menu withArrow>
            <Menu.Target>
              <div className="w-full cursor-pointer p-1 rounded-md ml-5 flex items-center gap-x-2">
                <Text
                  size="sm"
                >{toProper(`${user.firstname} ${user.lastname}`)}</Text>
                <IconUser size={17} />
              </div>
            </Menu.Target>
            <Menu.Dropdown w={160} style={{
              boxShadow: '1px 2px 5px #0005'
            }}>
              <Menu.Item onClick={async () => {
                console.log(user);

                accountForm.setValues({
                  ...user,
                  password: ''
                })
                openAccountState()
              }} leftSection={<IconUser size={15} />}>Account</Menu.Item>
              <Menu.Item onClick={logoutEventHandler} leftSection={<IconLogout2 size={15} />}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )} />

        </div>

    )
}
export default sample;