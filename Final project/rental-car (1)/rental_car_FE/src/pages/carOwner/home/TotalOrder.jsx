import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { ShoppingCart, MoreVert } from "@mui/icons-material";

const TotalOrder = ({ month, week }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mode, setMode] = useState("week"); // 'week' or 'month'

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (option) => {
    setMode(option);
    handleClose();
  };

  const title =
    mode === "week" ? "Number of bookings this week" : "Number of bookings this month";
  const orderCount = mode === "week" ? week : month;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(to right, #90caf9, #047edf 99%) !important",
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
              <ShoppingCart
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
                {title}
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
              {orderCount} Orders
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 0.7)", zIndex:"9999" }}
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu sx={{ zIndex:"99999"}} anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleSelect("week")}>This Week</MenuItem>
            <MenuItem onClick={() => handleSelect("month")}>This Month</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
};

export default TotalOrder;
