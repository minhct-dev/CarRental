
import "./active.scss";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ActivationError = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div id="activation-error">
        <div className="success-body">
          <div className="card">
            <div className="circle">
              <i className="checkmark">❌</i>
            </div>
            <h3>Account Activation Failed</h3>
            <p>
              We were unable to activate your account.
              <br /> Please try again later or contact support.
            </p>
            <Stack direction={"row"} spacing={3} className="mt-5" justifyContent={"center"}>
              <Button
                onClick={() => {
                  navigate("/");
                }}
                color="error"
                sx={{ textTransform: "initial" }}
                variant="outlined"
              >
                Go to Homepage
              </Button>
              <Button
                onClick={() => {
                  navigate("/support");
                }}
                color="error"
                sx={{ textTransform: "initial" }}
                variant="outlined"
              >
                Contact Support
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationError;
