import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Pagination,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  confirmDepositApi,
  confirmPaymentApi,
  getListBookingApi,
  rejectBookingCarOwnerApi,
} from "../../../api/bookingApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../client/loading/Loading";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import ModalCancel from "./ModalCancel";
import { useState } from "react";

const handleStatus = (status, carOwnerStatus) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return { label: "Approved", color: "green" };
    case "pending_deposit":
      if (carOwnerStatus === "CONFIRM") {
        return { label: "Approved", color: "green" };
      }
      return { label: "Pending", color: "#FFA733" };
    case "cancelled":
      if(carOwnerStatus === "CANCEL"){
        return { label: "Rejected", color: "red" };
      }
      return { label: "Cancelled", color: "red" };
    case "pending_payment":
      return { label: "Pending payment", color: "#FFA733" };
    case "in_progress":
      return { label: "In Progess", color: "orange" };
    case "completed":
      return { label: "Completed", color: "blue" };
    default:
      return { label: "Unknown", color: "grey" };
  }
};

const BookingListCarOwner = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //xử lý đóng mở modal cancel cho car owner chọn
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const handleOpenCancel = (id) => {
    if (!id) {
      return;
    }
    setCancelBooking(id);
    setOpenCancel(true);
  };
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 5;
  const queryClient = useQueryClient();

  // ✅ Hàm xử lý chuyển trang
  const handlePageChange = (event, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", value);
      return params;
    });
  };

  // ✅ Fetch data từ API
  const { data, isLoading } = useQuery({
    queryKey: ["bookings", page, size],
    queryFn: () => getListBookingApi(page, size, "created_at:desc"),
  });
  console.log(data);

  const confirmDepositMutation = useMutation({
    mutationFn: confirmDepositApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
   
  });
  const confirmPaymentMutation = useMutation({
    mutationFn: confirmPaymentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleConfirmDeposit = (bookingId) => {
    Swal.fire({
      title: "Confirm deposit",
      text: "Please confirm that you have receive the deposit this booking. This will allow the customer to pick-up the car at the agreed date and time.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          text: "It will take a few seconds.",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        confirmDepositMutation.mutate(bookingId, {
          onSuccess: () => {
            Swal.fire({
              title: "Confirmed!",
              text: "Confirm pick-up successfully.",
              icon: "success",
            });
          },
          onError: (e) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            Swal.fire({
              title: "Error",
              text: e.response.data.message || "Something wrong",
              icon: "error",
            });
          },
        });
      }
    });
  };
  const handleConfirmPayment = (bookingId) => {
    Swal.fire({
      title: "Confirm deposit",
      text: "Please confirm that you have receive the payment for this booking.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          text: "It will take a few seconds.",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        confirmPaymentMutation.mutate(bookingId, {
          onSuccess: () => {
            Swal.fire({
              title: "Confirmed!",
              text: "Confirm pick-up successfully.",
              icon: "success",
            });
          },
          onError: (e) => {
            Swal.fire({
              title: "Error",
              text: e.response.data.message,
              icon: "error",
            });
          },
        });
      }
    });
  };

  // cancel booking for car owner
  const cancelMutation = useMutation({
    mutationFn: rejectBookingCarOwnerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleCancelBooking = async (bookingId) => {
    // const cancelDate = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZZ");

    // const percentage = await getPercentageCancelCarOwner(bookingId, cancelDate);
    // console.log(cancelDate);

    Swal.fire({
      title: "Reject booking",
      text: `Are you sure you want to reject this booking?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          text: "Please wait while we cancel the booking.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        cancelMutation.mutate(bookingId, {
          onSuccess: () => {
            Swal.fire({
              title: "Confirmed!",
              text: "Confirm pick-up successfully.",
              icon: "success",
            });
          },
          onError: (e) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            Swal.fire({
              title: "Error",
              text: e.response.data.message || "Something wrong",
              icon: "error",
            });
          },
        });
      }
    });
  };

  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ pt: "8vh", backgroundColor: "#FAFAFB", minHeight: "100vh" }}>
      <Container maxWidth={"xl"}>
        {/* ✅ Title */}
        <Stack direction="row" spacing={1} alignItems={"center"}>
          <ListAltIcon sx={{ color: "primary.main", fontSize: "35px" }} />
          <Typography variant="body1" fontSize={"25px"}>
            Booking List
          </Typography>
        </Stack>

        {/* ✅ Bảng dữ liệu */}
        <TableContainer sx={{ mt: 5 }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Car Image</TableCell>
                <TableCell sx={{ maxWidth: "200px" }}>Car Name</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>
                    <img
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                      src={booking.carImg[0]}
                      alt=""
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: "200px" }}>
                    <Stack>
                      <Typography
                        variant="body1"
                        fontWeight={400}
                        color="initial"
                      >
                        {booking.name}
                      </Typography>
                      {booking.cancelBookingStatus?.toLowerCase() ===
                        "pending" && (
                        <Typography
                          variant="body1"
                          fontSize={"12px"}
                          fontWeight={400}
                          color="initial"
                        >
                          (The customer wants to cancel this order.)
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {dayjs(booking.from).format("DD/MM/YYYY HH:mm")}h
                  </TableCell>
                  <TableCell>
                    {dayjs(booking.to).format("DD/MM/YYYY HH:mm")}h
                  </TableCell>
                  <TableCell
                    sx={{
                      color: handleStatus(
                        booking.statusBooking,
                        booking.carOwnerStatus
                      ).color,
                      fontWeight: 500,
                    }}
                  >
                    {
                      handleStatus(
                        booking.statusBooking,
                        booking.carOwnerStatus
                      ).label
                    }
                  </TableCell>
                  <TableCell>
                    {/* Sửa lại các nút , nếu đơn đã được khách hàng yêu cầu hủy thì hiển thị nút handleCancel */}
                    <Stack direction={"column"} spacing={1}>
                      {/* Nút View Detail luôn hiển thị */}
                      <Button
                        onClick={() =>
                          navigate(`/car-owner/booking/${booking.id}`)
                        }
                        variant="contained"
                      >
                        View Detail
                      </Button>

                      {/* Trường hợp cancelBookingStatus là "PENDING" */}
                      {booking.cancelBookingStatus?.toLowerCase() ===
                      "pending" ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenCancel(booking.id)}
                        >
                          Handle Cancel
                        </Button>
                      ) : (
                        <>
                          {/* Trường hợp statusBooking là "PENDING_DEPOSIT" */}
                          {booking.statusBooking?.toLowerCase() ===
                            "pending_deposit" &&
                            booking.carOwnerStatus === "PENDING" && (
                              <Button
                                variant="contained"
                                onClick={() => handleConfirmDeposit(booking.id)}
                              >
                                Confirm deposit
                              </Button>
                            )}

                          {/* Trường hợp statusBooking là "PENDING_PAYMENT" */}
                          {booking.statusBooking?.toLowerCase() ===
                            "pending_payment" && (
                            <Button
                              variant="contained"
                              onClick={() => handleConfirmPayment(booking.id)}
                            >
                              Confirm payment
                            </Button>
                          )}

                          {/* Trường hợp statusBooking là "PENDING_DEPOSIT" hoặc "CONFIRMED" */}
                          {booking.statusBooking?.toLowerCase() ===
                            "pending_deposit" &&
                            booking.carOwnerStatus === "PENDING" && (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            )}
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination */}
        <Stack sx={{ mt: 5 }} direction={"row"} justifyContent={"center"}>
          <Pagination
            count={data?.totalPages}
            page={page} // Đặt trạng thái active
            onChange={handlePageChange}
            variant="text"
            color="primary"
          />
        </Stack>

        <ModalCancel
          cancelBooking={cancelBooking}
          setCancelBooking={setCancelBooking}
          open={openCancel}
          handleClose={handleCloseCancel}
        ></ModalCancel>
      </Container>
    </Box>
  );
};

export default BookingListCarOwner;
