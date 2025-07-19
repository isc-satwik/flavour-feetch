import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton, Grid, Card, CardMedia, CardContent, CardActionArea, Autocomplete, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Snackbar from '@mui/material/Snackbar';

// Customize your dish images here:
const DISH_IMAGES = {
  Biryani: 'https://shorturl.at/XiAud',
  Pizza: 'https://shorturl.at/lSg9p',
  Pulav: 'https://shorturl.at/YUnnl',
  // Add more as needed
};

const CARD_IMAGE_HEIGHT = 240;
const CARD_WIDTH = 260;
const CARD_CONTENT_HEIGHT = 110;

const Home = ({ user, resetHome, greeting }) => {
  const theme = useTheme();
  const [dishes, setDishes] = useState([]);
  const [dishId, setDishId] = useState('');
  const [servings, setServings] = useState(1);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const navigate = useNavigate();
  const userEmail = user?.email || 'guest';
  const [favorites, setFavorites] = useState(() => {
    try {
      const allFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
      return allFavs[userEmail] || [];
    } catch {
      return [];
    }
  });
  const [favSaved, setFavSaved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    try {
      const allFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
      allFavs[userEmail] = favorites;
      localStorage.setItem('favorites', JSON.stringify(allFavs));
    } catch {}
  }, [favorites, userEmail]);

  useEffect(() => {
    // When user changes, load their favorites
    try {
      const allFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
      setFavorites(allFavs[userEmail] || []);
    } catch {
      setFavorites([]);
    }
  }, [userEmail]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes')
      .then(res => setDishes(res.data))
      .catch(() => setError('Failed to load dishes'));
  }, []);

  const toggleFavorite = (dishId) => {
    setFavorites(favs => favs.includes(dishId) ? favs.filter(id => id !== dishId) : [...favs, dishId]);
  };

  const favoriteDishes = dishes.filter(d => favorites.includes(d.id));

  // Reset all state when resetHome changes
  useEffect(() => {
    setDishId('');
    setServings(1);
    setError('');
    setSearch('');
    setSelectedDish(null);
  }, [resetHome]);

  const handleFetch = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedDish || servings <= 0) {
      setError('Please select a dish and enter a valid number of servings.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/dishes/${selectedDish.id}/ingredients/scaled?servings=${servings}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      navigate('/results', { state: { result: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ingredients');
    }
  };

  const handleSaveFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/favorites', {
        dish_id: selectedDish.id,
        servings: servings
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavSaved(true);
      setSnackbarMsg('Saved to Favorites!');
      setSnackbarOpen(true);
    } catch {
      setFavSaved(false);
      setSnackbarMsg('Failed to save favorite.');
      setSnackbarOpen(true);
    }
  };

  const handleCardClick = (dish) => {
    setError('');
    setSelectedDish(dish);
    setDishId(dish.id);
    setServings(1);
  };

  const handleMinus = () => setServings(s => Math.max(1, s - 1));
  const handlePlus = () => setServings(s => s + 1);

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box maxWidth={900} mx="auto" mt={6} p={3} borderRadius={2} boxShadow={2}
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#23272a' : 'white',
        color: theme.palette.mode === 'dark' ? '#fff' : '#222',
        background: theme.palette.mode === 'dark' ? 'none' : 'linear-gradient(135deg, #f4f6f8 0%, #ffe0b2 100%)',
        transition: 'background 0.5s, color 0.3s',
      }}
    >
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
          text-align: center;
        }
        .flashy-line {
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, #ff9800, #1976d2, #ff9800);
          border-radius: 6px;
          margin: 24px 0 12px 0;
          animation: flashy 2s linear infinite;
        }
        @keyframes flashy {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
          100% { filter: brightness(1); }
        }
        .dish-card {
          transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          animation: fadeInCard 0.7s;
        }
        .dish-card:hover {
          box-shadow: 0 8px 24px rgba(33,150,243,0.18);
          transform: scale(1.045);
          background: #fffbe7;
        }
        /* Fix description color on hover in dark mode */
        @media (prefers-color-scheme: dark) {
          .dish-card:hover .MuiCardContent-root .MuiTypography-body2 {
            color: #ffb300 !important;
          }
        }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .micro-btn:active {
          transform: scale(1.18);
        }
      `}</style>
      {user && greeting && (
        <Typography
          variant="h6"
          mb={2}
          fontWeight={700}
          align="center"
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : '#222',
            textShadow: theme.palette.mode === 'dark' ? '0 2px 8px #000a' : 'none',
            transition: 'color 0.3s',
            fontFamily: 'Roboto, Arial, sans-serif',
          }}
        >
          {greeting}
        </Typography>
      )}
      <Autocomplete
        options={dishes}
        getOptionLabel={option => option.name}
        value={selectedDish}
        onChange={(_, value) => {
          setSelectedDish(value);
          setDishId(value ? value.id : '');
        }}
        inputValue={search}
        onInputChange={(_, value) => setSearch(value)}
        renderInput={params => (
          <TextField
            {...params}
            placeholder="Search or select a dish..."
            margin="normal"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 2,
              bgcolor: theme.palette.mode === 'dark' ? '#23272a' : '#f9f9f9',
              color: theme.palette.mode === 'dark' ? '#fff' : undefined,
              borderRadius: 2,
              border: theme.palette.mode === 'dark' ? `2px solid ${theme.palette.secondary.main}` : undefined,
              boxShadow: theme.palette.mode === 'dark' ? '0 0 0 1px #ff9800' : undefined,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : undefined,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.light : undefined,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.light : undefined,
                },
                color: theme.palette.mode === 'dark' ? '#fff' : undefined,
              },
              input: {
                color: theme.palette.mode === 'dark' ? '#fff' : undefined,
              },
            }}
          />
        )}
        sx={{ mb: 2 }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
      <div className="flashy-line"></div>
      {favoriteDishes.length > 0 && (
        <>
          <Typography variant="subtitle1" align="center" mb={2} color="secondary" fontWeight={600}>
            Favorites
          </Typography>
          <Grid container spacing={3} mb={3} justifyContent="center" alignItems="stretch">
            {favoriteDishes.slice(0, 3).map(dish => {
              const hasImage = !!DISH_IMAGES[dish.name];
              return (
                <Grid item xs={12} sm={4} md={4} key={dish.id} display="flex" justifyContent="center">
                  <Card className="dish-card" sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    width: CARD_WIDTH,
                    display: 'flex',
                    flexDirection: 'column',
                    height: hasImage ? CARD_IMAGE_HEIGHT + CARD_CONTENT_HEIGHT : CARD_CONTENT_HEIGHT + 32,
                    transition: 'height 0.2s',
                    position: 'relative',
                    bgcolor: theme.palette.mode === 'dark' ? '#23272a' : '#fff',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                  }}>
                    <IconButton
                      onClick={e => { e.stopPropagation(); toggleFavorite(dish.id); }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        color: favorites.includes(dish.id) ? '#ff9800' : '#bbb',
                        background: 'rgba(255,255,255,0.7)',
                        '&:hover': { color: '#ff9800', background: 'rgba(255,255,255,0.9)' },
                      }}
                    >
                      {favorites.includes(dish.id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <CardActionArea onClick={() => handleCardClick(dish)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                      {hasImage && (
                        <CardMedia
                          component="img"
                          height={CARD_IMAGE_HEIGHT}
                          image={DISH_IMAGES[dish.name]}
                          alt={dish.name}
                          sx={{ objectFit: 'cover', width: '100%' }}
                        />
                      )}
                      <CardContent sx={{ height: CARD_CONTENT_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                        <Typography variant="h6" fontWeight={700} align="center" sx={{ mb: 1 }}>
                          {dish.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ minHeight: 24, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {dish.description || <span>&nbsp;</span>}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      <Typography variant="subtitle1" align="center" mb={2} color="secondary" fontWeight={600}>
        Popular Dishes
      </Typography>
      <Grid container spacing={3} mb={3} justifyContent="center" alignItems="stretch">
        {filteredDishes.slice(0, 3).map(dish => {
          const hasImage = !!DISH_IMAGES[dish.name];
          return (
            <Grid item xs={12} sm={4} md={4} key={dish.id} display="flex" justifyContent="center">
              <Card className="dish-card" sx={{
                borderRadius: 3,
                boxShadow: 3,
                width: CARD_WIDTH,
                display: 'flex',
                flexDirection: 'column',
                height: hasImage ? CARD_IMAGE_HEIGHT + CARD_CONTENT_HEIGHT : CARD_CONTENT_HEIGHT + 32,
                transition: 'height 0.2s',
                position: 'relative',
                bgcolor: theme.palette.mode === 'dark' ? '#23272a' : '#fff',
                color: theme.palette.mode === 'dark' ? '#fff' : '#222',
              }}>
                <IconButton
                  onClick={e => { e.stopPropagation(); toggleFavorite(dish.id); }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    color: favorites.includes(dish.id) ? '#ff9800' : '#bbb',
                    background: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: '#ff9800', background: 'rgba(255,255,255,0.9)' },
                  }}
                >
                  {favorites.includes(dish.id) ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <CardActionArea onClick={() => handleCardClick(dish)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  {hasImage && (
                    <CardMedia
                      component="img"
                      height={CARD_IMAGE_HEIGHT}
                      image={DISH_IMAGES[dish.name]}
                      alt={dish.name}
                      sx={{ objectFit: 'cover', width: '100%' }}
                    />
                  )}
                  <CardContent sx={{ height: CARD_CONTENT_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6" fontWeight={700} align="center" sx={{ mb: 1 }}>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ minHeight: 24, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {dish.description || <span>&nbsp;</span>}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {selectedDish && (
        <form onSubmit={handleFetch}>
          <Typography variant="subtitle2" align="center" sx={{ mb: 1, fontWeight: 600 }}>
            Number of Servings
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
            <IconButton className="micro-btn" onClick={handleMinus} size="medium" sx={{ border: '1px solid #ccc', borderRadius: '50%', bgcolor: '#fafafa', transition: '0.2s', '&:hover': { bgcolor: '#f0f0f0', borderColor: 'primary.main' } }}>
              <RemoveIcon />
            </IconButton>
            <TextField
              type="number"
              value={servings}
              onChange={e => setServings(Math.max(1, Number(e.target.value)))}
              required
              margin="normal"
              inputProps={{ min: 1, style: { textAlign: 'center', fontWeight: 600, fontSize: 20, padding: '10px 0', width: 60 } }}
              sx={{ width: 80 }}
            />
            <IconButton className="micro-btn" onClick={handlePlus} size="medium" sx={{ border: '1px solid #ccc', borderRadius: '50%', bgcolor: '#fafafa', transition: '0.2s', '&:hover': { bgcolor: '#f0f0f0', borderColor: 'primary.main' } }}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Fetch Ingredients
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveFavorite}
              disabled={favSaved}
              fullWidth
            >
              {favSaved ? 'Saved!' : 'Save as Favorite'}
            </Button>
          </Box>
        </form>
      )}
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

export default Home; 