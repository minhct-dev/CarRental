import { Box, Typography } from "@mui/material"
import Groups2Icon from '@mui/icons-material/Groups2';
const TotalUser = ({data}) => {
  return (
    <Box
    className="total-order-admin"
    sx={{
      background: "#1e88e5",
      borderRadius: "10px",
      padding: "25px",
      color: "white",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      position: "relative",
      height: "200px",
    }}
  >
    {/* Icon and More button */}
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.2)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <Groups2Icon sx={{ color: "white" }} />
      </Box>
   
    </Box>

    {/* Earnings Amount */}
    <Typography variant="h4" fontWeight="bold">
      {data}
    </Typography>
    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
      Total User
    </Typography>
  </Box>
  )
}

export default TotalUser