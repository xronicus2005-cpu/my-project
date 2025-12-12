import { createTheme } from "@mui/material";

const tailwindGreen = {
  0: "#FFFFFF",
  50:  "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
  950: "#052e16",
};

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: tailwindGreen[500],
      light: tailwindGreen[300],
      dark: tailwindGreen[700],
      contrastText: "#ffffff",
      ...tailwindGreen,       // barcha green-50...green-900 ni qo‘shib qo‘yamiz
    },

    secondary: {
      main: "#FFC107",
    },

    info: {
      main: "#009688",
    },

    background: {
      default: tailwindGreen[0],
      paper: "#FFFF"
    },

    text: {
      primary: "#1A1A1A",
      secondary: "#4A4A4A",
    },
  },

  typography: {
    fontFamily: "Poppins, sans-serif",
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "10px 20px",
        },
      },
    },
  },
});

export default theme;
