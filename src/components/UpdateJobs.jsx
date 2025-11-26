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
  backgroundColor: "inherit",
  color: "#555",
  borderRadius: "10px",
  fontSize: "1rem",
  padding: "0.3rem",
  minWidth: "150px",
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
          setPhoto(`${import.meta.env.VITE_SERVER_URL}/uploads/works/${workData.imgWork}`);
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

  const updateJobs = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", value.title);
    formData.append("niche", value.workType.niche);
    formData.append("profession", value.workType.profession);
    formData.append("infoWork", value.infoWork);
    formData.append("buyersMust", value.buyersMust);
    formData.append("cost", value.cost);
    if (value.imgWork) formData.append("imgWork", value.imgWork);

    api
      .put(`/updateWork/${id}`, formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.message === "Janalandi") {
          toast.success("Janalandi");
          navigate("/Profile");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (msg) {
          toast.error(msg || "Serverde qatelik boldi");
        }
      });
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
        <Typography variant="h4">Jumıstı jańalaw</Typography>
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
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {/* Title */}
            <label>
              Jumıs atı:
              <TextField
                fullWidth
                label="ati"
                value={value.title}
                onChange={(e) => setValue({ ...value, title: e.target.value })}
              />
            </label>

            {/* Work Type */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "stretch",
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
            <label htmlFor="choose">
              Jumıs obloshkasın saylaw:
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "300px",
                  height: { xs: "200px", sm: "250px" },
                  border: "solid 0.2px #555",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                {photo ? (
                  <img
                    src={photo}
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

            {/* Info */}
            <label>
              Jumıs haqqında informaciya:
              <textarea
                value={value.infoWork}
                onChange={(e) => setValue({ ...value, infoWork: e.target.value })}
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.5rem",
                  fontSize: "1rem",
                }}
              ></textarea>
            </label>

            {/* Buyers Must */}
            <label>
              Jallawshılardan talap etiledi:
              <textarea
                value={value.buyersMust}
                onChange={(e) => setValue({ ...value, buyersMust: e.target.value })}
                style={{
                  width: "100%",
                  height: "5rem",
                  padding: "0.5rem",
                  fontSize: "1rem",
                }}
              ></textarea>
            </label>

            {/* Cost */}
            <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
              <label>Jumıs bahası</label>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Baha</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  endAdornment={<InputAdornment position="end">(sum)</InputAdornment>}
                  label="Baha"
                  value={value.cost}
                  onChange={(e) => setValue({ ...value, cost: e.target.value })}
                />
              </FormControl>
            </Box>

            {/* Buttons */}
            <Button
              type="button"
              onClick={deleteJob}
              sx={{
                color: "red",
                width: "100%",
                mt: 1,
              }}
            >
              Óshiriw
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "#fff",
                width: "100%",
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
