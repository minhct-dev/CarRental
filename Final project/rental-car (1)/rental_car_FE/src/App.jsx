import "bootstrap/dist/css/bootstrap.min.css";
import AllRouter from "./routes/AllRouter";
import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "./api/userApi";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN, LOGOUT } from "./redux/slice/AuthSlice";
import Loading from "./pages/client/loading/Loading";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./styles.css";
import "aos/dist/aos.css";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { SET_CLIENT_SOCKET } from "./redux/slice/stompsClient";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSelector((state) => state.stomps.client);
  const [tokenReady, setTokenReady] = useState(false);
  const { profile, login } = useSelector((state) => state.auth);
  useEffect(() => {
    if (profile) {
      if(!socket){
        handleConnect();
      }
    }
  }, [profile]);
  const handleConnect = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = over(socket);
    const connectHeaders = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    stompClient.connect(
      connectHeaders,
      () => onConnected(stompClient),
      onError
    );
  };
  const onConnected = (client) => {
    dispatch(SET_CLIENT_SOCKET(client));
  };
  const onError = () => {
    console.log("error");
  };

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (accessToken != null && refreshToken != null) {
      setTokenReady(true);
    }
  }, [login]);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    retry: 0,
    enabled: tokenReady,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(LOGIN(data));
    }
    if (isError) {
      dispatch(LOGOUT());
      
    }
  }, [data, isSuccess, isError, dispatch, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <AllRouter />;
}

export default App;
