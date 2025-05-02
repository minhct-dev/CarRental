import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { formatISODate, formatVND } from "../../../helper/function";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";
import {
  checkCancelStatusApi,
  confirmPickupApi,
  returnCarApi,
} from "../../../api/bookingApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  sendCancelRequestCustomer,
  cancelBookingCarOwnerApi,
} from "./../../../api/bookingApi";

const checkBookingStatus = async (bookingId) => {
  let data = await checkCancelStatusApi(bookingId);
  return data;
};

const formatNumber = (num) => {
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

const handleOwnerStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return { color: "warning", label: "Waiting for car owner" };
    case "confirm":
      return { color: "success", label: "Approved by car owner" };
    case "cancel":
      return { color: "error", label: "Cancelled by car owner" };
    default:
      return { color: "warning", label: "Unknown" };
  }
};

const handleStatus = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return { label: "Confirmed", color: "green" };
    case "pending_deposit":
      return { label: "Pending deposit", color: "#FFA733" };
    case "in_progress":
      return { label: "In-progress", color: "#FFA733" };
    case "completed":
      return { label: "Completed", color: "blue" };
    case "cancelled":
      return { label: "Cancelled", color: "red" };
    case "pending_payment":
      return { label: "Pending payment", color: "#FFA733" };
    default:
      return { label: "Unknown", color: "grey" };
  }
};
const handleButtonType = (
  status,
  bookingId,
  carId,
  navigate,
  handleConfirmPickup,
  handleCancelBooking,
  from,
  to,
  handleReturnCar,
  cancelBookingStatus
) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return [
        {
          label: "View car details",
          color: "primary",
          onClick: () => {
            navigate(
              `/car/${carId}?from=${encodeURIComponent(
                formatISODate(from)
              )}&to=${encodeURIComponent(formatISODate(to))}`
            );
          },
        },
        {
          label: "Confirm pick-up",
          color: "primary",
          onClick: () => handleConfirmPickup(bookingId),
        },
        {
          label: "Cancel",
          color: "error",
          onClick: () => handleCancelBooking(bookingId),
          display:
            cancelBookingStatus === "PENDING" || cancelBookingStatus === "DONE"
              ? "none"
              : "",
        },
      ];
    case "pending_deposit":
      return [
        {
          label: "View car details",
          color: "primary",
          onClick: () => {
            navigate(
              `/car/${carId}?from=${encodeURIComponent(
                formatISODate(from)
              )}&to=${encodeURIComponent(formatISODate(to))}`
            );
          },
        },
        {
          label: "Cancel",
          color: "error",
          onClick: () => handleCancelBooking(bookingId),
        },
      ];
    case "in_progress":
      return [
        {
          label: "View car details",
          color: "primary",
          onClick: () => {
            navigate(
              `/car/${carId}?from=${encodeURIComponent(
                formatISODate(from)
              )}&to=${encodeURIComponent(formatISODate(to))}`
            );
          },
        },
        {
          label: "Return car",
          color: "primary",
          onClick: () => {
            handleReturnCar(bookingId);
          },
        },
      ];
    default:
      return [
        {
          label: "View car details",
          color: "primary",
          onClick: () => {
            navigate(
              `/car/${carId}?from=${encodeURIComponent(
                formatISODate(from)
              )}&to=${encodeURIComponent(formatISODate(to))}`
            );
          },
        },
      ];
  }
};

const formatBookingDate = (isoString) => {
  const date = parseISO(isoString);
  return {
    formattedDate: format(date, "EEE, dd MMM, yyyy"),
    formattedTime: format(date, "hh:mm a"),
  };
};
function CardInfo({ bookingDetail, carName, onwer }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: confirmPickupApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingDetail"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleConfirmPickup = (bookingId) => {
    Swal.fire({
      title: "Confirm pick-up",
      text: "Are you sure you want to confirm pick-up?",
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
        mutation.mutate(bookingId, {
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
  //đổi hàm call api : hiếu
  const cancelMutation = useMutation({
    mutationFn: sendCancelRequestCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  //call api gửi request : hiếu
  const handleCancelBooking = async (bookingId) => {
    try {
      // Gọi API kiểm tra trạng thái booking trước khi hủy
      console.log("id ne", bookingId);

      const bookingStatus = await checkBookingStatus(bookingId);
      console.log("Booking status:", bookingStatus);

      let title = "Cancel Booking";
      let text = "Are you sure you want to cancel the trip?";

      if (bookingStatus === "PENDING") {
        text =
          "Car owner has not accepted the booking yet. You will receive a full deposit refund.";
      } else if (bookingStatus === "CONFIRM") {
        text =
          "Car owner has already confirmed the booking. If you cancel now, you may lose your deposit.";
      } else {
        Swal.fire({
          title: "Error",
          text: "Invalid booking status.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title,
        icon: "warning",
        text,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Hiển thị trạng thái loading khi hủy
          Swal.fire({
            title: "Processing...",
            icon: "info",
            text: "Please wait while we cancel the booking.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          // Gọi API hủy booking
          cancelMutation.mutate(bookingId, {
            onSuccess: (data) => {
              console.log("Cancel response:", data);
              queryClient.invalidateQueries({ queryKey: ["bookingDetail"] });
              Swal.fire({
                title: "Booking Cancelled!",
                text: "Your booking has been successfully cancelled.",
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
    } catch (error) {
      console.error("Error fetching booking status:", error);
      Swal.fire({
        title: "Error",
        text: "Could not check booking status. Please try again.",
        icon: "error",
      });
    }
  };

  const returnMutation = useMutation({
    mutationFn: ({ bookingId, currentDate }) =>
      returnCarApi(bookingId, currentDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleReturnCar = (bookingId) => {
    Swal.fire({
      title: "Return Car",
      text: "Are you sure you want to return this car?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, return it",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentDate = dayjs().format("YYYY-MM-DDTHH:mm");
        returnMutation.mutate(
          { bookingId, currentDate },
          {
            onSuccess: (res) => {
              navigate("/bill/" + res.id);
            },
            onError: () => {
              Swal.fire(
                "Error",
                "Failed to return the car. Try again.",
                "error"
              );
            },
          }
        );
      }
    });
  };
  const fromTime = formatBookingDate(bookingDetail?.from);
  const toTime = formatBookingDate(bookingDetail?.to);
  const navigate = useNavigate();
  const buttons = handleButtonType(
    bookingDetail?.status,
    bookingDetail?.bookingId,
    bookingDetail?.carId,
    navigate,
    handleConfirmPickup,
    handleCancelBooking,
    bookingDetail?.from,
    bookingDetail?.to,
    handleReturnCar,
    bookingDetail?.cancelBookingStatus
  );
  const status = handleStatus(bookingDetail?.status);
  return (
    <Box sx={{ width: "45%", px: 2 }}>
      <Stack
        direction={"column"}
        sx={{
          borderWidth: "1px",
          borderColor: "#CBCBCB",
          boxShadow: "0px 0px 5px 0px #CBCBCB",
          borderRadius: "10px",
          px: "1.5rem",
          pt: "1.1rem",
          pb: "1rem",
          backgroundColor: "white",
          mt: 1,
        }}
      >
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: "1.7rem" }}>
            {carName}
          </Typography>
          {bookingDetail?.cancelBookingStatus === "PENDING" && (
            <Alert severity="info" sx={{ py: 0 }}>
              Your cancel request is pending
            </Alert>
          )}
        </Stack>
        <Container
          sx={{
            border: "1px solid black",
            borderRadius: "10px",
            width: "95%",
            py: "0.5rem",
            mt: "1rem",
          }}
        >
          <Stack direction={"column"}>
            <Stack direction={"row"}>
              <Typography
                variant="span"
                sx={{
                  fontWeight: 550,
                  fontSize: "0.9rem",
                  color: "#777979",
                  width: "50%",
                }}
              >
                Pick-up time
              </Typography>
              <Typography
                variant="span"
                sx={{
                  fontWeight: 550,
                  fontSize: "0.9rem",
                  color: "#777979",
                  pl: "0.65rem",
                  width: "50%",
                }}
              >
                Return time
              </Typography>
            </Stack>
            <Stack direction={"row"} sx={{ pt: "0.7rem" }}>
              <Stack
                direction={"column"}
                sx={{ alignItems: "start", width: "45%", flex: 1 }}
              >
                <Typography variant="span">{fromTime.formattedDate}</Typography>
                <Typography variant="span">
                  from {fromTime.formattedTime}
                </Typography>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack
                direction={"column"}
                sx={{ alignItems: "start", width: "45%", flex: 1, pl: 2 }}
              >
                <Typography variant="span">{toTime.formattedDate}</Typography>
                <Typography variant="span">
                  to {toTime.formattedTime}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction={"row"}
              sx={{ pt: "1.3rem", justifyContent: "space-between" }}
            >
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#777979" }}
                >
                  Number of days
                </Typography>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                >
                  {bookingDetail?.numberOfDays === 0
                    ? 1
                    : bookingDetail?.numberOfDays}
                </Typography>
              </Stack>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#777979" }}
                >
                  Booking no.
                </Typography>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                >
                  {bookingDetail?.bookingId}
                </Typography>
              </Stack>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#777979" }}
                >
                  Status
                </Typography>
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: status.color,
                  }}
                >
                  {status.label}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
        <Container sx={{ width: "100%", mt: "1rem" }}>
          <Chip
            label={handleOwnerStatus(bookingDetail?.carOwnerStatus).label}
            color={handleOwnerStatus(bookingDetail?.carOwnerStatus).color}
            sx={{ width: "100%" }}
          />
        </Container>
        <Typography
          variant="span"
          sx={{ fontWeight: 600, fontSize: "1.2rem", pt: "1.3rem" }}
        >
          Your price summary
        </Typography>
        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", pt: "1rem" }}
        >
          <Typography variant="span" sx={{ fontWeight: 400, fontSize: "1rem" }}>
            Base price:
          </Typography>
          <Typography variant="span" sx={{ fontWeight: 400, fontSize: "1rem" }}>
            {formatVND(bookingDetail?.price)}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", pt: "0.25rem" }}
        >
          <Typography variant="span" sx={{ fontWeight: 400, fontSize: "1rem" }}>
            Deposit:
          </Typography>
          <Typography variant="span" sx={{ fontWeight: 400, fontSize: "1rem" }}>
            {formatVND(bookingDetail?.deposit)}
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", pt: "0.8rem" }}
        >
          <Typography
            variant="span"
            sx={{ fontWeight: 600, fontSize: "1.5rem", color: "#399D64" }}
          >
            Total price:
          </Typography>
          <Stack direction={"row"} sx={{ alignItems: "center", gap: 1 }}>
            {bookingDetail?.discount > 0 && (
              <Stack
                direction={"row"}
                sx={{
                  backgroundColor: "#D3EFD5",
                  borderRadius: "5px",
                  alignItems: "center",
                  px: 0.35,
                  height: "1.5rem",
                }}
              >
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, fontSize: "0.8rem", color: "#4A9D62" }}
                >
                  -{formatNumber(bookingDetail?.discount)}
                </Typography>
              </Stack>
            )}
            <Typography
              variant="span"
              sx={{ fontWeight: 600, fontSize: "1.5rem", color: "#399D64" }}
            >
              {bookingDetail?.totalPrice === 0
                ? formatVND(bookingDetail?.price - bookingDetail?.discount)
                : formatVND(
                    bookingDetail?.totalPrice - bookingDetail?.discount
                  )}
            </Typography>
          </Stack>
        </Stack>
        {bookingDetail?.discount > 0 && (
          <Stack direction={"row"} sx={{ justifyContent: "end" }}>
            <Typography
              variant="span"
              sx={{ fontWeight: 600, fontSize: "1rem", color: "#777979" }}
            >
              <s>
                {bookingDetail?.totalPrice === 0
                  ? formatVND(bookingDetail?.price)
                  : formatVND(bookingDetail?.totalPrice)}
              </s>
            </Typography>
          </Stack>
        )}
        <Stack direction={"row"} sx={{ pt: 1.55, gap: 2 }}>
          {!onwer &&
            buttons.map((button) => (
              <Button
                key={button.label}
                variant="contained"
                color={button.color}
                onClick={button.onClick}
                sx={{ fontSize: "0.9rem", display: button.display }}
              >
                {button.label}
              </Button>
            ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default CardInfo;
