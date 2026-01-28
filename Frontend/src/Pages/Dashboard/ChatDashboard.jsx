
import { useEffect,useState } from 'react';
import ChatLayout from '../../Component/chat/ChatLayout';
import { connectSocket,disconnectSocket } from '../../socket/socket';
const ChatDashboard = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user,'fmlocal')
    if (user?._id) {
      connectSocket(user?._id, setOnlineUsers)
    }
    return () => {
      disconnectSocket();
    }
  }, [])

  return (
    <>
      <ChatLayout onlineUsers={onlineUsers}/>
    </>

  );
};

export default ChatDashboard;