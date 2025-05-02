import { Alert, Box, Container, Grid2 } from "@mui/material";

import TotalEarning from "./TotalEarning";
import TotalOrder from "./TotalOrder";
import TotalIncome from "./TotalIncome";
import BarChart from "./BarChart";
import PopularStocks from "./PopularStock";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { useQuery } from "@tanstack/react-query";
import { getDashboardCarOwnerApi } from "../../../api/carApi";
import Loading from "../../client/loading/Loading";
import { getDashboardDriverApi } from "../../../api/driverApi";

dayjs.extend(weekday);
const CarOwnerHome = () => {
  const profile = useSelector((state) => state.auth.profile);
  let currentdate = dayjs();
  let startMonth = currentdate.startOf("month").format("YYYY-MM-DD");
  let endMonth = currentdate.endOf("month").format("YYYY-MM-DD");

  // Lấy ngày đầu tuần và cuối tuần
  let startWeek = currentdate.startOf("week").format("YYYY-MM-DD");
  let endWeek = currentdate.endOf("week").format("YYYY-MM-DD");

  const isCarOwner = profile.roles.includes("carOwner");
  const isDriver = profile.roles.includes("driver");

  const { data: carOwnerData, isLoading: isCarOwnerLoading } = useQuery({
    queryKey: ["car-owner-dashboard"],
    queryFn: () =>
      getDashboardCarOwnerApi(startWeek, endWeek, startMonth, endMonth),
    enabled: !!profile && isCarOwner,
  });


  const { data: driverData, isLoading: isDriverLoading } = useQuery({
    queryKey: ["driver-dashboard"],
    queryFn: () =>
      getDashboardDriverApi(startWeek, endWeek, startMonth, endMonth),
    enabled: !!profile && isDriver,
  });

  console.log(driverData);

  const isLoading =
    (isCarOwner && isCarOwnerLoading) || (isDriver && isDriverLoading);

  const dashboardData = isDriver ? driverData : carOwnerData;
  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box sx={{ pt: "5vh", backgroundColor: "#FAFAFB", pb: 2 }}>
      <Container maxWidth={"xl"}>
        {profile.status == "INACTIVE" && (
          <Alert sx={{ mb: 3 }} severity="error">
            Please update your profile to start receiving bookings and add car.{" "}
            <Link to={isDriver ? "/driver/profile" : "/car-owner/profile"}>
              Go to Profile
            </Link>
          </Alert>
        )}
        <Grid2 spacing={3} justifyContent={"center"} container>
          <Grid2 size={4}>
            <TotalEarning
              week={dashboardData?.incomeInWeek}
              month={dashboardData?.incomeInMonth}
            />
          </Grid2>
          <Grid2 size={4}>
            <TotalOrder
              week={dashboardData?.numberOfBookingInWeek}
              month={dashboardData?.numberOfBookingInMonth}
            />
          </Grid2>
          {!isDriver && (
            <Grid2 size={4}>
              <TotalIncome
                active={dashboardData?.numberOfAvailableCar}
                stop={dashboardData?.numberOfStoppedCar}
              ></TotalIncome>
            </Grid2>
          )}
          <Grid2 size={8}>
            <BarChart data={dashboardData?.barChartIncomeByMonth} />
          </Grid2>
          <Grid2 size={4}>
            <PopularStocks data={dashboardData?.listOfBookings} />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default CarOwnerHome;
