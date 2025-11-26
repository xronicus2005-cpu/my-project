import { Container, Box, Typography, Avatar } from "@mui/material";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import { useAuth } from "../hooksForBackend/useAuth";
import { Link } from "react-router-dom";

import { makeStyles } from '@mui/styles';
import dayjs from "dayjs";


// Button style
const styleBtn = makeStyles({
  root: {
    backgroundColor: '#fff',
    display: 'block',
    padding: '1rem',
    borderRadius: '1rem',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#4CAF50',
    fontWeight: '700',
    border: '0.2rem solid #4CAF50',
    transition: "0.3s ease",
    width: "100%",
    '&:hover': {
      backgroundColor: "#4CAF50",
      color: '#fff'
    },
  }
});


const PersonInfo = () => {
  const btn = styleBtn();

  const { user } = useAuth();

  const defaultUser = {
    name: "Palanshe",
    lastName: "Tolensheyev",
    fathersName: "Tolenshe uli",
    login: "Tolenshe123",
    number: "+998 01 234 56 78",
    address: { city: "Nukus" },
    createdAt: "Dizimnen otpegen",
  };

  const current = user || defaultUser;


  // Date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "Ro'yxatdan o'tmagan";
    const date = dayjs(dateString.replace(" M", "-"));
    return date.isValid() ? date.format("D MMMM YYYY") : "Sane joq";
  };


  return (
    <>
      <Container
        sx={{
          marginTop: '2rem',
          backgroundColor: '#fff',
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: '1rem',
          display: 'flex',
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: '2rem', md: '1.5rem' },
          alignItems: { xs: "center", md: "flex-start" }
        }}
      >

        {/* LEFT SIDE */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: "column",
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: '0.5rem'
          }}
        >

          {/* Profile Image */}
          <Box sx={{
            overflow: 'hidden',
            width: { xs: '150px', sm: '180px', md: '200px' },
            height: { xs: '180px', sm: '220px', md: '250px' },
            borderRadius: '0.5rem'
          }}>
            {user?.imgProfile ? (
              <img
                src={`${import.meta.env.VITE_SERVER_URL}${user.imgProfile}`}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Avatar
                sx={{
                  width: { xs: 150, md: 200 },
                  height: { xs: 150, md: 200 },
                  fontSize: "4rem"
                }}
              >
                {current.name.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Box>

          {/* login */}
          <Typography variant="h6" textAlign={{ xs: "center", md: "left" }}>
            {current.login}
          </Typography>

          {/* phone */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LocalPhoneIcon />
            <Typography variant="body1">{current.number}</Typography>
          </Box>

          {/* location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LocationOnIcon />
            <Typography variant="body1">{current.address.city}</Typography>
          </Box>

          {/* date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AccessTimeFilledIcon />
            <Typography variant="body1">{formatDate(current.createdAt)}</Typography>
          </Box>
        </Box>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: { xs: "center", md: "left" },
            width: '100%',
            justifyContent: "space-between",
            
          }}
        >
          <Typography variant="h4">
            {current.name} {current.lastName} {current.fathersName}
          </Typography>

          <Typography variant="h5">
            {current.job || "Jumis"}
          </Typography>

          <Typography variant="body1">
            {user?.info || "Paydalaniwshi haqqinda magliwmat"}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
            <Link className={btn.root} to={"/Settings"}>Profildi sazlaw</Link>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PersonInfo;
