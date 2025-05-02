/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { formatVND } from "../../../../helper/function";
import SvgVoucher from "./SvgVoucher";

import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { GO_TO_BOOKING } from "../../../../redux/slice/bookingSlice";
import { useEffect, useState } from "react";
import DateModal from "../../../../pages/client/listCar/modal/DateModal";
import Swal from "sweetalert2";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SelectVoucherModal from "../voucher/SelectVoucherModal";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
const CarDetailPrice = ({ data, id, voucher }) => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [openVoucher, setOpenVoucher] = useState(false);
  const [selectVoucher, setSelectVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const handleCloseVoucher = () => {
    setOpenVoucher(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { profile, login } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ✅ Lấy start_date và end_date từ URL
  const rawStartDate = searchParams.get("from");
  const rawEndDate = searchParams.get("to");

  const startDate = rawStartDate
    ? dayjs(rawStartDate).format("DD/MM/YYYY HH:mm")
    : "--/--/---- --:--";

  const endDate = rawEndDate
    ? dayjs(rawEndDate).format("DD/MM/YYYY HH:mm")
    : "--/--/---- --:--";

  let numberDay = dayjs(rawEndDate).diff(rawStartDate, "day", true);
  numberDay = Math.floor(numberDay);
  if (numberDay == 0) {
    numberDay = 1;
  }

  useEffect(() => {
    if (selectVoucher != null) {
      let discountAmount = 0; // Khai báo đúng chỗ
      let subtotal = data.basePrice * numberDay;

      if (selectVoucher.percentRate > 0) {
        // Nếu voucher có giảm giá theo % thì tính
        let percentAmount = subtotal * (selectVoucher.percentRate / 100);

        if (selectVoucher.maxPrice > 0) {
          discountAmount =
            percentAmount > selectVoucher.maxPrice
              ? selectVoucher.maxPrice
              : percentAmount;
        } else {
          discountAmount = percentAmount;
        }
      } else if (selectVoucher.percentRate == 0) {
        // Nếu voucher giảm giá theo số tiền cố định
        discountAmount = selectVoucher.fixedPrice;
      }

      // Tổng tiền sau khi giảm
      setDiscount(discountAmount);
    } else {
      setDiscount(0);
    }
  }, [selectVoucher]);

  const handleBooking = () => {
    if (!login) {
      Swal.fire({
        icon: "error",
        title: "Login Infomation",
        text: "Please login to retal car",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Go To Login",
        reverseButtons: true,
      }).then((r) => {
        if (r.isConfirmed) {
          navigate("/auth?page=login");
        }
      });
      return;
    }

    if (profile.status == "INACTIVE") {
      Swal.fire({
        icon: "error",
        title: "Account Infomation",
        text: "Your account is not eligible to rent a car. Please update your profile to rent a car.  ",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Go To Profile",
        reverseButtons: true,
      }).then((r) => {
        if (r.isConfirmed) {
          navigate("/profile");
        }
      });
      return;
    }

    // Lấy từ raw value thay vì giá trị đã format
    let startIos = dayjs(rawStartDate).toISOString();
    let endIos = dayjs(rawEndDate).toISOString();

    dispatch(
      GO_TO_BOOKING({ data, startIos, endIos, id, selectVoucher, voucher })
    );
    navigate("/booking");
  };
  return (
    <Stack direction={"column"} spacing={1}>
      <Box
        sx={{
          backgroundColor: "white",
          p: 3,
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontSize: "25px", fontWeight: "700" }}
        >
          {formatVND(data?.basePrice || 0)}{" "}
          <span style={{ fontSize: "15px", fontWeight: 500, color: "#767268" }}>
            / Day
          </span>
        </Typography>

        <Box
          sx={{ borderBottom: "1px solid #ccc", pb: 3, cursor: "pointer" }}
          onClick={() => setOpen(true)}
        >
          <Stack
            sx={{
              border: "0.5px solid black",
              borderRadius: "10px",
              p: 2,
              mt: 2,
            }}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Stack direction={"column"}>
              <Typography variant="body1" color="initial">
                Pick Up Date
              </Typography>
              <Typography
                variant="body1"
                fontSize={"14px"}
                fontWeight={400}
                color="initial"
              >
                {startDate}
              </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Stack direction={"column"}>
              <Typography variant="body1" color="initial">
                Drop Off Date
              </Typography>
              <Typography
                variant="body1"
                fontSize={"14px"}
                fontWeight={400}
                color="initial"
              >
                {endDate}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Cột giá, deposit, trạng thái */}
        <Stack
          sx={{ borderBottom: "1px solid #ccc", pb: 3 }}
          direction={"column"}
          spacing={1}
          mt={2}
        >
          <Box>
            <Stack
              spacing={1}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="body1" color="initial">
                Base Price:
              </Typography>
              <Typography
                variant="body1"
                fontSize={"15px"}
                fontWeight={400}
                color="initial"
              >
                {formatVND(data?.basePrice || 0)} /day
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Stack
              spacing={1}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="body1" color="initial">
                Deposit:
              </Typography>
              <Typography
                variant="body1"
                fontSize={"15px"}
                fontWeight={400}
                color="initial"
              >
                {formatVND(data?.deposit || 0)}
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Stack
              spacing={1}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="body1" color="initial">
                Status:
              </Typography>
              <Typography
                variant="body1"
                fontSize={"15px"}
                fontWeight={400}
                color={data?.status.toLowerCase() == "booked" ? "red" : "green"}
              >
                {data?.status}
              </Typography>
            </Stack>
          </Box>

          {data?.status.toLowerCase() == "booked" && (
            <Box>
              <Box>
                <Stack
                  spacing={1}
                  direction={"row"}
                  justifyContent={"space-between"}
                >
                  <Typography variant="body1" color="initial">
                    Start Book Time:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontSize={"15px"}
                    fontWeight={400}
                    color={
                      data?.status.toLowerCase() == "booked" ? "red" : "green"
                    }
                  >
                    {dayjs(data?.book_start_date).format("DD-MM-YYYY HH:mm")}
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Stack
                  spacing={1}
                  direction={"row"}
                  justifyContent={"space-between"}
                >
                  <Typography variant="body1" color="initial">
                    End Book Time:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontSize={"15px"}
                    fontWeight={400}
                    color={
                      data?.status.toLowerCase() == "booked" ? "red" : "green"
                    }
                  >
                    {dayjs(data?.book_end_date).format("DD-MM-YYYY HH:mm")}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          )}
        </Stack>

        <Stack
          sx={{ borderBottom: "1px solid #ccc", py: 2 }}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Typography variant="body1" color="initial">
            SubTotal :
          </Typography>
          <Typography variant="body1" color="initial">
            {formatVND(data.basePrice)} x {numberDay} Day
          </Typography>
        </Stack>

        {/* Chọn voucher */}

        {selectVoucher == null ? (
          <Button
            onClick={() => setOpenVoucher(true)}
            sx={{ borderBottom: "1px solid #ccc", pb: 2, width: "100%" }}
          >
            <Stack
              sx={{ width: "100%" }}
              direction={"row"}
              justifyContent={"space-between"}
              mt={2}
            >
              <Stack direction={"row"} spacing={2}>
                <SvgVoucher />
                <Typography
                  fontSize={"15px"}
                  fontWeight={400}
                  variant="body1"
                  color="initial"
                >
                  Select voucher
                </Typography>
              </Stack>
              <ChevronRightIcon sx={{ color: "text.secondary" }} />
            </Stack>
          </Button>
        ) : (
          <Stack
            sx={{ width: "100%" }}
            direction={"row"}
            justifyContent={"space-between"}
            my={3}
          >
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <SvgVoucher />
              <Typography
                fontSize={"15px"}
                fontWeight={400}
                variant="body1"
                color="initial"
              >
                Code: <b>{selectVoucher.code}</b>
              </Typography>
              <IconButton
                onClick={() => setSelectVoucher(null)}
                aria-label="delete"
                size="small"
              >
                <CloseOutlinedIcon fontSize="inherit" />
              </IconButton>
            </Stack>
            <Typography variant="body1" color="initial">
              - {formatVND(discount)}
            </Typography>
          </Stack>
        )}

        {/* Tổng giá */}
        <Box sx={{ mt: 1 }}>
          <Stack spacing={1} direction={"row"} justifyContent={"space-between"}>
            <Typography variant="body1" color="initial">
              Total:
            </Typography>
            <Typography
              variant="body1"
              fontSize={"16px"}
              fontWeight={500}
              color="initial"
            >
              {formatVND(data?.basePrice * numberDay - discount || 0)}
            </Typography>
          </Stack>
        </Box>

        <DateModal show={open} handleClose={handleClose}></DateModal>
        <SelectVoucherModal
          voucher={voucher}
          open={openVoucher}
          setSelectVoucher={setSelectVoucher}
          handleClose={handleCloseVoucher}
        ></SelectVoucherModal>

        <Button
          disabled={data?.status.toLowerCase() == "booked"}
          onClick={handleBooking}
          sx={{ width: "100%", mt: 2 }}
          variant="contained"
        >
          Booking now
        </Button>
      </Box>

      <Box sx={{ border: "1px solid #ccc", borderRadius: "10px" }}>
        <Box sx={{ padding: "20px" }}>
          <Typography variant="h6">Additional Fees</Typography>

          <Stack
            direction={"row"}
            sx={{ mt: 2 }}
            alignItems={"start"}
            spacing={1}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: "18px", color: "text.secondary" }}
            ></ErrorOutlineIcon>
            <Stack direction={"column"} spacing={0.5}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography
                  sx={{ fontSize: "15px" }}
                  variant="body1"
                  color="initial"
                >
                  Overtime Fee
                </Typography>
                <Typography
                  sx={{ color: "#5fcf86" }}
                  variant="body1"
                  color="initial"
                >
                  {formatVND(data?.late_fee)}/ 1 Hour
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "text.secondary",
                }}
                variant="body1"
              >
                Additional fee will apply for late return. If the delay exceeds
                1 hours, an extra one-day rental fee will be charged.
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default CarDetailPrice;
