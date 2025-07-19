import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [ordered, setOrdered] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  const handleOrder = async () => {
    setOrderError('');
    setOrderSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setOrderError('You must be logged in to place an order.');
        return;
      }
      await axios.post(`http://localhost:5000/api/history`, {
        dish_id: result.dishId,
        servings_requested: result.servings
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrdered(true);
      setOrderSuccess('Order placed and added to your history!');
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order.');
    }
  };

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
      {orderError && <Alert severity="error" sx={{ mb: 2 }}>{orderError}</Alert>}
      {orderSuccess && <Alert severity="success" sx={{ mb: 2 }}>{orderSuccess}</Alert>}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mb: 2 }}
        onClick={handleOrder}
        disabled={ordered}
      >
        {ordered ? 'Ordered' : 'Order'}
      </Button>
      <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/')}>Back</Button>
    </Box>
  );
};

export default Results; 