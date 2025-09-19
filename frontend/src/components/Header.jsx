// src/components/Header.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { 
    AppBar, Toolbar, IconButton, Typography, Box, Avatar, Badge, Tooltip,
    Menu, MenuItem, Divider, ListItemIcon, Drawer, List, ListItem, ListItemButton, ListItemText
} from '@mui/material';

// Imports des icônes
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Dashboard';
import PredictionIcon from '@mui/icons-material/AutoAwesome';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const drawerWidth = 240;

const navItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { text: 'Prédiction', icon: <PredictionIcon />, path: '/prediction' },
    { text: 'Relance', icon: <ChatIcon />, path: '/chatbot' },
    { text: 'À Propos', icon: <InfoIcon />, path: '/about' },
];

const Header = ({ isDrawerOpen, isMobileOpen, onMobileDrawerToggle, onDesktopDrawerToggle }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const location = useLocation();
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Le contenu de la barre latérale (Drawer)
    const drawerContent = (
        <div>
            <Toolbar />
            <Box sx={{ overflow: 'auto', padding: 2 }}>
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton 
                                component={Link} 
                                to={item.path} 
                                onClick={onMobileDrawerToggle} // Ferme le tiroir sur mobile après un clic
                                selected={location.pathname === item.path}
                                sx={{
                                    borderRadius: 2, mb: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                                        '&:hover': { backgroundColor: 'rgba(39, 174, 96, 0.15)' },
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: '#27AE60', fontWeight: 'bold',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{color: '#27AE60'}}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </div>
    );

    const renderMenu = (
        <Menu anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMenuOpen}
              onClose={handleMenuClose} sx={{ mt: '45px' }}>
            <MenuItem onClick={handleMenuClose}><ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>Mon Profil</MenuItem>
            <MenuItem onClick={handleMenuClose}><ListItemIcon><Settings fontSize="small" /></ListItemIcon>Paramètres</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}><ListItemIcon><Logout fontSize="small" /></ListItemIcon>Déconnexion</MenuItem>
        </Menu>
    );

    return (
        <>
            {/* Barre de navigation supérieure */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', color: 'text.primary', height: '90px' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton aria-label="open drawer" edge="start" onClick={onMobileDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}><MenuIcon /></IconButton>
                        <IconButton aria-label="toggle drawer" edge="start" onClick={onDesktopDrawerToggle} sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}><MenuIcon /></IconButton>
                        <img src="/logo.png" alt="Logo" style={{ height: '60px', marginRight: '15px', display: { xs: 'none', sm: 'block' } }} />
                        <Typography variant="h3" noWrap component="div" sx={{color: '#27AE60', fontWeight: 'bold' }}>Risk-Predict</Typography>
                    </Box>
                    {/*<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Notifications">
                            <IconButton size="large" color="inherit"><Badge badgeContent={4} color="error"><NotificationsIcon /></Badge></IconButton>
                        </Tooltip>
                        <Tooltip title="Menu du compte">
                            <IconButton size="large" edge="end" onClick={handleProfileMenuOpen} color="inherit"><Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>FP</Avatar></IconButton>
                        </Tooltip>
                    </Box>*/}
                </Toolbar>
            </AppBar>
            {renderMenu}

            {/* Barre de navigation latérale (Sidebar) */}
            <Box component="nav" sx={{ width: { sm: isDrawerOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 }, transition: (theme) => theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) }}>
                {/* Version mobile (temporaire) */}
                <Drawer variant="temporary" open={isMobileOpen} onClose={onMobileDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
                    {drawerContent}
                </Drawer>
                {/* Version bureau (permanente) */}
                <Drawer variant="permanent" open sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: isDrawerOpen ? drawerWidth : 0, overflowX: 'hidden', transition: (theme) => theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) } }}>
                    {drawerContent}
                </Drawer>
            </Box>
        </>
    );
};

Header.propTypes = {
    isDrawerOpen: PropTypes.bool.isRequired,
    isMobileOpen: PropTypes.bool.isRequired,
    onMobileDrawerToggle: PropTypes.func.isRequired,
    onDesktopDrawerToggle: PropTypes.func.isRequired,
};

export default Header;