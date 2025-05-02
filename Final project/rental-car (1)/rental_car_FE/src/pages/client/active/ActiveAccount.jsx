import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { activeAccountApi } from "../../../api/AuthApi";
import Loading from "../loading/Loading";
import ActiveSuccess from "./ActiveSuccess";
import ActivationError from "./ActiveErr";
import NotFound from "../../../components/err/NotFound";

const ActiveAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const {isError, isLoading, refetch, isSuccess} = useQuery({
    queryKey:['active-account', token],
    queryFn: () => activeAccountApi(token),
    enabled:false
  })

  useEffect(() => {
    if (token) {
      refetch()
    } else {
      navigate("/");
    }
  }, [token]);

  if (isLoading) {
    return <Loading />;
  }
  else if (isSuccess) {
    return <ActiveSuccess />;
  }
  else if (isError) {
    return <ActivationError />;
  }
  else{
    return <NotFound></NotFound>
  }
};

export default ActiveAccount;
