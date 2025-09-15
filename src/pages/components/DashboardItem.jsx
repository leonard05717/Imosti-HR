import { ActionIcon, Text } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";

function DashboardItem({ Icon, label = "", value, items = [] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: 10,
        border: "1px solid #0003",
        height: "fit-content",
        padding: "20px",
        borderRadius: 10,
        position: "relative",
        boxShadow: "2px 3px 8px #0002",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 15,
          right: 15,
        }}
      >
        <ActionIcon
          variant='subtle'
          color='dark'
          hidden
        >
          <IconDotsVertical />
        </ActionIcon>
      </div>

      <Icon size={70} />
      <Text
        fw={1000}
        fz={30}
      >
        {value}
      </Text>
      <Text size='sm'>{label}</Text>
    </div>
  );
}

export default DashboardItem;
