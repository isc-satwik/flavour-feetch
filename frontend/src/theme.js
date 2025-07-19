import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: mode === 'dark' ? '#181a1b' : '#f4f6f8',
      paper: mode === 'dark' ? '#23272a' : '#fff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontFamily: 'Pacifico, cursive' },
    h2: { fontWeight: 700, fontFamily: 'Pacifico, cursive' },
    h3: { fontWeight: 700, fontFamily: 'Pacifico, cursive' },
    h4: { fontWeight: 700, fontFamily: 'Pacifico, cursive' },
    h5: { fontWeight: 700, fontFamily: 'Pacifico, cursive' },
    h6: { fontWeight: 700, fontFamily: 'Pacifico, cursive' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'background 0.2s, box-shadow 0.2s',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.2s, transform 0.2s',
        },
      },
    },
  },
});

export default getTheme; 