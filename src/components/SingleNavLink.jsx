import { NavLink } from "react-router-dom";
import { NavLink as MantineNavLink } from "@mantine/core";

function SingleNavLink({ to, Icon, label, onClick }) {
  return (
    <NavLink
      onClick={onClick}
      to={to}
      style={{
        color: "black",
        textDecoration: "none",
      }}
    >
      {({ isActive }) => (
        <MantineNavLink
          leftSection={Icon && <Icon size={20} />}
          styles={{
            root: {
              background: isActive ? "#FF6900 " : "",
              color: isActive ? "#fff" : "",
            },
          }}
          style={{ borderBottom: "1px solid #ccc" }}
          color='dark'
          component='button'
          label={label}
        />
      )}
    </NavLink>
  );
}

export default SingleNavLink;
