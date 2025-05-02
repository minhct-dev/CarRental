import { Box, Button, Stack, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
function CarOwnerInfo({ data }) {
  const navigate = useNavigate();
  return (
    <Stack direction={"column"} sx={{ mt:2, gap: 2 }}>
      <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: 500 }}>
        Car Owner Information
      </Typography>
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #ccc",
          p: 2,
          borderRadius:"10px"
        }}
      >
        <Stack
          direction={"row"}
          sx={{ alignItems: "center", gap: 1, width: "35%" }}
        >
          <Box sx={{ width: "50%", borderRadius: "50%", overflow: "hidden" }}>
            <img
              style={{ width: "100%", objectFit: "cover", height: "100%" }}
              src={data?.carOwnerAvatarUrl}
            />
          </Box>
          <Stack direction={"column"}>
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", fontWeight: 500 }}
            >
              {data?.carOwnerName}
            </Typography>
            <Stack direction={"row"} sx={{ gap: 0, alignItems: "center" }}>
              <Typography
                variant="span"
                color="text.secondary"
                sx={{ fontWeight: 400, fontSize: "13px", pt: "3px" }}
              >
                {data?.province}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction={"column"}
          alignItems={"center"}
          spacing={1}
          sx={{
            borderLeft: "1px solid #ccc",
            borderRight: "1px solid #ccc",
            px: 3,
            height: "100%",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
            <StarIcon sx={{ color: "orange", fontSize: "30px" }}></StarIcon>
            <Typography
              sx={{ marginLeft: "6px !importance", fontSize: "18px" }}
              variant="body1"
              color="initial"
            >
              {data?.carOwnerAverageRating}
            </Typography>
          </Stack>
          <Typography
            sx={{ fontSize: "13px" }}
            variant="body1"
            color="text.secondary"
          >
            Rating
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          sx={{ width: "20%" }}
          onClick={() => navigate(`/car-owner-info/${data?.carOwnerId}`)}
        >
          View profile
        </Button>
      </Stack>
    </Stack>
  );
}

export default CarOwnerInfo;
