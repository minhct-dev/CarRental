/* eslint-disable react/prop-types */
import { Box, Grid2, Stack, Typography } from "@mui/material";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import EvStationIcon from "@mui/icons-material/EvStation";
import PlaceIcon from '@mui/icons-material/Place';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

import parse from 'html-react-parser';
const Detail = ({ data }) => {
  return (
    <Box>
      <Typography variant="h6" color="initial">
        <AddRoadIcon></AddRoadIcon> Milleage
      </Typography>

      <Typography
        variant="body1"
        fontSize={"15px"}
        fontWeight={400}
        color="initial"
        sx={{ mt: 2, mb: 3, ml: 2 }}
      >
        Odometer reading : {data?.mileage} km
      </Typography>

      <Typography variant="h6" color="initial">
        <EvStationIcon></EvStationIcon> Fuel consumption
      </Typography>

      <Typography
        variant="body1"
        fontSize={"15px"}
        fontWeight={400}
        color="initial"
        sx={{ mt: 2, mb: 3, ml:2 }}
      >
        Fuel consumption : {data?.fuelConsumption}L/100km
      </Typography>
      <Typography variant="h6" color="initial">
        <PlaceIcon></PlaceIcon> Address
      </Typography>

      <Typography
        variant="body1"
        fontSize={"15px"}
        fontWeight={400}
        color="initial"
        sx={{ mt: 2, mb: 3, ml:2 }}
      >
        Address Detail:  {data?.addressDetail}
      </Typography>

      <Typography variant="h6" color="initial">
        <DescriptionIcon></DescriptionIcon> Decription
      </Typography>

      <Typography
        variant="body1"
        fontSize={"15px"}
        fontWeight={400}
        color="initial"
        sx={{ mt: 3 , ml: 2}}
      >
        {parse(data?.description)}
      </Typography>
      <Typography sx={{ mt: 3, mb: 3 }} variant="h6" color="initial">
        <ViewCompactIcon></ViewCompactIcon> Feature
      </Typography>
      <Grid2 sx={{ ml: 2 }} container spacing={3} rowSpacing={2}>
        {data?.carFunctions.map((feature, index) => (
          <Grid2 item key={index} size={4}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <i className={feature.icon}></i>
              <Typography fontSize={"15px"} fontWeight={400}>
                {feature.name}
              </Typography>
            </Stack>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Detail;
