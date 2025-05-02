import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { formatVND } from "../../../../helper/function";
import SvgVoucher from "../../carDetail/CarDetailRight/SvgVoucher";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SelectVoucherModal from "../../carDetail/voucher/SelectVoucherModal";
const PreviewBooking = ({ data, selectVoucher, setSelectVoucher }) => {
  let numberDay = dayjs(data.endDate).diff(data.startDate, "day", true);
  const [discount, setDiscount] = useState(0);
  const [openVoucher, setOpenVoucher] = useState(false);
  numberDay = Math.floor(numberDay);
  if (numberDay == 0) {
    numberDay = 1;
  }
  const handleCloseVoucher = () => {
    setOpenVoucher(false);
  };
  useEffect(() => {
    if (selectVoucher != null) {
    
      
      let discountAmount = 0; // Khai báo đúng chỗ
      let subtotal = data.car.basePrice * numberDay;

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
  return (
    <Box
      sx={{
        width: "30%",
        padding: "20px",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        borderRadius: "10px",
        backgroundColor: "white",
       
      }}
    >
      <Box>
        <img
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
          src={data?.car.carImages[0]}
          alt=""
        />
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          mt: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontSize: "25px", fontWeight: "700" }}
        >
          {data?.car.name}
        </Typography>

        <Box sx={{ borderBottom: "1px solid #ccc", pb: 3 }}>
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
                fontSize={"13px"}
                fontWeight={400}
                color="initial"
              >
                {dayjs(data.startDate).format("DD/MM/YYYY HH:mm")}
              </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Stack direction={"column"}>
              <Typography variant="body1" color="initial">
                Drop Off Date
              </Typography>
              <Typography
                variant="body1"
                fontSize={"13px"}
                fontWeight={400}
                color="initial"
              >
                {dayjs(data.endDate).format("DD/MM/YYYY HH:mm")}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        {/* Cột nhận xe */}
        <Stack
          sx={{ borderBottom: "1px solid #ccc", pb: 2 }}
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
              <Typography fontWeight={400} variant="body1" color="initial">
                Base Price:
              </Typography>
              <Typography variant="body1" fontSize={"15px"} color="initial">
                {formatVND(data?.car.basePrice || 0)} /day
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Stack
              spacing={1}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography fontWeight={400} variant="body1" color="initial">
                Deposit:
              </Typography>
              <Typography variant="body1" fontSize={"15px"} color="initial">
                {formatVND(data?.car.deposit || 0)}{" "}
              </Typography>
            </Stack>
          </Box>
          <Box>
            <Stack
              spacing={1}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography fontWeight={400} variant="body1" color="initial">
                Number of day:
              </Typography>
              <Typography variant="body1" fontSize={"15px"} color="initial">
                {numberDay} day
              </Typography>
            </Stack>
          </Box>
        </Stack>

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

        <SelectVoucherModal
          open={openVoucher}
          handleClose={handleCloseVoucher}
          setSelectVoucher={setSelectVoucher}
          voucher={data.listVoucher}
        ></SelectVoucherModal>

        <Box sx={{ mt: 1 }}>
          <Stack spacing={1} direction={"row"} justifyContent={"space-between"}>
            <Typography fontWeight={500} variant="body1" color="initial">
              Total:
            </Typography>
            <Typography
              variant="body1"
              fontWeight={500}
              fontSize={"16px"}
              color="initial"
            >
              {formatVND((data.car.basePrice * numberDay )- discount)}{" "}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default PreviewBooking;
