import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { rejectCarDraftApi, rejectUpdateCarApi } from "../../../api/carApi";
import { queryClient } from "../../../main";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "1px solid #ccc",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const RejectModal = ({ open, handleClose, id, type }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const closeModal = () => {
    setError(false);
    handleClose();
  };

  const { mutate:updateMutate } = useMutation({
    mutationFn: (data) => {
      return rejectUpdateCarApi(data);
    },
    onMutate: () => {
      Swal.fire({
        title: "Processing...",
        text: "Please wait",
        allowOutsideClick: false,
        icon: "info",
        didOpen: () => {
          Swal.showLoading();
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["list-request-draft"])
      Swal.fire({
        title: "Rejected!",
        text: "The request has been rejected successfully.",
        icon: "success",
      }).then(() => {
        handleClose();
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to reject the request. Please try again.",
        icon: "error",
      });
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return rejectCarDraftApi(data);
    },
    onMutate: () => {
      Swal.fire({
        title: "Processing...",
        text: "Please wait",
        allowOutsideClick: false,
        icon: "info",
        didOpen: () => {
          Swal.showLoading();
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["list-request-draft"])
      Swal.fire({
        title: "Rejected!",
        text: "The request has been rejected successfully.",
        icon: "success",
      }).then(() => {
        handleClose();
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to reject the request. Please try again.",
        icon: "error",
      });
    },
  });

  const handleReject = () => {
    if (!reason.trim()) {
      setError(true);
    } else {
      setError(false);
      closeModal();
      if(type == "UPDATE"){
        updateMutate({ id, reason })
      }
      else{
        mutate({ id, reason });
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Reject Request
        </Typography>
        <Stack sx={{ mt: 2 }} direction={"column"} spacing={2}>
          <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
            If you want to reject this request, please enter a reason.
          </Typography>

          {error && <Alert severity="error">Reason is required!</Alert>}

          <Stack direction={"row"} justifyContent={"center"}>
            <TextField
              label="Reason Reject"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{
                width: "400px",
                label: { color: "text.secondary" },
              }}
              error={error}
              helperText={error ? "Please enter a reason" : ""}
            />
          </Stack>
        </Stack>

        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"end"}
          sx={{ mt: 2 }}
        >
          <Button onClick={closeModal} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleReject}>
            Reject
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RejectModal;
