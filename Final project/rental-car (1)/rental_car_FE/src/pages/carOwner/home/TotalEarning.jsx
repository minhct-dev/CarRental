import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert, ArrowUpward, AccountBalance } from "@mui/icons-material";
import { formatVND } from "../../../helper/function";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const TotalEarning = ({ week, month }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState("week"); // "week" hoặc "month"

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeView = (mode) => {
    setViewMode(mode);
    handleMenuClose();
  };

  const data = viewMode === "week" ? week : month;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(to right, #ffbf96, #fe7096) !important",
        color: "white",
        borderRadius: 3,
        height: "200px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: "0",
          top: "0",
          width: "50%",
          zIndex: 9999,
        }}
      >
        <img
          src="https://demo.bootstrapdash.com/purple-admin-free/dist/themes/assets/images/dashboard/circle.svg"
          alt=""
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <AccountBalance
                sx={{
                  fontSize: 30,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  padding: 1,
                  borderRadius: "5px",
                  marginRight: 1,
                }}
              />
              <Typography
                variant="body1"
                fontFamily={"ubuntu-regular, sans-serif"}
                fontWeight={400}
                color="white"
                fontSize={"1rem"}
              >
                {viewMode === "week" ? "Weekly Income" : "Monthly Income"}
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: "30px",
                letterSpacing: "0.5px",
                mt: 1,
              }}
            >
              {formatVND(data?.balance)}
            </Typography>

            {data.changePercentage != 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  mt: 3,
                }}
              >
                {data.changePercentage > 0 && <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />}
                {data.changePercentage < 0 &&   <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }}></ArrowDownwardIcon>}
                <Typography variant="body1" fontWeight={400} color="white">
                  {data.changePercentage > 0 ? "Increase " : "Decrease"} {data.changePercentage}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box>
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 0.7)", zIndex: "99999" }}
            onClick={handleMenuOpen}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            sx={{ zIndex: "999999" }}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleChangeView("week")}>
              Weekly Income
            </MenuItem>
            <MenuItem onClick={() => handleChangeView("month")}>
              Monthly Income
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
};

export default TotalEarning;
