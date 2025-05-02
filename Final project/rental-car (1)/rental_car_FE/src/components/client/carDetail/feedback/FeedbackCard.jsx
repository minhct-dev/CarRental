import { Avatar, Box, Paper, Rating, Typography } from "@mui/material";
import { formatDateTime } from "../../../../helper/function";
function FeedbackCard({ feedback }) {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, maxWidth: "100%", borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={feedback?.imageUrl}></Avatar>
          <Box flexGrow={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {feedback?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(feedback?.feedbackDate)}
            </Typography>
          </Box>
          <Rating value={feedback?.rating} precision={0.5}  readOnly size="small" />
        </Box>

        <Typography variant="body2" color="text.primary">
          {feedback?.comment}
        </Typography>
      </Paper>
    </Box>
  );
}

export default FeedbackCard;
