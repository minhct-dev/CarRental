/* eslint-disable no-unused-vars */
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid2,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AccountCircle, Email, Phone, CreditCard } from "@mui/icons-material";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PlaceIcon from "@mui/icons-material/Place";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../../api/addressApi";
import { useQuery } from "@tanstack/react-query";
import SearchDriverModal from "./SearchDriverModal";
import { Link, useNavigate } from "react-router-dom";
dayjs.extend(customParseFormat);

let dataInput = [
  {
    label: "Full Name",
    name: "name",
    icon: <AccountCircle sx={{ fontSize: "18px" }}></AccountCircle>,
    type: "text",
    hoder: "Enter Full Name",
    disable: true,
  },
  {
    label: "Date of birth",
    name: "bod",
    type: "date",
    hoder: "Enter Date of Birth",
    disable: true,
  },
  {
    label: "Phone Number",
    name: "phone",
    icon: <Phone sx={{ fontSize: "18px" }}></Phone>,
    type: "text",
    hoder: "Enter Phone Number",
  },
  {
    label: "Email Address",
    name: "email",
    icon: <Email sx={{ fontSize: "18px" }}></Email>,
    type: "text",
    hoder: "Enter Email Address",
    disable: true,
  },
  {
    label: "National ID",
    name: "nationalId",
    icon: <CreditCard sx={{ fontSize: "18px" }}></CreditCard>,
    type: "text",
    hoder: "Enter National Id",
    disable: true,
  },
];

let dataInput2 = [
  {
    label: "Full Name",
    name: "driverName",
    icon: <AccountCircle sx={{ fontSize: "18px" }}></AccountCircle>,
    type: "text",
    hoder: "Enter Full Name",
  },
  {
    label: "Date of birth",
    name: "bod",
    type: "date",
    hoder: "Enter Date of Birth",
  },
  {
    label: "Phone Number",
    name: "phoneNumber",
    icon: <Phone sx={{ fontSize: "18px" }}></Phone>,
    type: "text",
    hoder: "Enter Phone Number",
  },
  {
    label: "Email Address",
    name: "email",
    icon: <Email sx={{ fontSize: "18px" }}></Email>,
    type: "text",
    hoder: "Enter Email Address",
  },
  {
    label: "National ID",
    name: "nationalId",
    icon: <CreditCard sx={{ fontSize: "18px" }}></CreditCard>,
    type: "text",
    hoder: "Enter National Id",
  },
];

const isOver18 = (value) => {
  if (!value) return false;
  return dayjs(value).isBefore(dayjs().subtract(18, "year"));
};
const phoneRegex = /^[0-9]{10}$/;
const nationalIdRegex = /^[0-9]{12}$/;
const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  dob: yup
    .string()
    .required("Date of Birth is required")
    .test("isOver18", "You must be at least 18 years old", isOver18),

  phone: yup
    .string()
    .required("Phone Number is required")
    .matches(phoneRegex, "Phone number must be exactly 10 digits"),

  email: yup
    .string()
    .required("Email Address is required")
    .email("Invalid email format"),

  nationalId: yup
    .string()
    .required("National ID is required")
    .matches(nationalIdRegex, "National ID must be exactly 12 digits"),
});
const Step1Form = ({
  handleNext,
  driverLicense,
  driverLicenseBack,
  profile,
  setRequest,
  setDriverLicense,
  setDriverLicenseBack,
  startDate,
  endDate,
  driver,
  setDriver,
  check,
  handleCheck,
  setDriverLicenseBackFile,
  setDriverLicenseFile,
}) => {
  const formattedDate = profile.dob
    ? dayjs(profile.dob, "DD/MM/YYYY").isValid()
      ? dayjs(profile.dob, "DD/MM/YYYY")
      : null
    : null;

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      dob: formattedDate || "",
      phone: profile.phone || "",
      nationalId: profile.nationalId || "",
      provinceCode: profile.provinceName || "",
      districtCode: profile.districtName || "",
      wardCode: profile.wardName || "",
      addressDetail: profile.addressDetail || "",
    },
    resolver: yupResolver(schema),
    mode: "all",
  });
  const navigate = useNavigate()
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const [selectProvince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);

  const { data: province } = useQuery({
    queryKey: ["province"],
    queryFn: getProvinceApi,
  });

  const { data: district } = useQuery({
    queryKey: ["district", selectProvince?.code],
    queryFn: () => getDistrictApi(selectProvince.code),
    enabled: !!selectProvince?.code, // Only enable when selectprovince.code is available
  });

  const { data: ward } = useQuery({
    queryKey: ["ward", selectDistrict?.code],
    queryFn: () => getWardApi(selectDistrict.code),
    enabled: !!selectDistrict?.code, // Only enable when selectprovince.code is available
  });

  useEffect(() => {
    if (profile.provinceName != null) {
      setSelectProvince(
        province?.find((item) => item.code == profile.provinceName)
      );
    }
  }, [profile, province]);

  useEffect(() => {
    if (profile.districtName != null) {
      setSelectDistrict(
        district?.find((item) => item.code == profile.districtName)
      );
    }
  }, [profile, district]);

  useEffect(() => {
    if (profile.wardName != null) {
      setSelectWard(ward?.find((item) => item.code == profile.wardName));
    }
  }, [profile, ward]);

  const [driverErr, setDriverErr] = useState(null);
  const [licenseErr, setLicenseErr] = useState(null);
  const onsubmit = (data) => {
    if (check && !driver) {
      setDriverErr("Please select driver");
      return;
    }
    if (!check && !driverLicenseBack && !driverLicense) {
      console.log(1);

      setLicenseErr("A valid driver's license is required to drive this car.");
      return;
    }
    setDriverErr(null);
    setRequest(data);
    handleNext();
  };
  return (
    <Box
      sx={{
        padding: "30px",
        width: "70%",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        backgroundColor: "white",
        borderRadius: "10px",
      }}
    >
      <form onSubmit={handleSubmit(onsubmit)}>
        <Box>
          <Typography variant="h6" color="initial">
            Rental Information
          </Typography>

          <Container>
            {/* Full Name */}

            <Grid2 sx={{ mt: 3 }} container columnSpacing={3} rowSpacing={3}>
              {dataInput.map((item, index) => {
                if (item.type != "date") {
                  return (
                    <Grid2 size={6} key={index}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          {item.label}: <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                          {...register(item.name)}
                          placeholder={item.hoder}
                          error={Boolean(errors[item.name])} // Kiểm tra có lỗi trong errors
                          helperText={errors[item.name]?.message} // Lấy thông báo lỗi từ errors
                          size="small"
                          disabled={item.disable}
                          sx={{
                            "& input": {
                              fontSize: "15px",
                              fontWeight: 400,
                            },
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                              color: "#ccc",
                              transition: "color 0.3s ease",
                            },
                            "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                              {
                                color: "primary.main",
                              },
                          }}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  {item.icon}
                                </InputAdornment>
                              ),
                            },
                          }}
                          fullWidth
                        />
                      </Stack>
                    </Grid2>
                  );
                } else {
                  return (
                    <Grid2 size={6} key={index}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          Date of Birth: <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            disabled={true}
                            value={watch("dob") || null}
                            onChange={(date) => setValue("dob", date)} // Cập nhật giá trị vào useForm
                            slotProps={{
                              textField: {
                                placeholder: item.hoder,
                                size: "small",
                                fullWidth: true,
                                error: Boolean(errors[item.name]), // Đặt vào trong textField
                                helperText: errors[item.name]?.message, // Đặt vào trong textField
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid2>
                  );
                }
              })}
              <Grid2 size={6}>
                <Stack spacing={1}>
                  <Typography fontSize={14} fontWeight={500}>
                    Driver License :{" "}
                    {!check && <span style={{ color: "red" }}>*</span>}
                  </Typography>
                  {driverLicense && driverLicenseBack ? (
                    <Stack sx={{ mt: 2 }} direction={"column"} spacing={2}>
                      <Stack
                        spacing={2}
                        direction={"row"}
                        justifyContent={"center"}
                      >
                        <img
                          src={driverLicense}
                          style={{
                            width: "130px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />

                        <img
                          src={driverLicenseBack}
                          style={{
                            width: "130px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack direction={"column"} alignItems={"center"}>
                      {licenseErr && (
                        <>
                          <Typography
                            fontSize={"14px"}
                            color="red"
                            sx={{ mt: 2 }}
                            variant="body1"
                          >
                            {licenseErr}
                          </Typography>
                          <Link style={{fontSize:"14px"}} to={"/profile"}>Go to profile to update license driver</Link>
                        </>
                      )}
                    </Stack>
                  )}
                </Stack>
              </Grid2>
            </Grid2>
            <Typography sx={{ mt: 3 }} fontSize={14} fontWeight={500}>
              Address:
            </Typography>

            <Grid2 sx={{ mt: 2 }} columnSpacing={3} rowSpacing={3} container>
              <Grid2 size={6}>
                <Autocomplete
                  disablePortal
                  options={province || []}
                  value={selectProvince}
                  onChange={(e, v) => {
                    setValue("provinceCode", v.code);
                    setSelectProvince(v);
                    setSelectDistrict(null);
                    setSelectWard(null);
                  }}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        label: { color: "text.secondary" },
                        "& input": {
                          fontWeight: 400,
                          fontSize: "15px",
                        },
                      }}
                      {...params}
                      size="small"
                      label="Province"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={6}>
                <Autocomplete
                  disablePortal
                  options={district || []}
                  disabled={selectProvince == null}
                  value={selectDistrict}
                  onChange={(e, v) => {
                    setValue("districtCode", v.code);
                    setSelectDistrict(v);
                    setSelectWard(null);
                  }}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        label: { color: "text.secondary" },
                        "& input": {
                          fontWeight: 400,
                          fontSize: "15px",
                        },
                      }}
                      {...params}
                      size="small"
                      label="District"
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={6}>
                <Autocomplete
                  disablePortal
                  options={ward || []}
                  value={selectWard}
                  onChange={(e, v) => {
                    setSelectWard(v);
                    setValue("wardCode", v.code);
                  }}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        label: { color: "text.secondary" },
                        "& input": {
                          fontWeight: 400,
                          fontSize: "15px",
                        },
                      }}
                      {...params}
                      size="small"
                      label="Ward"
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={6}>
                <Stack spacing={1}>
                  <TextField
                    placeholder="Address Detail"
                    size="small"
                    {...register("addressDetail")}
                    sx={{
                      "& input": {
                        fontSize: "15px",
                        fontWeight: 400,
                      },
                      "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                        color: "#ccc",
                        transition: "color 0.3s ease",
                      },
                      "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                        {
                          color: "primary.main",
                        },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PlaceIcon></PlaceIcon>
                          </InputAdornment>
                        ),
                      },
                    }}
                    fullWidth
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </Container>
        </Box>

        <Box>
          <Typography sx={{ mt: 3 }} variant="h6" color="initial">
            Driver Information
          </Typography>
          <Container>
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      handleCheck(e);
                      setLicenseErr(null);
                    }}
                    checked={check}
                    size="small"
                  />
                }
                label="Different than rental information"
                componentsProps={{
                  typography: {
                    fontSize: "15px", // Cỡ chữ
                    fontWeight: 400, // Độ dày chữ
                  },
                }}
              />
            </FormGroup>

            {check &&
              (driver ? (
                <Box>
                  <Button
                    onClick={() => setShow(true)}
                    variant="contained"
                    sx={{ my: 2 }}
                  >
                    Change Driver
                  </Button>
                  <Grid2
                    sx={{ mt: 3 }}
                    container
                    columnSpacing={3}
                    rowSpacing={3}
                  >
                    {dataInput2.map((item, index) => {
                      if (item.type != "date") {
                        return (
                          <Grid2 size={6} key={index}>
                            <Stack spacing={1}>
                              <Typography fontSize={14} fontWeight={500}>
                                {item.label}:{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <TextField
                                disabled
                                value={driver[item.name]}
                                size="small"
                                sx={{
                                  "& input": {
                                    fontSize: "15px",
                                    fontWeight: 400,
                                  },
                                  "& .MuiInputAdornment-root .MuiSvgIcon-root":
                                    {
                                      color: "#ccc",
                                      transition: "color 0.3s ease",
                                    },
                                  "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                                    {
                                      color: "primary.main",
                                    },
                                }}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {item.icon}
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                                fullWidth
                              />
                            </Stack>
                          </Grid2>
                        );
                      } else {
                        return (
                          <Grid2 size={6} key={index}>
                            <Stack spacing={1}>
                              <Typography fontSize={14} fontWeight={500}>
                                Date of Birth:{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Typography>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  disabled
                                  value={dayjs(driver.dob)}
                                  slotProps={{
                                    textField: {
                                      placeholder: item.hoder,
                                      size: "small",
                                      fullWidth: true,
                                    },
                                  }}
                                />
                              </LocalizationProvider>
                            </Stack>
                          </Grid2>
                        );
                      }
                    })}
                    <Grid2 size={6}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          Driver License :{" "}
                          {!check && <span style={{ color: "red" }}>*</span>}
                        </Typography>

                        <Stack sx={{ mt: 2 }} direction={"column"} spacing={2}>
                          <Stack direction={"row"} justifyContent={"center"}>
                            {driver?.drivingLicense.map((item, index) => (
                              <img
                                src={item}
                                key={index}
                                style={{
                                  width: "130px",
                                  height: "70px",
                                  objectFit: "contain",
                                }}
                                alt={`License ${index}`}
                              />
                            ))}
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid2>
                  </Grid2>
                  <Typography sx={{ mt: 3 }} fontSize={14} fontWeight={500}>
                    Address:
                  </Typography>

                  <Grid2
                    sx={{ mt: 2 }}
                    columnSpacing={3}
                    rowSpacing={3}
                    container
                  >
                    <Grid2 size={6}>
                      <TextField
                        placeholder="Address Detail"
                        size="small"
                        disabled
                        label="Province"
                        value={driver.provinceCode.name}
                        sx={{
                          "& input": {
                            fontSize: "15px",
                            fontWeight: 400,
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#ccc",
                            transition: "color 0.3s ease",
                          },
                          "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                            {
                              color: "primary.main",
                            },
                        }}
                        fullWidth
                      />
                    </Grid2>
                    <Grid2 size={6}>
                      <TextField
                        placeholder="Address Detail"
                        size="small"
                        disabled
                        label="District"
                        value={driver.districtCode.name}
                        sx={{
                          "& input": {
                            fontSize: "15px",
                            fontWeight: 400,
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#ccc",
                            transition: "color 0.3s ease",
                          },
                          "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                            {
                              color: "primary.main",
                            },
                        }}
                        fullWidth
                      />
                    </Grid2>

                    <Grid2 size={6}>
                      <TextField
                        disabled
                        placeholder="Address Detail"
                        size="small"
                        label="Province"
                        value={driver.wardCode.name}
                        sx={{
                          "& input": {
                            fontSize: "15px",
                            fontWeight: 400,
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#ccc",
                            transition: "color 0.3s ease",
                          },
                          "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                            {
                              color: "primary.main",
                            },
                        }}
                        fullWidth
                      />
                    </Grid2>

                    <Grid2 size={6}>
                      <Stack spacing={1}>
                        <TextField
                          placeholder="Address Detail"
                          size="small"
                          disabled
                          label="Address Detail"
                          value={driver.addressDetail}
                          sx={{
                            "& input": {
                              fontSize: "15px",
                              fontWeight: 400,
                            },
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                              color: "#ccc",
                              transition: "color 0.3s ease",
                            },
                            "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                              {
                                color: "primary.main",
                              },
                          }}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PlaceIcon></PlaceIcon>
                                </InputAdornment>
                              ),
                            },
                          }}
                          fullWidth
                        />
                      </Stack>
                    </Grid2>
                  </Grid2>
                </Box>
              ) : (
                <Box>
                  <Button
                    onClick={() => setShow(true)}
                    sx={{ mt: 2 }}
                    variant="contained"
                  >
                    Search Driver
                  </Button>

                  {driverErr && (
                    <Typography color="red" sx={{ mt: 2 }} variant="body1">
                      {driverErr}
                    </Typography>
                  )}
                </Box>
              ))}
          </Container>
        </Box>
        <Stack
          sx={{ mt: 5 }}
          direction={"row"}
          justifyContent={"space-between"}
          spacing={2}
        >
          <Button onClick={() => navigate(-1) } variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">
            Next
          </Button>
        </Stack>
      </form>

      <SearchDriverModal
        startDate={startDate}
        endDate={endDate}
        setDriver={setDriver}
        open={show}
        handleClose={handleClose}
      ></SearchDriverModal>
    </Box>
  );
};

export default Step1Form;
