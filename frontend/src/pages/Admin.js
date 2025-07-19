import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Admin = () => {
  const theme = useTheme();

  return (
    <Box maxWidth={600} mx="auto" mt={6} p={3}
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white',
        color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'background 0.3s',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
        <Typography variant="h5" fontWeight={700} mb={2}>Admin Panel</Typography>
        <Typography>This page will allow admin users to manage dishes and ingredients.</Typography>
      </Paper>
    </Box>
  );
};

export default Admin; 