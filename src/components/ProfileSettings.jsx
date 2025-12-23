import { Container, Box, TextField, Button, Typography, OutlinedInput, InputAdornment } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useAuth } from "../hooksForBackend/useAuth";
import Header from "./Header";
import Jobs from "./Jobs";
import Footer from "./Footer";
import { toast } from "react-toastify";

import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [photoOf, setPhotoOf] = useState(null);

  useEffect(() => {
    if (user?.imgProfile) setPhotoOf(user.imgProfile);
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

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      if (value.imgProfile) {
        const imgData = new FormData();
        imgData.append("file", value.imgProfile);
        imgData.append("folder", "profile");

        const uploadRes = await api.post("/upload", imgData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const imgUrl = uploadRes.data.url;

        const saveRes = await api.post("/updateProfile", {
          name: value.name || user?.name,
          lastName: value.lastName || user?.lastName,
          fathersName: value.fathersName || user?.fathersName,
          job: value.job || user?.job,
          info: value.info || user?.info,
          imgProfile: imgUrl || "",
        });

        if (saveRes.data.updated) {
          setPhotoOf(imgUrl);
          toast.success("Jaratildi");
          navigate("/Profile");
        }
      } else {
        const elseRes = await api.post("/updateProfile", {
          name: value.name || user?.name,
          lastName: value.lastName || user?.lastName,
          fathersName: value.fathersName || user?.fathersName,
          job: value.job || user?.job,
          info: value.info || user?.info,
          imgProfile: user?.imgProfile || "",
        });

        if (elseRes.data.updated) {
          toast.success("Janalandi");
          navigate("/Profile");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg);
    }
  };

  return (
    <>
      <Header />
      <Jobs />

      {/* NAVIGATION */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            p: 1,
            borderRadius: "999px",
            background: "#ffffffcc",
            backdropFilter: "blur(8px)",
            width: { xs: "100%", sm: "420px" },
          }}
        >
          <NavItem to="/Settings" icon={<PersonIcon />} active={false}>
            Uliwma
          </NavItem>
          <NavItem to="/Settings/ProfileSettings" icon={<PersonIcon />} active={true}>
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
          py: { xs: 4, md: 0 },
        }}
      >
        <Box
          component="form"
          onSubmit={updateProfile}
          sx={{
            width: "100%",
            maxWidth: "1100px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            p: { xs: 3, md: 5 },
            boxShadow: "0 20px 50px rgba(0,0,0,.08)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography fontSize="1.8rem" fontWeight={700} mb={3}>
            Profile sazlamaları
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <FormField icon={<PersonIcon />} label="Atı">
              <TextField
                fullWidth
                variant="outlined"
                defaultValue={user?.name}
                onChange={(e) => setValue({ ...value, name: e.target.value })}
              />
            </FormField>

            <FormField icon={<PersonIcon />} label="Familiyası">
              <TextField
                fullWidth
                variant="outlined"
                defaultValue={user?.lastName}
                onChange={(e) => setValue({ ...value, lastName: e.target.value })}
              />
            </FormField>

            <FormField icon={<BadgeIcon />} label="Ákesiniń atı">
              <TextField
                fullWidth
                variant="outlined"
                defaultValue={user?.fathersName}
                onChange={(e) => setValue({ ...value, fathersName: e.target.value })}
              />
            </FormField>

            <FormField icon={<WorkIcon />} label="Jumısıńız">
              <TextField
                fullWidth
                variant="outlined"
                defaultValue={user?.job}
                onChange={(e) => setValue({ ...value, job: e.target.value })}
              />
            </FormField>

            <FormField icon={<InfoIcon />} label="Ózińiz haqqıńızda maǵlıwmat">
              <textarea
                defaultValue={user?.info}
                onChange={(e) => setValue({ ...value, info: e.target.value })}
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ccc",
                  fontFamily: "sans-serif",
                  resize: "none",
                }}
              />
            </FormField>

            <FormField icon={<PhotoCameraIcon />} label="Profil fotosın ózgertiw">
              <Box
                component={"label"}
                htmlFor="choosePhoto"
                sx={{
                  width: { xs: "100%", sm: "220px" },
                  height: "260px",
                  border: "0.5px solid #888",
                  borderRadius: "0.75rem",
                  mt: 1,
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
                ) : photoOf ? (
                  <img src={photoOf} alt="photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 4,
              justifyContent: "flex-end",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              type="submit"
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "12px",
                backgroundColor: "#22c55e",
                color: "#fff",
                "&:hover": { backgroundColor: "#16a34a" },
              }}
            >
              Saqlaw
            </Button>
          </Box>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

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
    <Typography fontWeight={600} mb={0.5} display="flex" alignItems="center" gap={1} fontSize=".95rem">
      {icon}
      {label}
    </Typography>
    {children}
  </Box>
);

export default ProfileSettings;
