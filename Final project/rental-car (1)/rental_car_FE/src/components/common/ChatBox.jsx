import {
  Avatar,
  Box,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const ChatBox = ({
  data,
  socket,
  selectRoom,
  setListRoom,
  listChatRoom,
  refetch,
}) => {
  let [history, setHistory] = useState([]);
  useEffect(() => {
    if (data) {
      setHistory(data);
    }
  }, [data]);
  const messageContainerRef = useRef(null);
  const [content, setContent] = useState("");
  const profile = useSelector((state) => state.auth.profile);
  const handleSend = () => {
    let sendData = {
      recipientId: selectRoom.recipientId,
      content,
      listAttachmentUrl: [],
    };
    if (content != "") {
      socket.send(
        "/app/chat",
        {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        JSON.stringify(sendData)
      );
      setHistory([
        ...history,
        { content, senderId: profile.id, created_at: new Date().toISOString() },
      ]);
      setContent("");
      handleSortRoom(selectRoom.chatId, content, profile.id);
      refetch();
    }
  };

  const handleSortRoom = (chatId, message, sender) => {
    let roomIndex = listChatRoom.find((item) => item.chatId == chatId);
    if (roomIndex > -1) {
      const updatedRooms = listChatRoom.map((room) =>
        room.chatId === chatId
          ? {
              ...room,
              latestMessage: message,
              messageSenderId: sender,
            }
          : room
      );
      const sortedRooms = updatedRooms.sort((a, b) =>
        a.chatId === chatId ? -1 : b.chatId === chatId ? 1 : 0
      );
      setListRoom(sortedRooms);
    } else {
      refetch();
    }
  };

  useEffect(() => {
    if (!socket || !profile) return;
    const subscription = socket.subscribe(
      `/user/${profile.id}/queue/messages`,
      (message) => {
        const payload = JSON.parse(message.body);
        if (selectRoom) {
          if (selectRoom.chatId == payload.chatId) {
            setHistory((prev) => [...prev, payload]);
          }
        }
        handleSortRoom(payload.chatId, payload.content, payload.senderId);
        refetch();
      }
    );
    return () => {
      subscription.unsubscribe(); // cleanup tránh leak socket
    };
  }, [socket]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <Box
      sx={{
        height: "80vh",
        width: "70%",
        backgroundColor: "rgb(249, 250, 255)",
        position: "relative",
      }}
    >
      {/* Header */}
      {selectRoom && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            borderBottom: "1px solid #ccc",
            pb: 1,
            px: 2,
            height: "70px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Avatar src={selectRoom?.recipientAvatarUrl} />
          <Typography variant="body1">{selectRoom?.recipientName}</Typography>
        </Stack>
      )}

      {/* Messages */}
      <Box
        ref={messageContainerRef}
        sx={{
          height: "calc(100% - 70px - 78px)",
          overflowY: "auto",
          px: 3,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "&::-webkit-scrollbar": {
            width: "5px", // Chỉnh độ rộng của thanh cuộn dọc
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Màu sắc của thanh cuộn
            borderRadius: "10px", // Góc bo tròn của thanh cuộn
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent", // Màu nền của thanh cuộn
          },
        }}
      >
        {history?.map((item, index) => {
          const isMine = item.senderId == profile.id;
          return (
            <Stack
              key={index}
              direction="row"
              spacing={1}
              alignItems="flex-end"
              justifyContent={isMine ? "flex-end" : "flex-start"}
              width="100%"
            >
              {!isMine && <Avatar src={selectRoom?.recipientAvatarUrl} />}
              <Box
                sx={{
                  maxWidth: "60%",
                  px: 2,
                  py: 1,
                  borderRadius: "16px",
                  backgroundColor: isMine ? "primary.main" : "white",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  color: isMine ? "white" : "black",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {item.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    display: "block",
                    textAlign: "right",
                    color: isMine ? "white" : "black",
                  }}
                >
                  {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </Box>
              {isMine && <Avatar src={profile.avatarUrl} />}
            </Stack>
          );
        })}

        {/* Tin nhắn người khác - căn trái */}

        {/* Tin nhắn của mình - căn phải */}
      </Box>

      {/* Input */}
      {selectRoom && (
        <Stack
          sx={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            px: 2,
            py: 1.5,
            height: "78px",
            backgroundColor: "rgb(249, 250, 255)",
          }}
          width={"60%"}
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <TextField
            onChange={(e) => setContent(e.target.value)}
            value={content}
            sx={{
              flex: 1,
              backgroundColor: "white",
              "& input": {
                fontWeight: 400,
                fontSize: "15px",
              },
            }}
            placeholder="Enter message..."
            size="small"
          />
          <Button
            onClick={handleSend}
            endIcon={<SendOutlinedIcon />}
            variant="contained"
          >
            Send
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ChatBox;
