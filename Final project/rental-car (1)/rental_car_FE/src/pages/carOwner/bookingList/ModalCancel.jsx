import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { handleCancelBookingCarOwnerApi } from "../../../api/bookingApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const ModalCancel = ({ open, handleClose, cancelBooking, setCancelBooking }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [err, setErr] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => handleCancelBookingCarOwnerApi(data),
    onSuccess: () => {
      // Đóng loading và hiện thông báo success
      queryClient.refetchQueries(['bookings'])
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Handle Booking Success",
      });
    },
    onError: (e) => {
      console.log(e);
      // Đóng loading và hiện thông báo lỗi
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message || "Handle Booking Failed",
      });
    },
  });

  const handleSave = () => {
    if (!selectedOption) {
      setErr("Please select an option before saving!");
      return;
    }
    handleCloseCancel();
    // Hiển thị Swal loading khi bắt đầu call API
    Swal.fire({
      title: "Processing...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Hiện loading khi gọi API
      },
    });

    let data = {
      bookingId: cancelBooking,
      choice: selectedOption,
    };

    mutate(data);
  };

  const handleCloseCancel = () => {
    setSelectedOption(null);
    setErr(null);
    setCancelBooking(null);
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Handle Cancel
          </Typography>
          {err && <Alert sx={{ my: 1 }} severity="error">{err}</Alert>}
          <Stack sx={{ my: 2 }} direction={"column"} spacing={1}>
            <Typography
              variant="body1"
              fontSize={"14px"}
              fontWeight={400}
              color="initial"
            >
              The customer wants to cancel this order. You have three options to
              handle it.
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select option
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                label="Select option"
              >
                <MenuItem value={1}>
                  Agree to cancel and refund the deposit
                </MenuItem>
                <MenuItem value={2}>
                  Agree to cancel but do not refund the deposit.
                </MenuItem>
                <MenuItem value={3}>Decline the cancellation.</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={"row"} spacing={2} justifyContent={"end"}>
            <Button onClick={handleCloseCancel} variant="contained" disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={isLoading}>
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalCancel;
