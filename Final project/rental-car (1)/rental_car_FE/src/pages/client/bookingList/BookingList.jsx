import { Box, Stack, Typography, Container } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import SortingSelect from "../../../components/carOwner/carList/SortingSelect";
import PagePagination from "../../../components/carOwner/pagination/PagePagination";
import { useSearchParams } from "react-router-dom";
import { getBookingListApi } from "../../../api/bookingApi";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading/Loading";
import ErrorPage from "../errorPage/ErrorPage";
import NoBooking from "../../../components/client/bookingList/NoBooking";
import BookingCard from "../../../components/client/bookingList/BookingCard";
import { useEffect } from "react";

function BookingList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 6;
  const sortOption = searchParams.get("sort") || "created_at:desc";

  const setPagination = (newPage, newPageSize) => {
    setSearchParams({ page: newPage, pageSize: newPageSize, sort: sortOption });
  };
  //set page when pageSize change
  useEffect(() => {
    if (page != 1) {
      setPagination(1, pageSize);
    }
  }, [pageSize]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["bookings", sortOption, page, pageSize],
    queryFn: () => getBookingListApi(sortOption, page, pageSize),
  });
  return (
    <Container style={{ width: "80%" }}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          padding: "20px",
          borderRadius: "10px",
          mt: 3,
          mb: 1.7,
        }}
      >
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Box
            sx={{
              backgroundColor: "text.light",
              width: "35px",
              height: "35px",
              textAlign: "center",
              borderRadius: "10px",
              lineHeight: "35px",
            }}
          >
            <KeyboardArrowLeftIcon
              sx={{ fontSize: "15px", color: "text.secondary" }}
            ></KeyboardArrowLeftIcon>
          </Box>
          <Typography
            variant="h2"
            color="white"
            fontSize={"1.4rem"}
            fontWeight={700}
          >
            My bookings
          </Typography>
        </Stack>
      </Box>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorPage />
      ) : data?.bookings?.length <= 0 ? (
        <NoBooking />
      ) : (
        <>
          {/* filter */}
          <Stack direction={"row"} sx={{ justifyContent: "end", pt: 1 }}>
            <SortingSelect
              value={sortOption}
              onChange={(value) =>
                setSearchParams({ page, pageSize, sort: value })
              }
            />
          </Stack>
          {/* booking list */}
          <Stack direction={"column"} sx={{ pb: 4 }}>
            {data.bookings.map((item, index) => (
              <BookingCard key={index} data={item} />
            ))}
            <PagePagination
              pageCount={data.totalPages}
              page={page}
              pageSize={pageSize}
              setPagination={setPagination}
            />
          </Stack>
        </>
      )}
    </Container>
  );
}

export default BookingList;
