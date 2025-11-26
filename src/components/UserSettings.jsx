import { Container, Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooksForBackend/useAuth";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selectStyle = {
  width: "100%",
  maxWidth: "200px",
  height: "45px",
  borderRadius: "8px",
  padding: "5px",
};

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
    "Qaraqalpaqstan Respublikası": ["Nókis", "Mańǵıt", "Beruniy", "Qońırat", "Moynaq", "Tórtkól", "Taxtakópir", "Xojeli", "Shomanay", "Kegeyli", "Ellikqala", "Qanlıkól"]
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
            "x-auth-token": localStorage.getItem("token"),
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
        .delete(`/delete/${user._id}`, {
          headers: { "x-auth-token": localStorage.getItem("token") },
        })
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
      <Container sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            backgroundColor: "#fff",
            width: { xs: "100%", sm: "40%" },
            p: 1,
            justifyContent: "center",
            borderRadius: "1rem",
          }}
        >
          <Link style={{ textDecoration: "none", color: "#4CAF50" }} to="/Settings">
            Uliwma sazlamalar
          </Link>
          <Link style={{ textDecoration: "none", color: "#555" }} to="/Settings/ProfileSettings">
            Profile sazlamaları
          </Link>
        </Box>
      </Container>

      <Container sx={{ mt: 2 }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 4,
            width: { xs: "100%", sm: "90%", md: "60%" },
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label>
              Login:
              <TextField
                defaultValue={user?.login}
                onChange={(e) => setValue({ ...value, login: e.target.value })}
                variant="filled"
                fullWidth
              />
            </label>

            <label>
              Email:
              <TextField
                defaultValue={user?.emailAddress}
                onChange={(e) => setValue({ ...value, emailAddress: e.target.value })}
                variant="filled"
                fullWidth
              />
            </label>

            <label style={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, alignItems: "center" }}>
              Region:
              <Select
                value={region}
                onChange={handleRegionChange}
                displayEmpty
                sx={{ ...selectStyle, flex: 1 }}
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

              <Select
                value={city}
                onChange={handleCityChange}
                disabled={!region}
                displayEmpty
                sx={{ ...selectStyle, flex: 1 }}
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
            </label>

            <FormControl fullWidth>
              <InputLabel htmlFor="number">Telefon</InputLabel>
              <OutlinedInput
                id="number"
                startAdornment={<InputAdornment position="start">(+998)</InputAdornment>}
                label="number"
                onChange={(e) => setValue({ ...value, number: e.target.value })}
                defaultValue={user?.number}
              />
            </FormControl>

            <label style={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, alignItems: "center" }}>
              Eski parol:
              <TextField
                label="password"
                variant="filled"
                onChange={(e) => setValue({ ...value, password: e.target.value })}
                fullWidth
              />
            </label>

            <label style={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, alignItems: "center" }}>
              Jana parol:
              <TextField
                label="new password"
                variant="filled"
                onChange={(e) => setValue({ ...value, newPassword: e.target.value })}
                fullWidth
              />
            </label>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 2 }}>
              <Button
                onClick={handleDelete}
                variant="contained"
                sx={{ backgroundColor: "red", color: "#fff", flex: 1 }}
              >
                Akkounti oshiriw
              </Button>
              <Button type="submit" variant="contained" sx={{ color: "#fff", flex: 1 }}>
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
