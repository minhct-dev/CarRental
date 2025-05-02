import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

const TransmissionModal = ({ show, handleClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy giá trị transmission từ URL (nếu có)
  const transmissionParam = searchParams.get("transmission") || "";
  const initialTransmissions = transmissionParam
    .toUpperCase()
    .split(",")
    .filter(Boolean);

  // State lưu loại hộp số đã chọn
  const [selectedTransmissions, setSelectedTransmissions] = useState(
    initialTransmissions
  );

  // Xử lý khi thay đổi checkbox
  const handleChange = (type) => {
    setSelectedTransmissions((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  // Khi nhấn Save, cập nhật URL và gửi dữ liệu
  const handleSave = () => {
    const transmissionValue = selectedTransmissions.join(",");

    // Cập nhật URL mà không xóa các params khác
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (transmissionValue) {
        newParams.set("transmission", transmissionValue);
      } else {
        newParams.delete("transmission");
      }
      return newParams;
    });

    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="xs" fullWidth>
      {/* Tiêu đề */}
      <DialogTitle>Select Transmission</DialogTitle>

      {/* Nội dung */}
      <DialogContent>
        <Box>
          <Stack spacing={2}>
            {["MANUAL", "AUTOMATIC"].map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTransmissions.includes(type)}
                    onChange={() => handleChange(type)}
                  />
                }
                label={type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
              />
            ))}
          </Stack>
        </Box>
      </DialogContent>

      {/* Nút hành động */}
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransmissionModal;
