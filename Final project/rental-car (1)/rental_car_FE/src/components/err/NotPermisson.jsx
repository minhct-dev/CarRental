import { Box, Button, Stack } from "@mui/material"
import image from "../../assets/3819677.jpg"
import { useNavigate } from "react-router-dom"

const NotPermisson = () => {
  const navigate = useNavigate()
    const handleNavigate = () => {
      navigate("/")
    }
  return (
    <Box sx={{my:5}}>
      <Stack direction={"row"} justifyContent={"center"} sx={{  }}>
        <img style={{ width: "50%" }} src={image} alt="" />
      </Stack>
      <Stack direction={"row"} justifyContent={"center"} spacing={2}>
            <Button onClick={handleNavigate} variant="contained">Home page</Button>
      </Stack>
    </Box>
  )
}

export default NotPermisson