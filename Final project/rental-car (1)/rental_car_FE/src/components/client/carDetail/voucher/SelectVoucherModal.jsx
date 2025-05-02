import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import VoucherItem from "./VoucherItem";
import { useQuery } from "@tanstack/react-query";
import { searchVoucher } from "../../../../api/voucherApi";
import { useState } from "react";
import { useParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -20%)",
  width: 700,
  maxHeight: "70vh",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  overflowY: "auto", // Chỉ hiển thị thanh cuộn dọc khi cần
  overflowX: "hidden", // Ẩn hoàn toàn thanh cuộn ngang
  pt: 2,
  px: 4,
  pb: 3,
  scrollbarWidth: "thin", // Firefox: làm thanh cuộn nhỏ
  scrollbarColor: "rgba(0, 0, 0, 0.2) transparent", // Firefox: màu thanh cuộn
};
const SelectVoucherModal = ({
  open,
  handleClose,
  voucher,
  setSelectVoucher,
}) => {
  const { id } = useParams();
  const [code, setCode] = useState("");

  const handleSelectVoucher = (item) => {
    setSelectVoucher(item);
    handleClose();
  };

  const { data, refetch } = useQuery({
    queryKey: ["search-voucher"],
    queryFn: () => searchVoucher(id, code),
    enabled: false,
  });

  const handleSearch = () => {
    if (code != "") {
      refetch();
    }
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style, mx: 2 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Select Voucher
        </Typography>
        <Box sx={{ my: 3, pb: 2, borderBottom: "1px solid #ccc" }}>
          <Stack direction={"column"} spacing={1}>
            <Typography color="text.secondary" variant="body2">
              Enter Code To Search Voucher
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <TextField
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                sx={{ width: "70%" }}
                size="small"
              />
              <Button onClick={handleSearch} sx={{ width: "30%" }}>
                Search Voucher
              </Button>
            </Stack>

            {data && (
              <Box sx={{py:2}}>
                <VoucherItem
                  handleSelectVoucher={handleSelectVoucher}
                  data={data}
                ></VoucherItem>
              </Box>
            )}
          </Stack>
        </Box>
        <Box sx={{ mt: 3, mb: 5 }}>
          <Typography variant="body1" color="text.secondary">
            Select Voucher
          </Typography>
          <Stack sx={{ mt: 2 }} direction={"column"} spacing={2}>
            {voucher?.map((item, index) => {
              return (
                <VoucherItem
                  handleSelectVoucher={handleSelectVoucher}
                  key={index}
                  data={item}
                ></VoucherItem>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default SelectVoucherModal;
