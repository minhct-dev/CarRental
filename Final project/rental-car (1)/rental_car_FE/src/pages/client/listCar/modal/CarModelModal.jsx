import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const CarModelModal = ({ model, show, handleClose }) => {
  const [selectedModels, setSelectedModels] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");

  // Lấy danh sách model từ URL khi mở modal
  useEffect(() => {
    if (show) {
      const modelsParam = searchParams.get("models");
      setSelectedModels(modelsParam ? modelsParam.split(",").map(Number) : []);
    }
  }, [show, searchParams]);

  // Xử lý tìm kiếm
  const filteredModels = model?.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Xử lý chọn/bỏ chọn model
  const handleToggle = (modelId) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId) // Bỏ chọn nếu đã chọn
        : [...prev, modelId] // Thêm vào danh sách nếu chưa chọn
    );
  };

  // Khi nhấn Save, cập nhật searchParams
  const handleSave = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", 1);
      if (selectedModels.length > 0) {
        params.set("models", selectedModels.join(",")); // Lưu dạng "1,2,3"
      } else {
        params.delete("models");
      }
      return params;
    });
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Tiêu đề */}
      <DialogTitle>Filter By Model</DialogTitle>
      {/* Nội dung */}
      <DialogContent>
        {/* Thanh tìm kiếm */}
        <TextField
          size="small"
          fullWidth
          label="Search Model"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
        />
        {/* Danh sách Models */}
        <FormControl sx={{ width: "100%" }}>
          <Box
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Stack
              direction={"row"}
              justifyContent={"start"}
              alignItems={"center"}
              flexWrap={"wrap"}
            >
              {filteredModels?.map((item) => (
                <Box key={item.id} sx={{ width: "50%" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedModels.includes(item.id)}
                        onChange={() => handleToggle(item.id)}
                      />
                    }
                    label={item.name}
                  />
                </Box>
              ))}
              {filteredModels?.length === 0 && (
                <Box sx={{ textAlign: "center", width: "100%", mt: 2 }}>
                  No models found.
                </Box>
              )}
            </Stack>
          </Box>
        </FormControl>
      </DialogContent>
      {/* Nút Action */}
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

export default CarModelModal;
