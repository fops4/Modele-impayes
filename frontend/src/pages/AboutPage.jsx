import React from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemIcon, ListItemText, Divider, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icônes pour les fonctionnalités et technologies
import InsightsIcon from '@mui/icons-material/Insights'; // Pour l'analyse
import VisibilityIcon from '@mui/icons-material/Visibility'; // Pour la visualisation
import SmartToyIcon from '@mui/icons-material/SmartToy'; // Pour l'IA/Chatbot
import CodeIcon from '@mui/icons-material/Code'; // Pour le Frontend
import StorageIcon from '@mui/icons-material/Storage'; // Pour le Backend
import MemoryIcon from '@mui/icons-material/Memory'; // Pour l'IA Générative

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconWrapper = styled(Box)(({ theme, color = 'primary' }) => ({
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(45deg, ${theme.palette[color].light} 30%, ${theme.palette[color].main} 90%)`,
  color: '#fff',
}));


const AboutPage = () => {
    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom 
                    sx={{ color: '#1A5276', fontWeight: 'bold' }}
                >
                    Transformer la Donnée en Décision
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', margin: 'auto' }}>
                    Notre application vous offre une vision à 360° du risque client, en combinant analyse prédictive et outils intelligents pour sécuriser votre trésorerie.
                </Typography>
            </Box>

            <Paper sx={{ p: {xs: 2, md: 4}, borderRadius: 3, boxShadow: 'none', background: 'transparent' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    🚀 Notre Mission
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                    Dans un environnement économique incertain, anticiper les risques d'impayés n'est plus une option, mais une nécessité. Notre mission est de fournir aux entreprises de toutes tailles les outils pour <strong>anticiper</strong>, <strong>visualiser</strong> et <strong>agir</strong> face à ces risques. Nous traduisons des données complexes en indicateurs clairs et en prédictions fiables pour vous permettre de prendre les meilleures décisions stratégiques.
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    🎯 Fonctionnalités Clés
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard>
                            <IconWrapper color="primary"><InsightsIcon fontSize="large" /></IconWrapper>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Analyse Prédictive Avancée</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Grâce à un modèle de Machine Learning robuste, notre système évalue la probabilité qu'un client ne règle pas ses factures, vous alertant avant même que le problème ne survienne.
                                </Typography>
                            </CardContent>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard>
                            <IconWrapper color="success"><VisibilityIcon fontSize="large" /></IconWrapper>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Dashboard Intuitif</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Visualisez en un coup d'œil la santé financière de votre portefeuille clients. Nos KPIs et graphiques interactifs rendent les données complexes compréhensibles par tous.
                                </Typography>
                            </CardContent>
                        </FeatureCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard>
                            <IconWrapper color="secondary"><SmartToyIcon fontSize="large" /></IconWrapper>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Assistant de Relance IA</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gagnez un temps précieux avec notre chatbot intelligent qui rédige pour vous des emails de relance personnalisés et professionnels, adaptés au profil de chaque client.
                                </Typography>
                            </CardContent>
                        </FeatureCard>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    🛠️ La Technologie derrière la Magie
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6">Interface Utilisateur (Frontend)</Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon><CodeIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="React" secondary="Pour une interface dynamique et réactive." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CodeIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Material-UI" secondary="Pour un design élégant et cohérent." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CodeIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Plotly.js" secondary="Pour des visualisations de données interactives." />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6">Moteur & Modèle (Backend)</Typography>
                        <List dense>
                             <ListItem>
                                <ListItemIcon><StorageIcon color="action" /></ListItemIcon>
                                <ListItemText primary="Flask" secondary="Pour un serveur web léger et puissant." />
                            </ListItem>
                             <ListItem>
                                <ListItemIcon><StorageIcon color="action" /></ListItemIcon>
                                <ListItemText primary="Pandas & Scikit-learn" secondary="Le cœur de notre modèle prédictif." />
                            </ListItem>
                        </List>
                    </Grid>
                     <Grid item xs={12} md={4}>
                        <Typography variant="h6">IA Générative</Typography>
                         <List dense>
                             <ListItem>
                                <ListItemIcon><MemoryIcon sx={{color: '#00C896'}}/></ListItemIcon>
                                <ListItemText primary="Groq" secondary="Pour une génération de texte ultra-rapide par le chatbot." />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AboutPage;