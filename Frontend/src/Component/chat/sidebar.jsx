import { useEffect, useMemo, useState } from "react";
import {
    Box,
    TextField,
    List,
    Typography,
    CircularProgress,
    Avatar,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { Search, MoreVert, GroupAdd } from "@mui/icons-material";
import { useCreateGroupMutation, useGetAllUsersQuery, useGetMyGroupsQuery, userApi } from '../../services/userService'
import { useRef } from "react";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Logout from "@mui/icons-material/Logout";
import { useLogout } from "../../Utils/logout";
import SidebarUserItem from "./SidebarUserItem";
import { useDispatch } from "react-redux";
import { emitGroupCreated, offSidebarUpdated, offUnreadCountMessage, onSidebarUpdated, onUnreadCountMessage } from "../../socket/socket";
import { chatApi } from "../../services/chatService";
import { getInitials } from "../../Utils/common";
import { useConfirmDialog } from "../Common/ConfirmDialogProvider";
import { useDeleteUserMutation } from "../../services/loginService";
import notify from "../../Utils/toastNotification";


const Sidebar = ({ onSelectUser, onlineUsers }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [hasMore, setHasMore] = useState(true);


    const [search, setSearch] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [groupDialogOpen, setGroupDialogOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const menuRef = useRef();
    const buttonRef = useRef();
    const logout = useLogout();
    const { confirm } = useConfirmDialog();
    const [deleteUserApi] = useDeleteUserMutation();
    const [createGroup, { isLoading: creatingGroup }] = useCreateGroupMutation();

    const { data, isLoading, isFetching, refetch } = useGetAllUsersQuery(
        {
            page,
            limit: 10,
            search: debounceSearch,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );
    const { data: groupsData, refetch: refetchGroups } = useGetMyGroupsQuery();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceSearch(search)
            setPage(1);
            setHasMore(true);
        }, 500);
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
          offUnreadCountMessage();
        };
    }, []);

    useEffect(() => {
        onSidebarUpdated(() => {
            setPage(1);
            setHasMore(true);
            refetch();
            refetchGroups();
            dispatch(userApi.util.invalidateTags(["Users", "Groups"]));
        });

        return () => {
            offSidebarUpdated();
        };
    }, [dispatch, refetch, refetchGroups]);

    useEffect(() => {
        if (data?.data) {
            setUsers((prev) =>
                page === 1 ? data.data : [...prev, ...data.data]
            );
            setHasMore(data.hasMore);
        }
    }, [data]);

    const conversations = useMemo(() => {
        const direct = users.map((u) => ({ ...u, isGroup: false }));
        const groups = (groupsData?.data || []).map((g) => ({ ...g, isGroup: true }));

        return [...groups, ...direct].sort(
            (a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
    }, [users, groupsData?.data]);

    const toggleMember = (memberId) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedMembers.length === 0) return;

        try {
            const created = await createGroup({
                name: groupName.trim(),
                members: selectedMembers,
            }).unwrap();
            emitGroupCreated((created?.data?.members || []).map((member) => member._id));

            setGroupDialogOpen(false);
            setGroupName("");
            setSelectedMembers([]);
            refetchGroups();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAccount = async () => {
        setOpen(false);

        const ok = await confirm({
            title: "Delete Account",
            message: "Are you sure you want to delete your account?",
            confirmText: "Delete",
            cancelText: "Cancel",
            confirmColor: "error",
        });
        if (!ok) return;

        try {
            await deleteUserApi(user?._id).unwrap();
            notify.success("Account deleted successfully");
            logout();
        } catch (error) {
            notify.error(error?.data?.message || "Failed to delete account");
        }
    };


    return (
        <>
            <Box
                sx={{
                    borderRight: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    width: "360px",
                    height: "100%",
                    minHeight: 0,
                    scrollbarGutter: "stable",
                    "@media (max-width:900px)": {
                        width: "100%",
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0ff', color: '#000' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 42, height: 42, bgcolor: '#2196F3', fontSize: '1.2rem' }}>
                            {getInitials(user?.name)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600}>Chatify</Typography>
                            <Typography variant="caption" color="text.secondary">{user?.name}</Typography>
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
                                        setGroupDialogOpen(true);
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
                                    <GroupAdd fontSize="small" />
                                    <Typography fontSize={14}>New Group</Typography>
                                </Box>

                                <Box
                                    onClick={handleDeleteAccount}
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
                                    <DeleteOutline fontSize="small" />
                                    <Typography fontSize={14}>Delete</Typography>
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

                {isLoading && page === 1 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : conversations.length === 0 ? (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography color="text.secondary">
                            No users found
                        </Typography>
                    </Box>
                ) : (
                    <List
                        onScroll={(e) => {
                            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

                            if (
                                scrollHeight - scrollTop <= clientHeight + 50 &&
                                hasMore &&
                                !isFetching
                            ) {
                                setPage((prev) => prev + 1);
                            }
                        }}
                        sx={{ overflowY: "auto", px: 1, flex: 1, minHeight: 0 }}
                    >
                        {conversations.map((user, index) => (
                            <SidebarUserItem
                                key={`${user.isGroup ? "group" : "user"}-${user._id}`}
                                user={user}
                                index={index}
                                onlineUsers={onlineUsers}
                                onSelectUser={onSelectUser}
                            />
                        ))}

                        {isFetching && (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                                <CircularProgress size={20} />
                            </Box>
                        )}
                    </List>

                )
                }


            </Box >

            <Dialog
                open={groupDialogOpen}
                onClose={() => setGroupDialogOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        size="small"
                        label="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        sx={{ mt: 1, mb: 2 }}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Select Members
                    </Typography>
                    <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
                        {users.map((member) => (
                            <FormControlLabel
                                key={member._id}
                                control={
                                    <Checkbox
                                        checked={selectedMembers.includes(member._id)}
                                        onChange={() => toggleMember(member._id)}
                                    />
                                }
                                label={member.name}
                                sx={{ display: "flex", ml: 0 }}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateGroup}
                        disabled={creatingGroup || !groupName.trim() || selectedMembers.length === 0}
                    >
                        {creatingGroup ? "Creating..." : "Create Group"}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default Sidebar;
