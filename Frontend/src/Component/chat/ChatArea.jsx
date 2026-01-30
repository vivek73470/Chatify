import {
    Box,
    Typography,
    IconButton,
    TextField,
    Avatar,
    InputAdornment
} from "@mui/material";
import {
    ArrowBack,
    Phone,
    VideoCall,
    MoreVert,
    AttachFile,
    EmojiEmotions,
    Send,
    ChatBubbleOutline
} from "@mui/icons-material";
import { getInitials } from '../../Utils/common'
import { useEffect, useState } from "react";
import { receiveSocketMessage, sendSocketMessage } from "../../socket/socket";
import { useSendMessageMutation } from "../../services/chatService";


const ChatArea = ({ user, onBack, isMobile }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const loggedInUser = JSON.parse(localStorage.getItem('user'))

    const [sendMessageApi] = useSendMessageMutation();

    useEffect(() => {
        receiveSocketMessage((message) => {
            if (
                message.sender === user?._id ||
                message.receiver === user?._id
            ) {
                setMessages((prev) => [...prev, message]);
            }
        });
    }, [user]);

    if (!user) {
        return (
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fafafa",
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                    }}
                >
                    <ChatBubbleOutline sx={{ fontSize: 60, color: '#bdbdbd' }} />
                </Box>
                <Typography color="text.secondary" variant="h6" fontWeight={400}>
                    Select a contact to start chatting
                </Typography>
            </Box>
        );
    }

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            const res = await sendMessageApi({
                receiverId: user?._id,
                text
            })
            // emit by socket
            sendSocketMessage(res?.data)
            setMessages((prev) => [...prev, res.data]);
            setText("");

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fafafa",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid #e0e0e0",
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {isMobile && (
                    <IconButton onClick={onBack}>
                        <ArrowBack />
                    </IconButton>
                )}
                <Avatar sx={{ width: 44, height: 44, bgcolor: '#2196F3', fontWeight: 600 }}>
                    {getInitials(user.name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#000' }} fontWeight={600} fontSize="1rem">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary" fontSize="0.8rem">
                        Online
                    </Typography>
                </Box>
                <IconButton>
                    <Phone />
                </IconButton>
                <IconButton>
                    <VideoCall />
                </IconButton>
                <IconButton>
                    <MoreVert />
                </IconButton>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    p: 3,
                    overflowY: "auto",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {messages?.map((message) => {
                    const isMe = message.sender === loggedInUser._id;
                    return (
                        <Box
                            key={message.id}
                            sx={{
                                display: 'flex',
                                justifyContent: message.sender === 'isMe' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Box
                                sx={{
                                    maxWidth: '60%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: message.sender === 'isMe' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: message.sender === 'isMe' ? '#2196F3' : '#fff',
                                        color: message.sender === 'isMe' ? '#fff' : '#000',
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: 2,
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <Typography fontSize="0.9rem">{message.text}</Typography>
                                </Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mt: 0.5, fontSize: '0.7rem' }}
                                >
                                    {message.time}
                                </Typography>
                            </Box>
                        </Box>
                    )
                })}
            </Box>

            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small">
                        <AttachFile />
                    </IconButton>
                    <TextField
                        fullWidth
                        placeholder="Type a message..."
                        size="small"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small">
                                        <EmojiEmotions />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
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
                    <IconButton
                        onClick={handleSend}
                        sx={{
                            bgcolor: '#2196F3',
                            color: 'white',
                            '&:hover': { bgcolor: '#1976D2' }
                        }}
                    >
                        <Send />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatArea;
