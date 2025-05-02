import { Box, Stack, Typography } from "@mui/material";
import "./footer.scss";
import { Container } from "react-bootstrap";
import logo from "../../../assets/logo-white.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email"; // Ví dụ thêm icon khác

// Dữ liệu các mục trong footer
const services = [
  "Home",
  "Rental Deals",
  "About",
  "Why Choose Us",
  "Testimonials",
];
const vehicles = [
  "Toyota Corolla",
  "Toyota Noah",
  "Toyota Allion",
  "Toyota Premio",
  "Mitsubishi Pajero",
];
const contacts = [
  {
    icon: <LocalPhoneIcon sx={{ fontSize: "15px" }} />,
    text: "+91 0987654321",
  },
  {
    icon: <EmailIcon sx={{ fontSize: "15px" }} />,
    text: "contact@rentalcar.com",
  },
  {
    icon: <FacebookIcon sx={{ fontSize: "15px" }} />,
    text: "fb.com/rentalcar",
  },
];

// Component hiển thị một mục liên hệ (có thể chứa icon bất kỳ)
// eslint-disable-next-line react/prop-types
const ContactItem = ({ icon, text }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Box
      sx={{
        width: 25,
        height: 25,
        textAlign: "center",
        lineHeight: "25px",
        border: "1px solid white",
        borderRadius: "50%",
      }}
    >
      {icon}
    </Box>
    <Typography variant="body1" fontWeight={400} fontSize={13} color="white">
      {text}
    </Typography>
  </Stack>
);

const Footer = () => {
  return (
    <Box
      sx={{ color: "white", backgroundColor: "secondary.main", py: 8 }}
    >
      <Container style={{ width: "60%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          {/* Box 1 - Thông tin chung */}
          <Box sx={{ width: "25%" }}>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={1}>
                <Box>
                  <img width={30} height={30} src={logo} alt="Logo" />
                </Box>
                <Typography
                  sx={{ color: "white", fontSize: 23, fontWeight: 700 }}
                  variant="h4"
                >
                  <i>Rental Car</i>
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "white", fontSize: 13, fontWeight: 400 }}
              >
                We&apos;re here to provide you with the best vehicles and a
                seamless rental experience. Stay connected for updates, special
                offers, and more. Drive with confidence!
              </Typography>
              <Stack direction="row" spacing={2}>
                <FacebookIcon />
                <YouTubeIcon />
                <EmailIcon />
              </Stack>
            </Stack>
          </Box>

          {/* Box 2 - Dịch vụ */}
          <Box>
            <Typography
              variant="h5"
              fontSize={16}
              fontWeight={600}
              sx={{ mb: 2 }}
              color="white"
            >
              Our Services
            </Typography>
            <Stack direction="column" spacing={1}>
              {services.map((service, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  fontWeight={400}
                  fontSize={13}
                  color="white"
                >
                  {service}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* Box 3 - Mẫu xe */}
          <Box>
            <Typography
              variant="h5"
              fontSize={16}
              fontWeight={600}
              sx={{ mb: 2 }}
              color="white"
            >
              Vehicle Model
            </Typography>
            <Stack direction="column" spacing={1}>
              {vehicles.map((vehicle, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  fontWeight={400}
                  fontSize={13}
                  color="white"
                >
                  {vehicle}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* Box 4 - Liên hệ */}
          <Box>
            <Typography
              variant="h5"
              fontSize={16}
              fontWeight={600}
              sx={{ mb: 2 }}
              color="white"
            >
              Contact
            </Typography>
            <Stack direction="column" spacing={1}>
              {contacts.map((contact, index) => (
                <ContactItem
                  key={index}
                  icon={contact.icon}
                  text={contact.text}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        <Box sx={{mt:10}}>
          <Typography
            variant="body1"
            color="white"
            fontSize={"13px"}
            fontWeight={400}
            textAlign={"center"}
          >
            Copyright © 2025 Web Rental Car. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
