import { Box, Stack, Typography } from '@mui/material'
import image from "../../../assets/no-items.png"

const NotFoundCar = () => {
  return (
    <Box sx={{width:"100%"}}>
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <img style={{width:"30%"}} src={image} alt="" />
            <Typography variant="body1" color="initial">No cars match your credentials, please try again</Typography>
        </Stack>
    </Box>
  )
}

export default NotFoundCar