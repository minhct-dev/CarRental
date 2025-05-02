import { Box, Modal } from "@mui/material";
import parse from 'html-react-parser';
import image from "../../../../assets/coupon.png";
const VoucherDetail = ({ data, open, handleClose }) => {
  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: "30px",
    maxHeight: "80vh",
    overflowY: "auto", // Thêm thanh cuộn dọc khi nội dung vượt quá maxHeight
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ width: "100%", height: "400px" }}>
          <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={data?.voucherImageUrl || image} alt="" />
        </Box>

        <Box sx={{ mt: 3 }}>
          {parse(data?.description || "")}
        </Box>
      </Box>
    </Modal>
  );
};

export default VoucherDetail;