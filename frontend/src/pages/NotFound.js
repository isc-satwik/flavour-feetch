import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box mt={8} textAlign="center"
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white',
        color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: 500,
        mx: 'auto',
        p: 4,
        transition: 'background 0.3s',
      }}
    >
      <Typography variant="h4" mb={2}>404 - Page Not Found</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
    </Box>
  );
};

export default NotFound; 