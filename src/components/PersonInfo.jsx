import { Container, Box, Typography, Avatar } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

import { useAuth } from "../hooksForBackend/useAuth";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";

const styleBtn = makeStyles({
  root: {
    backgroundColor: "#22c55e",
    padding: "1rem 2rem",
    borderRadius: "1rem",
    textAlign: "center",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 700,
    border: "2px solid #22c55e",
    transition: "0.3s ease",
    fontSize: "1.05rem",
    "&:hover": {
      backgroundColor: "#18a045",
      transform: "translateY(-3px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
    },
  },
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

  const formatDate = (dateString) => {
    if (!dateString) return "Ro'yxatdan o'tmagan";
    const date = dayjs(dateString.replace(" M", "-"));
    return date.isValid() ? date.format("D MMMM YYYY") : "Sane joq";
  };

  return (
    <Container
      sx={{
        marginTop: "3rem",
        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
        p: { xs: 4, sm: 4, md: 5 },
        borderRadius: "3rem",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: "2rem", md: "3rem" },
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.8rem",
          width: { xs: "100%", md: "35%" },
        }}
      >
        {/* Profile Image */}
        <Box
          sx={{
            width: { xs: "150px", sm: "170px", md: "190px" },
            height: { xs: "150px", sm: "170px", md: "190px" },
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            border: "4px solid #22c55e",
            transition: "0.3s ease",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
            },
          }}
        >
          {user?.imgProfile ? (
            <img
              src={user.imgProfile}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: "100%",
                height: "100%",
                fontSize: "3.5rem",
                backgroundColor: "#22c55e",
                color: "#fff",
              }}
            >
              {current.name.charAt(0).toUpperCase()}
            </Avatar>
          )}
        </Box>

        {/* Login */}
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.3rem",
            color: "#14532d",
          }}
        >
          {current.login}
        </Typography>

        {/* User info icons section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.8rem",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            width: "100%",
            maxWidth: "240px",
          }}
        >
          {[  
            { icon: <LocalPhoneIcon />, text: current.number },
            { icon: <LocationOnIcon />, text: current.address.city },
            { icon: <AccessTimeFilledIcon />, text: formatDate(current.createdAt) },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 0.8rem",
                backgroundColor: "rgba(255,255,255,0.7)",
                borderRadius: "0.8rem",
                transition: "0.25s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateX(4px)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
                "& svg": {
                  color: "#166534",
                },
              }}
            >
              {item.icon}
              <Typography sx={{ fontWeight: 600 }}>{item.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          display: "flex",
          gap: "1.2rem",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: { xs: "center", md: "left" },
          width: { xs: "100%", md: "65%" },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.7rem", sm: "1.9rem", md: "2.2rem" },
            fontWeight: 800,
            color: "#064e3b",
          }}
        >
          {current.name} {current.lastName} {current.fathersName}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
            fontWeight: 600,
            opacity: 0.85,
            color: "#14532d",
          }}
        >
          {current.job || "Jumis"}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            opacity: 0.9,
            fontWeight: 600,
            maxWidth: "95%",
            color: "#1c1917",
            lineHeight: "1.6rem",
            margin: { xs: "0 auto", md: "0" },
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {user?.info || "Paydalaniwshi haqqinda magliwmat"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
            marginTop: { xs: "1rem", md: "0" },
          }}
        >
          <Link className={btn.root} to={"/Settings"}>
            Profildi sazlaw
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default PersonInfo;
