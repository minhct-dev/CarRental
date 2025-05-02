import {
  Alert,
  Box,
  Button,
  Checkbox,
  Grid,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  basePrice: yup
    .string()
    .min(0, "Base price must be greater than or equal to 0"),
  deposit: yup.string().min(0, "Deposit must be greater than or equal to 0"),
  lateFee: yup.string().min(0, "Deposit must be greater than or equal to 0"),
  otherText: yup.string().when("carTermOfUse", {
    is: (value) => value.includes("Other"),
    then: (schema) => schema.required("Other term is required"),
  }),
});
// eslint-disable-next-line no-unused-vars

const Step3 = ({ process, mutate, saveBack }) => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  const arr = [
    "No Smoking",
    "No food in car",
    "No pet in car",
    "Return on time",
    "Other",
  ];

  const formatNumber = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleInputChange = (field, value) => {
    let rawValue = value.replace(/\./g, ""); // Loại bỏ dấu chấm
    if (!/^\d*$/.test(rawValue)) return; // Chỉ cho phép số
    const formattedValue = formatNumber(rawValue); // Format lại số
    setValue(field, formattedValue); // Cập nhật vào form
  };

  const otherText =
    process?.carTermOfUses?.find((term) => !arr.includes(term)) || "";
  const defaultTerm = () => {
    let defaultTermUse = [];
    if (process.carTermOfUses != null) {
      defaultTermUse = process?.carTermOfUses;
      if (otherText !== "") {
        defaultTermUse = [...defaultTermUse, "Other"];
      }
    }
    return defaultTermUse;
  };

  useEffect(() => {
    if (otherText !== "") {
      setSelectedOther(true);
    }
  }, [otherText]);

  const [selectedOther, setSelectedOther] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      carTermOfUse: defaultTerm(),
      otherText: otherText,
      basePrice: process?.basePrice || "",
      deposit: process?.deposit || "",
      lateFee: process?.lateFee || ""
    },
    resolver: yupResolver(schema),
  });
  const [err, setErr] = useState(null);

  const handleCickSubmit = (type) => {
    handleSubmit((data) => onSubmit(data, type))();
  };

  const onSubmit = (data, type) => {
    let form = new FormData();
    let newTerm = [...data.carTermOfUse];
    if (newTerm.length === 0) {
      setErr("Please select at least one term of use"); // 🆕 Set lỗi nếu rỗng
      return;
    } else {
      setErr(null); // 🆕 Xóa lỗi nếu có giá trị
    }

    if (newTerm.includes("Other")) {
      newTerm = newTerm.filter((item) => item !== "Other"); // Xóa "Other"
      if (data.otherText) {
        newTerm.push(data.otherText); // Thêm giá trị otherText
      }
    }

    const payload = {
      ...data,
      basePrice: parseInt(data.basePrice.replace(/\./g, "") || 0),
      deposit: parseInt(data.deposit.replace(/\./g, "") || 0),
      lateFee:parseInt(data.lateFee.replace(/\./g, "") || 0),
      carTermOfUse: newTerm.filter((item) => item != null),
    };

    delete payload.otherText;

    form.append("obj", JSON.stringify(payload));
    form.append("type", process.step > 2 ? "UPDATE" : "CREATE");
    form.append("draftId", process.id);  
    if (type == "next") {
      mutate(form);
    } else {
      saveBack(form);
    }
  };

  const handleOtherChange = (e) => {
    setSelectedOther(e.target.checked);
    if (!e.target.checked) {
      setValue("otherText", ""); // Xóa dữ liệu khi bỏ tích
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "50px",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container style={{ width: "80%" }}>
          {/* Title */}

          <Typography
            sx={{ textAlign: "center", fontSize: "20px", fontWeight: 500 }}
            variant="h6"
          >
            Price Setup
          </Typography>
          {err && <Alert severity="error">{err}</Alert>}

          {/* Pricing Section */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Row 1 */}
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  fontWeight={400}
                  variant="body1"
                  sx={{ width: "30%" }}
                >
                  Set Base Price For your Car:{" "}
                  <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="end"
                  spacing={1}
                  alignItems="end"
                  sx={{ flex: 1, width: "70%" }}
                >
                  <Controller
                    name="basePrice"
                    control={control}
                    rules={{ required: "Base price is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={formatNumber(field.value)} // Format khi hiển thị
                        onChange={(e) =>
                          handleInputChange("basePrice", e.target.value)
                        } // Xử lý khi nhập
                        error={!!errors.basePrice}
                        helperText={errors.basePrice?.message}
                        sx={{
                          width: "70%",
                          "& input": {
                            fontWeight: 400,
                            fontSize: "15px",
                          },
                        }}
                        variant="standard"
                      />
                    )}
                  />
                  <Typography sx={{ width: "30%" }} variant="body1">
                    VND/ 1 Day
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  fontWeight={400}
                  variant="body1"
                  sx={{ width: "30%" }}
                >
                  Required Deposit: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="end"
                  spacing={1}
                  alignItems="end"
                  sx={{ flex: 1, width: "70%" }}
                >
                  <Controller
                    name="deposit"
                    control={control}
                    rules={{ required: "Deposit is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={formatNumber(field.value)} // Format khi hiển thị
                        onChange={(e) =>
                          handleInputChange("deposit", e.target.value)
                        } // Xử lý khi nhập
                        error={!!errors.deposit}
                        helperText={errors.deposit?.message}
                        sx={{
                          width: "70%",
                          "& input": {
                            fontWeight: 400,
                            fontSize: "15px",
                          },
                        }}
                        variant="standard"
                      />
                    )}
                  />
                  <Typography sx={{ width: "30%" }} variant="body1">
                    VND
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          {/* Term of Use Section */}
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 500,
              my: 5,
            }}
            variant="h6"
          >
            Term of use
          </Typography>

          <Grid2 alignItems={"center"} container spacing={2}>
            {arr.map((item, index) => (
              <Grid2 key={index} size={item == "Other" ? 6 : 4}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    borderRadius: "8px",
                    padding: "8px",
                    justifyContent: "flex-start",
                  }}
                >
                  {item === "Other" ? (
                    <>
                      <Controller
                        name="carTermOfUse"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <Checkbox
                            checked={selectedOther}
                            onChange={(e) => {
                              handleOtherChange(e);
                              field.onChange(
                                e.target.checked
                                  ? [...(field.value ?? []), "Other"]
                                  : field.value.filter((v) => v !== "Other")
                              );
                            }}
                          />
                        )}
                      />
                      <Typography fontWeight={400} fontSize={"15px"}>
                        {item}
                      </Typography>
                      {selectedOther && (
                        <Controller
                          name="otherText"
                          control={control}
                          rules={{
                            required: "Please specify other term",
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              multiline
                              minRows={3}
                              placeholder="Specify other term"
                              error={!!errors.otherText}
                              helperText={errors.otherText?.message}
                              sx={{
                                width: "300px",
                                "& input": {
                                  fontSize: "14px",
                                },
                              }}
                            />
                          )}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Controller
                        name="carTermOfUse"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value.includes(item)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.checked
                                  ? [...field.value, item]
                                  : field.value.filter((v) => v !== item)
                              )
                            }
                          />
                        )}
                      />
                      <Typography fontWeight={400} fontSize={"15px"}>
                        {item}
                      </Typography>
                    </>
                  )}
                </Stack>
              </Grid2>
            ))}
          </Grid2>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 500,
              my: 5,
            }}
            variant="h6"
          >
            Other Fee
          </Typography>

          <Grid2 container justifyContent={"center"}>
            <Grid2 size={10}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  fontWeight={400}
                  variant="body1"
                  sx={{ width: "30%" }}
                >
                  Overage fee per hour: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="end"
                  spacing={1}
                  alignItems="end"
                  sx={{ flex: 1, width: "70%" }}
                >
                  <Controller
                    name="lateFee"
                    control={control}
                    rules={{ required: "Over fee is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={formatNumber(field.value)} // Format khi hiển thị
                        onChange={(e) =>
                          handleInputChange("lateFee", e.target.value)
                        } // Xử lý khi nhập
                        error={!!errors.lateFee}
                        helperText={errors.lateFee?.message}
                        sx={{
                          width: "80%",
                          "& input": {
                            fontWeight: 400,
                            fontSize: "15px",
                          },
                        }}
                        variant="standard"
                      />
                    )}
                  />
                  <Typography sx={{ width: "20%" }} variant="body1">
                    VND
                  </Typography>
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
         
        </Container>

        {/* Buttons */}
        <Stack sx={{ mt: 5 }} direction="row" spacing={2} justifyContent="end">
          <Button
            type="button"
            onClick={() => handleCickSubmit("back")}
            variant="contained"
          >
            Back Step
          </Button>
          <Button
            onClick={() => handleCickSubmit("next")}
            type="button"
            variant="contained"
          >
            Next Step
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Step3;
