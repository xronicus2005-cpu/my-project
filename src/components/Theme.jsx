import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:{
      main: "#4CAF50",
    },

    secondary: {
      main: '#ff9800'
    },

    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },

    text: {
      primary: '#333',
      secondary: '#555'
    },

    
  },

  typography: {
    fontFamily: 'Poppins, sans-serif',
    h3: {
      fontWeight: '700',
      letterSpacing: '0.5px'
    },

    button:{
      textTransform: 'none',
      fontWeight: 600
    },
  },

  components:{
    MuiButton:{
      styleOverrides:{
        root:{
          borderRadius: '12px',
          padding: '10px 20px'
        },
      },
    },
  },
})

export default theme