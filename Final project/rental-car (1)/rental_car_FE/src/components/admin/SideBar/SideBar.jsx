import { Box, Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutApi } from "../../../api/AuthApi";
import { queryClient } from "../../../main";
import { LOGOUT } from "../../../redux/slice/AuthSlice";
import { useState } from "react";
import Loading from "../../../pages/client/loading/Loading";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

const SideBar = ({ toggle }) => {
  const [loading, setLoading] = useState(false);
  const today = dayjs().format("YYYY-MM-DD"); // Ngày hôm nay
  const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY-MM-DD"); // 1 tháng trước
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <Box
      sx={{
        pl: "20px",
        position: "fixed",
        paddingTop: "100px",
        backgroundColor: "white",
        width: toggle ? "75px" : "270px",
        transition: "all 0.3s",
        height: "100vh",
      }}
    >
      {/* DASHBOARD */}
      <Box sx={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        {!toggle && (
          <Stack direction={"column"}>
            <Typography variant="body1" color="initial">
              Dashboard
            </Typography>
          </Stack>
        )}

        <NavLink to="/admin" style={{ textDecoration: "none" }}>
          <Box sx={{ mt: 2 }}>
            <Stack
              sx={{
                backgroundColor:
                  location.pathname === "/admin" ? "#ede7f6" : "white",
                padding: "15px",
                borderRadius: "10px",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ede7f6",
                },
              }}
              direction={"row"}
              spacing={2}
              alignItems={"center"}
            >
              <DashboardIcon
                sx={{
                  color:
                    location.pathname === "/admin" ? "#5e35b1" : "text.primary",
                }}
              />
              {!toggle && (
                <Typography
                  fontWeight={400}
                  variant="body1"
                  color={
                    location.pathname === "/admin" ? "#5e35b1" : "text.primary"
                  }
                >
                  Dashboard
                </Typography>
              )}
            </Stack>
          </Box>
        </NavLink>
      </Box>

      {/* MANAGEMENT */}
      <Box sx={{ mt: 3 }}>
        {!toggle && (
          <Stack direction={"column"}>
            <Typography variant="body1" color="initial">
              Management
            </Typography>
          </Stack>
        )}

        {/* Car Management */}
        <NavLink to="/admin/car-management" style={{ textDecoration: "none" }}>
          <Box sx={{ mt: 2 }}>
            <Stack
              sx={{
                backgroundColor:
                  location.pathname === "/admin/car-management" ||
                  location.pathname.startsWith("/admin/car-detail")
                    ? "#ede7f6"
                    : "white",
                padding: "15px",
                borderRadius: "10px",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ede7f6",
                },
              }}
              direction={"row"}
              spacing={2}
              alignItems={"center"}
            >
              <DirectionsCarIcon
                sx={{
                  color:
                    location.pathname === "/admin/car-management" ||
                    location.pathname.startsWith("/admin/car-detail")
                      ? "#5e35b1"
                      : "text.primary",
                }}
              />
              <Typography
                variant="body1"
                fontWeight={400}
                fontSize={"15px"}
                sx={{
                  opacity: toggle ? 0 : 1,
                  whiteSpace: "nowrap",
                  minWidth: toggle ? 0 : "120px",
                  color:
                    location.pathname === "/admin/car-management" ||
                    location.pathname.startsWith("/admin/car-detail")
                      ? "#5e35b1"
                      : "text.primary",
                }}
              >
                Car Management
              </Typography>
            </Stack>
          </Box>
        </NavLink>
        {/* User Management */}
        <NavLink to="/admin/user-management" style={{ textDecoration: "none" }}>
          <Box sx={{ mt: 0 }}>
            <Stack
              sx={{
                backgroundColor:
                  location.pathname === "/admin/user-management"
                    ? "#ede7f6"
                    : "white",
                padding: "15px",
                borderRadius: "10px",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ede7f6",
                },
              }}
              direction={"row"}
              spacing={2}
              alignItems={"center"}
            >
              <PersonOutlineIcon
                sx={{
                  color:
                    location.pathname === "/admin/user-management"
                      ? "#5e35b1"
                      : "text.primary",
                  transition: "0.3s",
                  "&:hover": { color: "#5e35b1" },
                }}
              />
              <Typography
                variant="body1"
                fontWeight={400}
                fontSize={"15px"}
                sx={{
                  opacity: toggle ? 0 : 1,
                  whiteSpace: "nowrap",
                  minWidth: toggle ? 0 : "120px",
                  color:
                    location.pathname === "/admin/user-management"
                      ? "#5e35b1"
                      : "text.primary",
                }}
              >
                User Management
              </Typography>
            </Stack>
          </Box>
        </NavLink>

        {/* Voucher Management */}
        <NavLink to="/admin/voucher" style={{ textDecoration: "none" }}>
          <Box sx={{ mt: 0 }}>
            <Stack
              sx={{
                backgroundColor:
                  location.pathname === "/admin/voucher" ||
                  location.pathname === "/admin/add-voucher" ||
                  location.pathname.startsWith("/admin/edit-voucher")
                    ? "#ede7f6"
                    : "white",
                padding: "15px",
                borderRadius: "10px",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ede7f6",
                },
              }}
              direction={"row"}
              spacing={2}
              alignItems={"center"}
            >
              <LibraryBooksIcon
                sx={{
                  color:
                    location.pathname === "/admin/voucher" ||
                    location.pathname === "/admin/add-voucher" ||
                    location.pathname.startsWith("/admin/edit-voucher")
                      ? "#5e35b1"
                      : "text.primary",
                }}
              />
              <Typography
                variant="body1"
                fontWeight={400}
                fontSize={"15px"}
                sx={{
                  opacity: toggle ? 0 : 1,
                  whiteSpace: "nowrap",
                  minWidth: toggle ? 0 : "120px",
                  color:
                    location.pathname === "/admin/voucher" ||
                    location.pathname === "/admin/add-voucher" ||
                    location.pathname.startsWith("/admin/edit-voucher")
                      ? "#5e35b1"
                      : "text.primary",
                }}
              >
                Voucher Management
              </Typography>
            </Stack>
          </Box>
        </NavLink>
      </Box>

      {/* MANAGEMENT */}
      <Box sx={{ mt: 3 }}>
        {!toggle && (
          <Stack direction={"column"}>
            <Typography variant="body1" color="initial">
              Profile
            </Typography>
          </Stack>
        )}

        <NavLink
          to={`/admin/wallet?from=${oneMonthAgo}&to=${today}`}
          style={{ textDecoration: "none" }}
        >
          <Box sx={{ mt: 0 }}>
            <Stack
              sx={{
                backgroundColor: location.pathname.startsWith("/admin/wallet")
                  ? "#ede7f6"
                  : "white",
                padding: "15px",
                borderRadius: "10px",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ede7f6",
                },
              }}
              direction={"row"}
              spacing={2}
              alignItems={"center"}
            >
              <AccountBalanceWalletIcon
                sx={{
                  color: location.pathname.startsWith("/admin/wallet")
                    ? "#5e35b1"
                    : "text.primary",
                  transition: "0.3s",
                }}
              />
              {!toggle && (
                <Typography
                  variant="body1"
                  fontWeight={400}
                  fontSize={"15px"}
                  sx={{
                    transition: "0.3s",
                    color: location.pathname.startsWith("/admin/wallet")
                      ? "#5e35b1"
                      : "text.primary",
                  }}
                >
                  Wallet
                </Typography>
              )}
            </Stack>
          </Box>
        </NavLink>
        <Box sx={{ mt: 0 }} onClick={handleLogout}>
          <Stack
            sx={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "10px",
              transition: "0.3s",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#ede7f6",
              },
            }}
            direction={"row"}
            spacing={2}
            alignItems={"center"}
          >
            <LogoutIcon
              sx={{
                color: "text.primary",
                transition: "0.3s",
                "&:hover": { color: "#5e35b1" },
              }}
            />
            {!toggle && (
              <Typography
                variant="body1"
                fontWeight={400}
                fontSize={"15px"}
                sx={{ transition: "0.3s", "&:hover": { color: "#5e35b1" } }}
              >
                Logout
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default SideBar;
