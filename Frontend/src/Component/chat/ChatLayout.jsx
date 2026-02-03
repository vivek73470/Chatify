
import { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import Sidebar from "./sidebar";
import ChatArea from "./ChatArea";

const ChatLayout = ({ onlineUsers }) => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Box sx={{ display: "flex", width: '100%' }}>
      {isMobile ? (
        <Drawer open={!selectedUser} variant="temporary"
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
            },
          }}
        >
          <Sidebar onSelectUser={setSelectedUser} onlineUsers={onlineUsers} />
        </Drawer>
      ) : (
        <Sidebar onSelectUser={setSelectedUser} onlineUsers={onlineUsers} />
      )}

      {(!isMobile || selectedUser) && (
        <ChatArea
          onlineUsers={onlineUsers}
          user={selectedUser}
          onBack={() => setSelectedUser(null)}
          isMobile={isMobile}
        />
      )}
    </Box>
  );
};

export default ChatLayout;
