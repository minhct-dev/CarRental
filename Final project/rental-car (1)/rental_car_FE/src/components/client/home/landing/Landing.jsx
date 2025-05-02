import { Box, Stack, Typography } from "@mui/material";
import image from "../../../../assets/header.png";

const Landing = () => {
  return (
    <Box
      sx={{
        padding: "50px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
      }}
    >
      <Stack sx={{}} direction={"row"} spacing={2}>
        <Box sx={{ width: "50%" }}>
          <Stack direction={"column"} spacing={3}>
            
            <Typography
              data-aos="fade-up"
              data-aos-delay="500"
              variant="body1"
              className="label_heading"
              sx={{
                color: "primary.main",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.05)",
                padding: "5px 7px",
                border: "1px solid #8a79f0",
                borderRadius: "10px",
                width: "fit-content",
                fontSize: "15px",
              }}
            >
              👍 100% Trusted car rental platform in Viet Nam
            </Typography>
            <Typography
              data-aos="fade-up"
              data-aos-delay="700"
              sx={{
                fontSize: {
                  lg: "clamp(25px, calc(0.1333 * 100vh - 48.33px), 45px)",
                  xl: "50px",
                },
                // Điều chỉnh theo chiều cao
                fontWeight: 800,
                color: "text.primary",
              }}
            >
              FAST AND EASY WAY TO RENT A CAR
            </Typography>
            <Typography
              data-aos="fade-up"
              data-aos-delay="1000"
              className="text_heading"
              sx={{
                fontSize: { lg: "13px", xl: "16px" },
              }}
              variant="body1"
              color="text.secondary"
            >
              Discover a seamless car rental experience with us. Choose from a
              range of premium vehicles to suit your style and needs, and hit
              the road with confidence. Quick, easy, and reliable - rent your
              ride today!
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Box
            sx={{
              backgroundColor: "primary.main",
              position: "absolute",
              height: "450px",
              width: "40%",
              bottom: "0",
              right: "0",
              zIndex: -1,
              opacity: 0.2,
              borderTopLeftRadius: "20px",
            }}
          ></Box>

          <Box>
            <Box data-aos="fade-left">
              <Box
                component="img"
                src={image}
                alt="Car Image"
                className="car_image"
                sx={{
                  width: "40vw",
                  height: "350px",
                  position: "absolute",
                  zIndex: 2,
                  top: "10px",
                  right: "-20%",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Landing;
