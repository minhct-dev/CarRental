import "./active.scss";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ActiveSuccess = () => {
  const navigate = useNavigate();
  return (
    <div id="active-account">
      <div className="success-body">
        <div className="card">
          <div className="circle">
            <i className="checkmark">✓</i>
          </div>
          <h3>Congratulations!</h3>
          <p>Your account has been successfully activated</p>

          <div className="detail mt-2">
            <Stack direction={"column"} spacing={1}>
              <Stack
                direction={"row"}
                spacing={3}
                sx={{ justifyContent: "center", gap: "15px" }}
              >
                <Typography
                  className="detail-title"
                  variant="body1"
                  sx={{ fontWeight: "500" }}
                >
                  You can now log in and start using our services.
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction={"row"}
              spacing={3}
              className="mt-4"
              sx={{ justifyContent: "center" }}
            >
              <Button
                sx={{ textTransform: "capitalize" }}
                color="warning"
                variant="outlined"
                onClick={() => navigate("/")}
              >
                Back to home page
              </Button>
              <Button
                sx={{ textTransform: "capitalize" }}
                color="success"
                variant="outlined"
                onClick={() => navigate("/auth?page=login")}
              >
                Login now
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSuccess;
