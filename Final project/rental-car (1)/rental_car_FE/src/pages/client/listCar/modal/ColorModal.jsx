import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ColorModal = ({ color, show, handleClose }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy danh sách màu từ param khi mở modal
  useEffect(() => {
    if (show) {
      const colorsParam = searchParams.get("colors");
      setSelectedColors(colorsParam ? colorsParam.split(",") : []);
    }
  }, [show, searchParams]);

  // Xử lý chọn/bỏ chọn checkbox
  const handleToggle = (colorValue) => {
    setSelectedColors(
      (prev) =>
        prev.includes(colorValue)
          ? prev.filter((item) => item !== colorValue) // Bỏ màu nếu đã chọn
          : [...prev, colorValue] // Thêm màu nếu chưa chọn
    );
  };

  // Khi nhấn Save, lưu danh sách vào searchParams
  const handleSave = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", 1);
      if (selectedColors.length > 0) {
        params.set("colors", selectedColors.join(",")); // Lưu thành chuỗi "red,blue,green"
      } else {
        params.delete("colors"); // Xóa nếu không chọn màu nào
      }
      return params;
    });
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Tiêu đề */}
      <DialogTitle>Filter By Color</DialogTitle>

      {/* Nội dung */}
      <DialogContent>
        <FormControl sx={{ width: "100%" }}>
          <Grid2 container spacing={2}>
            {color?.map((item, index) => (
              <Grid2 key={index} size={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedColors.includes(item)}
                      onChange={() => handleToggle(item)}
                    />
                  }
                  label={item}
                />
              </Grid2>
            ))}
          </Grid2>
        </FormControl>
      </DialogContent>

      {/* Nút hành động */}
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorModal;
