import { Box, Stack, Typography } from "@mui/material";
import { Container } from "react-bootstrap";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PlaceIcon from "@mui/icons-material/Place";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import image from "../../../../assets/Pixahunt-953.png";
const WhyUs = () => {
  let data = [
    {
      index: 1,
      title: "Customer Support",
      icon: (
        <SupportAgentIcon sx={{ color: "primary.main" }}></SupportAgentIcon>
      ),
      para: "Our dedicated support team is available to assist you 24/7.",
    },
    {
      index: 2,
      title: "Many Locations",
      icon: <PlaceIcon sx={{ color: "primary.main" }}></PlaceIcon>,
      para: "Convenient pick-up and drop-off locations ",
    },
    {
      index: 3,
      title: "Best Price",
      icon: <AttachMoneyIcon sx={{ color: "primary.main" }}></AttachMoneyIcon>,
      para: "Enjoy competitive rates and great value for every rental.",
    },
    {
      index: 4,
      title: "Experience Driver",
      icon: <DriveEtaIcon sx={{ color: "primary.main" }}></DriveEtaIcon>,
      para: "Reliable, professional drivers available upon request.",
    },
    {
      index: 5,
      title: "Verified Brands",
      icon: <VerifiedIcon sx={{ color: "primary.main" }}></VerifiedIcon>,
      para: "Choose from trusted and well-maintained car brands.",
    },
    {
      index: 6,
      title: "Free Cancellations",
      icon: <CancelIcon sx={{ color: "primary.main" }}></CancelIcon>,
      para: "Flexible bookings with free cancellation options.",
    },
  ];
  return (
    <Box sx={{ mt: 7, position: "relative" }}>
      <Container style={{ width: "70%" }}>
        <Stack direction={"row"} spacing={2}>
          <Box sx={{ width: "50%" }}>
            <Box
              component="img"
              data-aos="fade-right"
              sx={{
                width: { lg: "40%", xl: "30%" }, // Responsive width
                position: "absolute",
                left: {xl:"15%", lg:"7%"},

              }}
              src={image}
              alt="Car Image"
            />
          </Box>
          <Box sx={{ width: "50%" }}>
            <Typography
              data-aos="fade-left"
              sx={{ mb: 2 }}
              fontSize={"30px"}
              fontWeight={700}
              variant="h2"
            >
              Why choose us
            </Typography>
            <Typography
              data-aos="fade-left"
              variant="body1"
              color="text.secondary"
              fontSize={"14px"}
              fontWeight={500}
            >
              Discover the difference with our car rental service. We offer
              reliable vehicles, exceptional customer service, and competitive
              pricing to ensure a seamless rental experience.
            </Typography>

            <Box>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
              >
                {/* stack1 */}

                {data.map((item) => {
                  return (
                    <Stack
                      key={item.index}
                      data-aos="fade-left"
                      data-aos-delay={item.index * 50}
                      sx={{ width: "46%", mt: 4 }}
                      direction={"row"}
                      spacing={2}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#eeebfd",
                          width: "70px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "10px",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Stack direction={"column"} spacing={1}>
                          <Typography
                            fontWeight={600}
                            fontSize={"17px"}
                            variant="h4"
                            color="initial"
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            fontSize={"13px"}
                            color={"text.secondary"}
                            variant="body1"
                          >
                            {item.para}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default WhyUs;
