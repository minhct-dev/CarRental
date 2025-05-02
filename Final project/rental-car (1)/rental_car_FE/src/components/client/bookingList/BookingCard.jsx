import ImageSlider from "../../carOwner/carList/ImageSlider";
import { Box, Button, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  formatDateTime,
  formatISODate,
  formatVND,
} from "./../../../helper/function";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  checkCancelStatusApi,
  confirmPickupApi,
  returnCarApi,
  sendCancelRequestCustomer,
} from "../../../api/bookingApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import GiveRating from "../../../pages/client/giveRating/GiveRating";
import { useState } from "react";

const imageStyle = {
  borderRadius: "13px",
  height: "90%",
  alignItems: "center",
};

const handleStatus = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return { label: "Confirmed", color: "green" };
    case "pending_deposit":
      return { label: "Pending Deposit", color: "#FFA733" };
    case "in_progress":
      return { label: "In-Progress", color: "#FFA733" };
    case "completed":
      return { label: "Completed", color: "blue" };
    case "cancelled":
      return { label: "Cancelled", color: "red" };
    case "pending_payment":
      return { label: "Pending Payment", color: "#FFA733" };
    default:
      return { label: "Unknown", color: "grey" };
  }
};
const handleButtonType = (
  status,
  bookingId,
  navigate,
  handleConfirmPickup,
  handleCancelBooking,
  handleReturnCar,
  handleOpen,
  cancelBookingStatus,
  feedbackStatus
) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return [
        {
          label: "View details",
          color: "primary",
          onClick: () => {
            navigate(`/booking/${bookingId}`);
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
          label: "View details",
          color: "primary",
          onClick: () => {
            navigate(`/booking/${bookingId}`);
          },
        },
        {
          label: "Cancel",
          color: "error",
          onClick: () => handleCancelBooking(bookingId),
        },
      ];
    case "pending_payment":
      return [
        {
          label: "View details",
          color: "primary",
          onClick: () => {
            navigate(`/booking/${bookingId}`);
          },
        },
        {
          label: "View Bill Detail",
          color: "primary",
          onClick: () => {
            navigate(`/bill/${bookingId}`);
          },
        },
      ];
    case "in_progress":
      return [
        {
          label: "View details",
          color: "primary",
          onClick: () => {
            navigate(`/booking/${bookingId}`);
          },
        },
        {
          label: "Return car",
          color: "primary",
          //click return car Hieu
          onClick: () => {
            handleReturnCar(bookingId);
          },
        },
      ];
    case "completed":
      return [
        {
          label: "View details",
          color: "primary",
          onClick: () => {
            navigate(`/booking/${bookingId}`);
          },
        },
        {
          label: "View Bill Detail",
          color: "primary",
          onClick: () => {
            navigate(`/bill/${bookingId}`);
          },
        },
        {
          label: "Give feedback",
          color: "primary",
          onClick: () => handleOpen(),
          display: feedbackStatus === "RECEIVED" ? "none" : "",
        },
      ];
    default:
      return [
        {
          label: "View details",
          color: "primary",
          onClick: () => {
            navigate(`/booking/${bookingId}`);
          },
        },
      ];
  }
};

const imgStyle = {
  height: "13rem",
};

const handleCancelMessage = (choice) => {
  switch (choice) {
    case 1:
      return "Car owner approved your cancel request and refund your deposit";
    case 2:
      return "Car owner approved your cancel request but did not refund your deposit";
    case 3:
      return "Car owner has rejected your cancel request";
  }
};

function BookingCard({ data }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: confirmPickupApi,
    onSuccess: () => {
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

  // check booking carowner status
  const checkBookingStatus = async (bookingId) => {
    let data = await checkCancelStatusApi(bookingId);
    return data;
  };

  //mutation return car: hieu
  const returnMutation = useMutation({
    mutationFn: ({ bookingId, currentDate }) =>
      returnCarApi(bookingId, currentDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  //handle return car hieu
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

  const navigate = useNavigate();
  const buttons = handleButtonType(
    data.status,
    data.id,
    navigate,
    handleConfirmPickup,
    handleCancelBooking,
    handleReturnCar,
    handleOpen,
    data.cancelBookingStatus,
    data.feedbackStatus
  );

  const status = handleStatus(data.status);
  return (
    <Stack
      direction={"row"}
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.2)",
        mt: 2,
        border: "1px solid rgba(165, 162, 162, 0.2)",
        p: "20px",
        borderRadius: "10px",
        justifyContent: "space-between",
      }}
    >
      <Stack direction={"row"} sx={{ width: "85%" }}>
        <Box sx={{ width: "35%" }}>
          <ImageSlider style={imageStyle}>
            {data.carImg.map((image, index) => (
              <img key={index} src={image} alt="Car image" style={imgStyle} />
            ))}
          </ImageSlider>
        </Box>
        <Stack direction={"column"} sx={{ pl: 3, pt: 1.5, width: "65%" }}>
          <Link
            to={`/car/${data.carId}?from=${encodeURIComponent(
              formatISODate(data.from)
            )}&to=${encodeURIComponent(formatISODate(data.to))}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              width: "fit-content",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={500}
              fontSize={"1.6rem"}
              component="span"
            >
              {data.name}
            </Typography>
          </Link>
          <Typography variant="span" fontWeight={350} fontSize={"0.75rem"}>
            From {formatDateTime(data.from)} to {formatDateTime(data.to)}
          </Typography>
          {/* center */}
          <Stack direction={"row"} sx={{ gap: 4 }}>
            <Stack direction={"column"} sx={{ pt: 2, gap: 0.5 }}>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <AccessTimeIcon />
                <Typography
                  variant="span"
                  sx={{
                    pl: 0.5,
                    fontWeight: 400,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: "13rem",
                    fontSize: "1.1rem",
                  }}
                >
                  {data?.numberOfDays} day(s)
                </Typography>
              </Stack>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <Typography variant="span" sx={{ pl: 0.3, fontSize: "1.1rem" }}>
                  Base price:
                </Typography>
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 400,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: "12rem",
                    fontSize: "1.1rem",
                  }}
                >
                  {formatVND(data.price)}
                </Typography>
              </Stack>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <Typography variant="span" sx={{ pl: 0.3, fontSize: "1.1rem" }}>
                  Deposit:
                </Typography>
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 400,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: "12rem",
                    fontSize: "1.1rem",
                  }}
                >
                  {formatVND(data.deposit)}
                </Typography>
              </Stack>
              {/* <Stack direction={"row"} sx={{ gap: 1 }}>
                <Typography variant="span" sx={{ pl: 0.3, fontSize: "1.1rem" }}>
                  Car Owner Status:
                </Typography>
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 400,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: "12rem",
                    fontSize: "1.1rem",
                    color:"red"
                  }}
                >
                  {data.carOwnerStatus}
                </Typography>
              </Stack>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <Typography variant="span" sx={{ pl: 0.3, fontSize: "1.1rem" }}>
                  Driver Status:
                </Typography>
                <Typography

                  variant="span"
                  sx={{
                    fontWeight: 400,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: "12rem",
                    fontSize: "1.1rem",
                    color:"red"
                  }}
                >
                  {data.driverStatus}
                </Typography>
              </Stack> */}
            </Stack>
            <Stack direction={"column"} sx={{ pt: 2, gap: 0.5 }}>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <Typography variant="span" sx={{ pl: 0.3, fontSize: "1.1rem" }}>
                  No.:
                </Typography>
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 400,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: "13rem",
                    fontSize: "1.1rem",
                  }}
                >
                  {data.id}
                </Typography>
              </Stack>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <Typography variant="span" sx={{ pl: 0.3, fontSize: "1.1rem" }}>
                  Status:
                </Typography>
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: 550,
                    color: status.color,
                    fontSize: "1.1rem",
                  }}
                >
                  {status.label}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          {data.cancelBookingStatus === "DONE" &&
          (data.status === "PENDING_DEPOSIT" ||
            data.status === "CONFIRMED" ||
            data.status === "CANCELLED") ? (
            <Typography
              variant="p"
              sx={{
                fontStyle: "italic",
                color: "red",
                fontSize: "0.95rem",
                pt: 1.3,
                maxWidth: "80%",
              }}
            >
              {handleCancelMessage(data.cancelBookingChoice)}
            </Typography>
          ) : data.cancelBookingStatus === "PENDING" &&
            (data.status === "PENDING_DEPOSIT" ||
              data.status === "CONFIRMED") ? (
            <Typography
              variant="p"
              sx={{
                fontStyle: "italic",
                color: "red",
                fontSize: "0.95rem",
                maxWidth: "80%",
                pt: 1.3,
              }}
            >
              Your cancel request is pending
            </Typography>
          ) : null}
        </Stack>
      </Stack>
      {/* right */}
      <Stack
        direction={"column"}
        sx={{ gap: 0.6, justifyContent: "space-between", alignItems: "end" }}
      >
        <Stack direction={"column"} sx={{ gap: 1, pt: 1 }}>
          {buttons.map((button) => (
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
        <Stack direction={"column"} sx={{ alignItems: "end", pr: 1, pt: 1 }}>
          <Typography
            variant="span"
            sx={{ fontWeight: 500, fontSize: "1.5rem" }}
          >
            {formatVND(data.totalPrice)}
          </Typography>
          <Typography
            variant="span"
            sx={{ fontWeight: 200, fontSize: "0.8rem", fontStyle: "italic" }}
          >
            Total price
          </Typography>
        </Stack>
      </Stack>
      <GiveRating open={open} handleClose={handleClose} bookingId={data.id} />
    </Stack>
  );
}

export default BookingCard;
