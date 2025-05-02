import { Button, Stack, Typography } from "@mui/material";
import "./ForgotPassword.scss";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { resetPasswordApi } from "../../../api/AuthApi";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";

// Schema xác thực với Yup
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, "Password must contain at least one number, one numeral, and seven characters")
    .matches(/[A-Z]/, "Password must contain at least one number, one numeral, and seven characters")
    .matches(/[a-z]/, "Password must contain at least one number, one numeral, and seven characters")
    .matches(/[0-9]/, "Password must contain at least one number, one numeral, and seven characters")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one number, one numeral, and seven characters"
    )
    .required("Please enter your new password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Password and Confirm password don’t match. Please try again")
    .required("Please enter confirm your password"),
});

const ResetPassword = () => {
  const { mutate } = useMutation({
    mutationFn: (data) => resetPasswordApi({ ...data, token }), // Truyền token vào API
    onSuccess: () => {
      reset();
      Swal.fire({
        icon: "success",
        text: "Your password has been reset successfully",
      }).then(() => navigate("/auth?page=login")); // Chuyển hướng sau khi reset thành công
    },
    onError: () => {
      reset();
      Swal.fire({
        icon: "error",
        text: "Token is invalid or expired",
      });
    },
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "all",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  if (!token) {
    return <Navigate to={"/auth?page=login"} />;
  }

  const onSubmit = (data) => {
    mutate({...data, token}); // Gọi API với dữ liệu nhập vào
  };

  return (
    <section style={{ backgroundColor: "#f3f3f3" }} id="forgot-password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: "600" }} color="initial">
            Reset Password
          </Typography>

          <Form.Group className="form-input">
            <Form.Label className="label">
              New Password <span>*</span>
            </Form.Label>
            <Form.Control
              className="mb-0"
              type="password"
              isInvalid={!!errors.newPassword}
              {...register("newPassword")}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.newPassword.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="form-input">
            <Form.Label className="label">
              Confirm Password <span>*</span>
            </Form.Label>
            <Form.Control
              className="mb-0"
              type="password"
              isInvalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword.message}
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
        </Stack>
      </form>
    </section>
  );
};

export default ResetPassword;
