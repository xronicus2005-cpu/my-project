import {
  Container,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Typography
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooksForBackend/useAuth";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSettings = () => {
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
      "Nókis", "Mańǵıt", "Beruniy", "Qońırat", "Moynaq",
      "Tórtkól", "Taxtakópir", "Xojeli", "Shomanay",
      "Kegeyli", "Ellikqala", "Qanlıkól"
    ]
  };

  const { user } = useAuth();

  const [value, setValue] = useState({
    login: "",
    emailAddress: "",
    address: { state: "", city: "" },
    number: "",
    password: "",
    newPassword: "",
  });

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .put(
        `/update/${user._id}`,
        {
          login: value.login || user?.login,
          emailAddress: value.emailAddress || user?.emailAddress,
          address: {
            state: value.address.state || user?.address?.state,
            city: value.address.city || user?.address?.city,
          },
          number: value.number || user?.number,
          password: value.password,
          newPassword: value.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.message === "Janalandi") {
          toast.success("Janalandi", {
            autoClose: 2000,
            onClose: () => window.location.reload(),
          });
        } else {
          toast.info("Server menen baylanista uzilis");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        toast.error(msg || "Serverde qatelik");
      });
  };

  const handleDelete = () => {
    const willDelete = confirm("Akkounti oshiriwge ruxsat beresizbe?");
    if (willDelete) {
      api
        .delete(`/delete/${user._id}`)
        .then((res) => {
          if (res.data.message === "Oshirildi") {
            toast.success("Akkount oshirildi");
            setTimeout(() => window.location.reload(), 1500);
          }
        })
        .catch((err) => {
          const msg = err.response?.data?.message;
          toast.error(msg || "Server menen qatelik");
        });
    }
  };

  return (
    <>
      {/* Navigation */}
      <Container sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            backgroundColor: "#fff",
            width: { xs: "100%", sm: "50%" },
            p: "1.5rem",
            justifyContent: "center",
            borderRadius: "1rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
          }}
        >
          <Link
            style={{
              textDecoration: "none",
              color: "#22c55e",
              fontWeight: 600,
              fontSize: "1.05rem"
            }}
            to="/Settings"
          >
            Uliwma sazlamalar
          </Link>

          <Link
            style={{
              textDecoration: "none",
              color: "#555",
              fontWeight: 600,
              fontSize: "1.05rem"
            }}
            to="/Settings/ProfileSettings"
          >
            Profile sazlamaları
          </Link>
        </Box>
      </Container>

      {/* Form */}
      <Container sx={{ mt: 3, mb: 5, }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 4,
            width: { xs: "100%", sm: "90%", md: "65%" },
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
          }}
        >
          <Typography fontSize="1.6rem" fontWeight={700}>
            Profile sazlamaları
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}
          >
            {/* Login */}
            <Box>
              <Typography mb={0.8} fontWeight={700}>
                Login:
              </Typography>
              <TextField
                defaultValue={user?.login}
                onChange={(e) => setValue({ ...value, login: e.target.value })}
                variant="outlined"
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>

            {/* Email */}
            <Box>
              <Typography mb={0.8} fontWeight={700}>
                Email:
              </Typography>
              <TextField
                defaultValue={user?.emailAddress}
                onChange={(e) => setValue({ ...value, emailAddress: e.target.value })}
                variant="outlined"
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>

            {/* Region + City */}
            <Box>
              <Typography mb={0.8} fontWeight={700}>
                Region:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2
                }}
              >
                <FormControl fullWidth>
                  <Select
                    value={region}
                    onChange={handleRegionChange}
                    displayEmpty
                    sx={{
                      height: "52px",
                      borderRadius: "12px",
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <MenuItem value="">
                      <em>{user?.address?.state}</em>
                    </MenuItem>
                    {Object.keys(regions).map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <Select
                    value={city}
                    onChange={handleCityChange}
                    disabled={!region}
                    displayEmpty
                    sx={{
                      height: "52px",
                      borderRadius: "12px",
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <MenuItem value="">
                      <em>{user?.address?.city}</em>
                    </MenuItem>
                    {region &&
                      regions[region].map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Number */}
            <Box>
              <Typography mb={0.8} fontWeight={700}>
                Telefon:
              </Typography>
              <FormControl fullWidth>
                <InputLabel htmlFor="number">Telefon</InputLabel>
                <OutlinedInput
                  id="number"
                  startAdornment={<InputAdornment position="start">+998</InputAdornment>}
                  label="number"
                  onChange={(e) => setValue({ ...value, number: e.target.value })}
                  defaultValue={user?.number}
                  sx={{ borderRadius: "12px" }}
                />
              </FormControl>
            </Box>

            {/* Password */}
            <Box>
              <Typography mb={0.8} fontWeight={700}>
                Eski parol:
              </Typography>
              <TextField
                label="password"
                variant="outlined"
                type="password"
                onChange={(e) => setValue({ ...value, password: e.target.value })}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>

            <Box>
              <Typography mb={0.8} fontWeight={700}>
                Jana parol:
              </Typography>
              <TextField
                label="new password"
                variant="outlined"
                type="password"
                onChange={(e) => setValue({ ...value, newPassword: e.target.value })}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 1
              }}
            >
              <Button
                onClick={handleDelete}
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "#fff",
                  flex: 1,
                  borderRadius: "12px",
                  fontWeight: 600
                }}
              >
                Akkounti oshiriw
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  flex: 1,
                  borderRadius: "12px",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#16a34a" }
                }}
              >
                Saqlaw
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default UserSettings;
