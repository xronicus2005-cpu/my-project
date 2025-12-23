import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import BadgeIcon from "@mui/icons-material/Badge";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useAuth } from "../hooksForBackend/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const selectStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "0.75rem",
  padding: "0.5rem 0.75rem",
  border: "1px solid #d1d5db",
  fontSize: "0.95rem",
  color: "#111",
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
    location: user?.address.city,
  });


  useEffect(() => {
    if (user?.address?.city) setValue(prev => ({ ...prev, location: user.address.city }));
  }, [user]);

  const handleNicheChange = (e) => {
    const newNiche = e.target.value;
    setNiche(newNiche);
    setProfession("");
    setValue({ ...value, workType: { ...value.workType, niche: newNiche } });
  };

  const handleProfessionChange = (e) => {
    const newProfession = e.target.value;
    setProfession(newProfession);
    setValue({ ...value, workType: { ...value.workType, profession: newProfession } });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setValue({ ...value, imgWork: file });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!value.imgWork) {
        toast.error("Jumis suwreti juklenbegen");
        return;
      }
      const imgData = new FormData();
      imgData.append("file", value.imgWork);
      imgData.append("folder", "Jobs");

      const uploadRes = await api.post("/upload", imgData, { headers: { "Content-Type": "multipart/form-data" } });
      const imgUrl = uploadRes.data.url;
      value.imgWork = imgUrl;

      const saveRes = await api.post("/create", value);
      if (saveRes.data.message === "Jumis jaratildi") {
        toast.success("Jumis jaratildi");
        navigate("/Profile");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>
      <Box
        component="form"
        onSubmit={handleCreate}
        sx={{
          width: "100%",
          maxWidth: "1100px",
          mx: "auto",
          backgroundColor: "#fff",
          borderRadius: "20px",
          p: { xs: 3, md: 5 },
          boxShadow: "0 20px 50px rgba(0,0,0,.08)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Header */}
        <Typography fontSize="2rem" fontWeight={700} textAlign="center" mb={2}>
          Jumıs jaratıw
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Title */}
          <FormField icon={<WorkIcon />} label="Jumıs atı">
            <TextField
              fullWidth
              variant="outlined"
              onChange={(e) => setValue({ ...value, title: e.target.value })}
            />
          </FormField>

          {/* Niche */}
          <FormField icon={<WorkIcon />} label="Baǵdar">
            <FormControl fullWidth size="small">
              <Select
                value={niche}
                onChange={handleNicheChange}
                displayEmpty
                sx={selectStyle}
              >
                <MenuItem value="">Baǵdar saylań...</MenuItem>
                {Object.keys(works).map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormField>

          {/* Profession */}
          <FormField icon={<WorkIcon />} label="Kásip">
            <FormControl fullWidth size="small">
              <Select
                value={profession}
                onChange={handleProfessionChange}
                disabled={!niche}
                displayEmpty
                sx={selectStyle}
              >
                <MenuItem value="">Kásip saylań ...</MenuItem>
                {niche && works[niche].map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormField>

          {/* Cost */}
          <FormField icon={<MonetizationOnIcon />} label="Baha">
            <OutlinedInput
              fullWidth
              placeholder="Baha"
              endAdornment={<InputAdornment position="end">(sum)</InputAdornment>}
              onChange={(e) => setValue({ ...value, cost: e.target.value })}
              sx={{ borderRadius: "0.75rem" }}
            />
          </FormField>

          {/* Info */}
          <FormField icon={<InfoIcon />} label="Jumıs haqqında">
            <textarea
              onChange={(e) => setValue({ ...value, infoWork: e.target.value })}
              style={{
                width: "100%",
                height: "5rem",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                resize: "none",
                fontFamily: "sans-serif",
              }}
            />
          </FormField>

          {/* Buyers Must */}
          <FormField icon={<BadgeIcon />} label="Jallawshilardan talap etiledi">
            <textarea
              onChange={(e) => setValue({ ...value, buyersMust: e.target.value })}
              style={{
                width: "100%",
                height: "5rem",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                resize: "none",
                fontFamily: "sans-serif",
              }}
            />
          </FormField>

          {/* Image Upload */}
          <FormField icon={<AttachFileIcon />} label="Jumıs obloshkasın saylaw">
            <Box
              component="label"
              htmlFor="choosePhoto"
              sx={{
                width: { xs: "100%", sm: "220px" },
                height: "260px",
                border: "0.5px solid #888",
                borderRadius: "0.75rem",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.03)", backgroundColor: "#f7f7f7" },
                transition: "0.3s",
              }}
            >
              {photo ? (
                <img src={photo} alt="photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "3rem", color: "#777" }}>+</span>
              )}

              <input
                type="file"
                id="choosePhoto"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>
          </FormField>
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            type="submit"
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: "12px",
              backgroundColor: "#22c55e",
              color: "#fff",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            Jaratıw
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

/* ===== UI HELPERS ===== */
const FormField = ({ icon, label, children }) => (
  <Box>
    <Typography fontWeight={600} mb={0.5} display="flex" alignItems="center" gap={1} fontSize=".95rem">
      {icon}
      {label}
    </Typography>
    {children}
  </Box>
);

export default CreateJob;
