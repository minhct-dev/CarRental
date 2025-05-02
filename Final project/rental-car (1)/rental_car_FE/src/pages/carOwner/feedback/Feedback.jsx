import {
  Box,
  Typography,
  Container,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Overall from "../../../components/carOwner/feedback/Overall";
import { useEffect, useState } from "react";
import PagePagination from "./../../../components/carOwner/pagination/PagePagination";
import { useSearchParams } from "react-router-dom";
import Loading from "./../../client/loading/Loading";
import ErrorPage from "../../client/errorPage/ErrorPage";
import { useQuery } from "@tanstack/react-query";
import NoFeedback from "../../../components/carOwner/feedback/NoFeedback";
import ChatIcon from "@mui/icons-material/Chat";
import { getFeedbackReportApi } from "./../../../api/feedbackApi";
import FeedbackInfo from "./../../../components/carOwner/feedback/FeedbackInfo";

function FeedBack() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 3;
  const [sortOption, setSortOption] = useState("created_at:desc");
  const [starRating, setStarRating] = useState(0);

  const setPagination = (newPage, newPageSize) => {
    setSearchParams({ page: newPage, pageSize: newPageSize });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedback-report", page, pageSize, sortOption, starRating],
    queryFn: () => getFeedbackReportApi(page, pageSize, sortOption, starRating),
  });

  useEffect(() => {
    if (page != 1) {
      setPagination(1, pageSize);
    }
  }, [pageSize]);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#F7F7F7",
      }}
    >
      <Container sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Typography variant="h6" fontWeight={500}>
          <ChatIcon /> Feedback report
        </Typography>
        <FormControl size="small" sx={{ minWidth: "15rem" }}>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            displayEmpty
            sx={{ fontSize: "1rem" }}
          >
            <MenuItem value="created_at:desc" sx={{ fontSize: "1rem" }}>
              Latest to Newest
            </MenuItem>
            <MenuItem value="created_at:asc" sx={{ fontSize: "1rem" }}>
              Newest to Latest
            </MenuItem>
          </Select>
        </FormControl>
      </Container>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorPage />
      ) : data?.feedbacks?.length <= 0 ? (
        <NoFeedback />
      ) : (
        <Container
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.2)",
            width: "97%",
            p: [3, 3, 3, 3],
            mt: 2,
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* overall info */}
          <Overall
            filterOption={starRating}
            setFilterOption={setStarRating}
            data={data}
          />
          {/* feedbacks */}
          {data?.listCarFeedback.map((feedback, index) => (
            <Box key={index}>
              <FeedbackInfo feedback={feedback} />
              <Divider sx={{ bgcolor: "black", mt: "1rem", height: 1 }} />
            </Box>
          ))}
          <PagePagination
            pageCount={data.totalPages}
            page={page}
            pageSize={pageSize}
            setPagination={setPagination}
          />
        </Container>
      )}
    </Box>
  );
}

export default FeedBack;
