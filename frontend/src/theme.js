import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#27AE60', // Le vert principal de votre design
      contrastText: '#ffffff', // Couleur du texte sur le fond principal
    },
    success: {
      main: '#2ECC71', // Le vert plus clair pour les succès ou les effets de survol
    },
    background: {
      default: '#F0F2F6', // Couleur de fond par défaut
      paper: '#FFFFFF',   // Couleur de fond pour les "cartes"
    },
    text: {
        primary: '#333333' // Couleur de texte principale
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    // Appliquer la couleur verte aux titres par défaut
    h4: {
      color: '#27AE60',
      fontWeight: 700,
    },
    h5: {
      color: '#27AE60',
      fontWeight: 700,
    },
     h6: {
      fontWeight: 700,
    },
  },
  components: {
    // Style par défaut pour tous les boutons
    MuiButton: {
      defaultProps: {
        variant: 'contained', // Style de bouton par défaut
      },
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none', // Empêche le texte des boutons d'être en majuscules
          fontWeight: 700,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
             boxShadow: '0px 0px 10px #27AE60', // Effet d'ombre au survol
          }
        },
      },
    },
    // Style par défaut pour toutes les "Paper" (les cartes)
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Ombre subtile
            }
        }
    },
    // Style pour la barre de navigation
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: '#FFFFFF',
                color: '#333333',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }
        }
    }
  },
});

export default theme;