import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Button,
  Avatar,
  Rating,
  Divider,
} from "@mui/material";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import SendIcon from "@mui/icons-material/Send";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [work, setWork] = useState([]);
  const [uId, setuId] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 4;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/getJob/${id}`);
        setJob(res.data.job);

        const userId = res.data.job.userId._id;
        setuId(userId);

        const userRes = await api.get(`/getUser/${userId}`);
        setUser(userRes.data.user);

        const workRes = await api.get(`/getUserWorks/${userId}`);
        setWork(workRes.data.works);
      } catch (err) {
        setError("Serverde qatelik yamasa siz kirgen emessiz");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading)
    return <Typography sx={{ textAlign: "center", mt: 5 }}>Juklenip atir...</Typography>;
  if (error)
    return <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>{error}</Typography>;
  if (!job)
    return <Typography sx={{ textAlign: "center", mt: 5 }}>Jumis tawilmadi</Typography>;

  const nextSlide = () => {
    if (currentIndex + visibleCount < work.length) setCurrentIndex((prev) => prev + 1);
  };
  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* --- HEADER CARD --- */}
        <Box
          sx={{
            p: 4,
            borderRadius: "1.5rem",
            background:
              "linear-gradient(135deg, #ffffff 0%, #f7f7f7 50%, #eef2ff 100%)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {job.title}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#22c55e",
              }}
            >
              {job.cost} sum
            </Typography>
          </Box>

          <Avatar
            src={
              user?.imgProfile
                ? user.imgProfile
                : null
            }
            sx={{
              width: 80,
              height: 80,
              border: "4px solid white",
              boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
            }}
          >
            {!user?.imgProfile && user?.name?.slice(0, 1).toUpperCase()}
          </Avatar>
        </Box>

        {/* --- MAIN IMAGE + USER CARD --- */}
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
          }}
        >
          {/* LEFT: Big Image */}
          <Box
            sx={{
              width: { xs: "100%", lg: "60%" },
              height: { xs: "260px", md: "380px" },
              borderRadius: "1.2rem",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={job.imgWork}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "0.4s",
              }}
            />
          </Box>

          {/* RIGHT: User Card */}
          <Box
            sx={{
              width: { xs: "100%", lg: "40%" },
              p: 4,
              borderRadius: "1.5rem",
              background: "#ffffff",
              boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                src={
                  user?.imgProfile
                    ? user.imgProfile
                    : null
                }
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: "#e2e8f0",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                }}
              >
                {!user?.imgProfile && user?.name?.slice(0, 1).toUpperCase()}
              </Avatar>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {user?.name} {user?.lastName}
                </Typography>
                <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>
                  {user?.job}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ color: "#374151", fontSize: "0.95rem", whiteSpace: "pre-line" }}>
              {user?.info}
            </Typography>

            <Rating value={Math.floor(job.rating || 0)} readOnly sx={{ mt: 1 }} />
          </Box>
        </Box>

        {/* --- PORTFOLIO BEAUTIFUL SLIDER --- */}
        <Typography variant="h5" sx={{ mt: 6, fontWeight: 800 }}>
          Portfoliolar
        </Typography>

        <Box sx={{ position: "relative", overflow: "hidden", mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              transition: "transform 0.4s",
              transform: `translateX(-${currentIndex * 25}%)`,
            }}
          >
            {work.map((w) => (
              <Box
                key={w._id}
                sx={{
                  minWidth: { xs: "100%", sm: "50%", md: "33%", lg: "25%" },
                  height: { xs: "210px", md: "240px" },
                  position: "relative",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <img
                  src={w.photo}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Typography
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    background: "rgba(0,0,0,0.55)",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.75rem",
                    borderRadius: "0.4rem",
                  }}
                >
                  {w.workName}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Slider buttons */}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              top: "50%",
              left: 5,
              transform: "translateY(-50%)",
              backgroundColor: "white",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: "absolute",
              top: "50%",
              right: 5,
              transform: "translateY(-50%)",
              backgroundColor: "white",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>

        {/* --- JOB INFO --- */}
        <Typography variant="h5" sx={{ mt: 6, fontWeight: 800 }}>
          Jumis haqqinda:
        </Typography>

        <Box
          sx={{
            mt: 3,
            p: 4,
            borderRadius: "1.4rem",
            backgroundColor: "white",
            boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#22c55e", fontWeight: 800 }}>
            Info
          </Typography>
          <Typography sx={{ fontSize: "0.95rem", whiteSpace: "pre-line" }}>
            {job.infoWork}
          </Typography>

          <Typography variant="h6" sx={{ color: "#22c55e", fontWeight: 800, mt: 2 }}>
            Jallawshılardan talap etiledi
          </Typography>
          <Typography sx={{ fontSize: "0.95rem", whiteSpace: "pre-line" }}>
            {job.buyersMust}
          </Typography>

          <Typography variant="h6" sx={{ color: "#22c55e", fontWeight: 800, mt: 2 }}>
            Baylanıs
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalPhoneIcon /> {user.number}
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationPinIcon /> {user.address.city}
          </Typography>

          <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: "#22c55e",
              color: "white",
              fontWeight: 700,
              borderRadius: "0.8rem",
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            <SendIcon sx={{ mr: 1 }} />
            <Link to={`/chat/${uId}`} style={{ textDecoration: "none", color: "white" }}>
              Baylanisiw
            </Link>
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default JobDetails;
