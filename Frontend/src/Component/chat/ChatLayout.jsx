
import { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import Sidebar from "./sidebar";
import ChatArea from "./ChatArea";

const ChatLayout = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {isMobile ? (
        <Drawer open={!selectedUser} variant="temporary">
          <Sidebar onSelectUser={setSelectedUser} />
        </Drawer>
      ) : (
        <Sidebar onSelectUser={setSelectedUser} />
      )}

      {(!isMobile || selectedUser) && (
        <ChatArea
          user={selectedUser}
          onBack={() => setSelectedUser(null)}
          isMobile={isMobile}
        />
      )}
    </Box>
  );
};

export default ChatLayout;
