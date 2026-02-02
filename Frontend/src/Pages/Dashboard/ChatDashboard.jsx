
import { useEffect, useState } from 'react';
import ChatLayout from '../../Component/chat/ChatLayout';
import { disconnectSocket,connectUser,onOnlineUsers, emitUserOnline } from '../../socket/socket';

const ChatDashboard = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      connectUser(user._id);
      emitUserOnline(user._id);
      onOnlineUsers(setOnlineUsers);
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <ChatLayout onlineUsers={onlineUsers} />
    </>

  );
};

export default ChatDashboard;