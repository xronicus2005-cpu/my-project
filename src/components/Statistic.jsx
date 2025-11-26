import { Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

const Statistic = () => {
  const [users, setUser] = useState();
  const [usersIn, setUsersIn] = useState();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await api.get("/getAllUsers");
        setUser(res.data.totalUsers);
        setUsersIn(res.data.weeklyUsers);
      } catch (err) {
        console.log(err);
      }
    };

    getAllUsers();
  }, []);

  return (
    <Container sx={{ marginTop: "100px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          rowGap: "30px",
          textAlign: "center",

          // Mobile: ustun ko‘rinishi
          flexDirection: { xs: "column", sm: "column", md: "row" },
        }}
      >
        {/* Total users */}
        <Typography
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            // Responsive font-size
            fontSize: {
              xs: "1.2rem",   // kichik ekran
              sm: "1.4rem",
              md: "1.6rem",
              lg: "1.8rem",
            },

            width: { xs: "100%", md: "50%" }, // mobile 100%, desktop 50%
          }}
        >
          Paydalanıwshılar sanı: <span className="num">{users}</span>
        </Typography>

        {/* Weekly users */}
        <Typography
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            fontSize: {
              xs: "1.2rem",
              sm: "1.4rem",
              md: "1.6rem",
              lg: "1.8rem",
            },

            width: { xs: "100%", md: "50%" },
          }}
        >
          Usı háptede bizge qosılǵanlar: <span className="num">{usersIn}</span>
        </Typography>
      </Box>
    </Container>
  );
};

export default Statistic;
