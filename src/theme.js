import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Modern Royal Blue
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0F172A', // Deep Navy Midnight
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC', // Very Light Blue Gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1E293B', // Slate Dark Gray
      secondary: '#64748B', // Slate Medium Gray
    },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
        },
        containedPrimary: {
           backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});

export default theme;
