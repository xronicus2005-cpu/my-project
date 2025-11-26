import Lottie from "lottie-react"
import happy from "./animations/happy.json"
import sad from "./animations/sad.json"
import look from "./animations/look.json"

import { TextField } from "@mui/material"

import { useState } from "react"

const Animation = () => {

  const [animation, setAnimation] = useState(look)

  return(
    <>
      <TextField
        onFocus={() => setAnimation(look)}
        onBlur={() => setAnimation(sad)}
        onChange={(e) => {
        if (e.target.value.length > 4) setAnimation(happy)
        else setAnimation(sad)}}/>

        <Lottie animationData={animation} style={{ height: 120 }} />

    </>
  )
}

export default Animation