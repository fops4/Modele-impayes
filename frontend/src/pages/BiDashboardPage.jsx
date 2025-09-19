import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Typography, Paper, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import Plot from 'react-plotly.js';

import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';

import { getClientsData } from '../api/predictorApi';

// Icônes
import { People, Warning, AttachMoney, Timer, Star, Email } from '@mui/icons-material';

// --- STYLED COMPONENTS (Pour l'effet "WOW") ---

const StyledKPICard = styled(Paper)(({ theme, color = 'primary' }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[10],
    },
}));

const IconWrapper = styled(Box)(({ theme, color = 'primary' }) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    background: `linear-gradient(45deg, ${theme.palette[color].light} 30%, ${theme.palette[color].main} 90%)`,
    boxShadow: `0px 4px 12px ${theme.palette[color].light}`,
    marginRight: theme.spacing(2),
}));


// --- CONFIGURATION PLOTLY ---

const plotlyBaseLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { family: 'Roboto, sans-serif', size: 12, color: '#333' },
    margin: { t: 50, b: 40, l: 60, r: 20 },
    legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, xanchor: 'right', x: 1 },
    autosize: true,
};


// --- COMPOSANT PRINCIPAL ---

const BiDashboardPage = () => {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- États des filtres ---
    const [f_org, setF_org] = useState([]);
    const [f_secteur, setF_secteur] = useState([]);
    const [f_abon, setF_abon] = useState([]);
    const [f_risque, setF_risque] = useState('Tous');
    const [f_anc, setF_anc] = useState([0, 100]);
    
    // --- Options pour les filtres ---
    const filterOptions = useMemo(() => {
        if (allData.length === 0) return null;
        const orgs = [...new Set(allData.map(item => item.Type_organisation).filter(Boolean))].sort();
        const secteurs = [...new Set(allData.map(item => item.Secteur_activite).filter(Boolean))].sort();
        const abons = [...new Set(allData.map(item => item.Type_abonnement).filter(Boolean))].sort();
        const anciennete = allData.map(item => item.Anciennete).filter(val => val !== null);
        return {
            orgs, secteurs, abons,
            anc_min: anciennete.length > 0 ? Math.min(...anciennete) : 0,
            anc_max: anciennete.length > 0 ? Math.max(...anciennete) : 100
        };
    }, [allData]);

    useEffect(() => {
        getClientsData()
            .then(response => {
                try {
                    const cleanJsonString = response.data.replace(/NaN/g, 'null');
                    const data = JSON.parse(cleanJsonString);

                    if (Array.isArray(data)) {
                        setAllData(data);
                        const orgs = [...new Set(data.map(item => item.Type_organisation).filter(Boolean))].sort();
                        const secteurs = [...new Set(data.map(item => item.Secteur_activite).filter(Boolean))].sort();
                        const abons = [...new Set(data.map(item => item.Type_abonnement).filter(Boolean))].sort();
                        const anciennete = data.map(item => item.Anciennete).filter(val => val !== null);
                        setF_org(orgs);
                        setF_secteur(secteurs);
                        setF_abon(abons);
                        setF_anc([
                            anciennete.length > 0 ? Math.min(...anciennete) : 0, 
                            anciennete.length > 0 ? Math.max(...anciennete) : 100
                        ]);
                    } else {
                        throw new Error('Les données une fois parsées ne sont pas un tableau.');
                    }
                } catch (e) {
                    throw new Error("Impossible de lire les données du serveur (format JSON invalide).");
                }
            })
            .catch(err => {
                setError(err.message || "Erreur de chargement des données.");
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredData = useMemo(() => {
        if (allData.length === 0) return [];
        return allData.filter(row => 
            (f_org.length === 0 || f_org.includes(row.Type_organisation)) &&
            (f_secteur.length === 0 || f_secteur.includes(row.Secteur_activite)) &&
            (f_abon.length === 0 || f_abon.includes(row.Type_abonnement)) &&
            (row.Anciennete >= f_anc[0] && row.Anciennete <= f_anc[1]) &&
            (f_risque === 'Tous' || (f_risque === 'À Risque' && row.Risque_impaye === 1) || (f_risque === 'Faible Risque' && row.Risque_impaye === 0))
        );
    }, [allData, f_org, f_secteur, f_abon, f_anc, f_risque]);

    const dashboardMetrics = useMemo(() => {
        if(filteredData.length === 0) return null;
        
        const df = filteredData;
        const total = df.length;
        const kpis = {
            total: total,
            pct_risque: total > 0 ? (df.filter(r => r.Risque_impaye === 1).length / total) * 100 : 0,
            ca_moyen: total > 0 ? df.reduce((sum, row) => sum + (row.Montant_mensuel || 0), 0) / total : 0,
            delai_moy: total > 0 ? df.reduce((sum, row) => sum + (row.Delai_moyen_paiement || 0), 0) / total : 0,
            satis_moy: total > 0 ? df.reduce((sum, row) => sum + (row.Note_satisfaction || 0), 0) / total : 0,
            relances_moy: total > 0 ? df.reduce((sum, row) => sum + (row.Nb_relances || 0), 0) / total : 0
        };
        
        // --- Calculs pour les graphiques ---
        const orgCounts = df.reduce((acc, row) => { acc[row.Type_organisation] = (acc[row.Type_organisation] || 0) + 1; return acc; }, {});
        const pieOrgData = [{ values: Object.values(orgCounts), labels: Object.keys(orgCounts), type: 'pie', hole: 0.55, textinfo: 'label+percent', textposition: 'inside', marker: { colors: ['#2E91E5', '#E04F5F', '#00C896', '#F5A623'] } }];
        
        const secCounts = df.reduce((acc, row) => { acc[row.Secteur_activite] = (acc[row.Secteur_activite] || 0) + 1; return acc; }, {});
        const sortedSecteurs = Object.entries(secCounts).sort(([,a],[,b]) => b-a); // Tri descendant pour le bar chart
        const barSecteurData = [{ y: sortedSecteurs.map(s => s[0]), x: sortedSecteurs.map(s => s[1]), type: 'bar', orientation: 'h', marker: { color: '#2E91E5' } }];
        
        // ** NOUVEAU GRAPHIQUE ** : Répartition par Secteur (Anneau)
        const pieSecteurData = [{ values: Object.values(secCounts), labels: Object.keys(secCounts), type: 'pie', hole: 0.55, textinfo: 'percent', hoverinfo: 'label+percent+value', automargin: true, marker: { colors: ['#54A0FF', '#FF6B6B', '#57E298', '#FFC542', '#836FFF', '#FF8F54', '#A569BD'] } }];
        
        const riskSector = df.reduce((acc, row) => {
            acc[row.Secteur_activite] = acc[row.Secteur_activite] || { total: 0, risque: 0 };
            acc[row.Secteur_activite].total++;
            if (row.Risque_impaye === 1) acc[row.Secteur_activite].risque++;
            return acc;
        }, {});
        const riskSectorData = Object.entries(riskSector).map(([secteur, data]) => ({ secteur, taux: (data.risque / data.total) * 100 }));
        riskSectorData.sort((a,b) => b.taux - a.taux);
        const barRiskSectorData = [{ x: riskSectorData.map(r => r.secteur), y: riskSectorData.map(r => r.taux), text: riskSectorData.map(r => `${r.taux.toFixed(1)}%`), textposition: 'outside', type: 'bar', marker: { color: '#E04F5F' } }];

        const scatterData = [
            {
                x: df.filter(r => r.Risque_impaye === 0).map(r => r.Anciennete),
                y: df.filter(r => r.Risque_impaye === 0).map(r => r.Montant_mensuel),
                mode: 'markers', type: 'scatter', name: 'Faible Risque', text: df.filter(r => r.Risque_impaye === 0).map(r => r.ID_client),
                marker: { color: '#00C896', size: 8, opacity: 0.7 }
            },
            {
                x: df.filter(r => r.Risque_impaye === 1).map(r => r.Anciennete),
                y: df.filter(r => r.Risque_impaye === 1).map(r => r.Montant_mensuel),
                mode: 'markers', type: 'scatter', name: 'À Risque', text: df.filter(r => r.Risque_impaye === 1).map(r => r.ID_client),
                marker: { color: '#E04F5F', size: 10, opacity: 0.9 }
            }
        ];
        
        return { kpis, charts: { pieOrgData, barSecteurData, barRiskSectorData, scatterData, pieSecteurData } };
    }, [filteredData]);

    const columns = useMemo(() => {
        if (allData.length === 0) return [];
        return Object.keys(allData[0])
            .filter(key => key !== 'Risque_impaye')
            .map(key => ({
                field: key,
                headerName: key.replace(/_/g, ' '),
                flex: 1,
                minWidth: 150
            }));
    }, [allData]);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" gutterBottom sx={{color: '#27AE60', fontWeight: 'bold' }}>
                📊 Dashboard Analytique
            </Typography>
            
            <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>🎛️ Filtres</Typography>
                {filterOptions && (
                     <Grid container spacing={2} alignItems="center">
                         <Grid item xs={12} sm={6} md={2.4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Organisation</InputLabel>
                                <Select multiple value={f_org} onChange={(e) => setF_org(e.target.value)} renderValue={(selected) => selected.length === filterOptions.orgs.length ? 'Toutes' : `${selected.length} sélection(s)`}>
                                    {filterOptions.orgs.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Secteur</InputLabel>
                                <Select multiple value={f_secteur} onChange={(e) => setF_secteur(e.target.value)} renderValue={(selected) => selected.length === filterOptions.secteurs.length ? 'Tous' : `${selected.length} sélection(s)`}>
                                    {filterOptions.secteurs.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                         <Grid item xs={12} sm={6} md={2.4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Abonnement</InputLabel>
                                <Select multiple value={f_abon} onChange={(e) => setF_abon(e.target.value)} renderValue={(selected) => selected.length === filterOptions.abons.length ? 'Tous' : `${selected.length} sélection(s)`}>
                                    {filterOptions.abons.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Risque</InputLabel>
                                <Select value={f_risque} onChange={(e) => setF_risque(e.target.value)}>
                                    <MenuItem value="Tous">Tous</MenuItem>
                                    <MenuItem value="À Risque">À Risque</MenuItem>
                                    <MenuItem value="Faible Risque">Faible Risque</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2.8}>
                            <Typography gutterBottom sx={{fontSize: '0.8rem'}}>Ancienneté ({f_anc[0]} - {f_anc[1]})</Typography>
                             <Slider value={f_anc} onChange={(e, newValue) => setF_anc(newValue)} min={filterOptions.anc_min} max={filterOptions.anc_max} size="small" valueLabelDisplay="auto"/>
                        </Grid>
                    </Grid>
                )}
            </Paper>

            {dashboardMetrics ? (
                <>
                    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                           <StyledKPICard color="primary">
                               <IconWrapper color="primary"><People fontSize="large" /></IconWrapper>
                               <Box textAlign="right">
                                   <Typography variant="h5" component="p" sx={{fontWeight: 'bold'}}>{dashboardMetrics.kpis.total}</Typography>
                                   <Typography variant="body2" color="text.secondary">Clients</Typography>
                               </Box>
                           </StyledKPICard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                           <StyledKPICard color="error">
                               <IconWrapper color="error"><Warning fontSize="large" /></IconWrapper>
                               <Box textAlign="right">
                                   <Typography variant="h5" component="p" sx={{fontWeight: 'bold'}}>{`${dashboardMetrics.kpis.pct_risque.toFixed(1)}%`}</Typography>
                                   <Typography variant="body2" color="text.secondary">À Risque</Typography>
                               </Box>
                           </StyledKPICard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                           <StyledKPICard color="success">
                               <IconWrapper color="success"><AttachMoney fontSize="large" /></IconWrapper>
                               <Box textAlign="right">
                                   <Typography variant="h5" component="p" sx={{fontWeight: 'bold'}}>{`${(dashboardMetrics.kpis.ca_moyen / 1000).toFixed(0)}k`}</Typography>
                                   <Typography variant="body2" color="text.secondary">CA Moyen</Typography>
                               </Box>
                           </StyledKPICard>
                        </Grid>
                         <Grid item xs={12} sm={6} md={4} lg={2}>
                           <StyledKPICard color="warning">
                               <IconWrapper color="warning"><Timer fontSize="large" /></IconWrapper>
                               <Box textAlign="right">
                                   <Typography variant="h5" component="p" sx={{fontWeight: 'bold'}}>{`${dashboardMetrics.kpis.delai_moy.toFixed(1)} j`}</Typography>
                                   <Typography variant="body2" color="text.secondary">Delai M</Typography>
                               </Box>
                           </StyledKPICard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                           <StyledKPICard color="info">
                               <IconWrapper color="info"><Star fontSize="large" /></IconWrapper>
                               <Box textAlign="right">
                                   <Typography variant="h5" component="p" sx={{fontWeight: 'bold'}}>{`${dashboardMetrics.kpis.satis_moy.toFixed(1)}/5`}</Typography>
                                   <Typography variant="body2" color="text.secondary">Satisfaction</Typography>
                               </Box>
                           </StyledKPICard>
                        </Grid>
                         <Grid item xs={12} sm={6} md={4} lg={2}>
                           <StyledKPICard color="secondary">
                               <IconWrapper color="secondary"><Email fontSize="large" /></IconWrapper>
                               <Box textAlign="right">
                                   <Typography variant="h5" component="p" sx={{fontWeight: 'bold'}}>{dashboardMetrics.kpis.relances_moy.toFixed(1)}</Typography>
                                   <Typography variant="body2" color="text.secondary">Relance M</Typography>
                               </Box>
                           </StyledKPICard>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                             <Paper sx={{ p: 2, height: 350, borderRadius: 2 }}><Plot data={dashboardMetrics.charts.pieOrgData} layout={{ ...plotlyBaseLayout, title: 'Répartition par Organisation', legend: {orientation: 'v'} }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                             {/* GRAPHIQUE REMPLACÉ */}
                             <Paper sx={{ p: 2, height: 350, borderRadius: 2 }}><Plot data={dashboardMetrics.charts.pieSecteurData} layout={{ ...plotlyBaseLayout, title: 'Répartition par Secteur', showlegend: false }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper>
                        </Grid>
                         <Grid item xs={12} md={12} lg={4}>
                             <Paper sx={{ p: 2, height: 350, borderRadius: 2 }}><Plot data={dashboardMetrics.charts.barRiskSectorData} layout={{ ...plotlyBaseLayout, title: 'Taux de Risque par Secteur (%)', yaxis: { range: [0, 100] } }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper>
                        </Grid>
                         <Grid item xs={12} lg={6}>
                             <Paper sx={{ p: 2, height: 350, borderRadius: 2 }}><Plot data={dashboardMetrics.charts.barSecteurData} layout={{ ...plotlyBaseLayout, title: 'Nombre de Clients par Secteur' }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                             <Paper sx={{ p: 2, height: 350, borderRadius: 2 }}><Plot data={dashboardMetrics.charts.scatterData} layout={{ ...plotlyBaseLayout, title: 'Ancienneté vs. Montant Mensuel', xaxis: {title: 'Ancienneté (mois)'}, yaxis: {title: 'Montant Mensuel (XAF)'} }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Alert severity="warning" sx={{mt: 2, borderRadius: 2 }}>Aucun enregistrement pour cette combinaison de filtres.</Alert>
            )}

            <Paper sx={{ p: 2, mt: 4, height: 600, borderRadius: 2 }}>
                <Typography variant="h6" sx={{mb: 2}}>📑 Tableau de Détail des Clients</Typography>
                <DataGrid
                    rows={filteredData.map((r) => ({ ...r, id: r.ID_client }))}
                    columns={columns}
                    localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                    sx={{ border: 0 }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                />
            </Paper>
        </Box>
    );
};

export default BiDashboardPage;