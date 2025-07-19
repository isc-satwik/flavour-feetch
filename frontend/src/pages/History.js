import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import axios from 'axios';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view history.');
      return;
    }
    axios.get('http://localhost:5000/api/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHistory(res.data))
      .catch(() => setError('Failed to load history.'));
  }, []);

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/dishes/${order.dish_id}/ingredients/scaled?servings=${order.servings_requested}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setIngredients(res.data.ingredients);
    } catch {
      setIngredients([]);
    }
    setLoading(false);
  };

  const handleReorder = async (fav) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/history', {
        dish_id: fav.dish_id,
        servings_requested: fav.servings_requested
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbarMsg('Order placed!');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMsg('Failed to reorder.');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box maxWidth={700} mx="auto" mt={6} p={3} borderRadius={2} boxShadow={2}
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white',
        color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
        transition: 'background 0.3s',
      }}
    >
      <Typography variant="h5" mb={2} fontWeight={700} align="center">Query History</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      {!error && (
        <TableContainer component={Paper} sx={{ bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dish</TableCell>
                <TableCell>Servings</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell align="center">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h, idx) => (
                <TableRow key={idx}>
                  <TableCell>{h.dish_name}</TableCell>
                  <TableCell>{h.servings_requested}</TableCell>
                  <TableCell>{new Date(h.timestamp).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOrderClick(h)} title="View Details & Reorder">
                      <ReplayIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography>Loading ingredients...</Typography>
          ) : (
            <>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                {selectedOrder?.dish_name} ({selectedOrder?.servings_requested} servings)
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ingredient</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ingredients.map((ing, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{ing.name}</TableCell>
                      <TableCell>{ing.quantity}</TableCell>
                      <TableCell>{ing.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)} color="secondary">Close</Button>
          <Button onClick={() => handleReorder(selectedOrder)} color="primary" variant="contained" disabled={loading}>
            Reorder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default History; 