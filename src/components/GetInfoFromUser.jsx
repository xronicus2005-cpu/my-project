import { Box, Typography, TextField, Container, Radio, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/axios";

const GetInfoFromUser = () => {
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  const [value, setValue] = useState({
    name: '',
    lastName: '',
    fathersName: '',
    wasBorn: '',
    sex: '',
    number: '',
    address: { state: '', city: '' },
    login: '',
    emailAddress: email,
    password: ''
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
    "Qaraqalpaqstan Respublikası": ["Nókis", "Mańǵıt", "Beruniy", "Qońırat", "Moynaq", "Tórtkól", "Taxtakópir", "Xojeli", "Shomanay", "Kegeyli", "Ellikqala", "Qanlıkól"]
  };

  const handleChange = (e) => {
    setGender(e.target.value);
    setValue({ ...value, sex: e.target.value });
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setRegion(newRegion);
    setCity('');
    setValue({ ...value, address: { ...value.address, state: newRegion } });
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    setValue({ ...value, address: { ...value.address, city: newCity } });
  };

  const selectStyle = {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 500,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/enter/register", value)
      .then((res) => {
        const { token } = res.data;
        if (!token) return toast.error("login yoki parol xato");

        localStorage.setItem("token", token);

        api.get("/me", { headers: { "x-auth-token": token } })
          .then(res => {
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            toast.success("Profil jaratildi");
            navigate("/Profile");
          }).catch(err => {
            const msg = err.response?.data?.message;
            toast.error(msg || "Server xatosi");
          });
      })
      .catch(err => {
        const msg = err.response?.data?.message;
        toast.error(msg || "Server xatosi");
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Paydalanıwshı maǵlıwmatların alıw
      </Typography>

      <Box sx={{
        backgroundColor: '#fff',
        p: 3,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name */}
          <TextField
            label="Atı"
            variant="outlined"
            fullWidth
            value={value.name}
            onChange={e => setValue({ ...value, name: e.target.value })}
          />

          <TextField
            label="Familiyası"
            variant="outlined"
            fullWidth
            value={value.lastName}
            onChange={e => setValue({ ...value, lastName: e.target.value })}
          />

          <TextField
            label="Ákesiniń atı"
            variant="outlined"
            fullWidth
            value={value.fathersName}
            onChange={e => setValue({ ...value, fathersName: e.target.value })}
          />

          <TextField
            label="Tuwılǵan jılı"
            variant="outlined"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={value.wasBorn}
            onChange={e => setValue({ ...value, wasBorn: e.target.value })}
          />

          {/* Gender */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Jınsı:</Typography>
            <Radio checked={gender === 'erkek'} onChange={handleChange} value="erkek" /> Erkek
            <Radio checked={gender === 'hayal'} onChange={handleChange} value="hayal" /> Hayal
          </Box>

          {/* Phone */}
          <FormControl fullWidth>
            <InputLabel htmlFor="number">Telefon</InputLabel>
            <OutlinedInput
              id="number"
              startAdornment={<InputAdornment position="start">(+998)</InputAdornment>}
              value={value.number}
              onChange={e => setValue({ ...value, number: e.target.value })}
              label="Telefon"
            />
          </FormControl>

          {/* Region & City */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Region</InputLabel>
              <Select value={region} onChange={handleRegionChange} label="Region">
                <MenuItem value="">Walayat saylań</MenuItem>
                {Object.keys(regions).map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Qala</InputLabel>
              <Select value={city} onChange={handleCityChange} label="Shahar" disabled={!region}>
                <MenuItem value="">Qala saylań</MenuItem>
                {region && regions[region].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* Login */}
          <TextField
            label="Login"
            variant="outlined"
            fullWidth
            value={value.login}
            onChange={e => setValue({ ...value, login: e.target.value })}
          />

          {/* Email */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            disabled
          />

          {/* Password */}
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={value.password}
            onChange={e => setValue({ ...value, password: e.target.value })}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, color: "#fff" }}>
            Jaratıw
          </Button>
        </form>
      </Box>
    </Container>
  )
};

export default GetInfoFromUser;
