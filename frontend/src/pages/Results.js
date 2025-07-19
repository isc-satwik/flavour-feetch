import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, Fade, Snackbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [ordered, setOrdered] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [favSaved, setFavSaved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();

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
      setTimeout(() => setShowConfirm(true), 400); // show animation after a short delay
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order.');
    }
  };

  const handleOrderMore = () => {
    navigate('/');
  };

  const userEmail = JSON.parse(localStorage.getItem('user') || 'null')?.email || 'guest';
  const handleSaveFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/favorites', {
        dish_id: result.dishId,
        servings: result.servings
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavSaved(true);
      setSnackbarOpen(true);
    } catch {
      setFavSaved(false);
      setSnackbarOpen(true);
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
    <Box maxWidth={600} mx="auto" mt={6} p={3} borderRadius={2} boxShadow={2}
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white',
        color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
        transition: 'background 0.3s',
      }}
    >
      <style>{`
        .order-confirm-anim {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }
        .order-check {
          color: #43a047;
          font-size: 64px;
          animation: popIn 0.5s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes popIn {
          0% { transform: scale(0.2); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <Typography variant="h5" mb={2} fontWeight={700} align="center">
        Ingredients for {result.servings} serving(s)
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2, bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white' }}>
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
      {!ordered && (
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={handleOrder}
        >
          Order
        </Button>
      )}
      {ordered && (
        <Fade in={showConfirm} timeout={600}>
          <Box className="order-confirm-anim">
            <CheckCircleIcon className="order-check" />
            <Typography variant="h6" mt={1} mb={2} color="success.main" fontWeight={700}>
              Order placed!
            </Typography>
            <Typography variant="body1" mb={2} align="center">
              Want to fetch ingredients for another dish?
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleOrderMore} sx={{ mb: 1 }}>
              Order More
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveFavorite}
              sx={{ mb: 1 }}
              disabled={favSaved}
            >
              {favSaved ? 'Saved!' : 'Save as Favorite'}
            </Button>
          </Box>
        </Fade>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Saved to Favorites!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/')}>Back</Button>
    </Box>
  );
};

export default Results; 