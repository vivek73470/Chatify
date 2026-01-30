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


const getAvatarColor = (index) => {
    const colors = ['#2196F3', '#9C27B0', '#FF9800', '#4CAF50', '#F44336', '#00BCD4'];
    return colors[index % colors.length];
};

const Sidebar = ({ onSelectUser, onlineUsers }) => {
    const [search, setSearch] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("");
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const buttonRef = useRef();
    const logout = useLogout();

    const { data, isLoading } = useGetAllUsersQuery({
        search: debounceSearch
    })
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceSearch(search)
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <Box
                sx={{
                    width: 350,
                    borderRight: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
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
                        {data?.data?.map((user, index) => {
                            const isOnline = onlineUsers.includes(user._id);
                            return (
                                <ListItemButton
                                    key={user._id}
                                    onClick={() => onSelectUser(user)}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        borderRadius: 1,
                                        mb: 0.5,
                                        "&:hover": { bgcolor: "#f5f5f5" },
                                    }}
                                >
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: isOnline ? "#44b700" : "#bdbdbd",
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                border: '2px solid white',
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: getAvatarColor(index),
                                                fontWeight: 600
                                            }}
                                        >
                                            {getInitials(user.name)}
                                        </Avatar>
                                    </Badge>
                                    <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Typography sx={{ color: '#000' }} fontWeight={600} fontSize="0.95rem">{user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                                {formatTime(user.lastSeen)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {user.status}
                                            </Typography>
                                            {index < 2 && (
                                                <Box
                                                    sx={{
                                                        bgcolor: '#2196F3',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: 20,
                                                        height: 20,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 600,
                                                        ml: 1,
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </ListItemButton>
                            )
                        })}
                    </List>
                )
                }
            </Box >

        </>
    );
};

export default Sidebar;
