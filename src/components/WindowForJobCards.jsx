import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios"
import { Box, Container, Typography, IconButton, Button, Avatar, Rating } from "@mui/material"
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Footer from "../components/Footer"
import { Link } from "react-router-dom";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SendIcon from '@mui/icons-material/Send';
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const JobDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [user, setUser] = useState(null)
  const [work, setWork] = useState([])
  const [uId, setuId] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 4;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/getJob/${id}`, { headers: { "x-auth-token": localStorage.getItem("token") } })
        setJob(res.data.job)

        const userId = res.data.job.userId._id
        setuId(userId)

        const userRes = await api.get(`/getUser/${userId}`, { headers: { "x-auth-token": localStorage.getItem("token") } })
        setUser(userRes.data.user)

        const workRes = await api.get(`/getUserWorks/${userId}`, { headers: { "x-auth-token": localStorage.getItem("token") } })
        setWork(workRes.data.works)

      } catch (err) {
        setError("Serverde qatelik yamasa siz kirgen emessiz")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  if (loading) return <Typography>Juklenip atir...</Typography>
  if (error) return <Typography color="error">{error}</Typography>
  if (!job) return <Typography>Jumis tawilmadi</Typography>

  const nextSlide = () => {
    if (currentIndex + visibleCount < work.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <>
      <Container>

        <Box sx={{ p: 3 }}>

          {/* Header section */}
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            backgroundColor: "#fff",
            p: 3,
            borderRadius: "1rem"
          }}>
            <div>
              <Typography variant="h5" sx={{ fontSize: { xs: "22px", md: "28px" } }}>{job.title}</Typography>
              <Typography sx={{ fontWeight: 700, color: "green", fontSize: { xs: "18px", md: "22px" } }}>
                {job.cost} sum
              </Typography>
            </div>

            <Avatar
              src={user?.imgProfile ? `${import.meta.env.VITE_SERVER_URL}${user.imgProfile}` : null}
              alt={user?.name}
              sx={{ width: 64, height: 64 }}
            >
              {!user?.imgProfile && user?.name?.slice(0, 1).toUpperCase()}
            </Avatar>

          </Box>

          {/* Image + Profile */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2,
            mt: 3
          }}>

            <Box sx={{
              width: { xs: "100%", lg: "60%" },
              height: { xs: "250px", md: "350px" }
            }}>
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/uploads/works/${job.imgWork}`}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1rem",
                  objectFit: "cover"
                }}
              />
            </Box>

            <Box sx={{
              width: { xs: "100%", lg: "40%" },
              backgroundColor: "#fff",
              p: 3,
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user?.imgProfile ? `${import.meta.env.VITE_SERVER_URL}${user.imgProfile}` : null}
                  sx={{ width: 64, height: 64 }}
                >
                  {!user?.imgProfile && user?.name?.slice(0, 1).toUpperCase()}
                </Avatar>
                <Typography variant="h6">{user?.name} {user?.lastName}</Typography>
              </Box>

              <Typography sx={{ fontSize: { xs: "14px", md: "18px" }, color: "#555" }}>
                {user?.job}
              </Typography>

              <Typography sx={{ fontSize: "12px", color: "#555" }}>
                {user?.info}
              </Typography>

              <Rating value={Math.floor(job.rating || 0)} readOnly />

            </Box>
          </Box>

          {/* PORTFOLIO */}
          <Typography variant="h5" sx={{ mt: 4 }}>Portfoliolar</Typography>

          <Box sx={{ position: "relative", width: "100%", overflow: "hidden", mt: 2 }}>
            <Box sx={{
              display: "flex",
              gap: "10px",
              transition: "transform 0.4s ease",
              transform: `translateX(-${currentIndex * 25}%)`
            }}>
              {work.map(w => (
                <Box
                  key={w._id}
                  sx={{
                    minWidth: { xs: "100%", sm: "50%", md: "33%", lg: "25%" },
                    height: { xs: "200px", md: "220px" },
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid #ddd"
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/portfolio/${w.photo}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />

                  <Typography sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    background: "rgba(0,0,0,0.4)",
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}>{w.workName}</Typography>

                </Box>
              ))}
            </Box>

            <IconButton onClick={prevSlide} sx={{ position: "absolute", top: "50%", left: 5 }}>
              <ArrowBackIos />
            </IconButton>

            <IconButton onClick={nextSlide} sx={{ position: "absolute", top: "50%", right: 5 }}>
              <ArrowForwardIos />
            </IconButton>

          </Box>

          {/* JOB INFO */}
          <Typography variant="h5" sx={{ mt: 4 }}>Jumis haqqinda:</Typography>

          <Box sx={{
            backgroundColor: "#fff",
            p: 3,
            borderRadius: "1rem",
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}>

            <Typography variant="h6" color="green">Info</Typography>
            <Typography sx={{ fontSize: "13px", whiteSpace: "pre-line" }}>
              {job.infoWork}
            </Typography>

            <Typography variant="h6" color="green">Jallawshilardan talap etiledi</Typography>
            <Typography sx={{ fontSize: "13px", whiteSpace: "pre-line" }}>
              {job.buyersMust}
            </Typography>

            <Typography variant="h6" color="green">Baylanis</Typography>

            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalPhoneIcon /> {user.number}
            </Typography>

            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationPinIcon /> {user.address.city}
            </Typography>

            <Button fullWidth sx={{ mt: 2 }}>
              <SendIcon sx={{ mr: 1 }} />
              <Link to={`/chat/${uId}`} style={{ textDecoration: "none", color: "green" }}>
                Baylanisiw
              </Link>
            </Button>

          </Box>

        </Box>

      </Container>

      <Footer />

    </>
  )
}

export default JobDetails
