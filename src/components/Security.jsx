import React from "react";
import { getAccount } from "../supabase";
import { IconWorldCancel } from "@tabler/icons-react";
import { Navigate } from "react-router-dom";

function Security({ children, page }) {
  const account = getAccount();

  if (!account) return <Navigate to='/login' />;

  if (account.Role === "superadmin") return children;

  if (account.access.includes(page)) return children;

  return (
    <div className='flex items-center justify-center flex-col gap-4 h-full'>
      <IconWorldCancel size={50} />
      <div className='text-2xl font-montserrat-black'>Access Denied</div>
    </div>
  );
}

export default Security;
