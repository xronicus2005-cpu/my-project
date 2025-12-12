import { Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

const Statistic = () => {
  const [users, setUsers] = useState(0);
  const [usersIn, setUsersIn] = useState(0);

  const [targetUsers, setTargetUsers] = useState(0);
  const [targetUsersIn, setTargetUsersIn] = useState(0);

  // Animation
  const animateValue = (start, end, setter, duration = 1200) => {
    const startTime = performance.now();

    const step = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(start + (end - start) * progress);

      setter(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await api.get("/getAllUsers");

        setTargetUsers(res.data.totalUsers);
        setTargetUsersIn(res.data.weeklyUsers);

        animateValue(0, res.data.totalUsers, setUsers);
        animateValue(0, res.data.weeklyUsers, setUsersIn);
      } catch (err) {
        console.log(err);
      }
    };

    getAllUsers();
  }, []);

  const maxValue = Math.max(targetUsers, targetUsersIn);
  const usersBarWidth = (users / maxValue) * 100;
  const usersInBarWidth = (usersIn / maxValue) * 100;

  return (
    <Container
      sx={{
        marginTop: "100px",
        padding: { xs: "3rem 1rem", md: "6rem 3rem" },
        borderRadius: "1.5rem",
        background: "linear-gradient(135deg, #f9fafb, #ececec)",
        boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
      }}
    >
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          rowGap: "50px",
          textAlign: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Total Users */}
        <Box
          sx={{
            width: { xs: "100%", md: "47%" },
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            transition: "0.3s ease",
            "&:hover": {
              boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
              transform: "translateY(-5px)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.45rem", md: "1.7rem" },
              fontWeight: 700,
              marginBottom: "12px",
              color: "#111827",
            }}
          >
            Paydalanıwshılar sanı:
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "2.3rem", md: "2.8rem" },
              fontWeight: 800,
              color: "#22c55e",
              textShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {users}
          </Typography>

          {/* Bar chart */}
          <Box
            sx={{
              width: "100%",
              height: "15px",
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              marginTop: "14px",
            }}
          >
            <Box
              sx={{
                height: "100%",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
                width: `${usersBarWidth}%`,
                transition: "width 0.45s ease",
                boxShadow: "0 0 10px rgba(34, 197, 94, 0.7)",
              }}
            />
          </Box>
        </Box>

        {/* Weekly Users */}
        <Box
          sx={{
            width: { xs: "100%", md: "47%" },
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            transition: "0.3s ease",
            "&:hover": {
              boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
              transform: "translateY(-5px)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.45rem", md: "1.7rem" },
              fontWeight: 700,
              marginBottom: "12px",
              color: "#111827",
            }}
          >
            Usı háptede bizge qosılǵanlar:
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "2.3rem", md: "2.8rem" },
              fontWeight: 800,
              color: "#22c55e",
              textShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {usersIn}
          </Typography>

          {/* Bar chart */}
          <Box
            sx={{
              width: "100%",
              height: "15px",
              backgroundColor: "#e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              marginTop: "14px",
            }}
          >
            <Box
              sx={{
                height: "100%",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
                width: `${usersInBarWidth}%`,
                transition: "width 0.45s ease",
                boxShadow: "0 0 10px rgba(34, 197, 94, 0.7)",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Statistic;
