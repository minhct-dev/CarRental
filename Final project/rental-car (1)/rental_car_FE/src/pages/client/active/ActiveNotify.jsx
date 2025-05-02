import "./active.scss";
import { Button, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { reActiveApi } from "../../../api/AuthApi";
import { useState, useEffect } from "react";
import Loading from "../loading/Loading";

const ActiveNotify = () => {
  const { mutate ,isPending} = useMutation({
    mutationFn: (email) => reActiveApi(email),
    onSuccess: () => {
      console.log("thanh cong");
      setCountdown(30); // Reset countdown sau khi gửi mail
    },
  });

  const [countdown, setCountdown] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [countdown]);

  const email = useSelector((state) => state.active.email);
  if (email == null) {
    return <Navigate to={"/"} />;
  }

  

  const reActive = () => {
    setIsDisabled(true); // Vô hiệu hóa nút
    mutate(email);
  };

  if(isPending){
    return <Loading></Loading>
  }

  return (
    <div id="active-no">
      <div className="success-body">
        <div className="card">
          <div className="circle pl-2">
            <i style={{ paddingLeft: "35%" }} className="checkmark">
              ！
            </i>
          </div>
          <h3>Activate Account</h3>
          <p>Hi {email},</p>
          <div className="detail mt-5">
            <Stack direction={"column"} spacing={2}>
              <Stack direction={"row"} spacing={3} sx={{ justifyContent: "center", gap: "15px" }}>
                <Typography className="detail-title" variant="body1" sx={{ fontWeight: "500" }}>
                  Thank you for signing up!
                </Typography>
              </Stack>
              <Stack direction={"row"} spacing={3} sx={{ justifyContent: "center", gap: "15px" }}>
                <Typography variant="body1" sx={{ fontWeight: "400", fontSize: "15px" }}>
                  We have sent you an email
                </Typography>
              </Stack>
              <Stack direction={"row"} spacing={3} sx={{ justifyContent: "center", gap: "15px" }}>
                <Typography variant="body1" sx={{ fontWeight: "400", fontSize: "13px" }}>
                  Please check your mail to activate your account.
                </Typography>
              </Stack>
            </Stack>

            <Stack direction={"row"} spacing={3} className="mt-4" sx={{ justifyContent: "center" }}>
              <Button
                onClick={reActive}
                sx={{ textTransform: "capitalize" }}
                color="warning"
                variant="outlined"
                disabled={isDisabled}
              >
                {isDisabled ? `Send mail again (${countdown}s)` : "Send mail again"}
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveNotify;
