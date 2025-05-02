/* eslint-disable react/prop-types */
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../../redux/slice/AuthSlice";
import { logoutApi } from "../../../api/AuthApi";
import { queryClient } from "../../../main";
import Swal from "sweetalert2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getNotifyMessageApi } from "../../../api/chatApi";
const HeaderAvatar = ({ home, data }) => {
  const { data: notifyApi, isError } = useQuery({
    queryKey: ["notify-message"],
    queryFn: getNotifyMessageApi,
  });



  useEffect(() => {
    if (notifyApi && !isError) {
      setNotify(notifyApi.length);
    }
  }, [notifyApi]);

  const socket = useSelector((state) => state.stomps.client);
  const profile = useSelector((state) => state.auth.profile);
  const [notify, setNotify] = useState(0);
  useEffect(() => {
    if (!socket || !profile) return;
    const subscription = socket.subscribe(
      `/user/${profile.id}/queue/notify`,
      (message) => {
        let payload = JSON.parse(message.body)
        if(payload.type == "seen"){
          setNotify(prev => prev - payload.numberOfSeenMessages);
        }
        else{
          setNotify(prev => prev + 1);
        }
      }
    );
    return () => {
      subscription.unsubscribe(); // cleanup tránh leak socket
    };
  }, [socket, profile]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const today = dayjs().format("YYYY-MM-DD"); // Ngày hôm nay
  const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY-MM-DD"); // 1 tháng trước
  const logout = () => {
    logoutApi()
      .then(() => {
        dispatch(LOGOUT());
        navigate("/");
        queryClient.removeQueries(["profile"]);
      })
      .catch(() => {
        dispatch(LOGOUT());
        navigate("/");
      });
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
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        gap: "5px",
        alignItems: "center",
      }}
    >
      <Box onClick={() => navigate("/chat")}>
        <Badge
          badgeContent={notify}
          sx={{ mt: "5px", cursor: "pointer" }}
          color="primary"
        >
          <MailOutlineIcon sx={{ color: home ? "action" : "white" }} />
        </Badge>
      </Box>
      <Button
        onClick={handleClick}
        endIcon={
          <ArrowDropDownIcon
            sx={{ color: home ? "primary.main" : "white" }}
          ></ArrowDropDownIcon>
        }
      >
        <Stack
          sx={{ cursor: "pointer" }}
          direction={"row"}
          alignItems={"center"}
          spacing={1}
        >
          <Avatar
            alt="Remy Sharp"
            src={data.avatarUrl}
            sx={{ width: 35, height: 35 }}
          />
          <Typography
            sx={{ fontSize: "15px", color: home ? "text.primary" : "white" }}
            variant="body1"
            color="initial"
          >
            {data.name}
          </Typography>
        </Stack>
      </Button>

      {open && (
        <Box
          onClick={handleClose}
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 3,
          }}
        ></Box>
      )}
      <Box
        sx={{
          position: "absolute",
          top: open ? "95%" : "30%",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          zIndex: 9999,
          width: "180px",
          transition: "all 0.3s ease",
          right: "-10%",
          backgroundColor: "white",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ fontWeight: 400, fontSize: "15px" }}>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={"/profile"}
            >
              Profile
            </Link>
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <AccountBalanceWalletIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={`/wallet?from=${oneMonthAgo}&to=${today}`}
            >
              My wallet
            </Link>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ fontWeight: 400, fontSize: "15px" }}>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={"/my-booking"}
            >
              My Booking
            </Link>
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Box>
    </Box>
  );
};

export default HeaderAvatar;
