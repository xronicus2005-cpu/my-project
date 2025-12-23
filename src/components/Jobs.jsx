import { Container, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles({
  /* DESKTOP LINK — TEGMADIK */
  root: {
    fontFamily: "sans-serif",
    position: "relative",
    textDecoration: "none",
    color: "#111",
    opacity: 0.85,
    fontSize: "18px",
    fontWeight: 600,
    display: "inline-block",
    transition: "all 0.3s ease",
    flex: 1,
    textAlign: "center",

    "&::before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: "3px",
      backgroundColor: "#22c55e",
      transition: "width 0.3s ease",
    },

    "&:hover::before": {
      width: "100%",
    },
  },

  /* MOBILE LINK — YUMSHATILDI */
  mobileLink: {
    minWidth: "100px",
    padding: "5px 10px",          // kichik
    borderRadius: "16px",         // kamroq
    backgroundColor: "rgba(255,255,255,0.65)",
    border: "1px solid #86efac",  // green-300
    color: "#166534",             // green-700
    fontWeight: 500,              // kamroq
    fontSize: "12.5px",           // kichik
    textAlign: "center",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "all 0.12s ease",

    "&:active": {
      transform: "scale(0.96)",
    },
  },

  /* ACTIVE MOBILE — SOKIN */
  activeMobile: {
    backgroundColor: "#22c55e",   // green-100
    color: "#fff",             // green-900
    border: "1px solid #22c55e",
    fontWeight: 600,
  },
});


const Jobs = () => {
  const classes = useStyles();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Container sx={{ mt: 2 }}>
      {/* DESKTOP */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <Link className={classes.root} to="/IT">IT</Link>
        <Link className={classes.root} to="/HandWork">Qol miyneti</Link>
        <Link className={classes.root} to="/Teach">Oqıtıw</Link>
        <Link className={classes.root} to="/Elektr">Elektronika</Link>
        <Link className={classes.root} to="/Cars">Mashinasazlıq</Link>
      </Box>

      {/* MOBILE */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          gap: "10px",
          overflowX: "auto",
          pb: 1,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Link
          to="/IT"
          className={`${classes.mobileLink} ${isActive("/IT") ? classes.activeMobile : ""}`}
        >
          IT
        </Link>

        <Link
          to="/HandWork"
          className={`${classes.mobileLink} ${isActive("/HandWork") ? classes.activeMobile : ""}`}
        >
          Qol miyneti
        </Link>

        <Link
          to="/Teach"
          className={`${classes.mobileLink} ${isActive("/Teach") ? classes.activeMobile : ""}`}
        >
          Oqıtıw
        </Link>

        <Link
          to="/Elektr"
          className={`${classes.mobileLink} ${isActive("/Elektr") ? classes.activeMobile : ""}`}
        >
          Elektronika
        </Link>

        <Link
          to="/Cars"
          className={`${classes.mobileLink} ${isActive("/Cars") ? classes.activeMobile : ""}`}
        >
          Mashinasazlıq
        </Link>
      </Box>
    </Container>
  );
};

export default Jobs;
