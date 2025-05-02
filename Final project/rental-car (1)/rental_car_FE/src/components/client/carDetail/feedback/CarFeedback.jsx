import { Box, Typography, Stack, Pagination } from "@mui/material";
import { formatNumber } from "../../../../helper/function";
import StarIcon from "@mui/icons-material/Star";
import FeedbackCard from "./FeedbackCard";
import NoCar from "./../../carOwnerProfile/noItemFound/NoCar";

function CarFeedback({ data, page, setPage }) {
  return (
    <Box sx={{ pt: 4 }}>
      <Stack direction={"row"} sx={{ alignItems: "center", gap: 3 }}>
        <Stack direction={"row"} sx={{ gap: 0.5 }} alignItems={"center"}>
          <Typography sx={{ fontSize: "18px", fontWeight: 500 }} variant="h6" color="initial">
            {" "}
            Average rating for car :
          </Typography>
          <Typography
            variant="span"
            sx={{ fontWeight: 800, fontSize: "20px" }}
          >
            {data?.rating}
          </Typography>
          <StarIcon sx={{ color: "#F8C524", width: "2rem", height: "2rem" }} />
        </Stack>
        <span>•</span>
        <Typography
          variant="span"
          sx={{ fontWeight: 400, fontSize: "1.1rem", pt: "3px" }}
        >
          {formatNumber(data?.noOfRatings)} rating
        </Typography>
      </Stack>
      <Stack direction={"column"} sx={{ pt: 2, gap: 2 }}>
        {data?.listCarFeedbackResponses?.length > 0 ? (
          data?.listCarFeedbackResponses.map((feedback, index) => (
            <FeedbackCard key={index} feedback={feedback} />
          ))
        ) : (
          <NoCar />
        )}
      </Stack>
      <Stack direction={"row"} sx={{ justifyContent: "center", pt: 2 }}>
        <Pagination
          count={data?.totalFeedbackPage}
          page={page}
          color="primary"
          onChange={(_, value) => setPage(value)}
        />
      </Stack>
    </Box>
  );
}

export default CarFeedback;
