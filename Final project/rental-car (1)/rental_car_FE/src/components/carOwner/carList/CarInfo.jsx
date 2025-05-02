import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import ImageSlider from "./ImageSlider";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { formatNumber, formatVND } from "./../../../helper/function";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { changeCarStatusApi, deleteCarApi } from "../../../api/carApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";

function handleStatusLabel(status) {
  switch (status.toLowerCase()) {
    case "available":
      return {
        text: "Available",
        style: { color: "green", backgroundColor: "#C8E6C9" },
      };
    case "stopped":
      return {
        text: "Stopped",
        style: { color: "red", backgroundColor: "#FFCDD2" },
      };
    case "booked":
      return {
        text: "Booked",
        style: { color: "blue", backgroundColor: "#BBDEFB" },
      };
    default:
      return {
        text: "Unknown",
        style: { color: "gray", backgroundColor: "#E0E0E0" },
      };
  }
}

const imgStyle = {
  height: "14rem",
};
const handleViewDetails = (navigate, carId) => {
  navigate(`/car-owner/edit-car/${carId}`);
};

function CarInfo({ car }) {
  const { text, style } = handleStatusLabel(car.status);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const changeCarStatusMutate = useMutation({
    mutationFn: changeCarStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]); // Cập nhật dữ liệu xe
      Swal.fire({
        title: "Successfully!",
        text: "Car status updated.",
        icon: "success",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong.",
        icon: "error",
      });
    },
  });

  const handleChangeCarStatus = (carId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to change this car status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        changeCarStatusMutate.mutate(carId);
      }
    });
  };

  const deleteCarMutate = useMutation({
    mutationFn: (carId) => deleteCarApi(carId),
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]);
      Swal.fire({
        title: "Successfully!",
        text: "Car deleted.",
        icon: "success",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong.",
        icon: "error",
      });
    },
  });

  const handleDeleteCar = (carId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this car?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCarMutate.mutate(carId);
      }
    });
  };

  return (
    <Stack
      direction={"column"}
      className="car-card"
      sx={{
        backgroundColor: "white",
        borderRadius: "13px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        width: "32.3%",
        pt: "0.7rem",
        px: "0.7rem",
        pb: 1,
        justifyContent: "space-between",
      }}
    >
      <Stack direction={"column"} sx={{ gap: 2 }}>
        <Box sx={{ width: "100%" }}>
          <ImageSlider>
            {car.carImagesUrl.map((img, index) => (
              <img key={index} src={img} alt={car.imgAlt} style={imgStyle} />
            ))}
          </ImageSlider>
        </Box>
        <Stack direction={"column"} sx={{ px: "0.7rem" }}>
          <Box>
            <Stack direction={"row"} alignItems={"start"} justifyContent={"space-between"}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, fontSize: "1.4rem" }}
              >
                {car.brand} {car.model}
              </Typography>
              <Typography
                sx={{
                  padding: "5px 10px",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  ...style,
                  fontSize: "1rem",
                }}
              >
                {text}
              </Typography>
            </Stack>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.2rem",
                fontWeight: 200,
                pl: "3px",
              }}
            ></Typography>
          </Box>
          <Box>
            <Stack
              sx={{ mt: 1 }}
              direction={"row"}
              spacing={"5px"}
              alignItems={"center"}
            >
              <FeaturedPlayListIcon
                sx={{
                  color: "primary.main",
                  width: "6%",
                  height: "1.5rem",
                  mb: "5px",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  width: "80%",
                  fontWeight: "500",
                }}
              >
                {car?.licensePlate}
              </Typography>
            </Stack>

            <Stack
              sx={{ mt: 1 }}
              direction={"row"}
              spacing={"5px"}
              alignItems={"center"}
            >
              <AddLocationAltIcon
                sx={{
                  color: "primary.main",
                  width: "6%",
                  height: "1.5rem",
                  mb: "5px",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  width: "80%",
                  fontWeight: "500",
                }}
              >
                {car.province}, {car.district}
              </Typography>
            </Stack>

            <Stack
              sx={{ mt: 1 }}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"end"}
            >
              <Stack direction={"row"} gap={"5px"}>
                <Stack alignItems={"center"} direction={"row"} gap={"5px"}>
                  <GroupsIcon
                    sx={{ color: "gray", width: "1.5rem", height: "1.5rem" }}
                  />
                  <Typography
                    variant="p"
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      alignContent: "center",
                    }}
                  >
                    {formatNumber(car.noOfRides)} booked
                  </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={"3px"}>
                  <StarIcon
                    sx={{ color: "#FDCC0D", width: "1.5rem", height: "1.5rem" }}
                  />
                  <Typography
                    variant="p"
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      alignContent: "center",
                    }}
                  >
                    {car.rating}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
      <Divider sx={{ bgcolor: "black", mt: 2 }} />
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          pb: 1.5,
          mt: 1,
        }}
      >
        <Stack direction={"row"} sx={{ gap: 1, justifyContent: "center" }}>
          <Tooltip title="View details">
            <IconButton
              size="small"
              onClick={() => handleViewDetails(navigate, car.carId)}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              <DisplaySettingsIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              car?.status?.toLowerCase() === "available"
                ? "Stop renting car"
                : "Start renting car"
            }
          >
            <IconButton
              sx={{
                backgroundColor:
                  car?.status.toLowerCase() === "available"
                    ? "warning.main"
                    : "success.main",
                "&:hover": {
                  backgroundColor:
                    car?.status.toLowerCase() === "available"
                      ? "warning.dark"
                      : "success.dark",
                },
              }}
              onClick={() => handleChangeCarStatus(car.carId)}
              size="small"
            >
              {car?.status.toLowerCase() === "available" ? (
                <CarCrashIcon sx={{ color: "white" }} />
              ) : (
                <DirectionsCarIcon sx={{ color: "white" }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete car">
            <IconButton
              size="small"
              onClick={() => handleDeleteCar(car.carId)}
              sx={{
                backgroundColor: "error.main",
                "&:hover": { backgroundColor: "error.dark" },
              }}
            >
              <DeleteForeverIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction={"row"} spacing={"3px"}>
          <Stack direction={"column"} sx={{ alignItems: "end" }}>
            <Typography
              variant="p"
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                alignContent: "center",
                wordWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: "10rem",
              }}
            >
              {formatVND(car.basePrice)}
            </Typography>
            <Typography
              variant="p"
              sx={{
                fontSize: "0.7rem",
                fontWeight: "300",
                pl: "8px",
              }}
            >
              per day
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default CarInfo;
