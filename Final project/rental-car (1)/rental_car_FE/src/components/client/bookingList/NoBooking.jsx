import { Stack, Typography } from "@mui/material";
import noBooking from "../../../assets/noBooking.png";
import { Link } from "react-router-dom";
function NoBooking() {
  return (
    <Stack
      sx={{ justifyContent: "center", alignItems: "center", height: "85vh" }}
    >
      <img src={noBooking} alt="no booking" style={{ width: "26%" }} />
      <Typography pt={5} variant="h5" fontWeight={600}>
        You have no booking. <Link to={'/search'} style={{ color: "#8C7AF2"}}>Book a car now</Link>
      </Typography>
    </Stack>
  );
}

export default NoBooking;
