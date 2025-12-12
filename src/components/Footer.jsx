import { Container, Box, Typography, Grid } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";

const Footer = () => {
  const socialLinks = [
    { name: "Telegram", icon: <TelegramIcon />, href: "#" },
    { name: "Email", icon: <AlternateEmailIcon />, href: "#" },
    { name: "Telefon", icon: <SettingsPhoneIcon />, href: "#" },
  ];

  return (
    <Box
      sx={{
        marginTop: "10rem",
        padding: "3rem 0",
        background: "linear-gradient(90deg, #16a34a, #22c55e)",
        color: "white",
        boxShadow: "0 -4px 15px rgba(0,0,0,0.15)",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* LEFT SIDE – ADDRESS */}
          <Grid item xs={12} md={6}>
            <Typography
              component="address"
              sx={{
                fontStyle: "normal",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: "1.7rem",
                color: "white",
                opacity: 0.95,
                fontWeight: 400,
              }}
            >
              Qaraqalpaqstan Respublikası  
              <br />
              Nokis qalası  
              <br />
              NMTU
            </Typography>
          </Grid>

          {/* RIGHT SIDE – SOCIAL LINKS */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "center", md: "flex-end" },
              alignItems: "center",
              gap: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            {socialLinks.map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  cursor: "pointer",
                  padding: "0.6rem 1rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.35)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                  "& svg": {
                    color: "white",
                    fontSize: "1.7rem",
                    transition: "all 0.3s ease",
                  },
                  "&:hover svg": {
                    transform: "scale(1.15)",
                  },
                }}
              >
                {item.icon}

                <a
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                    transition: "0.2s ease",
                  }}
                >
                  {item.name}
                </a>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
