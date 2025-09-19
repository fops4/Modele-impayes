// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, Toolbar, CssBaseline } from '@mui/material';

// Imports des pages et composants
import BiDashboardPage from './pages/BiDashboardPage';
import PredictionPage from './pages/PredictionPage';
import ChatbotPage from './pages/ChatbotPage';
import AboutPage from './pages/AboutPage';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Header from './components/Header';

const drawerWidth = 240;

function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const handleMobileDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleDesktopDrawerToggle = () => setIsDrawerOpen(!isDrawerOpen);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            <Header 
                isDrawerOpen={isDrawerOpen}
                isMobileOpen={mobileOpen}
                onMobileDrawerToggle={handleMobileDrawerToggle}
                onDesktopDrawerToggle={handleDesktopDrawerToggle}
            />
            
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` }, 
                    backgroundColor: '#F0F2F6', 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: (theme) => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    })
                }}
            >
                <Box component="div" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<BiDashboardPage />} />
                        <Route path="/prediction" element={<PredictionPage />} />
                        <Route path="/chatbot" element={<ChatbotPage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </Box>
                <Footer />
            </Box>
            <ChatWidget />
        </Box>
    );
}

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;