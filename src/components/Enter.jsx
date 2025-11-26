import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/axios";

const Enter = ({ change, create }) => {
  const [value, setValue] = useState({ login: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/auth", {
        login: value.login,
        password: value.password,
      })
      .then((res) => {
        const { token } = res.data;

        if (!token) {
          return toast.error("login yamasa parol qate");
        }

        localStorage.setItem("token", token);

        api
          .get("/me", {
            headers: { "x-auth-token": token },
          })
          .then((res) => {
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            navigate("/Profile");
          });
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (msg) toast.error(msg);
        else toast.error("Server qatesi");
      });
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
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          width: "100%",
          maxWidth: { xs: "90%", sm: 420 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontSize: { xs: "1.3rem", sm: "1.7rem" } }}>
            Kiriw
          </Typography>

          <Button
            onClick={() => change(false)}
            sx={{
              minWidth: "35px",
              color: "#333",
              fontSize: "1rem",
              "@media(max-width: 600px)": { fontSize: "0.9rem" },
            }}
          >
            X
          </Button>
        </Box>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            label="username"
            onChange={(e) => setValue({ ...value, login: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="filled"
            onChange={(e) => setValue({ ...value, password: e.target.value })}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              color: "#fff",
              py: 1.2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Kiriw
          </Button>
        </form>

        {/* Create Account */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={openAnotherWindow}
            sx={{
              fontSize: { xs: "0.85rem", sm: "1rem" },
              textTransform: "none",
            }}
          >
            Akkount jaratıw!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Enter;
