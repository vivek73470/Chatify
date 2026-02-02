import {
    Box,

} from "@mui/material";
const MessageTick = ({ isMe, status }) => {
  if (!isMe) return null;

  let color = "#7a7a7a";
  let icon = "✓";

  if (status === "delivered") {
    icon = "✓✓";
    color = "#7a7a7a";
  }
  
  if (status === "read") {
    icon = "✓✓";
    color = "#53bdeb"; 
  }

  return (
    <Box
      component="span"
      sx={{
        fontSize: '14px',
        fontWeight: 600,
        color: color,
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1,
        ml: 0.3,
      }}
    >
      {icon}
    </Box>
  );
};

export default MessageTick;