import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/axios";

const Enter = ({ change, create }) => {
  const [value, setValue] = useState({ login: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth", {
        login: value.login,
        password: value.password,
      });

      // cookie avtomatik ketadi
      const res = await api.get("/me", {withCredentials: true});

      // xohlasang state/contextga saqla
      // localStorage shart emas
      navigate("/Profile");

    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg) toast.error(msg);
      else toast.error("Server qatesi");
    }
  };


  function openAnotherWindow() {
    change(false);
    create(true);
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "1.4rem",
          width: "100%",
          maxWidth: { xs: "92%", sm: 420 },
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(245,245,245,0.88))",
          boxShadow: "0 15px 35px rgba(0,0,0,0.20)",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          gap: "1.7rem",
          animation: "fadeIn 0.25s ease",
        }}
      >

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.4rem", sm: "1.8rem" },
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            Kiriw
          </Typography>

          <Button
            onClick={() => change(false)}
            sx={{
              minWidth: "36px",
              color: "#222",
              fontWeight: 700,
              fontSize: "1.2rem",
              backgroundColor: "rgba(0,0,0,0.06)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.15)",
              },
            }}
          >
            ×
          </Button>
        </Box>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.3rem",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            onChange={(e) => setValue({ ...value, login: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.9rem",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            onChange={(e) => setValue({ ...value, password: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.9rem",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              py: 1.3,
              fontSize: "1rem",
              borderRadius: "0.9rem",
              fontWeight: 600,
              backgroundColor: "#22c55e",
              boxShadow: "0 4px 12px rgba(34,197,94,0.4)",
              "&:hover": {
                backgroundColor: "#16a34a",
                boxShadow: "0 6px 16px rgba(22,163,74,0.45)",
              },
            }}
          >
            Kiriw
          </Button>
        </form>

        {/* CREATE ACCOUNT */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={openAnotherWindow}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              color: "#22c55e",
              fontWeight: 600,
              "&:hover": {
                color: "#16a34a",
              },
            }}
          >
            Akkount jaratıw!
          </Button>
        </Box>
      </Box>

      {/* Fade In Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default Enter;
