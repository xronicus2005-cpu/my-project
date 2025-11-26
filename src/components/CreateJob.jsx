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
  backgroundColor: "inherit",
  color: "#555",
  borderRadius: "10px",
  fontSize: "1rem",
  fontWeight: 500,
  padding: "0.1rem",
  transition: "0.2s",
  width: "100%",               // RESPONSIVE
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

  const createJob = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("title", value.title);
    formData.append("niche", value.workType.niche);
    formData.append("profession", value.workType.profession);
    formData.append("infoWork", value.infoWork);
    formData.append("buyersMust", value.buyersMust);
    formData.append("cost", value.cost);
    if (value.imgWork) formData.append("imgWork", value.imgWork);

    api
      .post("/create", formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.message === "Jumis jaratildi") {
          toast.success("Jaratild");
          navigate("/Profile");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (msg) toast.error(msg || "Serverde qatelik boldi");
      });
  };

  return (
    <>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4">Jumıs jaratıw</Typography>
      </Container>

      <Container sx={{ mt: 3, mb: 5 }}>
        <form onSubmit={createJob}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "700px",               // center form
              backgroundColor: "#fff",
              mx: "auto",
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {/* Title */}
            <label>
              Jumıs atı:
              <TextField
                fullWidth
                label="ati"
                onChange={(e) =>
                  setValue({ ...value, title: e.target.value })
                }
              />
            </label>

            {/* Work Type - Responsive */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Select
                value={niche}
                onChange={handleNicheChange}
                displayEmpty
                style={selectStyle}
              >
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

            {/* Photo */}
            <label htmlFor="choose">
              Jumıs obloshkasın saylaw:
              <Box
                sx={{
                  width: { xs: "100%", sm: "260px" },
                  height: { xs: "200px", sm: "250px" },
                  border: "solid 0.2px #555",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="photo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "3rem", color: "#777" }}>+</span>
                )}

                <input
                  type="file"
                  id="choose"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </label>

            {/* Info */}
            <label>
              Jumıs haqqında informaciya:
              <textarea
                onChange={(e) =>
                  setValue({ ...value, infoWork: e.target.value })
                }
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.5rem",
                  fontSize: "1rem",
                }}
              ></textarea>
            </label>

            {/* Buyers must */}
            <label>
              Jallawshılardan talap etiledi:
              <textarea
                onChange={(e) =>
                  setValue({ ...value, buyersMust: e.target.value })
                }
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.5rem",
                  fontSize: "1rem",
                }}
              ></textarea>
            </label>

            {/* Cost */}
            <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
              <label>Jumıs bahası</label>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Baha
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  endAdornment={
                    <InputAdornment position="end">(sum)</InputAdornment>
                  }
                  label="Baha"
                  onChange={(e) =>
                    setValue({ ...value, cost: e.target.value })
                  }
                />
              </FormControl>
            </Box>

            {/* Button */}
            <Button type="submit" variant="contained" sx={{ color: "#fff" }}>
              Jaratıw
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default CreateJob;
