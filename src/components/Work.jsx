import { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CreateIcon from "@mui/icons-material/Create";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { api } from "../api/axios";

const useStyles = makeStyles({
  card: {
    width: "100%",
    borderRadius: "18px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 15px 35px rgba(0,0,0,0.22)",
    },
    "&:hover $overlayTop": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },

  overlayTop: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "50px",
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 1rem",
    opacity: 0,
    transition: "all 0.3s ease",
  },

  addCard: {
    width: "100%",
    height: "220px",
    borderRadius: "18px",
    border: "2px dashed #888",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
    fontWeight: 300,
    color: "#777",
    textDecoration: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#fafafa",
    "&:hover": {
      transform: "scale(1.05)",
      borderColor: "#22c55e",
      color: "#22c55e",
      backgroundColor: "#f0fff4",
    },
  },
});

const Work = () => {
  const classes = useStyles();
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const getWorks = async () => {
      try {
        const res = await api.get("/works")
        setWorks(res.data.works || []);
      } catch (err) {
        console.log(err);
      }
    };
    getWorks();
  }, []);

  return (
    <>
      <Container sx={{ marginTop: "7rem" }}>
        <Typography variant="h4" fontWeight={700}>
          Jumıslarım
        </Typography>
      </Container>

      <Container
        sx={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        <Link to="/Profile/CreateWork" className={classes.addCard}>
          +
        </Link>

        {works.map((w) => (
          <Box key={w._id} className={classes.card}>
            <img
              src={
                w.imgWork
                  ? w.imgWork
                  : "https://placehold.co/300x250"
              }
              alt={w.title}
              className={classes.image}
            />

            {/* Overlay */}
            <Box className={classes.overlayTop}>
              <Link
                to={`/updateJobs/${w._id}`}
                style={{
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  padding: "4px",
                  borderRadius: "6px",
                }}
              >
                <CreateIcon />
              </Link>
            </Box>

            {/* Content */}
            <Box
              sx={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "160px",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {w.title}
                </Typography>

                <Typography sx={{ color: "#777", fontSize: "0.9rem" }}>
                  {w.workType?.niche}
                </Typography>

                <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  {w.workType?.profession}
                </Typography>

                <Typography
                  sx={{
                    marginTop: "0.5rem",
                    fontWeight: 800,
                    color: "#22c55e",
                    fontSize: "1.1rem",
                  }}
                >
                  {w.cost} sum
                </Typography>
              </Box>

              <Rating
                name="read-only"
                value={Math.floor(w.rating || 0)}
                readOnly
                sx={{ marginTop: "0.6rem" }}
              />
            </Box>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default Work;
