import { useState } from "react";
import {
  Box,
  Container,
  Rating,
  Stack,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import { formatDateTime } from "../../../helper/function";

function FeedbackInfo({ feedback }) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleOpen = (imageSrc) => {
    setSelectedImage(imageSrc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container
      sx={{
        backgroundColor: "#fff",
        minHeight: "200px",
        mt: "0.5rem",
        px: "1rem",
        py: "1rem",
      }}
    >
      <Stack direction={"column"} sx={{ gap: 0.3 }}>
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <Stack
            sx={{ width: "50%", gap: 1, alignItems: "center" }}
            direction={"row"}
          >
            {/* Avatar */}
            <img
              src={feedback.userImg}
              style={{
                borderRadius: "50%",
                width: 50,
                height: 50,
                cursor: "pointer",
              }}
              alt="User avatar"
              onClick={() => handleOpen(feedback.userImg)}
            />
            <Stack direction={"column"}>
              <Typography variant="span" sx={{ fontSize: "1rem" }}>
                {feedback.userName}
              </Typography>
              <Typography
                variant="span"
                sx={{ fontSize: "12px", fontWeight: 400 }}
              >
                {formatDateTime(feedback.dateOfRating)}
              </Typography>
            </Stack>
          </Stack>
          <Rating
            value={feedback.rating}
            precision={0.1}
            sx={{
              color: "#ee4d2d",
              "& .css-9xw0na-MuiRating-icon": {
                color: "#ee4d2d",
              },
            }}
            readOnly
          />
        </Stack>
        <Typography sx={{ width: "75%", pt: 1, fontWeight: 400 }}>
          {feedback.comment}
        </Typography>
        <Stack direction={"row"} sx={{ pt: 1.5 }}>
          <Box sx={{ width: "35%" }}>
            <img
              src={feedback.carImg}
              alt="car image"
              style={{
                cursor: "pointer",
                width: "100%",
                objectFit: "cover",
                height: "13rem",
              }}
              onClick={() => handleOpen(feedback.carImg)}
            />
          </Box>
          <Stack
            direction={"column"}
            sx={{ pl: "3rem", gap: 2, justifyContent: "center" }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 500, fontSize: "1.7rem" }}
            >
              {feedback.carName}
            </Typography>
            <Stack direction={"row"}>
              <AccessTimeIcon />
              <Typography variant="span" sx={{ pl: 1, fontSize: "1rem" }}>
                From: {formatDateTime(feedback.startBookingDate)}
              </Typography>
            </Stack>
            <Stack direction={"row"}>
              <AccessTimeIcon />
              <Typography variant="span" sx={{ pl: 1, fontSize: "1rem" }}>
                To: {formatDateTime(feedback.endBookingDate)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent sx={{ position: "relative" }}>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={selectedImage}
            alt="Large image"
            sx={{ width: "100%", height: "30rem", borderRadius: 2 }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default FeedbackInfo;
