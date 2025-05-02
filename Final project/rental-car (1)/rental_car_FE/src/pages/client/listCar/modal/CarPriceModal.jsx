import {
  Box,
  Button,
  Slider,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatVND } from "../../../../helper/function";
import { getMaxPrice } from "../../../../api/carApi";

const CarPriceModal = ({ show, handleClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch maxPrice từ API
  const { data: maxPriceFromDB } = useQuery({
    queryKey: ["max-price"],
    queryFn: getMaxPrice,
  });

  const maxPrice = maxPriceFromDB || 1000000; // Fallback nếu API chưa có dữ liệu

  // Lấy min/max từ URL
  let minPrice = parseInt(searchParams.get("min"));
  let maxSelectedPrice = parseInt(searchParams.get("max"));

  // Kiểm tra min/max có hợp lệ không (phải là số và trong khoảng)
  if (isNaN(minPrice) || minPrice < 0) minPrice = 0;
  if (isNaN(maxSelectedPrice) || maxSelectedPrice > maxPrice)
    maxSelectedPrice = maxPrice;

  // State lưu giá trị slider
  const [priceRange, setPriceRange] = useState([minPrice, maxSelectedPrice]);

  // Khi mở modal, cập nhật giá trị từ URL & API
  useEffect(() => {
    if (show) {
      setPriceRange([minPrice, maxSelectedPrice]);

      // Nếu giá trị trên URL không hợp lệ thì cập nhật lại, nhưng giữ nguyên các param khác
      if (
        parseInt(searchParams.get("min")) !== minPrice ||
        parseInt(searchParams.get("max")) !== maxSelectedPrice
      ) {
        setSearchParams(
          (prev) => {
            const params = new URLSearchParams(prev);
            params.set("page", 1);
            params.set("min", minPrice);
            params.set("max", maxSelectedPrice);
            return params;
          },
          { replace: true }
        );
      }
    }
  }, [
    show,
    minPrice,
    maxSelectedPrice,
    maxPrice,
    searchParams,
    setSearchParams,
  ]);

  // Xử lý thay đổi slider
  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Khi nhấn Save
  const handleSave = () => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("min", priceRange[0]);
        params.set("max", priceRange[1]);
        params.set("page", 1); // Reset về trang 1 khi filter
        return params;
      },
      { replace: true }
    );
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Tiêu đề */}
      <DialogTitle>Filter By Price</DialogTitle>

      {/* Nội dung */}
      <DialogContent>
        <Box>
        <Box sx={{ padding: 2, maxWidth: "400px", margin:"auto" }}>
          {/* Hiển thị giá trị min/max */}
          <Stack justifyContent={"space-between"} direction={"row"}>
            <Typography gutterBottom>{formatVND(priceRange[0])}</Typography>
            <Typography gutterBottom>{formatVND(priceRange[1])}</Typography>
          </Stack>

          {/* Slider chọn khoảng giá */}
          <Slider
            value={priceRange}
            onChange={handleChange}
            min={0}
            max={maxPrice}
            step={50000}
            valueLabelDisplay="auto"
            sx={{ mt: 2 }}
          />
        </Box>
        </Box>
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

export default CarPriceModal;
