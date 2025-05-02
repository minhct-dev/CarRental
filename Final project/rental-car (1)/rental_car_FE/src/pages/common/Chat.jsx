import { Box, Stack } from "@mui/material";
import { Container } from "react-bootstrap";
import ChatRoom from "../../components/common/ChatRoom";
import ChatBox from "../../components/common/ChatBox";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getMessageHistoryApi } from "../../api/chatApi";
import { useEffect, useState } from "react";
import { CLEAR_CHAT } from "../../redux/slice/messageSlice";

const Chat = ({ chatRoom ,refetch }) => {

  const socket = useSelector((state) => state.stomps.client);
  const profile = useSelector((state) => state.auth.profile);
  const [listChatRoom, setListRoom] = useState(chatRoom || []);
  const [selectRoom, setSelectRoom] = useState(chatRoom[0]);
  const dispatch = useDispatch();
  const carOwner = useSelector((state) => state.message.carOwner);
  const chatRoomState = useSelector((state) => state.message.chatRoom);
  useEffect(() => {
    setListRoom(chatRoom)
  }, [chatRoom])

  
  useEffect(() => {
    
    if (carOwner) {
      if (chatRoomState) {
        setSelectRoom(chatRoomState);
        dispatch(CLEAR_CHAT());
      } else {

        let chatId =""
        if(profile.id < carOwner.recipientId){
          chatId = `${profile.id}_${carOwner.recipientId}`
        }
        else{
          chatId = `${carOwner.recipientId}_${profile.id}`
        }
        let newChatRoom = { ...carOwner, chatId };  
        // Kiểm tra xem newChatRoom đã tồn tại trong listChatRoom chưa
        setListRoom((pre) => {
          // Nếu chưa có newChatRoom, mới thêm vào
          if (!pre.some(room => room.chatId === newChatRoom.chatId)) {
            return [newChatRoom, ...pre];
          }
          return pre;  // Nếu đã có thì giữ nguyên listChatRoom hiện tại
        });
        setSelectRoom(newChatRoom);
        dispatch(CLEAR_CHAT());
      }
    }
  }, [profile, carOwner, chatRoomState]);


  
  const { data: history, refetch:fetchHistory } = useQuery({
    queryKey: ["history", selectRoom],
    queryFn: () => getMessageHistoryApi(selectRoom.chatId),
  });
  return (
    <Box
      sx={{
        height: "90vh",
        py: 5,
        backgroundColor: profile.roles.includes("user") ? "white" : "#FAFAFB",
      }}
    >
      <Container
        style={{ width: profile.roles.includes("user") ? "70%" : "90%" }}
      >
        <Box
          sx={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            height: "80vh",
          }}
        >
          <Stack direction={"row"}>
            <ChatRoom
              refetch={fetchHistory}
              selectRoom={selectRoom}
              setSelectRoom={setSelectRoom}
              data={listChatRoom}
              socket={socket}
              listChatRoom={listChatRoom}
              setListRoom={setListRoom}
            ></ChatRoom>
            <ChatBox
              refetch={refetch}
              selectRoom={selectRoom}
              socket={socket}
              listChatRoom={listChatRoom}
              data={history?.listMessages}
              setListRoom={setListRoom}
            ></ChatBox>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Chat;
