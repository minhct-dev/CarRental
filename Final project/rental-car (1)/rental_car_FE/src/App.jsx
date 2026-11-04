import "bootstrap/dist/css/bootstrap.min.css";
import AllRouter from "./routes/AllRouter";
import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "./api/userApi";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
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
import { DEMO_MODE } from "./data/demoData";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSelector((state) => state.stomps.client);
  const [tokenReady, setTokenReady] = useState(false);
  const { profile, login } = useSelector((state) => state.auth);
  const onConnected = useCallback((client) => {
    dispatch(SET_CLIENT_SOCKET(client));
  }, [dispatch]);
  const onError = useCallback(() => {
    console.log("error");
  }, []);
  const handleConnect = useCallback(() => {
    const socket = new SockJS(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/ws`);
    const stompClient = over(socket);
    const connectHeaders = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    stompClient.connect(
      connectHeaders,
      () => onConnected(stompClient),
      onError
    );
  }, [onConnected, onError]);
  useEffect(() => {
    if (!DEMO_MODE && profile && !socket) handleConnect();
  }, [profile, socket, handleConnect]);

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (!DEMO_MODE && accessToken != null && refreshToken != null) {
      setTokenReady(true);
    }
  }, [login]);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    retry: 0,
    enabled: !DEMO_MODE && tokenReady,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (DEMO_MODE) return;
    if (isSuccess && data) {
      dispatch(LOGIN(data));
    }
    if (isError) {
      dispatch(LOGOUT());
      
    }
  }, [data, isSuccess, isError, dispatch, navigate]);

  if (!DEMO_MODE && isLoading) {
    return <Loading />;
  }

  return <AllRouter />;
}

export default App;
