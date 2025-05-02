import { Button, Rating, Stack, Typography, Container } from "@mui/material";
import { formatNumber } from "../../../helper/function";

function Overall({ data, filterOption, setFilterOption }) {
  const filter = [
    {
      text: "All",
      value: 0,
      count: data.numberOfRatings,
    },
    { text: "5 stars", value: 5, count: data.numberOf5starRatings },
    { text: "4 stars", value: 4, count: data.numberOf4starRatings },
    { text: "3 stars", value: 3, count: data.numberOf3starRatings },
    { text: "2 stars", value: 2, count: data.numberOf2starRatings },
    { text: "1 star", value: 1, count: data.numberOf1starRatings },
  ];
  return (
    <Container
      sx={{
        backgroundColor: "#fffbf8",
        border: "1px solid #f9ede5",
        p: "2rem",
      }}
    >
      <Stack direction={"row"} gap={10} sx={{ px: "1rem" }}>
        {/* average */}
        <Stack direction={"column"}>
          <Typography variant="h6" fontWeight={400} color={"#ee4d2d"}>
            <span style={{ fontSize: "1.9rem" }}>{data.averageRating}</span> out of 5
          </Typography>
          <Rating
            value={data.averageRating}
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
        {/* filter */}
        <Stack
          direction={"row"}
          sx={{ alignItems: "center", gap: 2, flexWrap: "wrap", width: "100%" }}
        >
          {filter.map((item) => (
            <Button
              variant="outlined"
              size="small"
              key={item.value}
              sx={{
                borderColor:
                  filterOption === item.value
                    ? "#ee4d2d"
                    : "rgba(0, 0, 0, .09)",
                borderWidth: "1px",
                borderRadius: "0.2rem",
                minWidth: "8rem",
                maxHeight: "2.3rem",
                p: "0.5rem",
              }}
              onClick={() => setFilterOption(item.value)}
            >
              <Typography
                sx={{
                  color: filterOption === item.value && "#ee4d2d",
                  fontSize: "0.95rem",
                  fontWeight: 400,
                }}
              >
                {item.text} ({formatNumber(item.count)})
              </Typography>
            </Button>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}

export default Overall;
