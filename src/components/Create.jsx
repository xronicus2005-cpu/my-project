import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/axios";

const Create = ({ change, render }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/enter/check", { emailAddress: value })
      .then((res) => {
        const canEnter = res.data.canEnter;
        localStorage.setItem("email", res.data.emailAddress);

        if (canEnter) {
          navigate("/registration");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        toast.error(msg || "Serverde qatelik");
      });
  };

  function openAnother() {
    change(false);
    render(true);
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
            Akkount jaratıw
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
            label="Email address"
            type="email"
            variant="outlined"
            onChange={(e) => setValue(e.target.value)}
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
            Jaratıw
          </Button>
        </form>

        {/* LOGIN LINK */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={openAnother}
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
            Akkountıma kiriw!
          </Button>
        </Box>
      </Box>

      {/* ANIMATION */}
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

export default Create;
