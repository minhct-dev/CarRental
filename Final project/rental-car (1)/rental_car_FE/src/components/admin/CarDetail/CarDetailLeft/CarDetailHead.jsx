/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Rating, Stack, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import PlaceIcon from "@mui/icons-material/Place";
const CarDetailHead = ({ data }) => {
  return (
    <Stack direction={"column"} spacing={1}>
      <Typography
        sx={{ fontSize: "35px", fontWeight: 700 }}
        variant="h2"
        color="initial"
      >
        {data?.name}
      </Typography>
  
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
      
        
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <PlaceIcon sx={{ fontSize: "20px", color: "primary.main" }} />
          <Typography
            variant="body1"
            color="text.secondary"
            fontSize={"15px"}
            sx={{ marginLeft: "0px !important" }}
          >
            {data?.wardName} - {data?.districtName} - {data?.provinceName}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CarDetailHead;
