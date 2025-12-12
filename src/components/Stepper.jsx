import { useState } from "react";
import { Box, Stepper, Step, StepLabel, Container, useMediaQuery } from '@mui/material'
import { useTheme } from "@mui/material/styles";

const StepCom = () => {
  const [activeStep, setActiveStep] = useState(false);

  const steps = ["Registraciya islew", "Profildi sazlaw", "Jumıs jaratıw"];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px

  return (
    <>
      <Container sx={{ marginTop: "10rem" }}>
        <Box
          sx={{
            width: "100%",
            mt: isMobile ? 2 : 6,
            px: isMobile ? 1 : 3,
            py: isMobile ? 3 : 5,
            backgroundColor: "#ffffff",
            borderRadius: "1.5rem",
            boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{
              "& .MuiStepConnector-line": {
                borderColor: "#16a34a",  
              },
              "& .Mui-active .MuiStepIcon-root": {
                color: "#16a34a !important",
              },
              "& .Mui-completed .MuiStepIcon-root": {
                color: "#22c55e !important",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: isMobile ? "1.3rem" : "1.7rem",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "normal",
                      color: "#1f2937",
                      letterSpacing: "0.5px",
                    },
                    "& .MuiStepIcon-root": {
                      width: isMobile ? 35 : 45,
                      height: isMobile ? 35 : 45,
                    },
                    "& .MuiStepIcon-text": {
                      fontSize: "1.1rem",
                      fontWeight: 700,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Container>
    </>
  );
};

export default StepCom;
