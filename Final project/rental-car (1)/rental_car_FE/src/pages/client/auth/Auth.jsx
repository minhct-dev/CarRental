import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./login.scss";
import Register from "./register/Register";
import Login from "./login/Login";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi } from "../../../api/AuthApi";
import Loading from "../loading/Loading";
import { useDispatch } from "react-redux";
import { clearRegisterData } from "../../../redux/slice/oldDataRegisterSlice";
import { SET_EMAIL_ACTIVE } from "../../../redux/slice/activeSlice";
import { LOGIN } from "../../../redux/slice/AuthSlice";
const Auth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [login, setLogin] = useState(
    queryParams.get("page") == "login" ? true : false
  );

  const dispatch = useDispatch();

  useEffect(() => {
    let page = queryParams.get("page");
    if (!page) {
      setLogin(true);
    } else {
      if (page == "login") {
        setLogin(true);
      } else {
        setLogin(false);
      }
    }
  }, [queryParams]);

  useEffect(() => {
    dispatch(clearRegisterData());
  }, []);

  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/auth?page=register");
  };
  const goTologin = () => {
    navigate("/auth?page=login");
  };

  //register api
  const { mutate: registerMutate, isPending: registerPending } = useMutation({
    mutationFn: (data) => registerApi(data),
    onSuccess: (data) => {
      dispatch(clearRegisterData());
      setRegisterErr(null);
      dispatch(SET_EMAIL_ACTIVE(data));
      navigate("/active-no");
    },
    onError: (e) => {
      setRegisterErr(
        e.response.data.message
          ? e.response.data.message
          : "Server Error, Please try again"
      );
    },
  });

  //loginApi
  const { mutate: loginMutate, isPending: loginPending } = useMutation({
    mutationFn: (data) => loginApi(data),
    onSuccess: (data) => {
      setLoginErr(null);
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      dispatch(LOGIN())
      navigate("/");
    },
    onError: (e) => {
      setLoginErr(
        e.response.data.message
          ? e.response.data.message
          : "Server Error, Please try again"
      );
    },
  });

  const [registerErr, setRegisterErr] = useState(null);
  const [loginErr, setLoginErr] = useState(null);

  if (registerPending || loginPending) {
    return <Loading></Loading>;
  }
  return (
    <>
      <Box
        className="form_auth"
        sx={{ pt: 5, pb: 5, backgroundColor: "#f3f3f3" }}
      >
        <Container
          style={{
            borderRadius: "30px",
            padding: 0,
            width: "70%",
            boxShadow:
              " rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px ",
          }}
        >
          <Box>
            <Box
              className={login ? "containerr" : "containerr active"}
              id="containerr"
            >
              <Box className="form-container sign-up">
                <Register mutate={registerMutate} err={registerErr}></Register>
              </Box>
              <Box className="form-container sign-in">
                <Login mutate={loginMutate} err={loginErr}></Login>
              </Box>
              <div className="toggle-container">
                <div className="toggle">
                  <div className="toggle-panel toggle-left">
                    <h1>Sign Up & Start Your Journey!</h1>
                    <p>
                      Find the perfect car or start earning by sharing yours.
                      Quick & easy!
                    </p>
                    <Button
                      sx={{ color: "white" }}
                      variant="outlined"
                      onClick={goTologin}
                      className="hidden"
                      id="login"
                    >
                      Go to login
                    </Button>
                  </div>
                  <div className="toggle-panel toggle-right">
                    <h1>Welcome Back!</h1>
                    <p>
                      Your journey starts here. Log in to book your ride and hit
                      the road!
                    </p>
                    <Button
                      sx={{ color: "white" }}
                      variant="outlined"
                      onClick={goToRegister}
                      className="hidden"
                      id="login"
                    >
                      Go to register
                    </Button>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Auth;
