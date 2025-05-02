/* eslint-disable react/prop-types */
import logo from "../../../../assets/logo-white.png";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { saveRegisterData } from "../../../../redux/slice/oldDataRegisterSlice";

const schema = yup.object().shape({
  username: yup.string().required("User name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits")
    .required("Phone Number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password and Confirm password don’t match. Please try again")
    .required("Confirm Password is required"),
});

const formFields = [
  {
    name: "username",
    label: "Full Name",
    icon: <PersonIcon sx={{ fontSize: "15px" }} />,
    type: "text",
  },
  {
    name: "phone",
    label: "Phone Number",
    icon: <LockIcon sx={{ fontSize: "15px" }} />,
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    icon: <EmailIcon sx={{ fontSize: "15px" }} />,
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    icon: <LockIcon sx={{ fontSize: "15px" }} />,
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    icon: <LockIcon sx={{ fontSize: "15px" }} />,
    type: "password",
  },
];

const Register = ({mutate, err}) => {
  const dispatch = useDispatch()
  const savedFormData = useSelector((state) => state.oldDataRegister.registerFormData);
  // eslint-disable-next-line no-unused-vars
  const [roleSignUpId, setRoleSignUpId] = useState(savedFormData?.roleSignUpId ?? 1);
 
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: savedFormData || {},
  });
  const onSubmit = (data) => {
    console.log(data);
    dispatch(saveRegisterData({...data, checkTerm:false}))
    mutate(data)
  };

  return (
    <form
      style={{ padding: "10px", width: "90%" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ pt: 3, display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            backgroundColor: "primary.main",
            width: "40px",
            height: "40px",
            textAlign: "center",
            borderRadius: "50%",
            lineHeight: "40px",
          }}
        >
          <img width={25} height={25} src={logo} alt="Logo" />
        </Box>
      </Box>
      <Typography
        variant="h1"
        fontSize={"30px"}
        fontWeight={700}
        textAlign={"center"}
      >
        Tell us about yourself
      </Typography>
      <Typography
        variant="body1"
        fontSize={"13px"}
        textAlign={"center"}
        sx={{ margin: "10px 0px 25px 0" }}
      >
        Enter your details to proceed further
      </Typography>
      <Stack
        sx={{ width: "70%", margin: "auto" }}
        direction="column"
        mt={2}
        spacing={2}
      >
       {err &&  <Alert variant="filled" severity="error">
          {err}
        </Alert>}
        {formFields.map((field) => (
          <TextField
            key={field.name}
            size="small"
            label={field.label}
            type={field.type}
            {...register(field.name)}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
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
                <InputAdornment position="end">{field.icon}</InputAdornment>
              ),
            }}
          />
        ))}
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
          <RadioGroup
            
            sx={{ display: "flex", justifyContent: "space-between" }}
            row
            defaultValue={roleSignUpId}
          >
            <FormControlLabel
              sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
              value={1}
              control={<Radio size="small" {...register("roleSignUpId")} />}
              label="I am a customer"
            />
            <FormControlLabel
              sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
              value={2}
              control={<Radio size="small"  {...register("roleSignUpId")}/>}
              label="I am a car owner"
            />
             <FormControlLabel
              sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
              value={3}
              control={<Radio size="small"  {...register("roleSignUpId")}/>}
              label="I am a driver"
            />
          </RadioGroup>
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox {...register("checkTerm")} size="small" />}
            label="I have read and agree with Temr or use"
            sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
          />
        </FormGroup>

        <Button type="submit" variant="contained">
          Register
        </Button>
        <Typography
          sx={{
            fontSize: "10px",
            color: "primary.main",
            textAlign: "end",
            cursor: "pointer",
          }}
        >
          You have an account? Login now!
        </Typography>
      </Stack>
    </form>
  );
};

export default Register;
