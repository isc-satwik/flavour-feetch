import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [dishes, setDishes] = useState([]);
  const [dishId, setDishId] = useState('');
  const [servings, setServings] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes')
      .then(res => setDishes(res.data))
      .catch(() => setError('Failed to load dishes'));
  }, []);

  const handleFetch = async (e) => {
    e.preventDefault();
    setError('');
    if (!dishId || servings <= 0) {
      setError('Please select a dish and enter a valid number of servings.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/dishes/${dishId}/ingredients/scaled?servings=${servings}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      navigate('/results', { state: { result: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ingredients');
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={6} p={3} bgcolor="white" borderRadius={2} boxShadow={2}>
      <Typography variant="h5" mb={2} fontWeight={700} align="center">Flavour Fetch</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleFetch}>
        <TextField
          select
          label="Select Dish"
          value={dishId}
          onChange={e => setDishId(e.target.value)}
          fullWidth
          required
          margin="normal"
        >
          {dishes.map(dish => (
            <MenuItem key={dish.id} value={dish.id}>{dish.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Number of Servings"
          type="number"
          value={servings}
          onChange={e => setServings(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Fetch Ingredients
        </Button>
      </form>
    </Box>
  );
};

export default Home; 