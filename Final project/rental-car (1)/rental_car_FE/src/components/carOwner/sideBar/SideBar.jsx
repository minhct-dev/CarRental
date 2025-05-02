import {
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CarRentalIcon from "@mui/icons-material/DirectionsCar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logoDark from "../../../assets/logo-dark.png";
import { useLocation, useNavigate } from "react-router-dom";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutApi } from "../../../api/AuthApi";
import { LOGOUT } from "../../../redux/slice/AuthSlice";
import { queryClient } from "../../../main";
import Swal from "sweetalert2";
import Loading from "../../../pages/client/loading/Loading";
import dayjs from "dayjs";

const SideBar = ({ data }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const logout = () => {
    setLoading(true);
    logoutApi()
      .then(() => {
        dispatch(LOGOUT());
        navigate("/");
        queryClient.removeQueries(["profile"]);
      })
      .catch(() => {
        dispatch(LOGOUT());
        navigate("/");
      })
      .finally(setLoading(false));
  };

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      text: "Do you want to logout",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((data) => {
      if (data.isConfirmed) {
        logout();
      }
    });
  };
  const isOnlyDriver =
    data.profile?.roles.length === 1 && data.profile.roles.includes("driver");
  const today = dayjs().format("YYYY-MM-DD"); // Ngày hôm nay
  const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY-MM-DD"); // 1 tháng trước
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: isOnlyDriver ? "/driver" : "/car-owner",
    },
    {
      text: "Cars Management",
      icon: <CarRentalIcon />,
      path: "/car-owner/car-list",
      disable: isOnlyDriver, //  Ẩn nếu chỉ có "driver"
    },
    {
      text: "Booking Management",
      icon: <ListAltOutlinedIcon />,
      path: isOnlyDriver ? "/driver/request" : "/car-owner/booking-list",
    },
    {
      text: "Voucher Management",
      icon: <DiscountOutlinedIcon />,
      path: "/car-owner/voucher",
      disable: isOnlyDriver, //  Ẩn nếu chỉ có "driver"
    },
    {
      text: "My Wallet",
      icon: <AccountBalanceWalletOutlinedIcon />,
      path: isOnlyDriver
        ? `/driver/wallet?from=${oneMonthAgo}&to=${today}`
        : `/car-owner/wallet?from=${oneMonthAgo}&to=${today}`,
    },
    {
      text: "Report",
      icon: <ReportGmailerrorredOutlinedIcon />,
      path: "/car-owner/feedback-report",
      disable: isOnlyDriver,
    },
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      path: isOnlyDriver ? "/driver/profile" : "/car-owner/profile",
    },
  ];

  const location = useLocation();

  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <Box
      sx={{
        height: "100vh",
        width: "17%",
        position: "fixed",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo + Tên */}
      <Stack
        sx={{
          height: "8vh",
          borderBottom: "1px solid #dddd",
          borderRight: "1px solid #dddd",
        }}
        alignItems="center"
        direction="row"
        justifyContent={"start"}
        pl={"10%"}
        spacing={1}
      >
        <img src={logoDark} width={40} height={40} alt="logo" />
        <Typography
          variant="h6"
          sx={{
            fontStyle: "italic",
            fontWeight: 700,
            color: "#333",
          }}
        >
          Car Rental
        </Typography>
      </Stack>

      {/* Menu */}
      <List sx={{ flexGrow: 1, mt: 2, height: "80%" }}>
        {" "}
        {/* ✅ flexGrow đẩy logout xuống cuối */}
        {menuItems.map((item, index) => {
          const isActive =
            item.path === "/car-owner/car-list"
              ? location.pathname.startsWith("/car-owner/car-list") ||
                location.pathname.includes("/car-owner/add-car") ||
                location.pathname.includes("/car-owner/edit-car")
              : item.path === "/car-owner/booking-list"
              ? location.pathname.startsWith("/car-owner/booking-list") ||
                location.pathname.startsWith("/car-owner/booking/")
              : item.path === "/car-owner/voucher"
              ? location.pathname.startsWith("/car-owner/voucher") ||
                location.pathname.startsWith("/car-owner/add-voucher") ||
                location.pathname.startsWith("/car-owner/edit-voucher")
              : item.path.startsWith("/car-owner/wallet")
              ? location.pathname.startsWith("/car-owner/wallet") // ✅ Sửa ở đây
              : location.pathname === item.path;

          if (!item.disable) {
            return (
              <ListItemButton
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "8px",
                  marginBottom: "8px",
                  paddingLeft: "30px",
                  backgroundColor: isActive ? "primary.main" : "transparent",
                  "&:hover": {
                    backgroundColor: isActive ? "primary.main" : "#f5f5f5",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "#555",
                    minWidth: "35px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: "0.5px",
                    fontSize: "15px",
                    color: isActive ? "white" : "text.primary",
                  }}
                />
              </ListItemButton>
            );
          }
        })}
      </List>

      {/* ✅ Logout luôn nằm cuối */}
      <ListItemButton
        onClick={handleLogout}
        sx={{
          borderTop: "1px solid #ddd",
          paddingLeft: "30px",
          height: "10%",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <ListItemIcon sx={{ color: "#555" }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{
            fontWeight: 500,
            letterSpacing: "0.5px",
            fontSize: "15px",
            color: "text.primary",
          }}
        />
      </ListItemButton>
    </Box>
  );
};

export default SideBar;
