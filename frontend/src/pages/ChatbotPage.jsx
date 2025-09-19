// src/pages/ChatbotPage.jsx

import React, { useState } from 'react';
// MODIFICATION : Ajout de 'Grid' à la liste des imports
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert, Tooltip, IconButton, Grid } from '@mui/material';
import { generateMail } from '../api/predictorApi';

// NOUVEAUX IMPORTS
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importe le thème de l'éditeur
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from 'copy-to-clipboard';

const ChatbotPage = () => {
    const [clientName, setClientName] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [generatedMail, setGeneratedMail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(''); // Pour le message de confirmation de copie

    // Options de la barre d'outils pour l'éditeur de texte
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link'],
            ['clean']
        ],
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!clientName || !amountDue) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        setLoading(true);
        setError('');
        setGeneratedMail('');
        setCopySuccess(''); // Réinitialiser le message de copie
        try {
            const response = await generateMail(clientName, parseFloat(amountDue));
            setGeneratedMail(response.data.generated_mail);
        } catch (err) {
            setError('Une erreur est survenue lors de la génération du mail.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const success = copy(generatedMail, { format: 'text/html' });
        if (success) {
            setCopySuccess('Copié dans le presse-papiers !');
            setTimeout(() => setCopySuccess(''), 2000); // Fait disparaître le message après 2s
        }
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" gutterBottom sx={{color: '#27AE60', fontWeight: 'bold'}}>
                💬 Assistant de relance IA
            </Typography>
            <Typography paragraph color="text.secondary">
                Cet assistant utilise l'IA pour rédiger un brouillon de mail de relance. Vous pouvez ensuite le modifier et le mettre en forme avant de le copier.
            </Typography>
            
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nom du client"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Montant dû (XAF)"
                            type="number"
                            value={amountDue}
                            onChange={(e) => setAmountDue(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "✍️ Rédiger le mail"}
                </Button>
            </Paper>

            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
            
            {generatedMail && (
                <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Mail de relance généré :</Typography>
                        <Tooltip title="Copier le contenu">
                            <IconButton onClick={handleCopy}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                     {copySuccess && <Typography color="success.main" sx={{ mb: 1 }}>{copySuccess}</Typography>}

                    {/* L'ÉDITEUR DE TEXTE RICHE */}
                    <ReactQuill 
                        theme="snow" 
                        value={generatedMail} 
                        onChange={setGeneratedMail}
                        modules={modules}
                        style={{ height: '250px', marginTop: '16px', marginBottom: '50px' }}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default ChatbotPage;