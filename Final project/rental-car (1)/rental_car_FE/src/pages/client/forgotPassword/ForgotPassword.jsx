import { Button, Stack, Typography } from "@mui/material";
import "./ForgotPassword.scss";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { sendMailForgotApi } from "../../../api/AuthApi";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";

// Schema xác thực với Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Please enter your email"),
});

const ForgotPassword = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  const {mutate, isPending} = useMutation({
    mutationFn: (email) => sendMailForgotApi(email),
    onSuccess: () => {
        reset()
        Swal.fire({
            icon:"success",
            text:"We have sent you and email to reset password"
        })
    },
    onError: () =>{
        reset()
        Swal.fire({
            icon:"error",
            text:"User not found"
        })
    }
})

  const navigate = useNavigate();
  const onSubmit = (data) => {
    mutate(data.email)
  };
  const navigateToLogin = () => {
    navigate("/auth?page=login");
  };

  if(isPending){
    return <Loading></Loading>
  }

  return (
    <section style={{ backgroundColor: "#f3f3f3" }} id="forgot-password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: "600" }} color="initial">
            Reset Password
          </Typography>

          <Form.Group className="form-input">
            <Form.Label className="label">
              Email <span>*</span>
            </Form.Label>
            <Form.Control
              className="mb-0"
              type="email"
              isInvalid={Boolean(errors.email)}
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button
            type="submit"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "999px",
            }}
          >
            <b>Reset Password</b>
          </Button>
          <Button
            type="button"
            onClick={navigateToLogin}
            sx={{
              backgroundColor: "white",
              color: "#1b1b1b",
              borderRadius: "999px",
              textTransform: "capitalize",
              border: "1px solid rgba(0, 0, 0, 0.5) !important",
            }}
          >
            <b>Already a member? Login now!</b>
          </Button>
        </Stack>
      </form>
    </section>
  );
};

export default ForgotPassword;
