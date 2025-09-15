import { Text } from "@mantine/core";

function PieCourseItem({ color, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 5,
       
      }}
    >
      <div
        style={{
          width: 25,
          height: 25,
          minWidth: 25,
          border: `2px solid ${color}`,
          backgroundColor: `${color}88`,
        }}
      ></div>
      <Text size='sm'>{label || "item"}</Text>
    </div>
  );
}

export default PieCourseItem;
