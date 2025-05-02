import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { queryClient } from "../../main";
import dayjs from "dayjs";

const ChatRoom = ({
  data,
  setSelectRoom,
  refetch,
  selectRoom,
  socket,
  listChatRoom,
  setListRoom,
}) => {
  const profile = useSelector((state) => state.auth.profile);    
  const handleSelect = (item) => {
    let sendData = {
      chatId: item.chatId,
    };
    // Gửi seen đến server
    socket.send(
      "/app/seen",
      {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      JSON.stringify(sendData)
    );
    // Đánh dấu phòng là đã xem
    let newRoom = { ...item, status: "SEEN" };
    
    // Cập nhật lại listChatRoom
    const updatedList = listChatRoom.map((room) =>
      room.chatId == item.chatId ? { ...room, status: "SEEN" } : room
    ); 
    setListRoom(updatedList);
    setSelectRoom(newRoom);
    // Gọi lại dữ liệu nếu cần
    refetch();
    queryClient.invalidateQueries(["notify-message"])
    
  };
  return (
    <Box
      sx={{
        width: "30%",
        padding: " 20px 5px",
        borderRight: "1px solid #ccc",
        height: "80vh",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h6" textAlign={"center"} color="initial">
        All Chat Room
      </Typography>
      <Stack sx={{ mt: 2 }} direction={"column"} spacing={1}>
        {data?.map((item, index) => {
          return (
            <Stack
              onClick={() => {
                handleSelect(item);
              }}
              key={index}
              sx={{
                cursor: "pointer",
                p: "15px",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#F5F6FA",
                },
                backgroundColor:
                  selectRoom?.chatId == item.chatId ? "#F5F6FA" : "",
              }}
              spacing={2}
              direction={"row"}
              alignItems={"center"}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar src={item.recipientAvatarUrl}></Avatar>
                {item.status == "UNSEEN" && (
                  <Box
                    sx={{
                      width: "13px",
                      height: "13px",
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      position: "absolute",
                      top: "-5px",
                      left: "0px",
                      border: "1px solid white",
                    }}
                  ></Box>
                )}
              </Box>
              <Stack sx={{ width: "80%" }} direction={"column"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography variant="body1" color="initial">
                    {item.recipientName}
                  </Typography>
                  <Typography
                    fontSize={"12px"}
                    variant="body2"
                    color="text.secondary"
                  >
                    {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Stack>
                {item.messageSenderId && item.latestMessage && (
                  <Typography
                    sx={{
                      fontWeight: item.status == "UNSEEN" ? "500" : "400",
                      color:
                        item.status == "UNSEEN" ? "black" : "text.secondary",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.messageSenderId === profile.id
                      ? `You: `
                      : `${item.recipientName} : `}
                    {item.latestMessage.length > 20
                      ? `${item.latestMessage.substring(0, 20)}...`
                      : item.latestMessage}
                  </Typography>
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ChatRoom;
