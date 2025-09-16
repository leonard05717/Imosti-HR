import { Navigate, NavLink, Outlet } from "react-router-dom";
import { CloseButton, NavLink as MantineNavLink } from "@mantine/core";
import {
  IconCertificate,
  IconChartHistogram,
  IconFolder,
  IconMan,
  IconMessage2Cog,
  IconReport,
  IconSchool,
  IconSettings,
  IconTool,
  IconUserShare,
} from "@tabler/icons-react";
import SingleNavLink from "../components/SingleNavLink";
import { useDrawer } from "../context/DrawerContext";
import { getAccount } from "../supabase";

const links = [
  {
    label: "Analytic",
    to: "analytic",
    icon: IconChartHistogram,
  },
  {
    label: "Maintenance",
    to: "maintenance",
    icon: IconTool,
  },
  {
    label: "Employee",
    to: "Medical",
    icon: IconMan,
  },
  {
    label: "Master List",
    to: "masterlist",
    icon: IconReport,
  },
];

/**
 * Gets the first accessible link based on the order in the links array
 * @param {string[]} access - Array of accessible route names ("to" values)
 * @returns {string|null} - The first accessible route or null if none found
 */
export function getFirstLink(access) {
  for (const link of links) {
    if (access.includes(link.to)) {
      return link.to;
    }
  }
  return null;
}

function AdminMainPage() {
  const account = getAccount();
  const { isOpen, setIsOpen } = useDrawer();

  if (!account) {
    return <Navigate to='/login' />;
  }

  return (
    <div
      id='drawer'
      className='flex w-full h-screen'
    >
      <div
        style={{ backgroundColor: "gray" }}
        data-open={isOpen}
        className='data-[open=true]:left-[0] w-[270px] duration-150 h-full p-5 fixed md:relative z-10 left-[-270px] md:left-[0]'
      >
        <div className='absolute top-2 right-2 block md:hidden text-white'>
          <CloseButton
            onClick={() => setIsOpen(false)}
            color='white'
            variant='transparent'
          />
        </div>
        <div className='w-full py-5'>
          <img
            className='w-full'
            src='/images/Admin-Logo.png'
            alt='Admin Logo'
          />
        </div>

        {links
          .filter((link) => {
            if (account.Role === "superadmin") return true;
            const access = account.access || [];
            return access.includes(link.to);
          })
          .map((link, i) => (
            <SingleNavLink
              key={i}
              onClick={() => setIsOpen(false)}
              to={link.to}
              label={link.label}
              Icon={link.icon}
            />
          ))}
      </div>
      <div className='flex flex-col md:w-[calc(100%-270px)] w-full h-full'>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminMainPage;
