import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <Box mt={6} textAlign="center">
        <Typography variant="h6">No results to display.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={6} p={3} bgcolor="white" borderRadius={2} boxShadow={2}>
      <Typography variant="h5" mb={2} fontWeight={700} align="center">
        Ingredients for {result.servings} serving(s)
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ingredient</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.ingredients.map((ing, idx) => (
              <TableRow key={idx}>
                <TableCell>{ing.name}</TableCell>
                <TableCell>{ing.quantity}</TableCell>
                <TableCell>{ing.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/')}>Back</Button>
    </Box>
  );
};

export default Results; 