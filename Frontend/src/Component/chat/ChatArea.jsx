import {
    Box,
    Typography,
    IconButton,
    TextField,
    Avatar,
    InputAdornment,
    CircularProgress,
    ClickAwayListener
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
import EmojiPicker from "emoji-picker-react";
import { formatMessageTime, getInitials } from '../../Utils/common'
import { useEffect, useState } from "react";
import {
    emitTypingStart, emitTypingStop, onTypingStart, onTypingStop,
    onReceiveMessage, sendReadReceipt, sendSocketMessage, offTypingStart,
    offTypingStop, onMessageReadUpdate, onMessageStatusUpdate, offReceiveSocketMessage, offMessageReadUpdate, offMessageStatusUpdate
} from "../../socket/socket";
import { useGetMessageQuery, useMarkMessageAsDeliveredMutation, useMarkMessageAsReadMutation, useSendMessageMutation } from "../../services/chatService";
import MessageTick from "../MessageTick/MessageTick";
import { useRef } from "react";


const ChatArea = ({ user, onBack, isMobile, onlineUsers }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);

    const loggedInUser = JSON.parse(localStorage.getItem('user'))
    const isUserOnline = onlineUsers.includes(user?._id)

    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);


    const [sendMessageApi] = useSendMessageMutation();
    const [markAsReadApi] = useMarkMessageAsReadMutation();
    const [markAsDeliveredApi] = useMarkMessageAsDeliveredMutation();
    const { data, isLoading } = useGetMessageQuery(
        user?._id,
        { skip: !user }
    );

    useEffect(() => {
        if (data?.data) {
            setMessages(data.data);
        }
    }, [data]);

    // RECEIVE MESSAGE & AUTO-MARK AS READ
    useEffect(() => {
        onReceiveMessage((message) => {
            const isCurrentChat =
                message.sender === user?._id ||
                message.receiver === user?._id;

            if (!isCurrentChat) return;

            setMessages((prev) => [...prev, message]);

            if (message.sender === user?._id) {
                markAsReadApi(user._id);
                sendReadReceipt({
                    senderId: user._id,
                    receiverId: loggedInUser._id,
                });
            }
        });

        return () => {
            offReceiveSocketMessage();
        };
    }, [user?._id]);



    // Mark messages as READ when opening chat
    useEffect(() => {
        if (!user) return;
        const markRead = async () => {
            await markAsReadApi(user?._id);
            sendReadReceipt({
                senderId: user?._id,
                receiverId: loggedInUser?._id,
            });
        };
        markRead();
    }, [user]);

    const handleSend = async () => {
        if (!text.trim()) return;
        emitTypingStop({
            senderId: loggedInUser._id,
            receiverId: user._id,
        });
        isTypingRef.current = false;
        try {
            const res = await sendMessageApi({
                receiverId: user?._id,
                text
            })
            // emit by socket
            sendSocketMessage(res?.data?.data)
            setMessages((prev) => [...prev, res.data?.data]);
            setText("");

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        onMessageReadUpdate(({ receiverId }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.receiver === receiverId &&
                        msg.sender === loggedInUser._id
                        ? { ...msg, status: "read" }
                        : msg
                )
            );
        });

        onMessageStatusUpdate(({ messageId, status }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId ? { ...msg, status } : msg
                )
            );
        });

        return () => {
            offMessageReadUpdate();
            offMessageStatusUpdate();
        };
    }, [loggedInUser._id]);



    const handleTyping = (e) => {
        setText(e.target.value);

        // emit typing start ONCE
        if (!isTypingRef.current) {
            emitTypingStart({
                senderId: loggedInUser._id,
                receiverId: user._id,
            });
            isTypingRef.current = true;
        }

        // debounce typing stop
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            emitTypingStop({
                senderId: loggedInUser._id,
                receiverId: user._id,
            });
            isTypingRef.current = false;
        }, 1500);
    };

    useEffect(() => {
        onTypingStart(({ from }) => {
            if (from === user?._id) {
                setIsOtherTyping(true);
            }
        });

        onTypingStop(({ from }) => {
            if (from === user?._id) {
                setIsOtherTyping(false);
            }
        });

        return () => {
            offTypingStart();
            offTypingStop();
        };
    }, [user?._id]);



    const typingPlaceholder = isOtherTyping
        ? `${user.name} typing...`
        : "Type a message...";

    const handleEmojiClick = (emojiData) => {
        setText((prev) => prev + emojiData.emoji)
    }


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

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f0f2f5",
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
                        {isUserOnline ? 'Online' : 'Offline'}
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
                    gap: 2,
                    background: '#efeae240',
                }}
            >
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <>
                        {messages?.map((message) => {
                            const isMe = message.sender === loggedInUser._id;
                            return (
                                <Box
                                    key={message._id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: isMe ? "flex-end" : "flex-start",
                                        mb: 0.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '65%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isMe ? 'flex-end' : 'flex-start',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                bgcolor: isMe ? '#d9fdd3' : '#fff',
                                                color: '#111',
                                                px: 1.5,
                                                py: 1,
                                                borderRadius: isMe ? '8px 8px 0 8px' : '8px 8px 8px 0',
                                                boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)',
                                                position: 'relative',
                                                minWidth: '80px',
                                            }}
                                        >
                                            <Typography
                                                fontSize="0.94rem"
                                                sx={{
                                                    pr: isMe ? 7 : 0,
                                                    pb: 0.5,
                                                    lineHeight: 1.4,
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                {message.text}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    justifyContent: 'flex-end',
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: '0.68rem',
                                                        color: 'rgba(0,0,0,0.45)',
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {formatMessageTime(message.createdAt)}
                                                </Typography>

                                                <MessageTick
                                                    isMe={isMe}
                                                    status={message.status}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })}
                    </>
                )}

            </Box>

            {showEmoji && (
                <ClickAwayListener onClickAway={() => setShowEmoji(false)}>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 70,
                            right: 4,
                            zIndex: 10,
                        }}
                    >
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            height={350}
                            width={300}
                        />
                    </Box>
                </ClickAwayListener>
            )}


            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small">
                        <AttachFile />
                    </IconButton>
                    <TextField
                        fullWidth
                        placeholder={typingPlaceholder}
                        size="small"
                        value={text}
                        onChange={handleTyping}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowEmoji((prev) => !prev)}
                                    >
                                        <EmojiEmotions />
                                    </IconButton>

                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiInputBase-input::placeholder': {
                                color: isOtherTyping ? '#2196F3' : '#9e9e9e',
                                opacity: 1,
                                fontStyle: isOtherTyping ? 'italic' : 'normal',
                            },
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
                        disabled={!text}
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
