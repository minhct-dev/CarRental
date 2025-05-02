import { Box, Container, Typography } from "@mui/material";
import VoucherCarousel from "./VoucherCarosel";

const VoucherHomePage = ({ data }) => {
  return (
    Array.isArray(data) &&
    data.length > 0 && (
      <Box sx={{ mt: 5, margin: "20px 0" }}>
        <Container sx={{ width: "80%" }}>
          <Typography
            data-aos="fade-left"
            sx={{ mb: 2 }}
            fontSize={"30px"}
            textAlign={"center"}
            fontWeight={700}
            variant="h2"
          >
            Car Rental Deals
          </Typography>
          <Typography
            data-aos="fade-right"
            variant="body1"
            color="text.secondary"
            fontSize={"14px"}
            textAlign={"center"}
            fontWeight={500}
          >
            Enjoy exclusive deals from Rental Car
          </Typography>

          <VoucherCarousel data={data} />
        </Container>
      </Box>
    )
  );
};

export default VoucherHomePage;
