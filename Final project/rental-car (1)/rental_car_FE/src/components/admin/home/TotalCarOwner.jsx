import { Box, Stack, Typography } from "@mui/material";

import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
const TotalCarOwner = ({data}) => {
  return (
    <Box
      className="car-owner-data"
      sx={{
        height: "84px",
        backgroundColor: "#1e88e5",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        px: 2,
        position: "relative",
      }}
    >
      <Stack alignItems={"center"} direction={"row"} spacing={1}>
        <Box
          sx={{
            backgroundColor: "#1565c0",
            width: "40px",
            height: "40px",
            lineHeight: "40px",
            textAlign: "center",
            borderRadius: "10px",
          }}
        >
          <DirectionsCarFilledOutlinedIcon
            sx={{ color: "white", transform: "translateY(-10%)" }}
          ></DirectionsCarFilledOutlinedIcon>
        </Box>
        <Stack>
          <Typography variant="body1" color="white">
            {data.value}
          </Typography>
          <Typography fontSize={"13px"} variant="body2" color="white">
            Car Owner
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalCarOwner;
