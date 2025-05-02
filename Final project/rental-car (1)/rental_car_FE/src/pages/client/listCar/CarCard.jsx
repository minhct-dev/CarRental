import { Box, Grid2, Stack, Typography } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import { formatVND } from "../../../helper/function";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
const CarCard = ({ data }) => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  let fromParam = searchParams.get("from");
  let toParam = searchParams.get("to");
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/car/${data.id}?from=${dayjs(fromParam).toISOString()}&to=${dayjs(toParam).toISOString()}`)
  }
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        p: 2,
        borderRadius: "10px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Stack direction={"column"} spacing={2} sx={{ backgroundColor: "white" }}>
        <Box>
          <img
            style={{ borderRadius: "10px", objectFit: "cover" }}
            width={"100%"}
            height={"200px"}
            src={data.imageUrl}
            alt=""
          />
        </Box>
        <Box>
          <Stack
            direction={"column"}
            spacing={2}
            sx={{ borderBottom: "1px solid #ccc", pb: 2 }}
          >
            <Typography
              fontSize={"19px"}
              fontWeight={800}
              variant="h6"
              color="initial"
            >
              {data.name.length > 25 ? data.name.substring(0,25)+"..." : data.name}
            </Typography>

            <Grid2 container justifyContent={"space-between"} rowSpacing={1.5} >
              <Grid2 size={4}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <TuneIcon
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                  ></TuneIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                  >
                    {data.transmissionType.substring(0, 1).toUpperCase() +
                      data.transmissionType.substring(1).toLowerCase()}
                  </Typography>
                </Stack>
              </Grid2>

              <Grid2 size={4}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <ColorLensIcon
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                  ></ColorLensIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {data.color}
                  </Typography>
                </Stack>
              </Grid2>

              <Grid2 size={4}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <LocalGasStationIcon
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                  ></LocalGasStationIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                  >
                    {data.fuelType.substring(0, 1).toUpperCase() +
                      data.fuelType.substring(1).toLowerCase()}
                  </Typography>
                </Stack>
              </Grid2>

              <Grid2 size={4}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <EventSeatIcon
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                  ></EventSeatIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                  >
                    {data.chair} seats
                  </Typography>
                </Stack>
              </Grid2>
              <Grid2 size={4}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <EditCalendarIcon
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                  ></EditCalendarIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                  >
                    {data.productionYear}
                  </Typography>
                </Stack>
              </Grid2>

              <Grid2 size={4}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <BrandingWatermarkIcon
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                  ></BrandingWatermarkIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                  >
                    {data.brand.length > 10 ? data.brand.substring(0,8)+"..." : data.brand}
                  </Typography>
                </Stack>
              </Grid2>

              <Grid2 size={10}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <FormatAlignCenterIcon
                    sx={{ fontSize: "14px", color: "text.secondary" }}
                  ></FormatAlignCenterIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                  >
                    {data.carType}
                  </Typography>
                </Stack>
              </Grid2>

              <Grid2 size={12}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <PlaceIcon
                    sx={{ fontSize: "18px", color: "text.primary" }}
                  ></PlaceIcon>
                  <Typography
                    fontSize={"14px"}
                    fontWeight={400}
                    variant="body1"
                    color="text.secondary"
                  >
                    {data.ward ? data.ward + ", " : ""}{" "}
                    {data.district ? data.district + ", " : ""} {data.province}
                  </Typography>
                </Stack>
              </Grid2>

              <Grid2 size={12}>
                <Stack spacing={0.5} direction={"row"} alignItems={"center"}>
                  <AlarmOnIcon
                    sx={{ fontSize: "18px",  color:data.status == "BOOKED" ? "red" : "green"}}
                  ></AlarmOnIcon>
                  <Typography
                    fontSize={"15px"}
                    fontWeight={500}
                    variant="body1"
                    color={data.status == "BOOKED" ? "red" : "green"}
                  >
                    {data.status.substring(0, 1).toUpperCase() +
                      data.status.substring(1).toLowerCase()}
                  </Typography>
                </Stack>
              </Grid2>
            </Grid2>
          </Stack>
        </Box>

        <Box>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"column"}>
              <Stack direction={"row"} alignItems={"start"} spacing={1}>
                <Stack direction={"row"} alignItems={"center"}>
                  <StarIcon
                    sx={{ color: "orange", fontSize: "22px" }}
                  ></StarIcon>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    fontSize={"13px"}
                    fontWeight={400}
                    pt={0.5}
                  >
                    {Math.round(data.rating * 2) / 2}
                  </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                  <DepartureBoardIcon
                    sx={{ fontSize: "16px", color: "primary.main" }}
                  >
                    {" "}
                  </DepartureBoardIcon>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    fontSize={"13px"}
                    pt={0.5}
                    fontWeight={400}
                  >
                    {data.numberOfBookings} Journey
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction={"row"} alignItems={"end"} spacing={0.5}>
              <Typography
                variant="body1"
                fontSize={"17px"}
                fontWeight={700}
                color="primary.main"
              >
                {formatVND(data.pricePerDay)}
              </Typography>
              <Typography
                variant="body1"
                fontSize={"14px"}
                fontWeight={400}
                color="textSecondary"
              >
                /
              </Typography>
              <Typography
                variant="body1"
                fontSize={"14px"}
                fontWeight={400}
                color="textSecondary"
              >
                Day
              </Typography>
            </Stack>
          </Stack>
       
        </Box>
      </Stack>
    </Box>
  );
};

export default CarCard;
