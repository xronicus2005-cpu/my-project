import { useState, useEffect } from "react";
import Header from "../components/Header";
import Jobs from "../components/Jobs";
import { Container, Box, Button, Typography, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import { api } from "../api/axios";

const IT = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCategoryClick = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/getJobsIt?profession=${category}`);
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err);
      setError("Serverda qatelik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCategoryClick("All");
  }, []);

  return (
    <>
      <Header />
      <Jobs />

      <Container sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* Left aside */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: { xs: "100%", md: "20%" },
              minWidth: { md: "200px" },
            }}
          >
            <Button
              onClick={() => handleCategoryClick("All")}
              variant="contained"
              sx={{ color: "#fff" }}
            >
              Uliwma
            </Button>
            <Button onClick={() => handleCategoryClick("Frontend")} sx={{ color: "#555" }}>
              Frontend
            </Button>
            <Button onClick={() => handleCategoryClick("Backend")} sx={{ color: "#555" }}>
              Backend
            </Button>
            <Button
              onClick={() => handleCategoryClick("Android Programmalastiriw")}
              sx={{ color: "#555" }}
            >
              Android Programmalastırıw
            </Button>
            <Button
              onClick={() => handleCategoryClick("Operaciyon sitemalar")}
              sx={{ color: "#555" }}
            >
              Operaciyon sistemalar
            </Button>
          </Box>

          {/* Jobs list */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 2,
              width: { xs: "100%", md: "75%" },
            }}
          >
            {loading && <Typography>Yuklanmoqda...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/job/${job._id}`}
                style={{
                  width: "100%",
                  height: "350px",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "#555",
                  backgroundColor: "#fff",
                  boxShadow: "5px 15px 15px 5px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <img
                  src={
                    job.imgWork
                      ? `${import.meta.env.VITE_SERVER_URL}/uploads/works/${job.imgWork}`
                      : "https://placehold.co/300x250"
                  }
                  alt={job.title}
                  style={{
                    width: "100%",
                    height: "50%",
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", p: 1 }}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography sx={{ color: "#999", fontSize: "0.9rem" }}>
                    {job.workType?.niche}
                  </Typography>
                  <Typography>{job.workType?.profession}</Typography>
                  <Typography sx={{ fontWeight: "800", color: "green" }}>
                    {job.cost} sum
                  </Typography>
                  <Rating
                    name="read-only"
                    value={Math.floor(job.rating || 0)}
                    readOnly
                  />
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default IT;
