import { Box, Typography, Button, TextField } from "@mui/material";
import { Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

const selectStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  fontSize: "1rem",
  padding: "0.5rem",
  width: "100%",
  border: "1px solid #ccc",
  transition: "0.3s",
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

  ///suwret juklaytin funkciya

  const createPortfolio = async (e) => {
    e.preventDefault()

    try{
      if(!value.photo){
        toast.error("Suret juklenbedi")
        return
      }

      //suret img kit qa jiberiledi
      const imgData = new FormData()
      imgData.append("file", value.photo)
      imgData.append("folder", "portfolio")

      const uploadRes = await api.post("/upload", imgData, {headers: {"Content-Type": "multipart/form-data"}})
      
      const imageUrl = uploadRes.data.url

      const saveRes = await api.post("/createPortfolio", 
        {
          workName: value.workName,
          niche: value.niche,
          photo: imageUrl,
        },


      )

      if(saveRes.data.message == "Jaratildi"){
        toast.success("Jaratildi")
        close(false)
      }

    
    }
    catch(err){

      const msg = err.response?.data?.message
      toast.error(msg)

    }
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
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* MODAL */}
        <Box
          sx={{
            width: { xs: "92%", sm: "430px", md: "520px" },
            maxHeight: "90vh",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: { xs: "1.5rem", sm: "2rem" },
            display: "flex",
            flexDirection: "column",
            gap: "1.7rem",
            overflowY: "auto",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
            animation: "scaleIn 0.25s ease",
          }}
        >
          {/* TITLE ROW */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e5e7eb",
              pb: 1.2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "26px", sm: "30px" },
                fontWeight: 700,
                color: "#222",
              }}
            >
              Portfolio jaratıw
            </Typography>

            <Button
              onClick={() => close(false)}
              sx={{
                color: "#333",
                fontWeight: "700",
                fontSize: "20px",
                minWidth: "40px",
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
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
                sx={{
                  fontSize: "13px",
                  mb: 0.8,
                  color: "#555",
                  lineHeight: 1.4,
                }}
              >
                Bul jerde siz ózińiz islegen jumıslarıńız, proyektlerińiz
                benen bólise alasız.
              </Typography>

              <TextField
                fullWidth
                label="Jumis ati"
                onChange={(e) =>
                  setValue({ ...value, workName: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Box>

            {/* Niche */}
            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  mb: 0.7,
                  color: "#444",
                  fontWeight: 500,
                }}
              >
                Jumısıńız qaysı baǵdarǵa tiyisli?
              </Typography>

              <Select
                value={value.niche}
                onChange={(e) =>
                  setValue({ ...value, niche: e.target.value })
                }
                displayEmpty
                style={selectStyle}
                MenuProps={{
                  disablePortal: true,
                  PaperProps: {
                    sx: {
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    },
                  },
                }}
              >
                <MenuItem value="">Baǵdar saylań...</MenuItem>
                {work.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Photo Upload */}
            <Box>
              <Typography sx={{ fontSize: "14px", mb: 0.7, color: "#444" }}>
                Portfolio súwretin júkleń
              </Typography>

              <label htmlFor="choose">
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: "200px", sm: "250px" },
                    border: "2px dashed #999",
                    borderRadius: "14px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "0.3s",
                    backgroundColor: "#fafafa",
                    "&:hover": {
                      borderColor: "#4ade80",
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
                    <span style={{ fontSize: "3rem", color: "#888" }}>+</span>
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#22c55e",
                padding: "0.8rem",
                fontWeight: 600,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#16a34a",
                },
              }}
            >
              Saqlaw
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default CreatePortfolio;
