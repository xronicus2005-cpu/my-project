import { Container, Slide, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";

import video1 from "../assets/2.mp4";
import video2 from "../assets/3.mp4";
import video3 from "../assets/4.mp4";

const SlideShow = () => {
  const videos = [video1, video2, video3];
  const textList = [
    "Jumıs penen óz-ózińizdi táminleń",
    "Jumısıńızdı jaratıń",
    "Pul tabıwdı baslań"
  ];

  const [index, setIndex] = useState(0);
  const [inProp, setInProp] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % videos.length);
        setInProp(true);
      }, 500);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container sx={{ marginTop: "30px" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: "230px",   // Mobile
            sm: "280px",
            md: "350px",
            lg: "430px"    // Desktop
          },
          overflow: "hidden",
          borderRadius: "10px",
          
        }}
      >
        {/* Video */}
        <video
          key={index}
          autoPlay
          muted
          playsInline
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <source src={videos[index]} type="video/mp4" />
        </video>

        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
            textAlign: "center"
          }}
        >
          <Slide
            direction="right"
            in={inProp}
            timeout={{ enter: 500, exit: 400 }}
            mountOnEnter
            unmountOnExit
          >
            <Typography
              variant="h3"
              sx={{
                color: "white",
                fontWeight: "bold",

                fontSize: {
                  xs: "20px",   // kichkina ekran
                  sm: "26px",
                  md: "32px",
                  lg: "40px"    // katta ekran
                }
              }}
            >
              {textList[index]}
            </Typography>
          </Slide>
        </Box>
      </Box>
    </Container>
  );
};

export default SlideShow;
