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
    width: "100%",
    height: "260px",
    borderRadius: "0.8rem",
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: "#111",
    transition: "0.35s ease",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      transform: "translateY(-3px)",
    },
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
      transform: "scale(1.08)",
      filter: "brightness(0.65)",
    },
  },

  imgCard: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "0.5s ease",
  },

  head: {
    position: "absolute",
    top: "12px",
    left: "12px",
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.95rem",
    letterSpacing: "0.4px",
    backdropFilter: "blur(4px)",
    opacity: 0,
    transform: "translateY(-10px)",
    transition: "all 0.35s ease",
  },

  bottom: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    letterSpacing: "0.3px",
    backdropFilter: "blur(4px)",
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.35s ease",
  },

  deleteBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.55)",
    color: "#fff",
    cursor: "pointer",
    opacity: 0,
    transform: "translateY(-10px)",
    transition: "all 0.25s ease",
    backdropFilter: "blur(4px)",
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.95)",
      transform: "scale(1.1)",
    },
    "&:active": {
      transform: "scale(0.92)",
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
        setPortfolio(prev => prev.filter(item => item._id !== id));
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

      <Container sx={{ marginTop: "5rem" }}>
        <Typography variant="h4" fontWeight={700}>Portfolio</Typography>
      </Container>

      <Container
        sx={{
          marginTop: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 2.5,
        }}
      >
        {/* Create New */}
        <Box
          sx={{
            width: portfolio && portfolio.length > 0 ? {xs:"100%", md:"100%"} : {xs:"100%", md:"350px"},
            height: '260px',
            border: '2px dashed #888',
            borderRadius: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "#fafafa",
            transition: "0.3s ease",
            "&:hover": {
              backgroundColor: "#f1f1f1",
              borderColor: "#333",
              transform: "translateY(-3px)",
            }
          }}
        >
          <Button
            onClick={() => setWindow(true)}
            sx={{
              width: '100%',
              height: '100%',
              fontSize: '4rem',
              fontWeight: 300,
              color: '#777',
            }}
          >
            +
          </Button>
        </Box>

        {/* Items */}
        {portfolio.map(port => (
          <Box key={port._id} className={classes.cardContainer}>
            <img
              src={port.photo}
              alt={port.photo}
              className={classes.imgCard}
            />
            <Typography className={classes.head}>{port.workName}</Typography>
            <Typography className={classes.bottom}>{port.niche}</Typography>

            <button
              className={classes.deleteBtn}
              onClick={() => handleDelete(port._id)}
            >
              <DeleteIcon />
            </button>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default Portfolio;
