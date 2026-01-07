import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Fiery Orange - Adventure/Energy
      light: '#FF8A50',
      dark: '#C41C00',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#263238', // Dark Blue Grey for contrast
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#222222', // Dark Grey
      secondary: '#717171', // Medium Grey
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#222222',
          boxShadow: 'none',
          borderBottom: '1px solid #ebebeb',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#FF5722',
          '&:hover': {
            backgroundColor: '#E64A19',
          },
        },
        containedSecondary: {
          backgroundColor: '#263238',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#102027',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 6px 16px rgba(0,0,0,0.08)', // Softer, more modern shadow
          border: '1px solid #f0f0f0',
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF3E0', // Light Orange
          color: '#E64A19',
        },
        colorPrimary: {
          backgroundColor: '#FF5722',
          color: '#ffffff',
        },
      },
    },
  },
});

export default theme;
