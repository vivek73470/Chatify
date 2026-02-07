
import { useEffect, useState } from 'react';
import ChatLayout from '../../Component/chat/ChatLayout';
import { disconnectSocket, connectUser, onOnlineUsers, initSocket, offOnlineUsers } from '../../socket/socket';

const ChatDashboard = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    initSocket();
    connectUser(user._id);
    onOnlineUsers(setOnlineUsers);


    return () => {
      offOnlineUsers();
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