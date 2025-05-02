import { Box, Stack, Typography } from "@mui/material";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
const TotalDriver = ({ data }) => {
  return (
    <Box
      className="driver-data"
      sx={{
        height: "84px",
        backgroundColor: "white",
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
            backgroundColor: "#fff8e1",
            width: "40px",
            height: "40px",
            lineHeight: "40px",
            textAlign: "center",
            borderRadius: "10px",
          }}
        >
          <DirectionsCarFilledOutlinedIcon
            sx={{ color: "#ffc107", transform: "translateY(-10%)" }}
          ></DirectionsCarFilledOutlinedIcon>
        </Box>
        <Stack>
          <Typography variant="body1" color="black">
            {data.value}
          </Typography>
          <Typography fontSize={"13px"} variant="body2" color="text.secondary">
            Driver
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalDriver;
