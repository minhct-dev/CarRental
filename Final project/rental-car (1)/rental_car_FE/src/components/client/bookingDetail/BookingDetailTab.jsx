import { Box, FormControlLabel, Radio, Typography } from "@mui/material";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BookingInfo from "./bookingInfo/BookingInfo";
import CarInfo from "./carInfo/CarInfo";
import { formatVND } from './../../../helper/function';

function BookingDetailTab({
  data,
  province,
  setSelectProvince,
  setSelectDistrict,
  setSelectWard,
  district,
  ward,
  selectDistrict,
  selectProvince,
  selectWard,
  carDetail,
  bookingDetail,
}) {
  const [value, setValue] = React.useState("0");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", pt: "1rem"}}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="secondary tabs example"
      >
        <Tab value="0" label="Booking information" sx={{textTransform:"none"}}/>
        <Tab value="1" label="Car information" sx={{textTransform:"none"}}/>
        <Tab value="2" label="Payment information" sx={{textTransform:"none"}}/>
      </Tabs>
      {value === "0" && (
        <BookingInfo
          district={district}
          ward={ward}
          setSelectProvince={setSelectProvince}
          setSelectDistrict={setSelectDistrict}
          setSelectWard={setSelectWard}
          province={province}
          selectDistrict={selectDistrict}
          selectProvince={selectProvince}
          selectWard={selectWard}
          bookingDetail={bookingDetail}
        />
      )}
      {value === "1" && <CarInfo carDetail={carDetail}>Car infomation</CarInfo>}
      {value === "2" && (
        <Box>
          <Typography variant="h6" color="initial">Payment infomation</Typography>
          <FormControlLabel value="female" control={<Radio defaultChecked />} label="My wallet" />
          <Typography>Current balance: {formatVND(data.walletBalance)}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default BookingDetailTab;
