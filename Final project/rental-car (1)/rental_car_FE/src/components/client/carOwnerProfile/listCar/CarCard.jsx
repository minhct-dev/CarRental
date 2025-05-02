import { Stack, Box, Typography, Divider } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EvStationIcon from "@mui/icons-material/EvStation";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import StarIcon from "@mui/icons-material/Star";
import LuggageIcon from "@mui/icons-material/Luggage";
import { formatNumber, formatVND } from "../../../../helper/function";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
function CarCard({ car }) {
  const navigate = useNavigate();
  return (
    <Stack
      direction={"column"}
      sx={{
        px: 2,
        pt: 2,
        pb: 1.2,
        border: "1px solid #e0e0e0",
        width: "45%",
        borderRadius: "12px",
        boxSizing: "border-box",
        cursor: "pointer",
      }}
      onClick={() => {
        const startDate = dayjs().toISOString();
        const endDate = dayjs().add(1, "day").toISOString();
        navigate(`/car/${car?.carId}?from=${startDate}&to=${endDate}`);
      }}
    >
      <Box sx={{ borderRadius: "10px", overflow: "hidden" }}>
        <img
          style={{ width: "100%", height: "16rem", objectFit: "cover" }}
          src={car?.carImages}
        />
      </Box>
      <Box sx={{ pt: 3 }}>
        <Typography variant="span" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
          {car?.carName}
        </Typography>
        <Stack direction={"column"} sx={{ gap: 0.8 }}>
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", pt: 1 }}
          >
            <Stack direction={"row"} sx={{ alignItems: "center", gap: 0 }}>
              <TuneIcon sx={{ color: "gray", height: "1.1rem" }} />
              <Typography
                variant="span"
                sx={{ fontWeight: 400, fontSize: "0.9rem", color: "gray" }}
              >
                {car?.transmissionType}
              </Typography>
            </Stack>
            <Stack direction={"row"} sx={{ alignItems: "center", gap: 0 }}>
              <PeopleAltIcon sx={{ color: "gray", height: "1.1rem" }} />
              <Typography
                variant="span"
                sx={{ fontWeight: 400, fontSize: "0.9rem", color: "gray" }}
              >
                {car?.noOfSeats} seats
              </Typography>
            </Stack>
            <Stack direction={"row"} sx={{ alignItems: "center", gap: 0 }}>
              <EvStationIcon sx={{ color: "gray", height: "1.1rem" }} />
              <Typography
                variant="span"
                sx={{ fontWeight: 400, fontSize: "0.9rem", color: "gray" }}
              >
                {car?.fuelType}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} sx={{ alignItems: "center", gap: 0 }}>
            <AddLocationAltIcon sx={{ color: "black", height: "1.1rem" }} />
            <Typography
              variant="span"
              sx={{ fontWeight: 400, fontSize: "0.9rem", color: "gray" }}
            >
              {car.location}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ bgcolor: "black", mt: "1rem" }} />
        <Stack
          direction={"row"}
          sx={{ pt: 1, justifyContent: "space-between" }}
        >
          <Stack direction={"row"} sx={{ gap: 1 }}>
            <Stack direction={"row"} sx={{ alignItems: "center" }}>
              <StarIcon sx={{ color: "#F8C524" }} />
              <Typography
                variant="span"
                sx={{
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  color: "gray",
                  pt: "3px",
                }}
              >
                {(Math.round(car?.rating * 10) / 10).toFixed(1)}
              </Typography>
            </Stack>
            <Stack direction={"row"} sx={{ alignItems: "center" }}>
              <LuggageIcon sx={{ color: "green" }} />
              <Typography
                variant="span"
                sx={{
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  color: "gray",
                  pt: "3px",
                }}
              >
                {formatNumber(car.numberOfBooking)} booked
              </Typography>
            </Stack>
          </Stack>
          <Typography
            variant="span"
            sx={{ fontWeight: 800, fontSize: "1.15rem", color: "primary.main" }}
          >
            {formatVND(car.basePrice)}{" "}
            <span
              style={{ fontSize: "0.9rem", fontWeight: 400, color: "gray" }}
            >
              /day
            </span>
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

export default CarCard;
