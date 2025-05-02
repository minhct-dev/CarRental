/* eslint-disable react/prop-types */
import { Box, Stack, Typography } from "@mui/material";
import { formatVND } from "../../../../helper/function";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CarDetailPrice = ({ data }) => {
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
        </Stack>

        {/* Chọn voucher */}

        {/* Tổng giá */}
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
                  {formatVND(data?.lateFee)}/ 1 Hour
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
