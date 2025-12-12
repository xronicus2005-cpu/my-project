import { Container, Typography } from "@mui/material";

const About = () => {
  return (
    <>
      <Container
        sx={{
          marginTop: { xs: "4rem", sm: "7rem", md: "9rem" },
          background: "linear-gradient(135deg, #f0fdf4, #e8fbe9)",
          padding: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          borderRadius: "1.5rem",
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Title */}
        <Typography
          fontWeight={800}
          sx={{
            fontSize: {
              xs: "1.8rem",
              sm: "2.1rem",
              md: "2.4rem",
              lg: "2.6rem",
            },
            textAlign: { xs: "center", md: "left" },
            position: "relative",
            display: "inline-block",
            paddingBottom: "6px",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: { xs: "50%", md: 0 },
              transform: { xs: "translateX(-50%)", md: "none" },
              width: "60%",
              height: "4px",
              borderRadius: "2px",
              background: "#22c55e",
            },
          }}
        >
          Sayttan paydalanıw haqqında:
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            marginTop: "2rem",
            lineHeight: 1.85,
            fontSize: {
              xs: "1rem",
              sm: "1.15rem",
              md: "1.25rem",
              lg: "1.35rem",
            },
            color: "#222",
            textAlign: { xs: "justify", md: "left" },
            opacity: 0.9,
            background: "rgba(255,255,255,0.5)",
            padding: { xs: "0.8rem", sm: "1rem" },
            borderRadius: "0.75rem",
          }}
        >
          Bul sayt Nókis Mámleketlik Texnika Universiteti 3-kurs studentleri hám oqıtıwshıları tárepinen
          jaratılǵan. Bul saytta hár bir shaxs óz qolınan keletuǵın jumıs penen ózin jumıs penen bánt etse
          boladı. Yaǵnı qolınan keletuǵın jumıs penen ózin jumıs penen bánt etse boladı. Yaǵnıy dáslep óz
          akkountınıńızdı jaratasız. Soń profil sazlamaların kiritesiz hám jumıs jaratıw bólimine ótip ózińiz
          isley alatuǵın jumız haqqında maǵlıwmat beresiz. Bergen maǵlıwmatlarıńız miynet bazarımızǵa
          shıǵadı hám jumıs jallawshılar ózleri siz benen baylanısadı. Jumısıńızdı jaratıń, Pul tabıń!
        </Typography>
      </Container>
    </>
  );
};

export default About;
