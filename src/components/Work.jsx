import { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CreateIcon from "@mui/icons-material/Create";
import Rating from '@mui/material/Rating';
import { Link } from "react-router-dom";
import { api } from "../api/axios";

const useStyles = makeStyles({
  card: {
    width: "100%", // grid ichida 100% egallaydi
    height: "350px",
    borderRadius: "0.5rem",
    position: "relative",
    overflow: "hidden",
    boxShadow: "5px 15px 15px 5px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover $overlayTop": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&:hover $overlayBottom": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  image: {
    width: "100%",
    height: "50%",
    objectFit: "cover",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "2.5rem",
    backgroundColor: "rgba(179, 188, 144, 0.76)",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.5rem",
    padding: "0.5rem",
    opacity: 0,
    transition: "all 0.3s ease",
  },
  overlayBottom: {
    position: "absolute",
    bottom: "50%",
    left: 0,
    width: "100%",
    height: "2.5rem",
    backgroundColor: "rgba(179, 188, 144, 0.76)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    opacity: 0,
    transition: "all 0.3s ease",
  },
  addCard: {
    width: "100%",
    height: "350px",
    border: "solid 0.2px #555",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
    fontWeight: 100,
    color: "#555",
    textDecoration: "none",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
});

const Work = () => {
  const classes = useStyles();
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const getWorks = async () => {
      try {
        const res = await api.get("/works", {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        setWorks(res.data.works || []);
      } catch (err) {
        console.log(err);
      }
    };
    getWorks();
  }, []);

  return (
    <>
      <Container sx={{ marginTop: "2rem" }}>
        <Typography variant="h4">Jumıslarım</Typography>
      </Container>

      <Container
        sx={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // mobil
            sm: "1fr 1fr", // kichik ekran
            md: "repeat(3, 1fr)", // desktop
          },
          gap: 2, // kartalar orasidagi bo'shliq
        }}
      >
        {/* Yangi work yaratish */}
        <Link to="/Profile/CreateWork" className={classes.addCard}>
          +
        </Link>

        {/* Backenddan kelgan works */}
        {works.map((w) => (
          <Box key={w._id} className={classes.card}>
            <img
              src={w.imgWork ? `${import.meta.env.VITE_SERVER_URL}/uploads/works/${w.imgWork}` : "https://placehold.co/300x250"}
              alt={w.title}
              className={classes.image}
            />

            <Box className={classes.overlayTop}>
              <Link
                size="small"
                style={{ display: "inline-block", marginLeft: "1rem", color: "#555", marginTop: "0.5rem" }}
                to={`/updateJobs/${w._id}`}
              >
                <CreateIcon />
              </Link>
            </Box>

            <Box className={classes.overlayBottom}></Box>

            <Box sx={{ display: "flex", flexDirection: "column", padding: "0rem 1rem" }}>
              <Typography variant="h5">{w.title}</Typography>
              <Typography sx={{ color: "#999", fontSize: "0.9rem" }}>{w.workType?.niche}</Typography>
              <Typography>{w.workType?.profession}</Typography>
              <Typography sx={{ fontWeight: "800", color: "green" }}>{w.cost} sum</Typography>
              <Box>
                <Rating name="read-only" value={Math.floor(w.rating || 0)} readOnly />
              </Box>
            </Box>
          </Box>
        ))}
      </Container>

      <Container
        sx={{
          backgroundColor: "#fff",
          marginTop: "2rem",
          p: 4,
          borderRadius: "1rem",
        }}
      >
        <Typography variant="h4">Pikirler:</Typography>
      </Container>
    </>
  );
};

export default Work;
