import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountBalance, MoreVert } from "@mui/icons-material";

const TotalIncome = ({ stop = 0, active = 0 }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [view, setView] = useState("active"); // "active" hoặc "stop"

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeView = (value) => {
    setView(value);
    handleMenuClose();
  };

  const isActiveView = view === "active";
  const carCount = isActiveView ? active : stop;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(to right, #84d9d2, #07cdae) !important",
        color: "white",
        borderRadius: 3,
        height: "200px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hiệu ứng vòng tròn nền */}
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
                {isActiveView ? "Active Cars" : "Stopped Cars"}
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
              {carCount} car{carCount !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>

        {/* Nút menu */}
        <Box>
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 0.7)", zIndex:"99999" }}
            onClick={handleMenuOpen}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{zIndex:"99999"}}
          >
            <MenuItem onClick={() => handleChangeView("active")}>
              Active Cars
            </MenuItem>
            <MenuItem onClick={() => handleChangeView("stop")}>
              Stopped Cars
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
};

export default TotalIncome;
