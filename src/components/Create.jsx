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
        console.log(err);
        const msg = err.response?.data?.message;
        toast.error(msg || "Serverde qatelik");
      });
  };

  function openAnother() {
    change(false);
    render(true);
  }

  return (
    <>
      {/* OVERLAY */}
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
        {/* MODAL */}
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: "90%", sm: "400px", md: "450px" },
            borderRadius: 2,
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* TITLE + CLOSE */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row", // har doim row bo'lsin
              gap: "0.5rem",
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center", flexGrow: 1 }}>
              Akkount jaratıw
            </Typography>

            <Button onClick={() => change(false)} sx={{ color: "#555" }}>
              X
            </Button>
          </Box>


          {/* FORM */}
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
              label="email address"
              onChange={(e) => setValue(e.target.value)}
              type="email"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ color: "#fff", width: "100%" }}
              fullWidth
            >
              Jaratıw
            </Button>
          </form>

          {/* CHANGE TO LOGIN */}
          <Button onClick={openAnother} fullWidth>
            Akkountıma kiriw!
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Create;
