import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const CarBrandModal = ({ brand, show, handleClose }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");

  // Lấy brand từ searchParams khi mở modal
  useEffect(() => {
    if (show) {
      const brandParam = searchParams.get("brand");
      setSelectedBrand(brandParam || "0");
    }
  }, [show, searchParams]);

  // Khi chọn radio, cập nhật state
  const handleChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  // Khi nhấn "Save Changes", cập nhật searchParams
  const handleSave = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", 1);
      if (selectedBrand && selectedBrand !== "0") {
        params.set("brand", selectedBrand);
      } else {
        params.delete("brand");
        params.delete("models");
      }
      return params;
    });
    handleClose();
  };

  // Lọc brand theo text search
  const filteredBrands = brand
    ? brand.filter((b) =>
        b.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter By Brand</DialogTitle>
      <DialogContent>
        {/* Thanh tìm kiếm */}
        <TextField
          label="Search Brand"
          variant="outlined"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {/* Danh sách Brand */}
        <FormControl sx={{ width: "100%" }}>
          <Box
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <RadioGroup value={selectedBrand} onChange={handleChange}>
              <Stack
                direction={"row"}
                justifyContent={"center"}
                flexWrap={"wrap"}
              >
                {/* Tất cả Brand */}
                <Box sx={{ width: "50%" }}>
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label={"All Brand"}
                  />
                </Box>
                {/* Danh sách Brand */}
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((item, index) => (
                    <Box key={index} sx={{ width: "50%" }}>
                      <FormControlLabel
                        value={item.id.toString()}
                        control={<Radio />}
                        label={item.name}
                      />
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", width: "100%" }}>
                    No brands found.
                  </Box>
                )}
              </Stack>
            </RadioGroup>
          </Box>
        </FormControl>
      </DialogContent>
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

export default CarBrandModal;
