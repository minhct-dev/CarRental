import {
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getListVoucherAdminApi } from "../../../api/voucherApi";
import Loading from "../../client/loading/Loading";
import VoucherCard from "../../../components/carOwner/voucher/VoucherCard";
const VoucherManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["list-voucher-admin"],
    queryFn: getListVoucherAdminApi,
  });
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <Box sx={{ pt: "5vh", minHeight: "100vh" }}>
      <Container>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction="row" spacing={1} alignItems={"center"}>
            <DiscountIcon sx={{ color: "primary.main", fontSize: "35px" }} />
            <Typography variant="body1" fontSize={"25px"}>
              Voucher Management
            </Typography>
          </Stack>
          <Button
            onClick={() => navigate("/admin/add-voucher")}
            variant="contained"
          >
            Add new Voucher
          </Button>
        </Stack>

        <Box sx={{ my: 3 }}>
          <Container>
            <Stack
              sx={{
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" fontWeight={"bold"}>
                List of Vouchers
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid2 container rowSpacing={3} columnSpacing={1}>
                  {data.map((item, index) => {
                    return (
                      <Grid2 key={index} size={4}>
                        <VoucherCard setOpen={true} data={item}></VoucherCard>
                      </Grid2>
                    );
                  })}
                </Grid2>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default VoucherManagement;
