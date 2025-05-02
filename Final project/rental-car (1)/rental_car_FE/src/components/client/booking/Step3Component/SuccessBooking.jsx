import { Box, Button, Stack, Typography } from "@mui/material";
import image from "../../../../assets/like1.png";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";

const SuccessBooking = () => {

    const navigate = useNavigate()
    const handleClick = () => {
        navigate("/")
    }
    const handleClickBooking = () => {
        navigate("/my-booking")
    }
  return (
    <Box
    sx={{
      padding: "50px",
      boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      backgroundColor: "white",
      borderRadius: "10px",
      width: "70%",
      margin: "auto",
    }}
  >
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignContent={"center"}
    >
      <Box>
        <img width={100} src={image} alt="" />
      </Box>
    </Stack>

    <Stack
      direction={"column"}
      spacing={2}
      sx={{ mt: 3 }}
      alignItems={"center"}
    >
      <Typography fontSize={30} variant="body1" color="#6decc1">
        Thank You !
      </Typography>

      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Box
          sx={{
            width: "25px",
            height: "25px",
            backgroundColor: "#4fdc8c",
            borderRadius: "50%",
            position: "relative",
          }}
        >
          <DoneIcon
            sx={{
              color: "white",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          ></DoneIcon>
        </Box>
        <Typography fontSize={18} variant="body1" color="#6decc1">
          Payment successfully
        </Typography>
      </Stack>
      <Typography
        sx={{ width: "70%" }}
        textAlign={"center"}
        variant="body1"
        fontSize={"15px"}
        fontWeight={400}
        color="text.secondary"
      >
        Your booking has been successfully completed! Thank you for choosing
        our service. You will receive a confirmation email shortly with all
        the details of your booking
      </Typography>
      <Stack direction={"row"} spacing={2} justifyContent={"center"}>
        <Button onClick={handleClick} variant="outlined">Home page</Button>
        <Button onClick={handleClickBooking} variant="contained">Go To My Booking</Button>
      </Stack>
    </Stack>
  </Box>
  )
}

export default SuccessBooking