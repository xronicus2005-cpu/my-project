import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

import { useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../hooksForBackend/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const selectStyle = {
  backgroundColor: "#f9fafb",
  color: "#222",
  borderRadius: "12px",
  padding: "0.6rem",
  fontSize: "1rem",
  fontWeight: 500,
  border: "1px solid #d1d5db",
  width: "100%",
};

const CreateJob = () => {
  const works = {
    IT: ["Frontend", "Backend", "Android Programmalastiriw", "Operaciyon sitemalar"],
    Qolmiyneti: ["Qurilis", "Santexnika", "Elektro montaj", "Remont"],
    Oqitiw: ["Online repititor", "Offline repititor"],
    Elektronika: ["Elektronik qurilmalar duzetiw"],
    Mashinasazliq: ["Mexanik", "Kuzov ustasi"],
  };

  const [niche, setNiche] = useState("");
  const [profession, setProfession] = useState("");
  const [photo, setPhoto] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = useState({
    title: "",
    workType: { niche: "", profession: "" },
    imgWork: null,
    infoWork: "",
    buyersMust: "",
    cost: "",
  });

  console.log(value)

  const handleNicheChange = (e) => {
    const newNiche = e.target.value;
    setNiche(newNiche);
    setProfession("");
    setValue({
      ...value,
      workType: { ...value.workType, niche: e.target.value },
    });
  };

  const handleProfessionChange = (e) => {
    const newProfession = e.target.value;
    setProfession(newProfession);
    setValue({
      ...value,
      workType: { ...value.workType, profession: e.target.value },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
      setValue({ ...value, imgWork: file });
    }
  };

 ////create

  const handleCreate = async(e) => {
    e.preventDefault();

    try{

      if(!value.imgWork){
        toast.error("Jumis suwreti juklenbegen")
        return
      }

      ///suretti img kit ga julew

      const imgData = new FormData()
      imgData.append("file", value.imgWork)
      imgData.append("folder", "Jobs")

      const uploadRes = await api.post("/upload", imgData, {headers: {"Content-Type": "multipart/form-data"}})
      const imgUrl = uploadRes.data.url
      value.imgWork = imgUrl
      
      const saveRes = await api.post("/create", value, {headers: {"x-auth-token": localStorage.getItem("token")}})

      if(saveRes.data.message == "Jumis jaratildi"){
        toast.success("Jumis jaratildi")
        navigate("/Profile")
      }
    }
    catch(err){
      console.log(err)

      const msg = err.response?.data?.message
      toast.error(msg)
    }
  }

  return (
    <>
      <Container sx={{ mt: 4, mb: 5 }}>
        <form onSubmit={handleCreate}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "720px",
              mx: "auto",
              p: { xs: 3, sm: 4 },
              backgroundColor: "#ffffff",
              borderRadius: "1.2rem",
              boxShadow: "0 6px 20px rgba(34, 197, 94, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "1.7rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "800",
                padding: "1rem",
                textAlign: "center",
                backgroundColor: "#22c55e",
                color: "#fff",
                borderRadius: "0.8rem",
                letterSpacing: "0.5px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
              }}
            >
              Jumıs jaratıw
            </Typography>

            {/* TITLE */}
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>Jumıs atı:</Typography>
              <TextField
                fullWidth
                label="ati"
                onChange={(e) => setValue({ ...value, title: e.target.value })}
              />
            </Box>

            {/* Niche + Profession */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Select value={niche} onChange={handleNicheChange} displayEmpty style={selectStyle}>
                <MenuItem value="">Baǵdar saylań...</MenuItem>
                {Object.keys(works).map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={profession}
                onChange={handleProfessionChange}
                disabled={!niche}
                displayEmpty
                style={selectStyle}
              >
                <MenuItem value="">Kásip saylań ...</MenuItem>
                {niche &&
                  works[niche].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
              </Select>
            </Box>

            {/* Image Upload */}
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>Jumıs obloshkasın saylaw:</Typography>

              <label htmlFor="choose">
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: "210px", sm: "260px" },
                    borderRadius: "1rem",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": { borderColor: "#22c55e", transform: "scale(1.02)" },
                  }}
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt="photo"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "3rem", color: "#94a3b8" }}>+</span>
                  )}
                </Box>
              </label>

              <input
                type="file"
                id="choose"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>

            {/* INFO */}
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Jumıs haqqında informaciya:
              </Typography>
              <textarea
                onChange={(e) => setValue({ ...value, infoWork: e.target.value })}
                style={{
                  width: "100%",
                  height: "6rem",
                  borderRadius: "10px",
                  padding: "0.8rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              ></textarea>
            </Box>

            {/* BUYERS MUST */}
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Jallawshılardan talap etiledi:
              </Typography>
              <textarea
                onChange={(e) => setValue({ ...value, buyersMust: e.target.value })}
                style={{
                  width: "100%",
                  height: "6rem",
                  borderRadius: "10px",
                  padding: "0.8rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              ></textarea>
            </Box>

            {/* COST */}
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>Jumıs bahası:</Typography>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">Baha</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  endAdornment={<InputAdornment position="end">(sum)</InputAdornment>}
                  label="Baha"
                  onChange={(e) => setValue({ ...value, cost: e.target.value })}
                />
              </FormControl>
            </Box>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#22c55e",
                padding: "0.9rem",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "0.8rem",
                "&:hover": { backgroundColor: "#16a34a" },
              }}
            >
              Jaratıw
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default CreateJob;
