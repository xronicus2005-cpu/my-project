import { Container, Box } from "@mui/material";
import { TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../hooksForBackend/useAuth";
import Header from "./Header";
import Jobs from "./Jobs";
import { toast } from "react-toastify";

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [photoOf, setPhotoOf] = useState(null);

  useEffect(() => {
    if (user?.imgProfile) {
      setPhotoOf(user.imgProfile);
    }
  }, [user]);

  const [value, setValue] = useState({
    name: "",
    lastName: "",
    fathersName: "",
    job: "",
    info: "",
    imgProfile: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setValue({ ...value, imgProfile: file });
    }
  };

  const updateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", value.name || user?.name);
    formData.append("lastName", value.lastName || user?.lastName);
    formData.append("fathersName", value.fathersName || user?.fathersName);
    formData.append("job", value.job || user?.job);
    formData.append("info", value.info || user?.info);
    if (value.imgProfile) formData.append("imgProfile", value.imgProfile);

    api
      .post("/update", formData, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.updated) {
          setPhotoOf(res.data.user.imgProfile);
          toast.success("Janalandi");
          navigate("/Profile");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        toast.error(msg || "Serverde qatelik");
      });
  };

  return (
    <>
      <Header />
      <Jobs />

      <Container sx={{ marginTop: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            backgroundColor: "#fff",
            width: { xs: "100%", sm: "40%" },
            padding: "1rem",
            justifyContent: "center",
            borderRadius: "1rem",
          }}
        >
          <Link style={{ textDecoration: "none", color: "#555" }} to="/Settings">
            Uliwma sazlamalar
          </Link>
          <Link
            style={{ textDecoration: "none", color: "#4CAF50" }}
            to="/Settings/ProfileSettings"
          >
            Profile sazlamaları
          </Link>
        </Box>
      </Container>

      <Container sx={{ marginTop: 2 }}>
        <form onSubmit={updateProfile}>
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 4,
              width: { xs: "100%", sm: "80%", md: "60%" },
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
            }}
          >
            <label>
              Atı:
              <TextField
                defaultValue={user?.name || ""}
                onChange={(e) => setValue({ ...value, name: e.target.value })}
                variant="filled"
                fullWidth
              />
            </label>

            <label>
              Familiyası:
              <TextField
                defaultValue={user?.lastName || ""}
                onChange={(e) => setValue({ ...value, lastName: e.target.value })}
                variant="filled"
                fullWidth
              />
            </label>

            <label>
              Ákesiniń atı:
              <TextField
                defaultValue={user?.fathersName || ""}
                onChange={(e) => setValue({ ...value, fathersName: e.target.value })}
                variant="filled"
                fullWidth
              />
            </label>

            <label>
              Jumısıńız:
              <TextField
                variant="filled"
                fullWidth
                defaultValue={user?.job || ""}
                onChange={(e) => setValue({ ...value, job: e.target.value })}
              />
            </label>

            <label>
              Ózińiz haqqıńızda maǵlıwmat:
              <textarea
                defaultValue={user?.info || ""}
                placeholder="Info"
                onChange={(e) => setValue({ ...value, info: e.target.value })}
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  fontFamily: "sans-serif",
                  color: "#555",
                  borderRadius: "0.5rem",
                  border: "1px solid #ccc",
                }}
              ></textarea>
            </label>

            <label htmlFor="choose">
              Profil fotosın ózgertiw:
              <Box
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  height: "250px",
                  border: "solid 0.2px #555",
                  borderRadius: "0.5rem",
                  transition: "0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "#f5f5f5", transform: "scale(1.02)" },
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="photo"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : photoOf ? (
                  <img
                    src={` ${import.meta.env.VITE_SERVER_URL}${user.imgProfile}`}
                    alt="photo"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

            <Button type="submit" variant="contained" sx={{ color: "#fff", mt: 2 }}>
              Saqlaw
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default ProfileSettings;
