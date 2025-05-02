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

const FuelTypeModal = ({ show, handleClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy giá trị fuel từ URL (nếu có)
  const fuelParam = searchParams.get("fuel") || "";
  const initialFuelTypes = fuelParam.toUpperCase().split(",").filter(Boolean); // Chuyển thành enum chuẩn

  // State lưu loại nhiên liệu đã chọn
  const [selectedFuels, setSelectedFuels] = useState(initialFuelTypes);

  // Xử lý khi thay đổi checkbox
  const handleChange = (type) => {
    setSelectedFuels((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type) // Bỏ chọn nếu đã chọn
        : [...prev, type] // Thêm vào nếu chưa chọn
    );
  };

  // Khi nhấn Save, cập nhật URL và gửi dữ liệu
  const handleSave = () => {
    const fuelValue = selectedFuels.join(",");

    // Cập nhật URL mà không xóa các params khác
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (fuelValue) {
        newParams.set("fuel", fuelValue);
      } else {
        newParams.delete("fuel");
      }
      return newParams;
    });
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="xs" fullWidth>
      {/* Tiêu đề */}
      <DialogTitle>Select Fuel Type</DialogTitle>

      {/* Nội dung */}
      <DialogContent>
        <Box>
          <Stack spacing={2}>
            {["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"].map((fuel) => (
              <FormControlLabel
                key={fuel}
                control={
                  <Checkbox
                    checked={selectedFuels.includes(fuel)}
                    onChange={() => handleChange(fuel)}
                  />
                }
                label={fuel.toLowerCase()}
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

export default FuelTypeModal;
