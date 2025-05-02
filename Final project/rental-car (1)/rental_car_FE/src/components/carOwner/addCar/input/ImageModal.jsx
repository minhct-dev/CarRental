import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useRef } from "react";
import CropImage from "./CropImage";

const ImageModal = ({ handleClose, show, handleSave }) => {
  const cropImageRef = useRef(); // Tạo ref để gọi hàm từ component con

  const handleSaveImage = () => {
    if (cropImageRef.current) {
      cropImageRef.current.onCropDone(); // Gọi hàm onCropDone từ CropImage
    }
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Car Images</DialogTitle>
      <DialogContent>
        <CropImage ref={cropImageRef} handleSave={handleSave} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button onClick={handleSaveImage} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageModal;
