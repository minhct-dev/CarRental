import { Box, Button, Grid2, Stack, Typography } from "@mui/material"; // Giả sử bạn đang dùng MUI Box
import image from "../../../assets/logo-dark.png";
import "./bill.css";
import { formatVND } from "../../../helper/function";
import dayjs from "dayjs";
import NotFound from "../../../components/err/NotFound";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBillApi, paidPaymentApi } from "../../../api/bookingApi";
import Swal from "sweetalert2";
import { getProfileApi } from "../../../api/userApi";
import { useParams } from "react-router-dom";
import Loading from "../loading/Loading";
import { useState } from "react";
import GiveRating from "./../giveRating/GiveRating";

export default function Bill() {
  const { id } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bill", id],
    queryFn: () => getBillApi(id),
  });

  //display give rating: Tuan
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { mutate } = useMutation({
    mutationFn: (data) => paidPaymentApi(data.id),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        text: "Payment success",
        showConfirmButton: true,
      }).then(() => {
        handleOpen();
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        text: "Payment failed",
      });
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });

  const handlePay = (id, total) => {
    let balance = profile.walletBalance;
    if (balance >= total) {
      Swal.fire({
        icon: "question",
        text: "Are you sure paying for invoice",
        showConfirmButton: true,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          mutate({ id, total });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Cannot payment due to lack of balance",
      });
    }
  };

  if (isLoading) {
    return <Loading></Loading>;
  }
  if (!data) {
    return <NotFound></NotFound>;
  }
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", my: 5, backgroundColor: "#f3f3f3" }}>
      <section>
        <div className="invoice">
          <div className="top_line"></div>
          <div className="header">
            <div className="i_row">
              <div className="i_logo">
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                  <img src={image} style={{ width: "80px" }} alt="" />
                </Stack>
              </div>
              <div className="i_title">
                <h2>INVOICE</h2>
                <p
                  style={{ marginBottom: "5px" }}
                  className="p_title text_right"
                >
                  {dayjs().format("DD/MM/YYYY")}
                </p>
                <p className="p_title text_right">Booking ID : {data.id}</p>
              </div>
            </div>
            <Box>
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{
                  backgroundColor: "#F1F6FF",
                  height: "50px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h6" fontSize={"18px"} color="initial">
                  Customer Infomation
                </Typography>
              </Stack>

              <Grid2 sx={{ my: 3 }} justifyContent={"center"} container>
                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Customer Name
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {data.userName}
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Phone Number
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {data.userPhone}
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Email Address
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {data.userEmail}
                    </Typography>
                  </Stack>
                </Grid2>
              </Grid2>
            </Box>

            <Box>
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{
                  backgroundColor: "#F1F6FF",
                  height: "50px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h6" fontSize={"18px"} color="initial">
                  Booking Infomation
                </Typography>
              </Stack>

              <Grid2 sx={{ my: 3 }} justifyContent={"center"} container>
                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Car Name
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {data.carName}
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Base Price
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {formatVND(data.basePrice)} / Day
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Deposit
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {formatVND(data.deposit)}
                    </Typography>
                  </Stack>
                </Grid2>
              </Grid2>

              <Grid2 sx={{ my: 3 }} justifyContent={"center"} container>
                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Pick Up Time
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {dayjs(data.from).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Drop Off Time
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {dayjs(data.to).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Stack>
                </Grid2>

                <Grid2 size={3}>
                  <Stack direction={"column"} spacing={0.5}>
                    <Typography
                      fontSize={"13px"}
                      variant="body2"
                      color="text.secondary"
                    >
                      Actual time
                    </Typography>
                    <Typography
                      fontSize={"14px"}
                      variant="body1"
                      color="initial"
                    >
                      {dayjs(data.actualTime).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Stack>
                </Grid2>
              </Grid2>

              {data.driverName || data.driverPhone || data.driverEmail ? (
                <Grid2 sx={{ my: 3 }} justifyContent={"center"} container>
                  {data.driverName && (
                    <Grid2 size={3}>
                      <Stack direction={"column"} spacing={0.5}>
                        <Typography
                          fontSize={"13px"}
                          variant="body2"
                          color="text.secondary"
                        >
                          Driver Name
                        </Typography>
                        <Typography
                          fontSize={"14px"}
                          variant="body1"
                          color="initial"
                        >
                          {data.driverName}
                        </Typography>
                      </Stack>
                    </Grid2>
                  )}

                  {data.driverPhone && (
                    <Grid2 size={3}>
                      <Stack direction={"column"} spacing={0.5}>
                        <Typography
                          fontSize={"13px"}
                          variant="body2"
                          color="text.secondary"
                        >
                          Driver Phone
                        </Typography>
                        <Typography
                          fontSize={"14px"}
                          variant="body1"
                          color="initial"
                        >
                          {data.driverPhone}
                        </Typography>
                      </Stack>
                    </Grid2>
                  )}

                  {data.driverEmail && (
                    <Grid2 size={3}>
                      <Stack direction={"column"} spacing={0.5}>
                        <Typography
                          fontSize={"13px"}
                          variant="body2"
                          color="text.secondary"
                        >
                          Driver Email
                        </Typography>
                        <Typography
                          fontSize={"14px"}
                          variant="body1"
                          color="initial"
                        >
                          {data.driverEmail}
                        </Typography>
                      </Stack>
                    </Grid2>
                  )}
                </Grid2>
              ) : null}
            </Box>

            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{
                backgroundColor: "#F1F6FF",
                height: "50px",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" fontSize={"18px"} color="initial">
                Amount
              </Typography>
            </Stack>
          </div>

          <div className="body mt-3">
            <div className="i_table">
              <Stack
                direction={"column"}
                spacing={2}
                sx={{ width: "80%", margin: "auto" }}
              >
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Stack direction={"column"}>
                    <Typography variant="body1" color="initial">
                      Rental Amount:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(data.from).format("DD/MM/YYYY HH:mm")} -{" "}
                      {dayjs(data.to).format("DD/MM/YYYY HH:mm")} (
                      {data.numberOfDays} days){" "}
                    </Typography>
                  </Stack>
                  <Typography variant="body1" color="initial">
                    {formatVND(data.basePrice * data.numberOfDays)}
                  </Typography>
                </Stack>

                {data.total_driver_fee - data.driver_late_fee != 0 && (
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"column"}>
                      <Typography variant="body1" color="initial">
                        Driver Fee:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(data.from).format("DD/MM/YYYY HH:mm")} -{" "}
                        {dayjs(data.to).format("DD/MM/YYYY HH:mm")} (
                        {data.numberOfDays} days){" "}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" color="initial">
                      {formatVND(data.total_driver_fee - data.driver_late_fee)}
                    </Typography>
                  </Stack>
                )}

                {data.car_late_fee != 0 && (
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"column"}>
                      <Typography variant="body1" color="initial">
                        Car OverTime Fee
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Additional fee will apply for late return{" "}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" color="red">
                      + {formatVND(data.car_late_fee)}
                    </Typography>
                  </Stack>
                )}

                {data.driver_late_fee != 0 && (
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"column"}>
                      <Typography variant="body1" color="initial">
                        Driver OverTime Fee
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Additional fee will apply for late return{" "}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" color="red">
                      + {formatVND(data.driver_late_fee)}
                    </Typography>
                  </Stack>
                )}

                {data.discount != 0 && (
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"column"}>
                      <Typography variant="body1" color="initial">
                        Discount:
                      </Typography>
                      <Typography variant="body2" color="initial"></Typography>
                    </Stack>
                    <Typography variant="body1" color="green">
                      - {formatVND(data.discount)}
                    </Typography>
                  </Stack>
                )}

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Stack direction={"column"}>
                    <Typography variant="body1" color="initial">
                      Total Amount:
                    </Typography>
                    <Typography variant="body2" color="initial"></Typography>
                  </Stack>
                  <Typography variant="body1" color="initial">
                    {formatVND(data.total_car_fee + data.total_driver_fee)}
                  </Typography>
                </Stack>

                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  sx={{}}
                >
                  <Stack direction={"column"}>
                    <Typography variant="body1" color="initial">
                      Status:
                    </Typography>
                    <Typography variant="body2" color="initial"></Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    color={data.status == "COMPLETED" ? "green" : "red"}
                  >
                    {data.status}
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"end"}
                sx={{ mt: 3, width: "90%" }}
              >
                {data.status != "COMPLETED" && (
                  <Button
                    onClick={() => {
                      handlePay(
                        data.id,
                        data.total_car_fee + data.total_driver_fee
                      );
                    }}
                    variant="contained"
                  >
                    Pay For Invoice
                  </Button>
                )}
              </Stack>
            </div>
          </div>
        </div>
      </section>
      <GiveRating open={open} handleClose={handleClose} bookingId={data.id} />
    </Box>
  );
}
