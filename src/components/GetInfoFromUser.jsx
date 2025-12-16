import {
  Box,
  Typography,
  TextField,
  Container,
  Radio,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/axios";

const GetInfoFromUser = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const [value, setValue] = useState({
    name: "",
    lastName: "",
    fathersName: "",
    wasBorn: "",
    sex: "",
    number: "",
    address: { state: "", city: "" },
    login: "",
    emailAddress: email,
    password: "",
  });

  const regions = {
    "Toshkent walayatı": ["Toshkent", "Yangiyo‘l", "Keles", "Zangiota", "Boʻka", "Ohangaron"],
    "Andijon walayatı": ["Andijon", "Asaka", "Jalaquduq", "Kuyganyor"],
    "Namangan walayatı": ["Namangan", "Chust", "Kosonsoy", "Pop"],
    "Fargʻona walayatı": ["Fargʻona", "Margʻilon", "Quvasoy", "Rishton"],
    "Samarqand walayatı": ["Samarqand", "Kattaqoʻrgʻon", "Ishtixon", "Narpay"],
    "Buxoro walayatı": ["Buxoro", "Vobkent", "Gʻijduvon", "Shofirkon"],
    "Qashqadaryo walayatı": ["Qarshi", "Shahrisabz", "Gʻuzor", "Kitob"],
    "Jizzax walayatı": ["Jizzax", "Gʻallaorol", "Doʻstlik"],
    "Sirdaryo walayatı": ["Guliston", "Sardoba", "Mirzaobod"],
    "Surxondaryo walayatı": ["Termiz", "Denov", "Boysun", "Qumqoʻrgʻon"],
    "Navoiy walayatı": ["Navoiy", "Tomdi", "Navbahor"],
    "Xorazm walayatı": ["Urganch", "Xiva", "Shovot", "Gurlan"],
    "Qaraqalpaqstan Respublikası": [
      "Nókis",
      "Mańǵıt",
      "Beruniy",
      "Qońırat",
      "Moynaq",
      "Tórtkól",
      "Taxtakópir",
      "Xojeli",
      "Shomanay",
      "Kegeyli",
      "Ellikqala",
      "Qanlıkól",
    ],
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setRegion(newRegion);
    setCity("");
    setValue({ ...value, address: { ...value.address, state: newRegion } });
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    setValue({ ...value, address: { ...value.address, city: newCity } });
  };

  const handleGender = (e) => {
    setGender(e.target.value);
    setValue({ ...value, sex: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Register (cookie backendda o‘rnatiladi)
      await api.post("/enter/register", value);

      // 2. User ma’lumotini olish (cookie avtomatik ketadi)
      const res = await api.get("/me");

      // 3. User info’ni saqlash (ixtiyoriy)
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      toast.success("Profil jaratildi");
      navigate("/Profile");

    } catch (err) {
      toast.error(err.response?.data?.message || "Serverde qatelik");
    }
  };


  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}
        >
          Registraciya – {step}/3
        </Typography>

        {/* ---------------- STEP 1 ---------------- */}
        {step === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Atı"
              fullWidth
              value={value.name}
              onChange={(e) => setValue({ ...value, name: e.target.value })}
            />
            <TextField
              label="Familiyası"
              fullWidth
              value={value.lastName}
              onChange={(e) => setValue({ ...value, lastName: e.target.value })}
            />
            <TextField
              label="Ákesiniń atı"
              fullWidth
              value={value.fathersName}
              onChange={(e) =>
                setValue({ ...value, fathersName: e.target.value })
              }
            />

            <Button
              variant="contained"
              onClick={() => setStep(2)}
              sx={{
                mt: 2,
                py: 1.2,
                backgroundColor: "#22c55e",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#16a34a" },
              }}
            >
              <ArrowForwardIcon />
            </Button>
          </Box>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {step === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              type="date"
              label="Tuwılǵan jılı"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={value.wasBorn}
              onChange={(e) =>
                setValue({ ...value, wasBorn: e.target.value })
              }
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Jınsı:</Typography>
              <Radio
                value="erkek"
                checked={gender === "erkek"}
                onChange={handleGender}
              />
              Erkek
              <Radio
                value="hayal"
                checked={gender === "hayal"}
                onChange={handleGender}
              />
              Hayal
            </Box>

            <FormControl fullWidth>
              <InputLabel>Telefon</InputLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">(+998)</InputAdornment>
                }
                value={value.number}
                onChange={(e) =>
                  setValue({ ...value, number: e.target.value })
                }
                label="Telefon"
              />
            </FormControl>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setStep(1)}
                sx={{ flex: 1 }}
              >
                <ArrowBackIcon/>
              </Button>
              <Button
                variant="contained"
                onClick={() => setStep(3)}
                sx={{
                  flex: 1,
                  backgroundColor: "#22c55e",
                  "&:hover": { backgroundColor: "#16a34a" },
                }}
              >
                <ArrowForwardIcon />
              </Button>
            </Box>
          </Box>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {step === 3 && (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Region</InputLabel>
                <Select value={region} onChange={handleRegionChange} label="Region">
                  <MenuItem value="">Walayat saylań</MenuItem>
                  {Object.keys(regions).map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Qala</InputLabel>
                <Select
                  value={city}
                  onChange={handleCityChange}
                  label="Qala"
                  disabled={!region}
                >
                  <MenuItem value="">Qala saylań</MenuItem>
                  {region &&
                    regions[region].map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Login"
              fullWidth
              value={value.login}
              onChange={(e) =>
                setValue({ ...value, login: e.target.value })
              }
            />

            <TextField label="Email" fullWidth value={email} disabled />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={value.password}
              onChange={(e) =>
                setValue({ ...value, password: e.target.value })
              }
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setStep(2)}
                sx={{ flex: 1 }}
              >
                <ArrowBackIcon/>
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  flex: 1,
                  backgroundColor: "#22c55e",
                  "&:hover": { backgroundColor: "#16a34a" },
                }}
              >
                Jaratıw
              </Button>
            </Box>
          </form>
        )}
      </Box>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  );
};

export default GetInfoFromUser;
