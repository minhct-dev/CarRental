/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { IconButton, Rating, Stack, Tooltip, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import PlaceIcon from "@mui/icons-material/Place";
import MessageIcon from "@mui/icons-material/Message";
import { useDispatch, useSelector } from "react-redux";
import { SET_CHAT_ROOM } from "../../../../redux/slice/messageSlice";
import { useNavigate } from "react-router-dom";
import fetch from "../../../../api/fetch";
import Swal from "sweetalert2";
const CarDetailHead = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const login = useSelector((state) =>state.auth.login )
  const handleChat = async () => {

    if(!login){
      Swal.fire({
        icon:"error",
        text:"Please login to chat with car owner",
        title:"Login Infomation"
      })
      return
    }
    let carOwner = {
      recipientName: data.carOwnerName,
      recipientId: data.carOwnerId,
      recipientAvatarUrl:data.carOwnerAvatarUrl
    };
    let result = await fetch.get("/chat-box/check-existed-chat?carOwnerId="+data.carOwnerId)
    console.log(result.data.data);
    
    dispatch(SET_CHAT_ROOM({carOwner, chatRoom:result.data.data}));
    navigate("/chat")
  };
  return (
    <Stack direction={"column"} spacing={1}>
      <Stack direction={"row"} spacing={3} alignItems={"center"}>
        <Typography
          sx={{ fontSize: "35px", fontWeight: 700 }}
          variant="h2"
          color="initial"
        >
          {data?.name}
        </Typography>

        <Tooltip title="Chat with car owner">
          <IconButton
            onClick={handleChat}
            size="small"
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main", // giữ nguyên màu khi hover
              },
            }}
          >
            <MessageIcon sx={{ color: "white", fontSize: "25px" }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction={"row"} spacing={1} alignItems={"end"}>
        <Rating
          name="half-rating-read"
          defaultValue={
            data?.rating == 5 || data.rating == 0
              ? data.rating
              : data.rating - 1
          }
          precision={0.5}
          readOnly
        />
        <Typography variant="body1" color="text.secondary" fontSize={"16px"}>
          {data?.rating} ({data.noOfRatings} Feed back)
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <DepartureBoardIcon
            sx={{ fontSize: "20px", color: "primary.main" }}
          />
          <Typography variant="body1" color="text.secondary" fontSize={"16px"}>
            No of rides: {data?.noOfRide}
          </Typography>
        </Stack>
        <FiberManualRecordIcon
          sx={{ fontSize: "15px", color: "#ccc" }}
        ></FiberManualRecordIcon>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <PlaceIcon sx={{ fontSize: "20px", color: "primary.main" }} />
          <Typography
            variant="body1"
            color="text.secondary"
            fontSize={"15px"}
            sx={{ marginLeft: "0px !important" }}
          >
            {data?.ward} - {data?.district} - {data?.province}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CarDetailHead;
