import {useNavigate} from 'react-router-dom'
import {disconnectSocket} from '../socket/socket'


export const useLogout = () => {
    const navigate = useNavigate();

    return () => {
        disconnectSocket();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };
};
