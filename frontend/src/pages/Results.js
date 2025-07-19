import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, Fade, Snackbar, IconButton, TextField, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
  const [ingredients, setIngredients] = useState(result ? result.ingredients.map(ing => ({ ...ing })) : []);
  const [addOpen, setAddOpen] = useState(false);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIng, setSelectedIng] = useState(null);
  const [addQty, setAddQty] = useState('');
  const backButtonRef = React.useRef();
  const animationRef = React.useRef();

  React.useEffect(() => {
    axios.get('http://localhost:5000/api/ingredients')
      .then(res => setAllIngredients(res.data))
      .catch(() => setAllIngredients([]));
  }, []);

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
      setTimeout(() => {
        window.scrollTo({ top: 1000, behavior: 'smooth' });
        setShowConfirm(true);
      }, 100); // scroll and show animation together
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

  const handleRemove = idx => setIngredients(ings => ings.filter((_, i) => i !== idx));
  const handleQtyChange = (idx, value) => setIngredients(ings => ings.map((ing, i) => i === idx ? { ...ing, quantity: value } : ing));
  const handleAddIngredient = () => {
    if (!selectedIng || !addQty) return;
    setIngredients([...ingredients, { name: selectedIng.name, unit: selectedIng.unit, quantity: addQty }]);
    setSelectedIng(null);
    setAddQty('');
    setAddOpen(false);
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
              <TableCell sx={{ minWidth: 70, maxWidth: 90, width: 90 }}>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ing, idx) => (
              <TableRow key={idx}>
                <TableCell>{ing.name}</TableCell>
                <TableCell sx={{ minWidth: 70, maxWidth: 90, width: 90 }}>
                  <TextField
                    value={ing.quantity}
                    onChange={e => handleQtyChange(idx, e.target.value)}
                    variant="standard"
                    type="number"
                    fullWidth
                    sx={{ input: { color: theme.palette.mode === 'dark' ? '#fff' : undefined, textAlign: 'center', p: 0 }, minWidth: 60, maxWidth: 80, width: 80 }}
                  />
                </TableCell>
                <TableCell>{ing.unit}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Remove">
                    <IconButton color="error" onClick={() => handleRemove(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 3, fontWeight: 600, px: 4, py: 1.2, fontSize: 16, boxShadow: 3 }}
          onClick={() => setAddOpen(true)}
        >
          Add Ingredient
        </Button>
      </Box>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Ingredient</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={allIngredients}
            getOptionLabel={option => option.name}
            value={selectedIng}
            onChange={(_, value) => setSelectedIng(value)}
            renderInput={params => (
              <TextField {...params} label="Ingredient" margin="normal" />
            )}
            sx={{ mb: 2, minWidth: 250 }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={addQty}
            onChange={e => setAddQty(e.target.value)}
            margin="normal"
            fullWidth
          />
          {selectedIng && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Unit: {selectedIng.unit}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddIngredient} color="primary" variant="contained" disabled={!selectedIng || !addQty}>Add</Button>
        </DialogActions>
      </Dialog>
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
      <Button ref={backButtonRef} variant="contained" color="primary" fullWidth onClick={() => navigate('/')}>Back</Button>
    </Box>
  );
};

export default Results; 