import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import "./home.scss";
import { useQuery } from "@tanstack/react-query";
import { getDashboardAdminApi } from "../../../api/adminApi";
import dayjs from "dayjs";
import TotalEarning from "../../../components/admin/home/TotalEarning";
import Loading from "../../client/loading/Loading";
import TotalUser from "../../../components/admin/home/TotalUser";
import TotalCarOwner from "../../../components/admin/home/TotalCarOwner";
import TotalDriver from "../../../components/admin/home/TotalDriver";
import PieChart from "../../../components/admin/home/PieChart";
import BarChart from "../../../components/admin/home/BarChart";

const AdminHome = () => {
  let currentdate = dayjs();
  let startMonth = currentdate.startOf("month").format("YYYY-MM-DD");
  let endMonth = currentdate.endOf("month").format("YYYY-MM-DD");

  // Lấy ngày đầu tuần và cuối tuần
  let startWeek = currentdate.startOf("week").format("YYYY-MM-DD");
  let endWeek = currentdate.endOf("week").format("YYYY-MM-DD");

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () =>
      getDashboardAdminApi(startWeek, endWeek, startMonth, endMonth),
  });

  console.log(dashboard);

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box id="admin-home" sx={{ minHeight: "100vh" }}>
      <Container maxWidth={"xl"}>
        <Stack
          sx={{ mb: 3 }}
          direction={"row"}
          alignItems={"center"}
          spacing={1}
        >
          <HomeOutlinedIcon
            sx={{ color: "primary.main", fontSize: "30px" }}
          ></HomeOutlinedIcon>
          <Typography fontSize={"20px"} variant="h6" color="initial">
            AdminHome
          </Typography>
        </Stack>

        <Grid2 rowSpacing={5} columnSpacing={5} container>
          <Grid2 size={4}>
            {" "}
            <TotalEarning data={dashboard.balanceInWallet}></TotalEarning>
          </Grid2>

          <Grid2 size={4}>
            {" "}
            <TotalUser data={dashboard.sumOfUser}></TotalUser>
          </Grid2>

          <Grid2 size={4}>
            {" "}
            <Stack direction={"column"} spacing={3}>
              <TotalCarOwner
                data={dashboard.userPieChart.find(
                  (item) => item.label == "carOwner"
                )}
              ></TotalCarOwner>
              <TotalDriver
                data={dashboard.userPieChart.find(
                  (item) => item.label == "driver"
                )}
              ></TotalDriver>
            </Stack>
          </Grid2>

          <Grid2 size={8}>
            <BarChart chart={dashboard.barChartIncomeByMonth}></BarChart>
          </Grid2>

          <Grid2 size={4}>
            <Box
              sx={{
                backgroundColor: "white",
                p: "20px",
                borderRadius: "10px",
                minHeight: "55vh",
              }}
            >
              <PieChart data={dashboard.userPieChart}></PieChart>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default AdminHome;
