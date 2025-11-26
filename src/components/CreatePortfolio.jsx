import { Box, Typography, Button, TextField } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

const selectStyle = {
  backgroundColor: "inherit",
  color: "#555",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: 500,
  width: "12rem",
  transition: "0.2s",
  zIndex: 99999
};

const CreatePortfolio = ({ close }) => {
  const [value, setValue] = useState({
    workName: "",
    niche: "",
    photo: "",
  });

  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const work = ["IT", "Qolmiyneti", "Oqitiw", "Elektronika", "Mashinasazliq"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
      setValue({ ...value, photo: file });
    }
  };

  const createPortfolio = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("workName", value.workName);
    formData.append("niche", value.niche);
    if (value.photo) formData.append("photo", value.photo);

    api
      .post("/createPortfolio", formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.message === "Jaratildi") {
          toast.success("Jaratildi");
          close(false);
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        toast.error(msg || "Serverde qatelik boldi");
      });
  };

  return (
    <>
      {/* OVERLAY */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          overflow: "hidden",
          p: 2,
        }}
      >
        {/* MODAL */}
        <Box
          sx={{
            width: { xs: "95%", sm: "450px", md: "550px" },
            maxHeight: "90vh",
            backgroundColor: "#fff",
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            overflowY: "auto",
          }}
        >
          {/* TITLE ROW */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "20px", sm: "24px" } }}
            >
              Portfolio jaratıw
            </Typography>

            <Button onClick={() => close(false)} sx={{ color: "#555" }}>
              X
            </Button>
          </Box>

          {/* FORM */}
          <form
            onSubmit={createPortfolio}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Work Name */}
            <Box>
              <Typography
                sx={{ fontSize: "14px", mb: 0.5, lineHeight: 1.4 }}
              >
                Bul jerde siz ózińiz islegen jumıslarıńız, proyektlerińiz
                benen bólise alasız. Dáslep juwmaqlanǵan jumıslarıńızǵa at
                beresiz.
              </Typography>

              <TextField
                fullWidth
                label="Jumis ati"
                onChange={(e) =>
                  setValue({ ...value, workName: e.target.value })
                }
              />
            </Box>

            {/* Niche */}
            <Box>
              <Typography sx={{ fontSize: "14px", mb: 0.5 }}>
                Jumısıńız qaysı baǵdarǵa tiyisli?
              </Typography>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                Jumıs túri:
                <Select
                  value={value.niche}
                  onChange={(e) =>
                    setValue({ ...value, niche: e.target.value })
                  }
                  displayEmpty
                  style={selectStyle}
                  MenuProps={{disablePortal: true, PaperProps: {sx: {zIndex: 999999}}}}
                >
                  <MenuItem value="">Baǵdar saylań...</MenuItem>
                  {work.map((r) => (
                    <MenuItem key={r} value={r} >
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </label>
            </Box>

            {/* Photo Upload */}
            <Box>
              <Typography sx={{ fontSize: "14px", mb: 0.5 }}>
                Portfolio súwretin júkleń
              </Typography>

              <label htmlFor="choose">
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: "200px", sm: "250px" },
                    border: "solid 1px #777",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "3rem", color: "#777" }}>+</span>
                  )}
                </Box>
              </label>

              <input
                type="file"
                id="choose"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Box>

            {/* Submit */}
            <Button type="submit" variant="contained" sx={{ color: "#fff" }}>
              Saqlaw
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default CreatePortfolio;


