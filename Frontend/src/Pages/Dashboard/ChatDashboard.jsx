import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  IconButton,
  Badge,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import {
  Search,
  Send,
  Phone,
  VideoCall,
  MoreVert,
  AttachFile,
  EmojiEmotions,
  ArrowBack,
  Chat as ChatIcon,
} from '@mui/icons-material';

const ChatDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data - replace with your actual data
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      number: "+1234567890",
      avatar: "JD",
      lastMessage: "Hey, how are you?",
      timestamp: "10:30 AM",
      unreadCount: 2,
      online: true,
      color: "#1976d2"
    },
    {
      id: 2,
      name: "Jane Smith",
      number: "+1234567891",
      avatar: "JS",
      lastMessage: "See you tomorrow!",
      timestamp: "9:15 AM",
      unreadCount: 0,
      online: false,
      color: "#9c27b0"
    },
    {
      id: 3,
      name: "Mike Johnson",
      number: "+1234567892",
      avatar: "MJ",
      lastMessage: "Thanks for your help",
      timestamp: "Yesterday",
      unreadCount: 1,
      online: true,
      color: "#f57c00"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      number: "+1234567893",
      avatar: "SW",
      lastMessage: "Let's catch up soon",
      timestamp: "Yesterday",
      unreadCount: 0,
      online: false,
      color: "#388e3c"
    }
  ]);

  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: "Hey, how are you?", sender: "them", timestamp: "10:28 AM" },
      { id: 2, text: "I'm doing great! How about you?", sender: "me", timestamp: "10:29 AM" },
      { id: 3, text: "Good to hear! I wanted to ask you about...", sender: "them", timestamp: "10:30 AM" }
    ],
    2: [
      { id: 1, text: "Don't forget about tomorrow's meeting", sender: "them", timestamp: "9:10 AM" },
      { id: 2, text: "I won't, thanks for reminding me!", sender: "me", timestamp: "9:12 AM" },
      { id: 3, text: "See you tomorrow!", sender: "them", timestamp: "9:15 AM" }
    ],
    3: [
      { id: 1, text: "Could you help me with the project?", sender: "them", timestamp: "2:30 PM" },
      { id: 2, text: "Sure, what do you need help with?", sender: "me", timestamp: "2:35 PM" },
      { id: 3, text: "Thanks for your help", sender: "them", timestamp: "4:20 PM" }
    ]
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.number.includes(searchTerm)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    setMessage('');
  };

  const handleChatSelect = (user) => {
    setSelectedChat(user);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              {currentUser.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Chatify
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser.name || 'User'}
              </Typography>
            </Box>
          </Box>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
        
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}
        />
      </Paper>

      {/* Chat List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List disablePadding>
          {filteredUsers.map((user, index) => (
            <React.Fragment key={user.id}>
              <ListItemButton
                onClick={() => handleChatSelect(user)}
                selected={selectedChat?.id === user.id}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light + '20',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: user.online ? '#44b700' : 'transparent',
                        color: user.online ? '#44b700' : 'transparent',
                        '&::after': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          border: '1px solid currentColor',
                          content: '""',
                        },
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: user.color }}>
                      {user.avatar}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '200px' }}>
                        {user.lastMessage}
                      </Typography>
                      {user.unreadCount > 0 && (
                        <Chip
                          label={user.unreadCount}
                          size="small"
                          color="primary"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
              {index < filteredUsers.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': { width: 320 },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Paper
          elevation={1}
          sx={{
            width: 350,
            borderRadius: 0,
            borderRight: 1,
            borderColor: 'divider'
          }}
        >
          {sidebarContent}
        </Paper>
      )}

      {/* Chat Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar>
                {isMobile && (
                  <IconButton
                    edge="start"
                    onClick={() => setMobileOpen(true)}
                    sx={{ mr: 1 }}
                  >
                    <ArrowBack />
                  </IconButton>
                )}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    mr: 2,
                    '& .MuiBadge-badge': {
                      backgroundColor: selectedChat.online ? '#44b700' : 'transparent',
                      color: selectedChat.online ? '#44b700' : 'transparent',
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: selectedChat.color }}>
                    {selectedChat.avatar}
                  </Avatar>
                </Badge>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="medium">
                    {selectedChat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedChat.online ? 'Online' : 'Last seen recently'}
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
              </Toolbar>
            </AppBar>

            {/* Messages */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 2,
                backgroundColor: 'grey.50',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(messages[selectedChat.id] || []).map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Card
                      sx={{
                        maxWidth: { xs: '85%', sm: '70%', md: '60%' },
                        backgroundColor: msg.sender === 'me' ? 'primary.main' : 'white',
                        color: msg.sender === 'me' ? 'white' : 'text.primary',
                      }}
                    >
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="body2">
                          {msg.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            opacity: 0.7,
                            textAlign: 'right'
                          }}
                        >
                          {msg.timestamp}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
            </Box>

            {/* Message Input */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton>
                  <AttachFile />
                </IconButton>
                
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <EmojiEmotions />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: 'grey.100' }}
                />
                
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '&:disabled': { backgroundColor: 'grey.300' }
                  }}
                >
                  <Send />
                </IconButton>
              </Box>
            </Paper>
          </>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.50',
            }}
          >
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'grey.200',
                  fontSize: '3rem'
                }}
              >
                <ChatIcon sx={{ fontSize: '3rem', color: 'grey.400' }} />
              </Avatar>
              <Typography variant="h4" fontWeight="medium" gutterBottom>
                Welcome to Chatify
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isMobile ? 'Tap the menu to select' : 'Select'} a contact to start chatting
              </Typography>
              {isMobile && (
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{
                    mt: 2,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  <ChatIcon />
                </IconButton>
              )}
            </Container>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatDashboard;