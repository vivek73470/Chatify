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

const ChatArea = ({ user, onBack, isMobile }) => {
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

    const mockMessages = [
        { id: 1, text: "Hey, how are you?", sender: "other", time: "10:28 AM" },
        { id: 2, text: "I'm doing great! How about you?", sender: "me", time: "10:29 AM" },
        { id: 3, text: "Good to hear! I wanted to ask you about...", sender: "other", time: "10:30 AM" }
    ];

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
                    <Typography sx={{color:'#000'}} fontWeight={600} fontSize="1rem">{user.name}</Typography>
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
                {mockMessages.map((message) => (
                    <Box
                        key={message.id}
                        sx={{
                            display: 'flex',
                            justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: '60%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: message.sender === 'me' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: message.sender === 'me' ? '#2196F3' : '#fff',
                                    color: message.sender === 'me' ? '#fff' : '#000',
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
                ))}
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
