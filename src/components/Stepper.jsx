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
      <Container sx={{ marginTop: '8rem' }}>
        <Box
          sx={{
            width: '100%',
            mt: isMobile ? 2 : 5,
            px: isMobile ? 1 : 0
          }}
        >
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel={!isMobile} 
            orientation={isMobile ? "vertical" : "horizontal"}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: isMobile ? "0.85rem" : "1rem",
                      textAlign: isMobile ? "left" : "center",
                      whiteSpace: "normal",
                      lineHeight: isMobile ? "1.1rem" : "1.3rem"
                    }
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
