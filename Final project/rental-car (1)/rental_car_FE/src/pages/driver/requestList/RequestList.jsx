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
import dayjs from "dayjs";
import { driverConfirmApi, getRequestListApi } from "../../../api/driverApi";
import Loading from "../../client/loading/Loading";
import NotFound from "../../../components/err/NotFound";
import Swal from "sweetalert2";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rejectBookingDriverApi } from "../../../api/bookingApi";
import { useNavigate } from "react-router-dom";
const handleStatus = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return { label: "Approved", color: "green" };
    case "pending":
      return { label: "Pending", color: "#FFA733" };
    case "cancelled":
      return { label: "Cancelled", color: "red" };
    case "rejected":
      return { label: "Rejected", color: "red" };
    default:
      return { label: "Unknown", color: "grey" };
  }
};

function RequestList() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["requests"],
    queryFn: () => getRequestListApi(),
  });
  const queryClient = useQueryClient();
  const driverConfirmMutation = useMutation({
    mutationFn: driverConfirmApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id) => rejectBookingDriverApi(id),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Swal.fire({
        icon: "success",
        text: "Reject success",
      });
    },
  });

  const handleReject = (id) => {
    Swal.fire({
      icon: "question",
      text: "Are you sure reject this booking",
      showConfirmButton: true,
      showCancelButton: true,
    }).then((data) => {
      if (data.isConfirmed) {
        mutate(id);
      }
    });
  };

  const handleDriverConfirm = (bookingId) => {
    Swal.fire({
      title: "Confirm booking",
      text: "Are you sure you want to take this booking?",
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
        driverConfirmMutation.mutate(bookingId, {
          onSuccess: () => {
            Swal.fire({
              title: "Confirmed!",
              text: "Confirm pick-up successfully.",
              icon: "success",
            });
          },
          onError: () => {
            Swal.fire({
              title: "Error",
              text: "Something went wrong. Please try again.",
              icon: "error",
            });
          },
        });
      }
    });
  };
  const navigate = useNavigate();

  const handleButtonType = ( driverStatus, bookingId) => {
    switch (driverStatus.toLowerCase()) {
      case "approved":
        return [
          {
            label: "View details",
            color: "primary",
            onClick: () => {
              navigate(`/car-owner/booking/${bookingId}`);
            },
          },
        ];
      case "pending":
        return [
          {
            label: "View details",
            color: "primary",
            onClick: () => {
              navigate(`/car-owner/booking/${bookingId}`);
            },
          },
          {
            label: "Approve",
            color: "success",
            onClick: () => handleDriverConfirm(bookingId),
          },
          {
            label: "Reject",
            color: "error",
            onClick: () => handleReject(bookingId),
          },
        ];
      case "rejected":
        return [
          {
            label: "View details",
            color: "primary",
            onClick: () => {
              navigate(`/car-owner/booking/${bookingId}`);
            },
          },
          
        ];
      case "cancelled":
        return [
          {
            label: "View details",
            color: "primary",
            onClick: () => {
              navigate(`/car-owner/booking/${bookingId}`);
            },
          },
        ];
      default:
        return [
          {
            label: "View details",
            color: "primary",
            onClick: () => {
              navigate(`/car-owner/booking/${bookingId}`);
            },
          },
        ];
    }
  };
  if (isLoading || isPending) {
    return <Loading />;
  }

  console.log(data);

  return (
    <Box sx={{ pt: "8vh", backgroundColor: "#FAFAFB", minHeight: "100vh" }}>
      {isError ? (
        <NotFound />
      ) : (
        <Container>
          {/* ✅ Title */}
          <Stack direction="row" spacing={1} alignItems={"center"}>
            <ListAltIcon sx={{ color: "primary.main", fontSize: "35px" }} />
            <Typography variant="body1" fontSize={"25px"}>
              Your request
            </Typography>
          </Stack>

          {/* Bảng dữ liệu */}
          <TableContainer sx={{ mt: 5 }} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Car Image</TableCell>
                  <TableCell>Car Name</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((booking) => (
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
                    <TableCell>{booking.name}</TableCell>
                    <TableCell>
                      {dayjs(booking.from).format("DD/MM/YYYY HH:mm")}h
                    </TableCell>
                    <TableCell>
                      {dayjs(booking.to).format("DD/MM/YYYY HH:mm")}h
                    </TableCell>
                    <TableCell
                      sx={{
                        color: handleStatus(booking.driver_status).color,
                        fontWeight: 500,
                      }}
                    >
                      {handleStatus(booking.driver_status).label}
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction={"column"}
                        spacing={1}
                        sx={{ justifyContent: "end" }}
                      >
                        {handleButtonType(
                          booking.driver_status,
                          booking.id
                        ).map((button, index) => (
                          <Button
                            variant="contained"
                            key={index}
                            color={button.color}
                            onClick={button.onClick}
                          >
                            {button.label}
                          </Button>
                        ))}
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
              // page={page} // Đặt trạng thái active
              // onChange={handlePageChange}
              variant="text"
              color="primary"
            />
          </Stack>
        </Container>
      )}
    </Box>
  );
}

export default RequestList;
