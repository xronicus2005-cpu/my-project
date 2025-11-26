import { Container, Box, Typography, Grid } from "@mui/material";
import TelegramIcon from '@mui/icons-material/Telegram';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer = () => {

  const socialLinks = [
    { name: "Telegram", icon: <TelegramIcon />, href: "#" },
    { name: "Instagram", icon: <InstagramIcon />, href: "#" },
    { name: "Facebook", icon: <FacebookIcon />, href: "#" },
    { name: "LinkedIn", icon: <LinkedInIcon />, href: "#" },
    { name: "WhatsApp", icon: <WhatsAppIcon />, href: "#" },
  ];

  return (
    <>
      <Box
        sx={{
          marginTop: "6rem",
          borderTop: "1px solid #ccc",
          padding: "2rem 0",
          backgroundColor: "#fafafa"
        }}
      >
        <Container>

          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Address */}
            <Grid item xs={12} md={6}>
              <Typography
                component="address"
                sx={{
                  fontStyle: "normal",
                  color: "#444",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: "1.5rem",
                }}
              >
                Qaraqalpaqstan Respublikası  
                Nokis qalası  
                NMTU
              </Typography>
            </Grid>

            {/* Social Links */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.7rem",
              }}
            >
              {socialLinks.map((item) => (
                <Box
                  key={item.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {item.icon}
                  <a
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      color: "#555",
                      fontSize: "0.95rem",
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
    </>
  );
};

export default Footer;
