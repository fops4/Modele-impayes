// src/components/Footer.jsx

import React from 'react';
import { Box, Typography, Link, IconButton, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                py: 4, 
                px: 2, 
                mt: 'auto', // Pousse le footer tout en bas si le contenu est court
                backgroundColor: '#2C3E50', // Couleur de fond sombre pour un look élégant
                color: '#ECF0F1', // Texte clair
                borderTop: '1px solid #34495E',
            }}
        >
            <Grid container spacing={4} justifyContent="space-around">
                <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 1 }}>
                        {/* LOGO AJOUTÉ ICI */}
                        <img src="/logo.png" alt="RiskPredict Logo" style={{ height: '30px', marginRight: '10px' }} />
                        <Typography variant="h6" color="inherit" sx={{ fontWeight: 'bold' }}>
                            Risk-Predict
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="inherit">
                        Votre partenaire de confiance pour la prédiction des risques d'impayés.
                        Analyse intelligente et intuitive pour des décisions éclairées.
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h6" color="inherit" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                        Liens Rapides
                    </Typography>
                    <Link href="/" color="inherit" display="block" variant="body2" sx={{ '&:hover': { color: '#27AE60' } }}>
                        Dashboard
                    </Link>
                    <Link href="/prediction" color="inherit" display="block" variant="body2" sx={{ '&:hover': { color: '#27AE60' } }}>
                        Prédiction
                    </Link>
                    <Link href="/about" color="inherit" display="block" variant="body2" sx={{ '&:hover': { color: '#27AE60' } }}>
                        À Propos
                    </Link>
                </Grid>

                <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h6" color="inherit" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                        Nous Suivre
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <IconButton aria-label="Facebook" color="inherit" sx={{ '&:hover': { color: '#27AE60' } }}>
                            <FacebookIcon />
                        </IconButton>
                        <IconButton aria-label="Twitter" color="inherit" sx={{ '&:hover': { color: '#27AE60' } }}>
                            <TwitterIcon />
                        </IconButton>
                        <IconButton aria-label="LinkedIn" color="inherit" sx={{ '&:hover': { color: '#27AE60' } }}>
                            <LinkedInIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid #34495E', fontSize: '0.8rem' }}>
                <Typography variant="body2" color="inherit">
                    &copy; {new Date().getFullYear()} RiskPredict. Tous droits réservés.
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;