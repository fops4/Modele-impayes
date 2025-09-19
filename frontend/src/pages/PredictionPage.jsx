import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { predictBatch } from '../api/predictorApi';
import Papa from 'papaparse'; // Importer PapaParse

import FormPrediction from '../components/FormPrediction';
// --- NOUVEAU : Importer le tableau de bord ---
import BatchResultDashboard from '../components/BatchResultDashboard'; 

const PredictionPage = () => {
    const [mode, setMode] = useState('fichier');
    const [file, setFile] = useState(null);
    // --- MODIFICATION : L'état va contenir les données JSON et le blob CSV ---
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setPredictionData(null); // Réinitialiser les anciens résultats
        setError('');
    };
    
    const handleFileSubmit = async () => {
        if (!file) {
            setError('Veuillez sélectionner un fichier.');
            return;
        }
        setLoading(true);
        setError('');
        setPredictionData(null);
        try {
            const response = await predictBatch(file);
            const csvBlob = new Blob([response.data], { type: 'text/csv' });
            
            // --- NOUVEAU : Parser le CSV en JSON ---
            Papa.parse(csvBlob, {
                header: true, // Le CSV a une ligne d'en-tête
                skipEmptyLines: true,
                complete: (results) => {
                    // Stocker les données parsées ET le blob original pour le téléchargement
                    setPredictionData({ 
                        jsonData: results.data, 
                        csvBlob: csvBlob 
                    });
                    setLoading(false);
                },
                error: (err) => {
                    setError("Erreur lors de la lecture du fichier CSV de résultats.");
                    console.error(err);
                    setLoading(false);
                }
            });

        } catch (err) {
            setError('Une erreur est survenue lors de la prédiction par fichier.');
            console.error(err);
            setLoading(false);
        }
    };
    
    const handleModeChange = (newMode) => {
        setMode(newMode);
        setError('');
        setFile(null);
        setPredictionData(null);
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" gutterBottom sx={{color: '#27AE60', fontWeight: 'bold' }}>
               ⚠️ Gestion des risques d'impayés
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}><Button fullWidth variant={mode === 'fichier' ? 'contained' : 'outlined'} onClick={() => handleModeChange('fichier')}>Prédiction par Fichier</Button></Grid>
                <Grid item xs={12} md={6}><Button fullWidth variant={mode === 'formulaire' ? 'contained' : 'outlined'} onClick={() => handleModeChange('formulaire')}>Prédiction par Formulaire</Button></Grid>
            </Grid>

            <Paper>
                {mode === 'fichier' && (
                    <Box>
                        <Typography variant="h5" gutterBottom>Prédiction à partir d'un fichier</Typography>
                        <Button variant="contained" component="label" sx={{ mb: 2 }}>
                            📂 Importer un fichier CSV
                            <input type="file" hidden accept=".csv" onChange={handleFileChange} />
                        </Button>
                        {file && <Typography sx={{ mb: 2 }}>Fichier sélectionné : {file.name}</Typography>}
                        <Button color="primary" onClick={handleFileSubmit} disabled={loading || !file} fullWidth>
                            {loading ? <CircularProgress size={24} color="inherit"/> : "🚀 Lancer la Prédiction"}
                        </Button>
                    </Box>
                )}
                {mode === 'formulaire' && (<FormPrediction />)}
            </Paper>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {/* --- MODIFICATION : Afficher le tableau de bord avec les données --- */}
            {predictionData && mode === 'fichier' && (
               <BatchResultDashboard 
                    results={predictionData.jsonData} 
                    csvBlob={predictionData.csvBlob} 
               />
            )}
        </Box>
    );
};

export default PredictionPage;    