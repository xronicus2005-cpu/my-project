import { Container, Box, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../hooksForBackend/useAuth";
import Header from "./Header";
import Jobs from "./Jobs";
import Footer from "./Footer";
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

  const updateProfile = async(e) => {
    e.preventDefault();

    try{

      if(value.imgProfile){
        const imgData = new FormData()
        imgData.append("file", value.imgProfile)
        imgData.append("folder", "profile")

        const uploadRes = await api.post("/upload", imgData, {headers:{"Content-Type" : "multipart/form-data"}})
        const imgUrl = uploadRes.data.url

        const saveRes = await api.post("/updateProfile", 
          {
            name: value.name || user?.name,
            lastName: value.name || user?.lastName,
            fathersName: value.fathersName || user?.fathersName,
            job: value.job || user?.job,
            info: value.info || user?.info,
            imgProfile: imgUrl || ""
          },
          {
            headers: {"x-auth-token": localStorage.getItem("token")}
          }
        )

        if(saveRes.data.updated == true){
          setPhotoOf(imgUrl)
          toast.success("Jaratildi")
          navigate("/Profile")
        }
      }

      else{
        const elseRes = await api.post("/updateProfile", 
          {
            name: value.name || user?.name,
            lastName: value.lastName || user?.lastName,
            fathersName: value.fathersName || user?.fathersName,
            job: value.job || user?.job,
            info: value.info || user?.info,
            imgProfile: user?.imgProfile || ""
          },
          {
            headers:{"x-auth-token": localStorage.getItem("token")}
          }
        )

        if(elseRes.data.updated == true){
          toast.success("Janalandi")
          navigate("/Profile")
        }
      }

    }
    catch(err){
      const msg = err.response?.data?.message
      toast.error(msg)
    }


  };

  return (
    <>
      <Header />
      <Jobs />

      {/* SETTINGS TABS */}
      <Container sx={{ marginTop: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            backgroundColor: "#fff",
            width: { xs: "100%", sm: "50%" },
            padding: "1.5rem",
            justifyContent: "center",
            borderRadius: "1rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          }}
        >
          <Link
            style={{
              textDecoration: "none",
              color: "#555",
              fontWeight: 600,
              fontSize: "1.05rem",
            }}
            to="/Settings"
          >
            Uliwma sazlamalar
          </Link>
          <Link
            style={{
              textDecoration: "none",
              color: "#22c55e",
              fontWeight: 700,
              fontSize: "1.05rem",
            }}
            to="/Settings/ProfileSettings"
          >
            Profile sazlamaları
          </Link>
        </Box>
      </Container>

      {/* FORM */}
      <Container sx={{ marginTop: 3 }}>
        <form onSubmit={updateProfile}>
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 4,
              width: { xs: "100%", sm: "80%", md: "60%" },
              borderRadius: "1rem",
              boxShadow: "0 3px 12px rgba(0,0,0,0.09)",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* NAME */}
            <Box>
              <label style={{ fontWeight: 600 }}>Atı:</label>
              <TextField
                defaultValue={user?.name || ""}
                onChange={(e) => setValue({ ...value, name: e.target.value })}
                variant="filled"
                fullWidth
                sx={{
                  mt: 1,
                  borderRadius: "0.5rem",
                }}
              />
            </Box>

            {/* LAST NAME */}
            <Box>
              <label style={{ fontWeight: 600 }}>Familiyası:</label>
              <TextField
                defaultValue={user?.lastName || ""}
                onChange={(e) => setValue({ ...value, lastName: e.target.value })}
                variant="filled"
                fullWidth
                sx={{ mt: 1 }}
              />
            </Box>

            {/* FATHERS NAME */}
            <Box>
              <label style={{ fontWeight: 600 }}>Ákesiniń atı:</label>
              <TextField
                defaultValue={user?.fathersName || ""}
                onChange={(e) => setValue({ ...value, fathersName: e.target.value })}
                variant="filled"
                fullWidth
                sx={{ mt: 1 }}
              />
            </Box>

            {/* JOB */}
            <Box>
              <label style={{ fontWeight: 600 }}>Jumısıńız:</label>
              <TextField
                defaultValue={user?.job || ""}
                onChange={(e) => setValue({ ...value, job: e.target.value })}
                variant="filled"
                fullWidth
                sx={{ mt: 1 }}
              />
            </Box>

            {/* INFO */}
            <Box>
              <label style={{ fontWeight: 600 }}>Ózińiz haqqıńızda maǵlıwmat:</label>
              <textarea
                defaultValue={user?.info || ""}
                placeholder="Info"
                onChange={(e) => setValue({ ...value, info: e.target.value })}
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.75rem",
                  marginTop: "0.5rem",
                  fontSize: "1rem",
                  fontFamily: "sans-serif",
                  color: "#444",
                  borderRadius: "0.5rem",
                  border: "1px solid #ccc",
                }}
              ></textarea>
            </Box>

            {/* PROFILE IMAGE */}
            <Box>
              <label style={{ fontWeight: 600 }}>Profil fotosın ózgertiw:</label>

              <Box
                component={"label"}
                htmlFor="choose"
                sx={{
                  width: { xs: "100%", sm: "220px" },
                  height: "260px",
                  border: "solid 0.5px #888",
                  borderRadius: "0.75rem",
                  mt: 1,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.03)",
                    backgroundColor: "#f7f7f7",
                  },
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
                    src={photoOf}
                    alt="photo"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "3.5rem", color: "#777" }}>+</span>
                )}

                <input
                  type="file"
                  id="choose"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Box>

            {/* SAVE BUTTON */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "#fff",
                mt: 2,
                backgroundColor: "#22c55e",
                paddingY: 1.2,
                borderRadius: "0.6rem",
                "&:hover": { backgroundColor: "#1da851" },
              }}
            >
              Saqlaw
            </Button>
          </Box>
        </form>
      </Container>

      <Footer/>
    </>
  );
};

export default ProfileSettings;
