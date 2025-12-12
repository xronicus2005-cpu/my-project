import Header from "../components/Header";
import Jobs from "../components/Jobs";
import Footer from "../components/Footer"
import { Container, Box, Button, Typography, Rating } from "@mui/material";
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";

const Elektr = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCategoryClick = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/getJobsElektr?profession=${category}`);
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

  const categoryBtnStyle = (isActive) => ({
    width: "100%",
    mb: 1,
    py: 1.2,
    borderRadius: "0.5rem",
    backgroundColor: isActive ? "#16a34a" : "#f3f4f6",
    color: isActive ? "#fff" : "#555",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: isActive ? "#15803d" : "#e5e7eb",
      transform: "translateY(-2px)",
      transition: "0.3s",
    },
    transition: "0.3s",
  });

  return (
    <>
      <Header />
      <Jobs />

      <Container sx={{ mt: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Left aside */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: { xs: "100%", md: "22%" },
              minWidth: { md: "220px" },
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            <Button sx={categoryBtnStyle(jobs.length === 0)} onClick={() => handleCategoryClick("All")}>
              Uliwma
            </Button>
            <Button
              sx={categoryBtnStyle(false)}
              onClick={() => handleCategoryClick("Elektronik qurilmalar duzetiw")}
            >
              Elektronik qurilmalar duzetiw
            </Button>
          </Box>

          {/* Jobs list */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 3,
              width: { xs: "100%", md: "78%" },
            }}
          >
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/job/${job._id}`}
                style={{
                  width: "100%",
                  height: "360px",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "#333",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                className="job-card"
              >
                <img
                  src={
                    job.imgWork
                      ? job.imgWork
                      : "https://placehold.co/300x250"
                  }
                  alt={job.title}
                  style={{
                    width: "100%",
                    height: "50%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", p: 2, gap: 0.5, flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {job.title}
                  </Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>
                    {job.workType?.niche}
                  </Typography>
                  <Typography sx={{ color: "#374151", fontSize: "0.95rem" }}>
                    {job.workType?.profession}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: "#16a34a" }}>
                    {job.cost} sum
                  </Typography>
                  <Rating
                    name="read-only"
                    value={Math.floor(job.rating || 0)}
                    readOnly
                    size="small"
                  />
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>

      <style>
        {`
          .job-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.2);
          }
          .job-card img:hover {
            transform: scale(1.05);
          }
        `}
      </style>

      <Footer/>
    </>
  );
};

export default Elektr;
