import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { formatISODate, formatVND } from "../../../helper/function";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";
import {
  cancelBookingApi,
  confirmPickupApi,
  getPercentageCancel,
  returnCarApi,
} from "../../../api/bookingApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import SvgVoucher from './../../client/carDetail/CarDetailRight/SvgVoucher';
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
  handleReturnCar
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
  const cancelMutation = useMutation({
    mutationFn: cancelBookingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingDetail"] });
    },
  });
  const handleCancelBooking = async (bookingId) => {
    const cancelDate = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZZ");

    const percentage = await getPercentageCancel(bookingId, cancelDate);
    console.log(cancelDate);

    Swal.fire({
      title: "Cancel Booking",
      text: `You have exceeded the time by ${
        percentage.percentTime
      } and must pay a penalty of ${
        percentage.percentValue
      }% of the deposit, your refund is ${formatVND(
        percentage.totalRefund
      )}. Are you sure to cancel?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it",
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

        cancelMutation.mutate(
          { bookingId, cancelDate },
          {
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
          }
        );
      }
    });
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
    bookingDetail?.id,
    bookingDetail?.carId,
    navigate,
    handleConfirmPickup,
    handleCancelBooking,
    bookingDetail?.from,
    bookingDetail?.to,
    handleReturnCar
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
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: "1.7rem" }}>
          {carName}
        </Typography>
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
        <Typography
          variant="span"
          sx={{ fontWeight: 600, fontSize: "1.2rem", pt: "1.3rem" }}
        >
          Car address
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
          sx={{
            borderBottom: "1px solid #ccc",
            py: 2,
            borderTop: "1px solid #ccc",
          }}
          direction={"row"}
          justifyContent={"space-between"}
          mt={2}
        >
          <Stack direction={"row"} spacing={2}>
            <SvgVoucher></SvgVoucher>
            <Typography
              fontSize={"15px"}
              fontWeight={400}
              variant="body1"
              color="initial"
            >
              Select voucher
            </Typography>
          </Stack>
          <ChevronRightIcon sx={{ color: "text.secondary" }}></ChevronRightIcon>
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
          <Typography
            variant="span"
            sx={{ fontWeight: 600, fontSize: "1.5rem", color: "#399D64" }}
          >
            {bookingDetail?.totalPrice === 0
              ? formatVND(bookingDetail?.price)
              : formatVND(bookingDetail?.totalPrice)}
          </Typography>
        </Stack>
        <Stack direction={"row"} sx={{ pt: 1.55, gap: 2 }}>
          { !onwer &&
            buttons.map((button) => (
              <Button
                key={button.label}
                variant="contained"
                color={button.color}
                onClick={button.onClick}
                sx={{ fontSize: "0.9rem" }}
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
