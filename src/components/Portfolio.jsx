import { Container, Box, Button, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";
import CreatePortfolio from './CreatePortfolio';
import { api } from "../api/axios";
import { toast } from "react-toastify";

const useStyles = makeStyles({
  cardContainer: {
    position: "relative",
    width: "100%", // kartaning o'lchami o'zgarmas
    height: "250px",
    border: "solid 0.2px #555",
    borderRadius: "0.5rem",
    overflow: "hidden",
    cursor: "pointer",
    transition: "0.3s ease",
    "&:hover $head": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&:hover $bottom": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&:hover $deleteBtn": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&:hover img": {
      transform: "scale(1.05)",
      filter: "brightness(0.7)",
    },
  },
  imgCard: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "0.5rem",
    transition: "0.4s ease",
  },
  head: {
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "#fff",
    background: "rgba(0,0,0,0.5)",
    padding: "4px 8px",
    borderRadius: "4px",
    opacity: 0,
    transform: "translateY(-10px)",
    transition: "all 0.3s ease",
  },
  bottom: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    color: "#fff",
    background: "rgba(0,0,0,0.5)",
    padding: "4px 8px",
    borderRadius: "4px",
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    cursor: "pointer",
    opacity: 0,
    transform: "translateY(-10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.9)",
      transform: "scale(1.1)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  },
});

const Portfolio = () => {
  const classes = useStyles();
  const [window, setWindow] = useState(false);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const getPortfolio = async () => {
      try {
        const res = await api.get("/myPortfolio", {
          headers: {
            "x-auth-token": localStorage.getItem("token")
          },
        });
        setPortfolio(res.data.portfolio || []);
      } catch (err) {
        console.log(err);
      }
    };
    getPortfolio();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/deletePortfolio/${id}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.data.message === "Oshirildi") {
        setPortfolio((prev) => prev.filter((item) => item._id !== id));
        toast.success("Oshirildi");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg || "Serverde qatelik");
    }
  };

  return (
    <>
      {window && <CreatePortfolio close={setWindow}/>}

      <Container sx={{ marginTop: 2 }}>
        <Typography variant="h4">Portfolio</Typography>
      </Container>

      <Container
        sx={{
          marginTop: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 1, // kartalar orasidagi bo'shliqni kichiklashtirdik
          justifyContent: 'start',
        }}
      >
        {/* New Portfolio Card */}
        <Box sx={{
          width: portfolio && portfolio.length > 0 ? {xs: "100%", md: "100%"} : {xs: "100%", md: "350px"},
          height: '250px',
          border: 'solid 0.2px #555',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          color: '#555',
          cursor: 'pointer',
          transition: '0.3s ease',
          "&:hover": { transform: 'scale(1.015)', backgroundColor: '#f5f5f5' }
        }}>
          <Button onClick={() => setWindow(true)} sx={{ width: '100%', height: '100%', fontSize: '4rem', color: '#555' }}>+</Button>
        </Box>

        {/* Portfolio Items */}
        {portfolio.map(port => (
          <Box key={port._id} className={classes.cardContainer}>
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/portfolio/${port.photo}` || "https://placehold.co/300x250"}
              alt={port.photo}
              className={classes.imgCard}
            />
            <Typography className={classes.head}>{port.workName}</Typography>
            <Typography className={classes.bottom}>{port.niche}</Typography>
            <button className={classes.deleteBtn} onClick={() => handleDelete(port._id)}>
              <DeleteIcon />
            </button>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default Portfolio;
