import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        setError('Failed to load favorites.');
      }
      setLoading(false);
    };
    fetchFavorites();
  }, [user, location]);

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

  const handleRemove = async (fav) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
        data: { dish_id: fav.dish_id, servings: fav.servings }
      });
      setFavorites(favorites.filter(f => !(f.dish_id === fav.dish_id && f.servings === fav.servings)));
    } catch {
      setError('Failed to remove favorite.');
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={6} p={3} borderRadius={2} boxShadow={2}
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white',
        color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
        transition: 'background 0.3s',
      }}
    >
      <Typography variant="h5" mb={2} fontWeight={700} align="center">Favorites</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
          <CircularProgress />
        </Box>
      ) : favorites.length === 0 ? (
        <Alert severity="info">No favorites yet. Save your favorite dish and servings from the Results page!</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dish</TableCell>
                <TableCell>Servings</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {favorites.map((fav, idx) => (
                <TableRow key={idx}>
                  <TableCell>{fav.dish_name}</TableCell>
                  <TableCell>{fav.servings}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleReorder(fav)}
                    >
                      Order
                    </Button>
                    <IconButton color="error" onClick={() => handleRemove(fav)} title="Remove">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Favorites; 