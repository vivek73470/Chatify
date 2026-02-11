import {
    Box,
    Avatar,
    Typography,
    ListItemButton,
    Badge
} from "@mui/material";
import { useUnReadMessageCountQuery } from "../../services/chatService";
import { getInitials, formatTime } from "../../Utils/common";

const getAvatarColor = (index) => {
    const colors = ['#2196F3', '#9C27B0', '#FF9800', '#4CAF50', '#F44336', '#00BCD4'];
    return colors[index % colors.length];
};

const SidebarUserItem = ({ user, index, onlineUsers, onSelectUser }) => {
    const { data: unreadData } = useUnReadMessageCountQuery(user._id);
    const unreadCount = unreadData?.count || 0;
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isLastByMe = user?.lastMessageSender === loggedInUser?._id;
    const lastMessagePreview = user?.lastMessageText
        ? `${isLastByMe ? "You: " : ""}${user.lastMessageText}`
        : "No messages yet";

    const isOnline = onlineUsers.includes(user._id);

    return (
        <ListItemButton
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
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                    "& .MuiBadge-badge": {
                        backgroundColor: isOnline ? "#44b700" : "#bdbdbd",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid white",
                    },
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: getAvatarColor(index),
                        fontWeight: 600,
                    }}
                >
                    {getInitials(user.name)}
                </Avatar>
            </Badge>

            <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                    }}
                >
                    <Typography sx={{ color: "#000" }} fontWeight={600} fontSize="0.95rem">
                        {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                        {formatTime(user?.lastMessageTime)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.85rem",
                        }}
                    >
                        {lastMessagePreview}
                    </Typography>

                    {unreadCount > 0 && (
                        <Box
                            sx={{
                                bgcolor: "#2196F3",
                                color: "white",
                                borderRadius: "50%",
                                width: 20,
                                height: 20,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                ml: 1,
                                flexShrink: 0,
                            }}
                        >
                            {unreadCount}
                        </Box>
                    )}
                </Box>
            </Box>
        </ListItemButton>
    );
};

export default SidebarUserItem;
