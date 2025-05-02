import {
  Modal,
  Box,
  Typography,
  Backdrop,
  Container,
  Rating,
  TextField,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { giveFeedbackApi } from "../../../api/feedbackApi";
const style = {
  position: "absolute",
  top: "20%",
  left: "50%",

  transform: "translate(-50%, -20%)",
  width: "33vw",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  px: 2.5,
  py: 5,
};
function GiveRating({ open, handleClose, bookingId }) {
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: giveFeedbackApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Swal.fire({
        icon: "success",
        title: "Thank you!",
        showConfirmButton: false,
        timer: 1200,
      });
      setRating(0);
      setFeedback(null);
      handleClose();
    },
  });
  const handleSubmit = () => {
    if (rating < 1) {
      setError(
        "Please provide a star rating before submitting your feedback! ⭐"
      );
    }
    mutation.mutate({ bookingId, rating, comment: feedback });
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Container sx={{ width: "95%" }}>
          {error && (
            <Typography
              variant="span"
              sx={{ fontSize: "0.9rem", fontWeight: 400, color: "red" }}
            >
              {error}
            </Typography>
          )}
            <Typography
              id="modal-modal-title"
              variant="h6"
              sx={{ fontSize: "1.5rem" }}
            >
              Give feedback
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ pt: 2, fontWeight: 400 }}
            >
              Do you enjoy the trip, please let we know what you think
            </Typography>
            <Stack direction={"row"} sx={{ justifyContent: "center" }}>
              <Rating
                precision={0.5}
                sx={{ fontSize: 45 }}
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
              />
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              placeholder="Write your feedback here..."
              onChange={(e) => setFeedback(e.target.value)}
              inputProps={{ maxLength: 250 }}
            />
            <Stack direction={"row"} sx={{ gap: 1, pt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ width: "50%", borderWidth: 1.5, fontSize: "0.95rem" }}
                size="large"
              >
                Not now
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{ width: "50%", fontSize: "0.95rem" }}
              >
                Send
              </Button>
            </Stack>
          </Container>
        </Box>
      </Modal>
    </div>
  );
}

export default GiveRating;
