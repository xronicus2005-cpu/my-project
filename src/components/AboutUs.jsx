import { Container, Typography } from "@mui/material";

const About = () => {
  return (
    <>
      <Container
        sx={{
          marginTop: { xs: "3rem", sm: "5rem", md: "7rem" },
        }}
      >
        {/* Title */}
        <Typography
          fontWeight={800}
          sx={{
            fontSize: {
              xs: "1.7rem",    // kichik ekran
              sm: "2rem",
              md: "2.2rem",
              lg: "2.4rem",
            },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Sayttan paydalanıw haqqında:
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            marginTop: "3rem",
            lineHeight: 1.7,

            fontSize: {
              xs: "1rem",     // phones
              sm: "1.1rem",
              md: "1.25rem",
              lg: "1.35rem",
            },

            textAlign: { xs: "justify", sm: "justify", md: "left" },
          }}
        >
          Bul sayt Nókis Mámleketlik Texnika Universiteti 3-kurs studentleri hám oqıtıwshıları tárepinen jaratılǵan.
          Bul saytta hár bir shaxs óz qolınan keletuǵın jumıs penen ózin jumıs penen bánt etse boladı. Yaǵnı qolınan keletuǵın jumıs penen ózin jumıs penen bánt etse boladı. Yaǵnıy dáslep óz akkountınıńızdı jaratasız. Soń profil sazlamaların kiritesiz hám jumıs jaratıw bólimine ótip ózińiz isley alatuǵın jumız haqqında maǵlıwmat beresiz. Bergen maǵlıwmatlarıńız miynet bazarımızǵa shıǵadı hám jumıs jallawshılar ózleri siz benen baylanısadı.
          Jumısıńızdı jaratıń, Pul tabıń!
        </Typography>
      </Container>
    </>
  );
};

export default About;
