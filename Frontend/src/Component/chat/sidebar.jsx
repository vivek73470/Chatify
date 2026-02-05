import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    List,
    ListItemButton,
    Typography,
    CircularProgress,
    Avatar,
    Badge,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";
import { useGetAllUsersQuery } from '../../services/userService'
import { formatTime, getInitials } from '../../Utils/common'
import { useRef } from "react";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Logout from "@mui/icons-material/Logout";
import { useLogout } from "../../Utils/logout";
import SidebarUserItem from "./SidebarUserItem";
import { useDispatch } from "react-redux";
import { initSocket, onUnreadCountMessage } from "../../socket/socket";
import { chatApi } from "../../services/chatService";


const Sidebar = ({ onSelectUser, onlineUsers }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("");
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const buttonRef = useRef();
    const logout = useLogout();

    const { data, isLoading } = useGetAllUsersQuery({
        search: debounceSearch,
    });

    useEffect(() => {
        const handler = setTimeout(() => setDebounceSearch(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        onUnreadCountMessage(({ from }) => {
            dispatch(
                chatApi.util.invalidateTags([
                    { type: "UnreadCount", id: from },
                ])
            );
        });

        return () => {
            const socket = initSocket();
            socket.off("unreadCountChanged");
        };
    }, []);


    return (
        <>
            <Box
                sx={{
                    borderRight: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    width: "360px",
                    scrollbarGutter: "stable",
                    "@media (max-width:900px)": {
                        width: "100%",
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0ff', color: '#000' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 42, height: 42, bgcolor: '#2196F3', fontSize: '1.2rem' }}>
                            U
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600}>Chatify</Typography>
                            {/* <Typography variant="caption" color="text.secondary">User</Typography> */}
                        </Box>
                    </Box>
                    <Box sx={{ position: 'relative' }}>
                        <IconButton
                            size="small"
                            ref={buttonRef}
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            <MoreVert />
                        </IconButton>
                        {open && (
                            <Box
                                ref={menuRef}
                                sx={{
                                    position: "absolute",
                                    top: 30,
                                    right: 0,
                                    bgcolor: "#fff",
                                    borderRadius: 1,
                                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                                    zIndex: 1000,
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    onClick={() => {
                                        setOpen(false);
                                        console.log("Profile");
                                    }}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        px: 2,
                                        py: 0.8,
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "#f5f5f5" },
                                    }}
                                >
                                    <PersonOutline fontSize="small" />
                                    <Typography fontSize={14}>Profile</Typography>
                                </Box>

                                <Box
                                    onClick={() => {
                                        setOpen(false);
                                        logout();

                                    }}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        px: 2,
                                        py: 0.8,
                                        cursor: "pointer",
                                        color: "error.main",
                                        "&:hover": { bgcolor: "#f5f5f5" },
                                    }}
                                >
                                    <Logout fontSize="small" />
                                    <Typography fontSize={14}>Logout</Typography>
                                </Box>
                            </Box>
                        )}

                    </Box>
                </Box>

                <Box sx={{ px: 2, py: 1.5 }}>
                    <TextField
                        fullWidth
                        placeholder="Search contacts & name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: '#f5f5f5',
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2196F3',
                                },
                            },
                        }}
                    />
                </Box>

                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : data?.data?.length === 0 ? (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography color="text.secondary">
                            No users found
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ overflowY: "auto", px: 1 }}>
                        {data?.data?.map((user, index) => (
                            <SidebarUserItem
                                key={user._id}
                                user={user}
                                index={index}
                                onlineUsers={onlineUsers}
                                onSelectUser={onSelectUser}
                            />
                        ))}
                    </List>
                )
                }
            </Box >

        </>
    );
};

export default Sidebar;
