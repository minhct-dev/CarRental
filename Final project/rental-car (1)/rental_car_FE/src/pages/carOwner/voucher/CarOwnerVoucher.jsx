import {
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import VoucherCard from "../../../components/carOwner/voucher/VoucherCard";
import { useQuery } from "@tanstack/react-query";
import { getListVoucherCarOwnerApi } from "../../../api/voucherApi";
import Loading from "../../client/loading/Loading";
import { useNavigate } from "react-router-dom";
const CarOwnerVoucher = () => {
  const navigate = useNavigate();

  const { data: listVoucher, isLoading } = useQuery({
    queryKey: ["list-voucher-owner"],
    queryFn: getListVoucherCarOwnerApi,
  });
  const handleAddVoucher = () => {
    navigate("/car-owner/add-voucher");
  };

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <Box sx={{ pt: "8vh", backgroundColor: "#FAFAFB", minHeight: "100vh" }}>
      <Container maxWidth={"xl"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction="row" spacing={1} alignItems={"center"}>
            <DiscountIcon sx={{ color: "primary.main", fontSize: "35px" }} />
            <Typography variant="body1" fontSize={"25px"}>
              Voucher Management
            </Typography>
          </Stack>
          <Button onClick={handleAddVoucher} variant="contained">
            Add New Voucher
          </Button>
        </Stack>

        <Box sx={{ mt: 3 }}>
          {/* item */}
          <Container>
            <Grid2 container rowSpacing={3} columnSpacing={1}>
              {listVoucher.map((item, index) => {
                return (
                  <Grid2 key={index} size={4}>
                    <VoucherCard setOpen={true} data={item}></VoucherCard>
                  </Grid2>
                );
              })}
            </Grid2>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default CarOwnerVoucher;
