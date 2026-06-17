import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('tutorgigs_theme') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('tutorgigs_theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2E7D32' : '#0e6a13ff', // Green 800 (light), Green 400 (dark)
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: mode === 'light' ? '#43A047' : '#81C784', // Green accents
        contrastText: '#FFFFFF',
      },
      success: {
        main: mode === 'light' ? '#00875A' : '#00C853', // Emerald green
        contrastText: '#FFFFFF',
      },
      warning: {
        main: mode === 'light' ? '#FF8B00' : '#FFA726',
        contrastText: '#FFFFFF',
      },
      error: {
        main: mode === 'light' ? '#DE350B' : '#FF6B6B',
        contrastText: '#FFFFFF',
      },
     background: {
          default: mode === 'light' ? '#FFFFFF' : '#0A0E14',
          paper: mode === 'light' ? '#FFFFFF' : '#1A202C', // 👈 solid white instead of transparent
        },
      text: {
        primary: mode === 'light' ? '#1B5E20' : '#E8F5E9', // Dark green vs pale green
        secondary: mode === 'light' ? '#4CAF50' : '#A5D6A7', // Muted greens
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      h1: {
        fontSize: 'clamp(1.875rem, 5vw, 3rem)',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h4: {
        fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h5: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h6: {
        fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      body1: {
        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
        lineHeight: 1.5,
      },
      caption: {
        fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
        lineHeight: 1.4,
      },
    },
    shape: {
      borderRadius: 12,
    },
   components: {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 12,
        padding: '10px 24px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: mode === 'light'
          ? '0 4px 16px rgba(0, 0, 0, 0.08)'
          : '0 4px 16px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: mode === 'light' ? '#FFFFFF' : '#121212',
        color: mode === 'light' ? '#1B5E20' : '#E8F5E9',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: mode === 'light'
          ? '0 2px 8px rgba(0, 0, 0, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiDialog: {
  styleOverrides: {
    paper: {
      backgroundColor: mode === 'light' ? '#FFFFFF' : '#1A202C',
      color: mode === 'light' ? '#1B5E20' : '#E8F5E9',
    },
  },
},
},
  });

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};