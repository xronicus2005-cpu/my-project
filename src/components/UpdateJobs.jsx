import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Header from "./Header";
import Jobs from "./Jobs";
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const selectStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  fontSize: "1rem",
  padding: "0.5rem",
  width: "100%",
  border: "1px solid #ccc",
};

const UpdateJobs = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);

  const [niche, setNiche] = useState("");
  const [profession, setProfession] = useState("");

  const navigate = useNavigate();

  const [value, setValue] = useState({
    title: "",
    workType: { niche: "", profession: "" },
    imgWork: null,
    infoWork: "",
    buyersMust: "",
    cost: "",
  });

  const work = {
    IT: ["Frontend", "Backend", "Android Programmalastiriw", "Operaciyon sitemalar"],
    Qolmiyneti: ["Qurilis", "Santexnika", "Elektro montaj", "Remont"],
    Oqitiw: ["Online repititor", "Offline repititor"],
    Elektronika: ["Elektronik qurilmalar duzetiw"],
    Mashinasazliq: ["Mexanik", "Kuzov ustasi"],
  };

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const res = await api.get(`/works/${id}`, {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });

        const workData = res.data.work;

        setValue({
          title: workData.title || "",
          workType: {
            niche: workData.workType?.niche || "",
            profession: workData.workType?.profession || "",
          },
          imgWork: workData.imgWork || null,
          infoWork: workData.infoWork || "",
          buyersMust: workData.buyersMust || "",
          cost: workData.cost || "",
        });

        setNiche(workData.workType?.niche || "");
        setProfession(workData.workType?.profession || "");

        if (workData.imgWork) {
          setPhoto(workData.imgWork);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWork();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
      setValue({ ...value, imgWork: file });
    }
  };

  if (loading) return <Typography sx={{ mt: 5 }}>loading...</Typography>;

  const updateJobs = async(e) => {

    e.preventDefault();

    try{

      // RASM O'ZGARITILGANINI TEKSHIRISH
      let imgUrl = value.imgWork;

      // Agar value.imgWork file bo'lsa (ya'ni foydalanuvchi yangi rasm yuklagan bo'lsa)
      if (value.imgWork && value.imgWork instanceof File) {

        const imgData = new FormData();
        imgData.append("file", value.imgWork);
        imgData.append("folder", "Jobs");

        const uploadRes = await api.post("/upload", imgData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        imgUrl = uploadRes.data.url;
      }

      // value.imgWork ni final URL bilan yangilaymiz
      const sendData = {
        ...value,
        imgWork: imgUrl
      };

      const updateRes = await api.put(`/updateWork/${id}`, sendData, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });

      if(updateRes.data.message === "Janalandi"){
        toast.success("Janalandi");
        navigate("/Profile");
      }

    }
    catch(err){
      console.log(err);
      const msg = err.response?.data?.message;
      toast.error(msg || "Serverde qatelik");
    }

  };


  const deleteJob = () => {
    api
      .delete(`/deleteWork/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.message === "Oshirildi") {
          toast.success("Oshirildi");
          navigate("/Profile");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (msg) toast.error(msg || "Serverde qatelik");
      });
  };

  return (
    <>
      <Header />
      <Jobs />

      <Container sx={{ mt: 4 }}>
        
      </Container>

      <Container
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          mb: 5,
          px: { xs: 1, sm: 2 },
        }}
      >
        <form
          onSubmit={updateJobs}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "650px",
              backgroundColor: "#fff",
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "1.4rem",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              Jumıstı jańalaw
            </Typography>
            {/* Title */}
            <Box>
              <Typography sx={{ mb: 1, color: "#444", fontWeight: 500 }}>
                Jumıs atı:
              </Typography>
              <TextField
                fullWidth
                label="ati"
                value={value.title}
                onChange={(e) => setValue({ ...value, title: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Box>

            {/* Work Type */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Select
                value={niche}
                onChange={(e) => {
                  setNiche(e.target.value);
                  setValue({
                    ...value,
                    workType: { ...value.workType, niche: e.target.value },
                  });
                }}
                displayEmpty
                fullWidth
                style={selectStyle}
              >
                <MenuItem value="">Baǵdar saylań...</MenuItem>
                {Object.keys(work).map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={profession}
                onChange={(e) => {
                  setProfession(e.target.value);
                  setValue({
                    ...value,
                    workType: { ...value.workType, profession: e.target.value },
                  });
                }}
                disabled={!niche}
                displayEmpty
                fullWidth
                style={selectStyle}
              >
                <MenuItem value="">Kásip saylań...</MenuItem>
                {niche &&
                  work[niche].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
              </Select>
            </Box>

            {/* Photo */}
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 500, color: "#444" }}>
                Jumıs obloshkasın saylaw:
              </Typography>

              <label htmlFor="choose">
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "320px",
                    height: { xs: "200px", sm: "250px" },
                    border: "2px dashed #999",
                    borderRadius: "14px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "0.3s",
                    backgroundColor: "#fafafa",
                    "&:hover": {
                      borderColor: "#22c55e",
                      transform: "scale(1.02)",
                    },
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
                </Box>
              </label>

              <input
                type="file"
                id="choose"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>

            {/* Info */}
            <Box>
              <Typography sx={{ mb: 1, color: "#444", fontWeight: 500 }}>
                Jumıs haqqında informaciya:
              </Typography>
              <textarea
                value={value.infoWork}
                onChange={(e) =>
                  setValue({ ...value, infoWork: e.target.value })
                }
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.8rem",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                }}
              ></textarea>
            </Box>

            {/* Buyers Must */}
            <Box>
              <Typography sx={{ mb: 1, color: "#444", fontWeight: 500 }}>
                Jallawshılardan talap etiledi:
              </Typography>
              <textarea
                value={value.buyersMust}
                onChange={(e) =>
                  setValue({ ...value, buyersMust: e.target.value })
                }
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.8rem",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                }}
              ></textarea>
            </Box>

            {/* Cost */}
            <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
              <Typography sx={{ mb: 1, color: "#444", fontWeight: 500 }}>
                Jumıs bahası:
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Baha</InputLabel>
                <OutlinedInput
                  endAdornment={<InputAdornment position="end">(sum)</InputAdornment>}
                  label="Baha"
                  value={value.cost}
                  onChange={(e) => setValue({ ...value, cost: e.target.value })}
                  sx={{ borderRadius: "12px" }}
                />
              </FormControl>
            </Box>

            {/* DELETE */}
            <Button
              type="button"
              onClick={deleteJob}
              sx={{
                color: "red",
                width: "100%",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Óshiriw
            </Button>

            {/* UPDATE */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#22c55e",
                padding: "0.8rem",
                fontWeight: 600,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#16a34a",
                },
              }}
            >
              Jańalaw
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default UpdateJobs;
