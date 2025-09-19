import React, { useState } from 'react';
import { 
    Grid, 
    TextField, 
    Button, 
    Box, 
    Typography, 
    CircularProgress, 
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { predictSingle } from '../api/predictorApi';

// Options pour les menus déroulants (basées sur votre code Streamlit)
const secteurs = ['Éducation', 'Santé', 'Finance', 'Agroalimentaire', 'Tech', 'BTP', 'Commerce', 'Services', 'Tourisme', 'Médias', 'Industrie', 'Transport'];
const types_org = ['PME', 'Administration', 'ONG'];
const types_abonnement = ['Internet', 'Interconnectivite', 'Console_connect', 'SD-WAN', 'Check_security'];

// État initial du formulaire
const initialState = {
    Montant_mensuel: 1500000,
    Type_organisation: 'PME',
    Nb_factures_impayees: 1,
    Moyenne_retards_jours: 30.0,
    Delai_moyen_paiement: 10.0,
    Anciennete: 60,
    Secteur_activite: 'Tech',
    Type_abonnement: 'Internet',
    Nb_tickets_service: 2.0,
    Note_satisfaction: 3,
    Nb_relances: 1,
};


const FormPrediction = () => {
    const [formData, setFormData] = useState(initialState);
    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        // Convertir en nombre si le champ est de type number
        const isNumber = [
            'Montant_mensuel', 'Nb_factures_impayees', 'Moyenne_retards_jours',
            'Delai_moyen_paiement', 'Anciennete', 'Nb_tickets_service',
            'Note_satisfaction', 'Nb_relances'
        ].includes(name);

        setFormData({
            ...formData,
            [name]: isNumber ? Number(value) : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setPredictionResult(null);

        try {
            const response = await predictSingle(formData);
            setPredictionResult(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Une erreur est survenue lors de la prédiction.";
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Entrez les caractéristiques du client
            </Typography>
            <Grid container spacing={3}>
                {/* --- COLONNE 1 --- */}
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Montant mensuel (XAF)" name="Montant_mensuel" type="number" value={formData.Montant_mensuel} onChange={handleChange} />
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel>Type d'organisation</InputLabel>
                        <Select name="Type_organisation" value={formData.Type_organisation} label="Type d'organisation" onChange={handleChange}>
                            {types_org.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField fullWidth label="Nb de factures impayées" name="Nb_factures_impayees" type="number" value={formData.Nb_factures_impayees} onChange={handleChange} sx={{ mt: 3 }} />
                    <TextField fullWidth label="Moyenne retards (jours)" name="Moyenne_retards_jours" type="number" value={formData.Moyenne_retards_jours} onChange={handleChange} sx={{ mt: 3 }} />
                    <TextField fullWidth label="Délai moyen de paiement" name="Delai_moyen_paiement" type="number" value={formData.Delai_moyen_paiement} onChange={handleChange} sx={{ mt: 3 }} />
                </Grid>

                {/* --- COLONNE 2 --- */}
                <Grid item xs={12} md={6}>
                     <TextField fullWidth label="Ancienneté (en mois)" name="Anciennete" type="number" value={formData.Anciennete} onChange={handleChange} />
                     <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel>Secteur d'activité</InputLabel>
                        <Select name="Secteur_activite" value={formData.Secteur_activite} label="Secteur d'activité" onChange={handleChange}>
                            {secteurs.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel>Type d'abonnement</InputLabel>
                        <Select name="Type_abonnement" value={formData.Type_abonnement} label="Type d'abonnement" onChange={handleChange}>
                            {types_abonnement.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </Select>
                    </FormControl>
                     <TextField fullWidth label="Nb de tickets service" name="Nb_tickets_service" type="number" value={formData.Nb_tickets_service} onChange={handleChange} sx={{ mt: 3 }} />
                     <TextField fullWidth label="Note de satisfaction (1-5)" name="Note_satisfaction" type="number" inputProps={{ min: 1, max: 5 }} value={formData.Note_satisfaction} onChange={handleChange} sx={{ mt: 3 }} />
                     <TextField fullWidth label="Nb de relances" name="Nb_relances" type="number" value={formData.Nb_relances} onChange={handleChange} sx={{ mt: 3 }} />
                </Grid>
            </Grid>

            <Button type="submit" fullWidth sx={{ mt: 4, py: 1.5 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "🚀 Prédire le risque"}
            </Button>

            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

            {predictionResult && (
                <Box sx={{ mt: 4, p: 2, borderRadius: 2, border: 1, borderColor: predictionResult.prediction_value === 1 ? 'error.main' : 'success.main' }}>
                    <Typography variant="h6">Résultat de la prédiction</Typography>
                    <Alert severity={predictionResult.prediction_value === 1 ? 'error' : 'success'} sx={{ mt: 1 }}>
                        Ce client présente un <strong>{predictionResult.prediction_label === 'À Risque' ? 'risque élevé' : 'faible risque'} d'impayé</strong>.
                    </Alert>
                    <Typography variant="h5" sx={{ mt: 2, color: predictionResult.prediction_value === 1 ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
                        Probabilité : {predictionResult.probability_percent}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default FormPrediction;