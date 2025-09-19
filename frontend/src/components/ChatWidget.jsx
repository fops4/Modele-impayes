// src/components/ChatWidget.jsx

import React, { useState, useRef, useEffect } from 'react';
// On utilise notre service centralisé pour les appels API
import { sendMessageToChatbot } from '../api/predictorApi';

import { Box, Paper, Typography, TextField, IconButton, Fab, Slide, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Bonjour ! Comment puis-je vous aider ?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // L'appel API est simple et propre
            const botReply = await sendMessageToChatbot(currentInput);
            const botMessage = { sender: 'bot', text: botReply };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            const errorMessage = { sender: 'bot', text: error.message || 'Désolé, une erreur est survenue.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
            <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
                <Paper 
                    elevation={8}
                    sx={{
                        width: { xs: '85vw', sm: 360 },
                        height: { xs: '70vh', sm: 500 },
                        mb: 2,
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ p: 2, background: 'linear-gradient(45deg, #27AE60 30%, #2ECC71 90%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px 8px 8px 8px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Assistant IA</Typography>
                        <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, backgroundColor: '#f9f9f9' }}>
                        {messages.map((msg, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                                <Paper elevation={1} sx={{ p: 1.5, borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px', backgroundColor: msg.sender === 'user' ? 'primary.main' : 'white', color: msg.sender === 'user' ? 'white' : 'text.primary', maxWidth: '80%' }}>
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}><CircularProgress size={24} /></Box>}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Posez une question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isLoading}
                        />
                        <IconButton color="primary" onClick={handleSendMessage} disabled={isLoading} sx={{ ml: 1 }}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Slide>

            {/* Bouton flottant pour ouvrir/fermer 
            <Fab color="primary" aria-label="chat" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>*/}
            {/* Bouton flottant pour ouvrir uniquement et apres avoir ouvert le boutton ne s'affiche plus */}
            {!isOpen && (
                <Fab color="primary" aria-label="chat" onClick={() => setIsOpen(true)}>
                    <SmartToyIcon />
                </Fab>
            )}
        </Box>
    );
};

export default ChatWidget;