import { Box, Typography, Container, Stack, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { formatNumber } from "../../../../helper/function";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SET_CHAT_ROOM } from "../../../../redux/slice/messageSlice";
import fetch from './../../../../api/fetch';
function OwnerInfo({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const login = useSelector((state) => state.auth.login);
  const handleChat = async () => {
    if (!login) {
      Swal.fire({
        icon: "error",
        text: "Please login to chat with car owner",
        title: "Login Infomation",
      });
      return;
    }
    let carOwner = {
      recipientName: data.name,
      recipientId: data.id,
      recipientAvatarUrl: data.avatarUrl,
    };
    let result = await fetch.get(
      "/chat-box/check-existed-chat?carOwnerId=" + data.id
    );
    console.log(result.data.data);

    dispatch(SET_CHAT_ROOM({ carOwner, chatRoom: result.data.data }));
    navigate("/chat");
  };
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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Car owner infomation
        </Typography>
        <Stack direction={"row"} sx={{ p: 3, gap: 9 }}>
          <Stack
            direction={"column"}
            sx={{ width: "25%", alignItems: "center", gap: 2 }}
          >
            <Box sx={{ borderRadius: "50%", overflow: "hidden" }}>
              <img
                style={{ width: "100%", aspectRatio: "1 / 1" }}
                src={data?.imageUrl}
              />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              {data?.name}
            </Typography>

            <Button
              variant="contained"
              sx={{ color: "primary", borderRadius: 5 }}
              onClick={handleChat}
            >
              Send message
              <SendIcon sx={{ ml: 1 }} />
            </Button>
          </Stack>
          <Stack direction={"column"} sx={{ width: "80%" }}>
            <Box
              sx={{
                backgroundColor: "#F0FAF3",
                width: "100%",
                borderRadius: "8px",
              }}
            >
              <Container sx={{ width: "95%", py: 2 }}>
                <Stack
                  direction={"row"}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Stack direction={"column"} sx={{ alignItems: "center" }}>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 400, fontSize: "0.9rem" }}
                    >
                      Total bookings
                    </Typography>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                    >
                      {formatNumber(data?.totalBooking || 0)}
                    </Typography>
                  </Stack>
                  <Stack direction={"column"} sx={{ alignItems: "center" }}>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 400, fontSize: "0.9rem" }}
                    >
                      Rating from customer
                    </Typography>
                    <Stack direction={"row"}>
                      <Typography
                        variant="span"
                        sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                      >
                        {(Math.round(data?.averageRating * 10) / 10).toFixed(1)}
                        /5.0
                      </Typography>
                      <StarIcon />
                    </Stack>
                  </Stack>
                  <Stack direction={"column"} sx={{ alignItems: "center" }}>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 400, fontSize: "0.9rem" }}
                    >
                      Joined time
                    </Typography>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                    >
                      {data?.joinedAt}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"column"} sx={{ mt: 1, gap: 0.5 }}>
                  <Typography>Description:</Typography>
                  <Typography
                    variant="span"
                    sx={{ fontWeight: 400, fontSize: "0.9rem" }}
                  >
                    {data?.description || "No description"}
                  </Typography>
                </Stack>
              </Container>
            </Box>
            <Stack direction={"column"} sx={{ gap: 1, pl: 4 }}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, mt: 2 }}>
                Provide car brand:{" "}
                <span style={{ fontWeight: 400 }}>
                  {data?.carBrandList?.map((b) => b.name).join(", ")}
                </span>
              </Typography>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <AddLocationAltIcon />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 400 }}>
                  {data?.address}
                </Typography>
              </Stack>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <EmailIcon />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 400 }}>
                  {data?.email}
                </Typography>
              </Stack>
              <Stack direction={"row"} sx={{ gap: 1 }}>
                <PhoneIcon />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 400 }}>
                  {data?.phone}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

export default OwnerInfo;
