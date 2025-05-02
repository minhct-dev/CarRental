import { useQuery } from "@tanstack/react-query";
import { getChatRoomApi } from "../../api/chatApi";
import Chat from "./Chat";
import Loading from "../client/loading/Loading";

const ChatBoxIndex = () => {
  const { data: chatRoom , isLoading, refetch} = useQuery({
    queryKey: ["chatRoom"],
    queryFn: getChatRoomApi,
  });

  if(isLoading){
    return <Loading></Loading>
  }
  return <Chat chatRoom={chatRoom} refetch={refetch} />;
};

export default ChatBoxIndex;
