import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { checkTokenForgotApi } from "../../../api/AuthApi";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import ResetPassword from "./ResetPassword";

const CheckToken = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["checktoken"],
    queryFn: () => checkTokenForgotApi(token),
    enabled: !!token,
  });

  if (token == null) {
    navigate("/auth?page=login");
  }
  if (isLoading) {
    return <Loading></Loading>;
  }
  if (isError) {
    Swal.fire({
        icon: 'error',
        text: 'Token is invalid or expired',
      }).then(() => {
        // After the alert is closed, navigate to the login page
        navigate('/auth?page=login');  // Replace '/login' with the actual path for your login page
      });
  }
  if(isSuccess){
    return <ResetPassword></ResetPassword>
  }
};

export default CheckToken;
