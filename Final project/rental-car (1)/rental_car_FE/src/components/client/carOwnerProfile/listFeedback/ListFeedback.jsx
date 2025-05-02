import {
  Box,
  Container,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { formatNumber } from "../../../../helper/function";
import FeedbackInfo from "../../../carOwner/feedback/FeedbackInfo";
import NoCar from "../noItemFound/NoCar";

function ListFeedback({
  feedbackList,
  totalPages,
  page,
  setPage,
  averageRating,
}) {
  const changeNameData =
    feedbackList?.feedbacks?.map((item) => ({
      userImg: item.avatarUrl,
      userName: item.userName,
      dateOfRating: item.createdAt,
      rating: item.rating,
      comment: item.comment,
      carImg: item.carImageUrl,
      carName: item.carName,
      startBookingDate: item.from,
      endBookingDate: item.to,
    })) || [];
  return (
    <Container
      sx={{
        width: "70%",
      }}
    >
      <Box
        sx={{
          px: 3.5,
          pt: 4,
          pb: 2,
          backgroundColor: "#fff",
          borderRadius: "12px",
        }}
      >
        <Stack direction={"row"} sx={{ alignItems: "center", gap: 1 }}>
          <Stack direction={"row"} sx={{ gap: 0.5 }}>
            <StarIcon
              sx={{ color: "#F8C524", width: "2rem", height: "2rem" }}
            />
            <Typography
              variant="span"
              sx={{ fontWeight: 800, fontSize: "1.3rem", pt: "3px" }}
            >
              {(Math.round(averageRating * 10) / 10).toFixed(1)}
            </Typography>
          </Stack>
          <span>•</span>
          <Typography
            variant="span"
            sx={{ fontWeight: 400, fontSize: "1.1rem", pt: "3px" }}
          >
            {formatNumber(feedbackList?.totalFeedback || 0)} rating
          </Typography>
        </Stack>
        <Divider sx={{ bgcolor: "black", mt: "1rem" }} />
        <Stack direction={"column"}>
          {changeNameData?.length > 0 ? (
            changeNameData.map((feedback) => (
              <div key={feedback.id}>
                <FeedbackInfo feedback={feedback} />
                <Divider sx={{ bgcolor: "black", mt: "1rem" }} />
              </div>
            ))
          ) : (
            <NoCar />
          )}

          <Stack direction={"row"} sx={{ justifyContent: "center", pt: 1 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

export default ListFeedback;
