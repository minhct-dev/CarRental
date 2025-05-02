import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DateRange } from "react-date-range";
import dayjs from "dayjs";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DesktopTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSearchParams } from "react-router-dom";

const DateModal = ({ show, handleClose, onSave }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");
  // Lấy giá trị from & to từ URL (nếu có)
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  // Giá trị mặc định: Ngày mai (12:00) đến ngày kia (14:00)
  const tomorrow = dayjs().add(1, "day").startOf("day").hour(12);
  const today = dayjs();
  const dayAfterTomorrow = dayjs().add(2, "day").startOf("day").hour(14);

  // Chuyển đổi từ param hoặc dùng mặc định
  const fromDate = fromParam ? dayjs(fromParam) : tomorrow;
  const toDate = toParam ? dayjs(toParam) : dayAfterTomorrow;

  // State quản lý ngày
  const [range, setRange] = useState([
    {
      startDate: fromDate.toDate(),
      endDate: toDate.toDate(),
      key: "selection",
    },
  ]);
  const getRoundedNow = () => {
    const now = dayjs();
    const minutes = now.minute();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    return now.minute(roundedMinutes).second(0);
  };

  // State quản lý thời gian
  const [pickUpTime, setPickUpTime] = useState(fromDate);
  const [dropOffTime, setDropOffTime] = useState(toDate);

  // Khi nhấn Save, cập nhật URL và gọi onSave
  const handleSave = () => {
    const fromISO = dayjs(range[0].startDate)
      .hour(pickUpTime.hour())
      .minute(pickUpTime.minute())
      .toISOString();

    const toISO = dayjs(range[0].endDate)
      .hour(dropOffTime.hour())
      .minute(dropOffTime.minute())
      .toISOString();

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("from", fromISO);
      newParams.set("to", toISO);
      return newParams;
    });

    if (onSave != null) {
      onSave({ from: fromISO, to: toISO });
    }

    handleClose(); // Đóng modal
  };
  const validateDateTime = () => {
    const startDate = dayjs(range[0].startDate);
    const endDate = dayjs(range[0].endDate);

    const now = dayjs();
    const pickUpDateTime = startDate
      .hour(pickUpTime.hour())
      .minute(pickUpTime.minute());

    const dropOffDateTime = endDate
      .hour(dropOffTime.hour())
      .minute(dropOffTime.minute());

    // Kiểm tra nếu chọn ngày hôm nay và giờ nhận < giờ hiện tại
    if (startDate.isSame(now, "day") && pickUpDateTime.isBefore(now)) {
      setError("Pick up time must be later than current time");
      return false;
    }

    // Nếu ngày giống nhau, drop off phải lớn hơn pick up
    if (startDate.isSame(endDate, "day")) {
      if (!dropOffDateTime.isAfter(pickUpDateTime)) {
        setError("Drop off time must be later than pick up time");
        return false;
      }
    } else if (!endDate.isAfter(startDate)) {
      setError("Drop off date must be after pick up date");
      return false;
    }

    setError(""); // Hợp lệ
    return true;
  };
  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullWidth
      maxWidth="md" // Kích thước của modal (md = medium)
    >
      {/* Tiêu đề */}
      <DialogTitle>Select Date Range</DialogTitle>

      {/* Nội dung */}
      <DialogContent>
        <Stack direction="column" alignItems="center" spacing={2}>
          {/* Chọn khoảng ngày */}
          <DateRange
            editableDateInputs
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
            minDate={today.toDate()} // Chặn chọn ngày trong quá khứ
          />
          {error && (
            <Box color="error.main" fontSize="0.9rem" mt={1}>
              {error}
            </Box>
          )}
          {/* Chọn giờ */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                {/* Giờ bắt đầu */}
                <DesktopTimePicker
                  label="Pick Up Time"
                  value={pickUpTime}
                  onChange={(newValue) => {
                    setPickUpTime(newValue);
                    validateDateTime();
                  }}
                  minutesStep={5}
                  minTime={
                    dayjs(range[0].startDate).isSame(dayjs(), "day")
                      ? getRoundedNow()
                      : dayjs().startOf("day")
                  }
                />

                <DesktopTimePicker
                  label="Drop Off Time"
                  value={dropOffTime}
                  onChange={(newValue) => {
                    setDropOffTime(newValue);
                    validateDateTime();
                  }}
                  minutesStep={5}
                  minTime={
                    dayjs(range[0].endDate).isSame(dayjs(), "day")
                      ? getRoundedNow()
                      : dayjs().startOf("day")
                  }
                />
              </Stack>
            </Box>
          </LocalizationProvider>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        {!error && (
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DateModal;
