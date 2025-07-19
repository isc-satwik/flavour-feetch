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
  React.useEffect(() => {
    const handleStorage = () => setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  const handleHomeReset = () => setHomeResetKey(k => k + 1);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="primary" elevation={2}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link component={RouterLink} to="/" color="inherit" underline="none" onClick={handleHomeReset}>
                Flavour Fetch
              </Link>
            </Typography>
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
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
