import {
  Container,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  OutlinedInput,
  InputAdornment,
  Typography
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockIcon from "@mui/icons-material/Lock";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooksForBackend/useAuth";
import { api } from "../api/axios";
import { toast } from "react-toastify";

const regions = { "Toshkent walayatı": ["Toshkent", "Yangiyo‘l", "Keles", "Zangiota", "Boʻka", "Ohangaron"], 
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
  "Qaraqalpaqstan Respublikası": [ "Nókis", "Mańǵıt", "Beruniy", "Qońırat", "Moynaq", "Tórtkól", "Taxtakópir", "Xojeli", "Shomanay", "Kegeyli", "Ellikqala", "Qanlıkól" ] };

const UserSettings = () => {
  const { user } = useAuth();

  const [value, setValue] = useState({
    login: "",
    emailAddress: "",
    address: { state: "", city: "" },
    number: "",
    password: "",
    newPassword: ""
  });

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (user?.address?.state) setRegion(user.address.state);
    if (user?.address?.city) setCity(user.address.city);
  }, [user]);

  const handleSubmit = () => {
    api.put(`/update/${user._id}`, {
      login: value.login || user.login,
      emailAddress: value.emailAddress || user.emailAddress,
      address: {
        state: region || user.address?.state,
        city: city || user.address?.city
      },
      number: value.number || user.number,
      password: value.password,
      newPassword: value.newPassword
    })
      .then((res) => {
        if(res.data.message == "Janalandi"){
          toast.success("Janalandi");
        }
      })
      .catch((err) => {
        toast.error("Serverde qatelik!")
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* NAV */}
      <Container maxWidth="xl" sx={{ pt: 3, marginBottom: "1rem" }}>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            p: 1,
            borderRadius: "999px",
            background: "#ffffffcc",
            backdropFilter: "blur(8px)",
            width: { xs: "100%", md: "420px" }
          }}
        >
          <NavItem to="/Settings" icon={<SettingsIcon />} active={true}>
            Uliwma
          </NavItem>
          <NavItem to="/Settings/ProfileSettings" active={false} icon={<PersonIcon />}>
            Profile
          </NavItem>
        </Box>
      </Container>

      {/* FORM */}
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 4, md: 0 }
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1100px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            p: { xs: 3, md: 5 },
            boxShadow: "0 20px 50px rgba(0,0,0,.08)"
          }}
        >
          <Typography fontSize="1.8rem" fontWeight={700} mb={3}>
            Profile sazlamaları
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3
            }}
          >
            <FormField icon={<PersonIcon />} label="Login">
              <TextField
                fullWidth
                defaultValue={user?.login}
                variant="outlined"
                onChange={(e) => {setValue({ ...value, login: e.target.value })}}
              />
            </FormField>

            <FormField icon={<EmailIcon />} label="Email">
              <TextField
                fullWidth
                defaultValue={user?.emailAddress}
                onChange={() => {setValue({ ...value, emailAddress: e.target.value })}}
              />
            </FormField>

            <FormField icon={<LocationOnIcon />} label="Region">
              <Select fullWidth value={region} onChange={(e) => setRegion(e.target.value)}>
                {Object.keys(regions).map(r => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </Select>
            </FormField>

            <FormField icon={<LocationOnIcon />} label="City">
              <Select fullWidth value={city} onChange={(e) => setCity(e.target.value)}>
                {region && regions[region]?.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormField>

            <FormField icon={<PhoneIphoneIcon />} label="Telefon">
              <OutlinedInput
                fullWidth
                startAdornment={<InputAdornment position="start">+998</InputAdornment>}
                defaultValue={user?.number}
              />
            </FormField>

            <FormField icon={<LockIcon />} label="Eski parol">
              <TextField onChange={(e) => {setValue({...value, password: e.target.value})}} type="password" fullWidth />
            </FormField>

            <FormField icon={<LockIcon />} label="Jana parol">
              <TextField onChange={(e) => {setValue({...value, newPassword: e.target.value})}} type="password" fullWidth />
            </FormField>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 4,
              justifyContent: "flex-end",
              flexDirection: { xs: "column", sm: "row" }
            }}
          >
            <Button
              onClick={handleSubmit}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "12px",
                backgroundColor: "#22c55e",
                color: "#fff",
                "&:hover": { backgroundColor: "#16a34a" }
              }}
            >
              Saqlaw
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

/* ===== UI HELPERS ===== */

/* ===== UI HELPERS ===== */
const NavItem = ({ to, icon, children, active }) => (
  <Link to={to} style={{ textDecoration: "none", flex: 1 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 1,
        borderRadius: "999px",
        fontWeight: 600,
        fontSize: ".95rem",
        backgroundColor: active ? "#dcfce7" : "#fff",
        color: active ? "#16a34a" : "#374151",
        transition: ".2s",
        "&:hover": { backgroundColor: "#bbf7d0" },
      }}
    >
      {icon}
      {children}
    </Box>
  </Link>
);

const FormField = ({ icon, label, children }) => (
  <Box>
    <Typography
      fontWeight={600}
      mb={0.5}
      display="flex"
      alignItems="center"
      gap={1}
      fontSize=".9rem"
    >
      {icon}
      {label}
    </Typography>
    {children}
  </Box>
);

export default UserSettings;
