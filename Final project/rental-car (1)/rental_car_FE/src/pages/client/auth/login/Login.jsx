import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import logo from "../../../../assets/logo-white.png";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Alert,
  Box,
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const DividerWithOr = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", my: 2 }}>
      <Divider sx={{ flexGrow: 1, borderColor: "#ccc" }} />
      <Typography sx={{ mx: 2, color: "#ccc", fontWeight: "bold", fontSize:"12px" }}>
        Or
      </Typography>
      <Divider sx={{ flexGrow: 1, borderColor: "#ccc" }} />
    </Box>
  );
};

// Schema validation với Yup (chỉ check required)
const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Please enter a valid email address"),
  password: yup.string().required("Password is required"),
});

// eslint-disable-next-line react/prop-types
const Login = ({err,mutate}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    mutate(data)
  };
  
  return (
    <form style={{ padding: "10px", width: "90%" }} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ pb: 3, display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            backgroundColor: "primary.main",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            lineHeight: "40px",
            textAlign:"center"
          }}
        >
          <img width={25} height={25} src={logo} alt="" />
        </Box>
      </Box>
      <Typography
        variant="h1"
        fontSize={"30px"}
        fontWeight={700}
        color="initial"
        textAlign={"center"}
      >
        Login to getting started
      </Typography>
      <Typography
        variant="body1"
        fontSize={"13px"}
        sx={{ margin: "10px 0px 25px 0 !important" }}
        color="text.secondary"
        textAlign={"center"}
      >
        Enter your account to ready rental car
      </Typography>
      <Stack sx={{ width: "70%", margin: "auto" }} direction="column" spacing={2}>
        {err &&  <Alert variant="filled" severity="error">
                  {err}
                </Alert>}
        {/* Input Email */}
        <TextField
          {...register("email")}
          size="small"
          type="text"
          sx={{
            width: "100%",
            label: { color: "text.secondary" },
            "& input": {
              fontWeight: 400,
              fontSize: "15px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailIcon sx={{ fontSize: "15px" }} />
              </InputAdornment>
            ),
          }}
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* Input Password */}
        <TextField
          {...register("password")}
          type="password"
          size="small"
          sx={{
            width: "100%",
            label: { color: "text.secondary" },
            "& input": {
              fontWeight: 400,
              fontSize: "15px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockIcon sx={{ fontSize: "15px" }} />
              </InputAdornment>
            ),
          }}
          label="Password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />

     
       <Typography
          sx={{
            fontSize: "10px",
            color: "primary.main",
            textAlign: "end",
            cursor: "pointer",
          }}
          variant="body1"
          color="initial"
          
        >
          <a href="/forgot-password">Forgot your password? Reset now!</a>
        </Typography>
      

        <Button type="submit" variant="contained">Login</Button>

        <DividerWithOr />

        <Button startIcon={<GoogleIcon />} variant="outlined">
          Login with Google
        </Button>
      </Stack>
    </form>
  );
};

export default Login;
