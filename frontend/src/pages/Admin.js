import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Admin = () => (
  <Box maxWidth={600} mx="auto" mt={6} p={3}>
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} mb={2}>Admin Panel</Typography>
      <Typography>This page will allow admin users to manage dishes and ingredients.</Typography>
    </Paper>
  </Box>
);

export default Admin; 