import { Box, Button, Stack, Typography } from "@mui/material";
import image from "../../../../assets/close.png";
import { useNavigate } from "react-router-dom";
const ErrorBooking = () => {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate("/")
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
        <Typography fontSize={30} variant="body1" color="red">
          Booking Failed !
        </Typography>

        <Typography
          sx={{ width: "80%" }}
          textAlign={"center"}
          variant="body1"
          fontSize={"15px"}
          fontWeight={400}
          color="text.secondary"
        >
          We sincerely apologize, but the car you selected has already been
          booked by another customer. We regret any inconvenience this may cause
          and appreciate your understanding. Please choose another available
          vehicle from our list or contact us for further assistance. Thank you
          for your trust in our service!
        </Typography>
        <Stack direction={"row"} spacing={2} justifyContent={"center"}>
          <Button onClick={handleClick} variant="outlined">Go to Home page</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ErrorBooking;
