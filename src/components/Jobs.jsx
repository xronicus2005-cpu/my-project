import { Container, Box } from "@mui/material"
import { makeStyles } from '@mui/styles'
import { Link } from "react-router-dom"

const Jobs = () => {

  const useStyles = makeStyles({
    root: {
      fontFamily: "sans-serif",
      position: 'relative',
      textDecoration: 'none',
      color: 'gray',
      opacity: 0.6,
      fontSize: '18px',
      display: 'inline-block',
      transition: 'color 0.3s ease',
      flex: 1,
      textAlign: 'center',

      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: '2px',
        backgroundColor: '#4CAF50',
        transition: 'width 0.3s ease',
      },

      '&:hover': {
        color: 'black',
        opacity: 0.95
      },
      '&:hover::before': {
        width: '100%',
      },
    },
  })

  const classes = useStyles()

  return(
    <Container style={{marginTop: '10px'}}>
      <Box sx={{
        display: 'flex', 
        justifyContent: 'space-between',
        width: '100%',
      }}>
        <Link className={classes.root} to="/IT">IT</Link>
        <Link className={classes.root} to="/HandWork">Qol miyneti</Link>
        <Link className={classes.root} to="/Teach">Oqıtıw</Link>
        <Link className={classes.root} to="/Elektr">Elektronika</Link>
        <Link className={classes.root} to="/Cars">Mashinasazlıq</Link>
      </Box>

      {/* Media query uchun style */}
      <style>
        {`
          @media (max-width: 768px) {
            a {
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </Container>
  )
}

export default Jobs
