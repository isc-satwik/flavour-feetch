import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Results from './pages/Results';
import History from './pages/History';
import NotFound from './pages/NotFound';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getTheme from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Favorites from './pages/Favorites';

function LogoutButton({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  return (
    <>
      <Typography variant="body1" sx={{ mx: 2 }}>{user.name}</Typography>
      <IconButton color="inherit" onClick={handleLogout} title="Logout">
        <LogoutIcon />
      </IconButton>
    </>
  );
}

function App() {
  const [user, setUser] = React.useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [homeResetKey, setHomeResetKey] = React.useState(0);
  const [mode, setMode] = React.useState('light');
  const handleThemeToggle = () => setMode(m => (m === 'light' ? 'dark' : 'light'));
  React.useEffect(() => {
    const handleStorage = () => setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  const handleHomeReset = () => setHomeResetKey(k => k + 1);
  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="primary" elevation={2} sx={{ backdropFilter: 'blur(8px)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Pacifico, cursive' }}>
              <Link component={RouterLink} to="/" color="inherit" underline="none" onClick={handleHomeReset}>
                Flavour Fetch
              </Link>
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 6,
                bgcolor: mode === 'dark' ? 'rgba(40,40,40,0.45)' : 'rgba(255,255,255,0.45)',
                boxShadow: mode === 'dark' ? '0 2px 12px #0004' : '0 2px 12px #1976d222',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.3s, box-shadow 0.3s',
                mr: 2,
              }}
            >
              <Switch
                checked={mode === 'dark'}
                onChange={handleThemeToggle}
                color="secondary"
                sx={{
                  '& .MuiSwitch-switchBase': {
                    transition: 'transform 0.3s',
                  },
                  '& .MuiSwitch-thumb': {
                    boxShadow: mode === 'dark' ? '0 0 8px #ff9800' : '0 0 8px #1976d2',
                    backdropFilter: 'blur(2px)',
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: 20,
                    background: mode === 'dark'
                      ? 'linear-gradient(90deg, #23272a 0%, #ff9800 100%)'
                      : 'linear-gradient(90deg, #e3f2fd 0%, #1976d2 100%)',
                    opacity: 1,
                  },
                }}
              />
            </Box>
            <IconButton component={RouterLink} to="/favorites" color="secondary" sx={{ mx: 1 }} title="Favorites">
              <FavoriteIcon />
            </IconButton>
            {user && (
              <Link component={RouterLink} to="/history" color="inherit" underline="hover" sx={{ mx: 1 }}>
                History
              </Link>
            )}
            {!user && (
              <Link component={RouterLink} to="/register" color="inherit" underline="hover" sx={{ mx: 1 }}>
                Register
              </Link>
            )}
            {!user && (
              <Link component={RouterLink} to="/login" color="inherit" underline="hover" sx={{ mx: 1 }}>
                Login
              </Link>
            )}
            {user && <LogoutButton user={user} setUser={setUser} />}
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home key={homeResetKey} user={user} resetHome={handleHomeReset} greeting={user ? `Ready to conquer the kitchen, ${user.name}? Let’s fetch some flavour!` : undefined} />} />
            <Route path="/results" element={<Results />} />
            <Route path="/favorites" element={<Favorites user={user} />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
