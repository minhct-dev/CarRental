import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateModal from "../../../../pages/client/listCar/modal/DateModal";
import AddressModal from "../../../../pages/client/listCar/modal/AddressModal";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";

const PickDate = () => {
  const [showDate, setShowDate] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(null);
  const [selectDate, setSelectDate] = useState(null);
  const hanleDateClose = () => setShowDate(false);
  const hanleAddressClose = () => setShowAddress(false);

  const defaultFrom = dayjs().add(1, "day").hour(12).minute(0);
  const defaultTo = dayjs().add(2, "day").hour(14).minute(0);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (selectAddress) {
      if (selectAddress[0]) params.set("province", selectAddress[0].code);
      if (selectAddress[1]) params.set("district", selectAddress[1].code);
      if (selectAddress[2]) params.set("ward", selectAddress[2].code);
    }
    if (selectDate) {
      params.set("from", dayjs(selectDate.from).toISOString());
      params.set("to", dayjs(selectDate.to).toISOString());
    }
    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const datepick = document.querySelector(".datepick");
    setTimeout(() => {
      datepick.style.transform = "translate(-50%,50%)";
      datepick.style.opacity = "1";
    }, 1000);
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        backgroundColor: "white",
        height: "100px",
        bottom: "0",
        width: "60%",
        left: "50%",
        transform: "translate(-50%,150%)",
        borderRadius: "10px",
        padding: "25px",
        opacity: 0,
        transition:"all 0.5s"
      }}
      className="datepick"
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Address */}
        <Box sx={{ cursor: "pointer" }} onClick={() => setShowAddress(true)}>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography sx={{ fontSize: "15px" }}>Address</Typography>
            </Stack>
            <Typography sx={{ fontSize: "15px", color: "text.secondary" }}>
              {selectAddress == null
                ? "All Place"
                : (selectAddress[2] ? selectAddress[2].name + ", " : "") +
                  (selectAddress[1] ? selectAddress[1].name + ", " : "") +
                  (selectAddress[0] ? selectAddress[0].name : "")}
            </Typography>
          </Stack>
        </Box>

        {/* Divider */}
        <Divider orientation="vertical" flexItem />

        {/* Pick up date */}
        <Box sx={{ cursor: "pointer" }} onClick={() => setShowDate(true)}>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DateRangeIcon fontSize="small" color="action" />
              <Typography sx={{ fontSize: "15px" }}>Pick up date</Typography>
            </Stack>
            <Typography sx={{ fontSize: "15px", color: "text.secondary" }}>
              {dayjs(selectDate?.from || defaultFrom).format(
                "DD/MM/YYYY, HH:mm"
              )}
            </Typography>
          </Stack>
        </Box>

        {/* Divider */}
        <Divider orientation="vertical" flexItem />

        {/* Return date */}
        <Box sx={{ cursor: "pointer" }} onClick={() => setShowDate(true)}>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DateRangeIcon fontSize="small" color="action" />
              <Typography sx={{ fontSize: "15px" }}>Return date</Typography>
            </Stack>
            <Typography sx={{ fontSize: "15px", color: "text.secondary" }}>
              {dayjs(selectDate?.to || defaultTo).format("DD/MM/YYYY, HH:mm")}
            </Typography>
          </Stack>
        </Box>

        {/* Divider */}

        {/* Search Button */}
        <Box>
          <Button
            onClick={handleSearchClick}
            startIcon={<SearchIcon />}
            variant="contained"
          >
            Search
          </Button>
        </Box>
      </Stack>

      {/* Date Modal */}
      <DateModal
        onSave={setSelectDate}
        show={showDate}
        handleClose={hanleDateClose}
      />

      {/* Address Modal */}
      <AddressModal
        onSave={setSelectAddress}
        show={showAddress}
        handleClose={hanleAddressClose}
      />
    </Box>
  );
};

export default PickDate;
