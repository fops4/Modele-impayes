import React, { useState, useMemo } from 'react';
import { 
    Box, 
    Grid, 
    Typography, 
    Paper, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Fade,
    Grow,
    Alert,
    Icon // Pour les icônes de titre
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import Plot from 'react-plotly.js';
import { saveAs } from 'file-saver';

// Import d'icônes supplémentaires
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InsightsIcon from '@mui/icons-material/Insights';
import FilterListIcon from '@mui/icons-material/FilterList';
import ListAltIcon from '@mui/icons-material/ListAlt';

import KPICard from './KPICard';

const getRiskColor = (value) => {
  if (value == null || typeof value !== 'number') return 'transparent';
  const hue = (1 - value) * 120;
  return `hsla(${hue}, 80%, 85%, 0.6)`;
};

// --- NOUVEAU : Configuration de base pour les graphiques Plotly ---
const plotlyBaseLayout = {
    paper_bgcolor: 'transparent', // Fond transparent
    plot_bgcolor: 'transparent',
    font: {
        family: 'Roboto, sans-serif',
        size: 12,
        color: '#333'
    },
    margin: { t: 50, b: 40, l: 60, r: 40 },
    legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1
    }
};


const BatchResultDashboard = ({ results, csvBlob }) => {
  const [selectedOrg, setSelectedOrg] = useState('Tous');
  const [selectedSecteur, setSelectedSecteur] = useState('Tous');
  const [selectedRisque, setSelectedRisque] = useState('Tous');
  const [animationKey, setAnimationKey] = useState(0);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setAnimationKey(prevKey => prevKey + 1); 
  };

  const filteredResults = useMemo(() => {
    if (!results) return [];
    let filtered = [...results];
    if (selectedOrg !== 'Tous') filtered = filtered.filter(row => row.Type_organisation === selectedOrg);
    if (selectedSecteur !== 'Tous') filtered = filtered.filter(row => row.Secteur_activite === selectedSecteur);
    if (selectedRisque === 'À Risque') filtered = filtered.filter(row => Number(row.Risque_impaye) === 1);
    else if (selectedRisque === 'Faible Risque') filtered = filtered.filter(row => Number(row.Risque_impaye) === 0);
    return filtered;
  }, [results, selectedOrg, selectedSecteur, selectedRisque]);

  const stats = useMemo(() => {
    if (!filteredResults || filteredResults.length === 0) return null;
    const totalClients = filteredResults.length;
    const clientsARisque = filteredResults.filter(row => Number(row.Risque_impaye) === 1);
    const pctRisque = (clientsARisque.length / totalClients) * 100;
    const montantPotentiel = clientsARisque.reduce((sum, row) => sum + (Number(row.Montant_mensuel) || 0), 0);
    return { totalClients, clientsARisque: clientsARisque.length, pctRisque: pctRisque.toFixed(1) + '%', montantPotentiel: montantPotentiel.toLocaleString('fr-FR') + ' XAF' };
  }, [filteredResults]);

  const chartData = useMemo(() => {
     if (!filteredResults || filteredResults.length === 0) return null;
     const aRisqueCount = filteredResults.filter(r => Number(r.Risque_impaye) === 1).length;
     const faibleRisqueCount = filteredResults.length - aRisqueCount;
     const pieData = [{ values: [aRisqueCount, faibleRisqueCount], labels: ['À Risque', 'Faible Risque'], type: 'pie', hole: 0.5, marker: { colors: ['#E74C3C', '#27AE60'] }, name: 'Répartition des risques' }];
     const orgRisk = filteredResults.reduce((acc, row) => { (acc[row.Type_organisation] = acc[row.Type_organisation] || { 'À Risque': 0, 'Faible Risque': 0 })[Number(row.Risque_impaye) === 1 ? 'À Risque' : 'Faible Risque']++; return acc; }, {});
     const orgCategories = Object.keys(orgRisk);
     const orgData = [{ x: orgCategories, y: orgCategories.map(cat => orgRisk[cat]['À Risque']), name: 'À Risque', type: 'bar', marker: { color: '#E74C3C' } }, { x: orgCategories, y: orgCategories.map(cat => orgRisk[cat]['Faible Risque']), name: 'Faible Risque', type: 'bar', marker: { color: '#27AE60' } }];
     const secteurRisk = filteredResults.reduce((acc, row) => { (acc[row.Secteur_activite] = acc[row.Secteur_activite] || { 'À Risque': 0, 'Faible Risque': 0 })[Number(row.Risque_impaye) === 1 ? 'À Risque' : 'Faible Risque']++; return acc; }, {});
     const secteurCategories = Object.keys(secteurRisk);
     const secteurData = [{ x: secteurCategories, y: secteurCategories.map(cat => secteurRisk[cat]['À Risque']), name: 'À Risque', type: 'bar', marker: { color: '#E74C3C' } }, { x: secteurCategories, y: secteurCategories.map(cat => secteurRisk[cat]['Faible Risque']), name: 'Faible Risque', type: 'bar', marker: { color: '#27AE60' } }];
     const scatterData = [{ x: filteredResults.map(r => Number(r.Montant_mensuel)), y: filteredResults.map(r => Number(r.Prob_impaye)), mode: 'markers', type: 'scatter', marker: { color: filteredResults.map(r => Number(r.Risque_impaye) === 1 ? '#E74C3C' : '#27AE60'), size: 8 }, text: filteredResults.map(r => `Probabilité: ${(Number(r.Prob_impaye) * 100).toFixed(2)}%<br>Montant: ${Number(r.Montant_mensuel).toLocaleString('fr-FR')} XAF`), hoverinfo: 'text' }];
     return { pieData, orgData, secteurData, scatterData };
  }, [filteredResults]);

  const typeOrgOptions = useMemo(() => ([ 'Tous', ...[...new Set(results.map(row => row.Type_organisation))] ]), [results]);
  const secteurActiviteOptions = useMemo(() => ([ 'Tous', ...[...new Set(results.map(row => row.Secteur_activite))] ]), [results]);

  if (!stats) return <Alert severity="info" sx={{ mt: 2 }}>Aucune donnée à afficher. Chargez un fichier pour commencer.</Alert>;

  const columns = Object.keys(results[0] || {}).map(key => {
    const columnDef = { field: key, headerName: key.replace(/_/g, ' '), flex: 1, minWidth: 150 };
    if (key === 'Prob_impaye') {
      columnDef.renderCell = (params) => (<Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', fontWeight: 'bold', color: Number(params.value) > 0.5 ? '#7f1d1d' : '#14532d', backgroundColor: getRiskColor(params.value) }}>{`${(Number(params.value) * 100).toFixed(2)}%`}</Box>);
    }
    return columnDef;
  });
  
  const rows = filteredResults.map((row, index) => ({ id: index, ...row }));
  const handleDownload = () => saveAs(csvBlob, "predictions_resultats.csv");

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📊 Tableau de bord d'analyse</Typography>

      {/* --- Section KPIs (cartes plus compactes) --- */}
      <Grow in={true} timeout={500}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}><KPICard title="Total Clients" value={stats.totalClients} icon={<PeopleIcon />} /></Grid>
          <Grid item xs={12} sm={6} md={4}><KPICard title="Clients à Risque" value={`${stats.clientsARisque} (${stats.pctRisque})`} icon={<WarningIcon />} sx={{ backgroundColor: stats.clientsARisque > 0 ? '#fee' : '#eef', '& .MuiAvatar-root': { bgcolor: stats.clientsARisque > 0 ? '#fec' : '#cef' } }} /></Grid>
          <Grid item xs={12} sm={12} md={4}><KPICard title="Montant Potentiel à Risque" value={stats.montantPotentiel} icon={<AttachMoneyIcon />} /></Grid>
        </Grid>
      </Grow>
      
      {/* --- Section Filtres --- */}
      <Fade in={true} timeout={700}>
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Icon color="primary"><FilterListIcon /></Icon>
                <Typography variant="h6" sx={{ ml: 1 }}>Filtres d'analyse</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}><FormControl fullWidth size="small"><InputLabel>Type d'organisation</InputLabel><Select value={selectedOrg} label="Type d'organisation" onChange={(e) => handleFilterChange(setSelectedOrg, e.target.value)}>{typeOrgOptions.map((o) => (<MenuItem key={o} value={o}>{o}</MenuItem>))}</Select></FormControl></Grid>
              <Grid item xs={12} sm={4}><FormControl fullWidth size="small"><InputLabel>Secteur d'activité</InputLabel><Select value={selectedSecteur} label="Secteur d'activité" onChange={(e) => handleFilterChange(setSelectedSecteur, e.target.value)}>{secteurActiviteOptions.map((o) => (<MenuItem key={o} value={o}>{o}</MenuItem>))}</Select></FormControl></Grid>
              <Grid item xs={12} sm={4}><FormControl fullWidth size="small"><InputLabel>Risque</InputLabel><Select value={selectedRisque} label="Risque" onChange={(e) => handleFilterChange(setSelectedRisque, e.target.value)}><MenuItem value="Tous">Tous</MenuItem><MenuItem value="À Risque" sx={{color: '#E74C3C'}}>À Risque</MenuItem><MenuItem value="Faible Risque" sx={{color: '#27AE60'}}>Faible Risque</MenuItem></Select></FormControl></Grid>
            </Grid>
        </Paper>
      </Fade>

      {/* --- Section Graphiques (cartes plus petites) --- */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon color="primary"><InsightsIcon /></Icon>
            <Typography variant="h6" sx={{ ml: 1 }}>Visualisations Détaillées</Typography>
        </Box>
        <Fade in={true} timeout={500} key={animationKey}>
          <Grid container spacing={3}>
            {/* ICI : Vous pouvez modifier la hauteur '350px' pour ajuster la taille */}
            <Grid item xs={12} md={6}><Paper elevation={2} sx={{ height: '350px', p: 2 }}><Plot data={chartData.pieData} layout={{ ...plotlyBaseLayout, title: 'Répartition des clients' }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper></Grid>
            <Grid item xs={12} md={6}><Paper elevation={2} sx={{ height: '350px', p: 2 }}><Plot data={chartData.orgData} layout={{ ...plotlyBaseLayout, barmode: 'group', title: 'Risque par Type d\'organisation' }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper></Grid>
            <Grid item xs={12} md={6}><Paper elevation={2} sx={{ height: '350px', p: 2 }}><Plot data={chartData.secteurData} layout={{ ...plotlyBaseLayout, barmode: 'group', title: 'Risque par Secteur d\'activité', xaxis: { tickangle: -25 } }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper></Grid>
            <Grid item xs={12} md={6}><Paper elevation={2} sx={{ height: '350px', p: 2 }}><Plot data={chartData.scatterData} layout={{ ...plotlyBaseLayout, title: 'Montant vs. Probabilité', xaxis: { title: "Montant" }, yaxis: { title: "Probabilité" } }} style={{ width: '100%', height: '100%' }} useResizeHandler config={{displayModeBar: false}} /></Paper></Grid>
          </Grid>
        </Fade>
      </Box>
      
      {/* --- Section Données (carte plus petite) --- */}
      <Grow in={true} timeout={900}>
        <Paper elevation={3} sx={{ height: '500px', width: '100%', p:3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Icon color="primary"><ListAltIcon /></Icon>
                <Typography variant="h6" sx={{ ml: 1 }}>Données Client Détaillées</Typography>
            </Box>
            <Button onClick={handleDownload} sx={{ mb: 2, mt: 1 }}>💾 Télécharger les résultats</Button>
            <DataGrid rows={rows} columns={columns} initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: 'Prob_impaye', sort: 'desc' }] } }} pageSizeOptions={[10]} checkboxSelection localeText={frFR.components.MuiDataGrid.defaultProps.localeText} />
        </Paper>
      </Grow>
    </Box>
  );
};

export default BatchResultDashboard;