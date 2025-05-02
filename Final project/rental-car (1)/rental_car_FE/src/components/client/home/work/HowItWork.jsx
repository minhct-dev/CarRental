import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import { Container } from "react-bootstrap";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ConmonTitle from "../common/ConmonTitle";
const HowItWork = () => {
  return (
    <Box sx={{ margin: "100px 0" }}>
      <Container style={{ width: "70%" }}>
        <ConmonTitle
          title={"How it work"}
          para={`
            Renting a car with us is simple! 
            Choose your vehicle, pick your dates, and complete your booking.
            We'll handle the rest, ensuring a smooth start to your journey.
        `}
        ></ConmonTitle>

        <Stack
          direction="row"
          justifyContent={"center"}
          alignItems={"center"}
          spacing={2}
          sx={{ mt: 6 }}
        >
          <Box sx={{ width: "90%" }}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              spacing={2}
            >
              <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ width: "30%" }}
                data-aos="fade-up"
              >
                <Box
                  sx={{
                    backgroundColor: "#eeebfd",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "10px",
                    mb: 3,
                  }}
                >
                  <FmdGoodIcon
                    sx={{ color: "primary.main", fontSize: "35px" }}
                  ></FmdGoodIcon>
                </Box>
                <Typography sx={{ fontWeight: 600 }} variant="body1">
                  Choose Location
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: "13px",
                    mt: 1,
                  }}
                  variant="body1"
                  color="initial"
                >
                  Select from a variety of pick-up locations that best suit your
                  needs, whether it&apos;s close to home, work, or airport.
                </Typography>
              </Stack>

              <Stack
                data-aos="fade-up"
                data-aos-delay="300"
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ width: "30%" }}
              >
                <Box
                  sx={{
                    backgroundColor: "#fff2e8",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "10px",
                    mb: 3,
                  }}
                >
                  <CalendarMonthIcon
                    sx={{ color: "#fba55b", fontSize: "35px" }}
                  ></CalendarMonthIcon>
                </Box>
                <Typography sx={{ fontWeight: 600 }} variant="body1">
                  Pick-up Date
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: "13px",
                    mt: 1,
                  }}
                  variant="body1"
                  color="initial"
                >
                  Choose the exact date and time for your car pick-up, ensuring
                  that your vehicle is ready when you need it.
                </Typography>
              </Stack>

              <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ width: "30%" }}
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <Box
                  sx={{
                    backgroundColor: "#fde9ea",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "10px",
                    mb: 3,
                  }}
                >
                  <DirectionsCarIcon
                    sx={{ color: "#ee6a6f", fontSize: "35px" }}
                  ></DirectionsCarIcon>
                </Box>
                <Typography sx={{ fontWeight: 600 }} variant="body1">
                  Book your Car
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: "13px",
                    mt: 1,
                  }}
                  variant="body1"
                  color="initial"
                >
                  Complete your booking with just a few clicks, and we&apos;ll
                  prepare your vehicle to ensure a hassle-free pick-up.
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HowItWork;
