import { Box, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { formatVND } from "../../../helper/function";
const TotalEarning = ({ data }) => {
  return (
    <Box
      className="total-earning-admin"
      sx={{
        background: "#5e35b1",
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
          <AccountBalanceWalletIcon sx={{ color: "white" }} />
        </Box>
      </Box>

      {/* Earnings Amount */}
      <Typography variant="h4" fontWeight="bold">
        {formatVND(data || 0)}
      </Typography>
      <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
        Wallet balance
      </Typography>
    </Box>
  );
};

export default TotalEarning;
