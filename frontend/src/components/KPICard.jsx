import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const KPICard = ({ title, value, icon, sx, ...props }) => {
  return (
    <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2, ...sx }} {...props}>
      <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56, mr: 2 }}>
        {React.cloneElement(icon, { sx: { color: 'primary.main' } })}
      </Avatar>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Card>
  );
};

export default KPICard;