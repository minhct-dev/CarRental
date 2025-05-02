import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import image from "../../../assets/coupon.png";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { formatVND } from "../../../helper/function";
import DiscountIcon from "@mui/icons-material/Discount";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  activeDisplayVoucherApi,
  activeVoucherApi,
  deActiveDisplayVoucherApi,
  deActiveVoucherApi,
  deleteVoucherApi,
} from "../../../api/voucherApi";
import { queryClient } from "../../../main";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "primary.main",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
const VoucherCard = ({ data }) => {
  const profile = useSelector((state) => state.auth.profile);

  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: () => {
      if (data.status == "INACTIVE") {
        return activeVoucherApi(data.voucherId);
      } else {
        return deActiveVoucherApi(data.voucherId);
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries(["list-voucher-owner"]);
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
      });
    },
  });
  const { mutate: activeDisplay } = useMutation({
    mutationFn: () => {
      if (data.homepageDisplay) {
        return deActiveDisplayVoucherApi(data.voucherId);
      } else {
        return activeDisplayVoucherApi(data.voucherId);
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries(["list-voucher-admin"]);
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
      });
    },
  });

  const { mutate: deleteApi } = useMutation({
    mutationFn: () => deleteVoucherApi(data.voucherId),
    onSuccess: () => {
      queryClient.refetchQueries(["list-voucher-owner"]);
      Swal.fire({
        icon: "success",
        text: "Delete Success",
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
      });
    },
  });

  const handleDelete = () => {
    Swal.fire({
      icon: "question",
      text: "Are you sure ?",
      showConfirmButton: true,
      showCancelButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteApi();
      }
    });
  };

  const [isActive, setIsActive] = useState(data.status === "ACTIVE");
  const [isDisplay, setIsDisplay] = useState(data.homepageDisplay);
  const handleSwitchChange = () => {
    if (data.status == "INACTIVE") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }

    mutate();
  };

  const handleSwitchDisplay = () => {
    setIsDisplay(!isDisplay);
    activeDisplay();
  };
  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY") : "All Date";

  const details = [
    {
      icon: <DiscountIcon sx={{ color: "primary.main", fontSize: "20px" }} />,
      label: "Code",
      value: data.code,
      show: true,
    },
    {
      icon: <DateRangeIcon sx={{ color: "primary.main", fontSize: "20px" }} />,
      label: "Date",
      value:
        data.startDate || data.endDate
          ? `${formatDate(data.startDate)} - ${formatDate(data.endDate)}`
          : "All Date",
      show: true,
    },
    {
      icon: (
        <ManageHistoryIcon sx={{ color: "primary.main", fontSize: "20px" }} />
      ),
      label: "Quantity",
      value: data.quantity === -1 ? "Unlimited" : data.quantity,
      show: true,
    },
    {
      icon: <PercentIcon sx={{ color: "primary.main", fontSize: "20px" }} />,
      label: "Percent Rate",
      value: `${data.percentRate}%`,
      show: data.percentRate != 0 ? true : false,
    },
    {
      icon: (
        <AttachMoneyIcon sx={{ color: "primary.main", fontSize: "20px" }} />
      ),
      label: "Max Price",
      value: formatVND(data.maxPrice),
      show: data.maxPrice != 0 ? true : false,
    },
    {
      icon: (
        <AttachMoneyIcon sx={{ color: "primary.main", fontSize: "20px" }} />
      ),
      label: "Discount Amount",
      value: formatVND(data.fixedPrice),
      show: data.percentRate == 0 ? true : false,
    },
  ];

  const handleUpdate = () => {
    if (profile.roles.includes("admin")) {
      navigate("/admin/edit-voucher/" + data.voucherId);
    } else {
      navigate("/car-owner/edit-voucher/" + data.voucherId);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "90%",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        borderRadius: "10px",
        height: profile.roles.includes("admin") ? "600px" : "550px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ height: "200px" }}
      >
        <img
          style={{
            width: data.imageUrl ? "100%" : "50px",
            height: data.imageUrl ? "100%" : "50px",
            objectFit: "cover",
          }}
          src={data.imageUrl || image}
          alt="Voucher"
        />
      </Stack>

      <Box
        sx={{
          padding: "0px 20px 20px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          flexGrow: 1,
          mt: 2,
        }}
      >
        <Typography variant="h6" fontSize={"18px"}>
          {data.name}
        </Typography>

        {profile.roles.includes("admin") && (
          <Stack
            sx={{ mt: 2 }}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: isDisplay ? "green" : "red",
                  borderRadius: "50%",
                }}
              ></Box>
              <Typography color={isDisplay ? "green" : "red"} variant="body2">
                Display in Home Page
              </Typography>
            </Stack>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <IOSSwitch checked={isDisplay} onChange={handleSwitchDisplay} />
              }
            />
          </Stack>
        )}

        <Stack
          sx={{ mt: 2 }}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Box
              sx={{
                width: "10px",
                height: "10px",
                backgroundColor: data.status === "ACTIVE" ? "green" : "red",
                borderRadius: "50%",
              }}
            ></Box>
            <Typography
              color={data.status === "ACTIVE" ? "green" : "red"}
              variant="body2"
            >
              {data.status.substring(0, 1).toUpperCase() +
                data.status.substring(1).toLowerCase()}
            </Typography>
          </Stack>
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <IOSSwitch checked={isActive} onChange={handleSwitchChange} />
            }
          />
        </Stack>

        <Stack direction={"column"} spacing={2} sx={{ mt: 4 }}>
          {details.map((item, index) => {
            if (item.show) {
              return (
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  key={index}
                >
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    {item.icon}
                    <Typography variant="body2">{item.label}</Typography>
                  </Stack>
                  <Typography variant="body2">{item.value}</Typography>
                </Stack>
              );
            }
          })}
        </Stack>
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"end"}
        spacing={2}
        sx={{ padding: "0 20px 20px 20px" }}
      >
        <Button onClick={handleUpdate} variant="contained">
          Update
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
      </Stack>
    </Box>
  );
};

export default VoucherCard;
