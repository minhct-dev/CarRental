/* eslint-disable react/prop-types */
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { topUpApi, widthDrawApi } from "../../../api/walletApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";

const formatNumber = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const WalletModel = ({ show, closeModal, title, balance, type }) => {
  const { mutate: topUpMutate } = useMutation({
    mutationFn: (data) => topUpApi(data),
    onSuccess: () => {
      queryClient.refetchQueries(["profile"]);
      closeModal();
      Swal.fire({ icon: "success", text: "Top up success" });
    },
    onError: () => {
      Swal.fire({ icon: "error", text: "Top up failed, please try again" });
    },
  });

  const { mutate: widthDrawMutate } = useMutation({
    mutationFn: (data) => widthDrawApi(data),
    onSuccess: () => {
      queryClient.refetchQueries(["profile"]);
      closeModal();
      Swal.fire({ icon: "success", text: "Withdrawal successful" });
    },
    onError: () => {
      Swal.fire({ icon: "error", text: "Withdrawal failed, please try again" });
    },
  });

  const amounts = [
    { label: "100,000 VND", value: 100000 },
    { label: "200,000 VND", value: 200000 },
    { label: "500,000 VND", value: 500000 },
    { label: "1,000,000 VND", value: 1000000 },
    { label: "2,000,000 VND", value: 2000000 },
    { label: "5,000,000 VND", value: 5000000 },
    { label: "10,000,000 VND", value: 10000000 },
    { label: "20,000,000 VND", value: 20000000 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [err, setErr] = useState(null);

  const handleAmountChange = (event, value) => {
    if (value) {
      setInputValue(formatNumber(value.value.toString()));
    }
  };

  const handleInputChange = (e, newInputValue) => {
    let rawValue = newInputValue.replace(/\./g, "");
    setInputValue(formatNumber(rawValue));
  };

  const handleSubmit = () => {
    let rawValue = inputValue.replace(/\./g, "").replace(/[^0-9]/g, "");
    let amount = parseInt(rawValue);
    
    if (type === 2) {
      if (balance - amount >= 0) {
        widthDrawMutate({ amount });
      } else {
        setErr("The balance in the wallet is insufficient to withdraw");
      }
    } else {
      topUpMutate({ amount });
    }
  };

  return (
    <Modal open={show} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        <Typography textAlign="center" color="text.secondary" fontWeight={400}>
          Your current balance is {balance?.toLocaleString()} VND. Please select an
          amount to {type === 1 ? "top up" : "withdraw"}.
        </Typography>
        <Autocomplete
          onChange={handleAmountChange}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          size="small"
          options={amounts}
          getOptionLabel={(option) => option.label}
          sx={{ width: "100%", mt: 2, mb: 2 }}
          renderInput={(params) => <TextField {...params} label="Amount" />}
          freeSolo
        />
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button variant="outlined" color="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WalletModel;