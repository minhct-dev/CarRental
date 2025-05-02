import {
  Box,
  Button,
  Checkbox,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { Controller } from "react-hook-form";

// eslint-disable-next-line no-unused-vars
const EditPrice = ({
  setValue,
  handleSubmit,
  setSelectedOther,
  selectedOther,
  control,
  errors,
  arr,
  submit,
}) => {
  // eslint-disable-next-line no-unused-vars

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
      <form onSubmit={handleSubmit(submit)}>
        <Container style={{ width: "80%" }}>
          {/* Title */}
          <Typography
            sx={{ textAlign: "center", fontSize: "20px", fontWeight: 500 }}
            variant="h6"
          >
            Price Setup
          </Typography>

          {/* Pricing Section */}
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            {/* Row 1 */}
            <Grid2 size={12}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  fontWeight={400}
                  variant="body1"
                  sx={{ width: "40%" }}
                >
                  Set Base Price For your Car:{" "}
                  <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="end"
                  spacing={1}
                  alignItems="center"
                  sx={{ flex: 1 }}
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
            </Grid2>

            {/* Row 2 */}
            <Grid2 size={12}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  fontWeight={400}
                  variant="body1"
                  sx={{ width: "40%" }}
                >
                  Required Deposit: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="end"
                  spacing={1}
                  alignItems="center"
                  sx={{ flex: 1 }}
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

          
          <Stack sx={{ mt: 3 }} direction={"row"} spacing={1}>
            <Typography
              variant="body1"
              fontSize={"15px"}
              fontWeight={"400"}
              color="initial"
            >
              Note:
            </Typography>
            <Typography variant="body1" color="red">
              <i>
                If you edit this car&apos;s information, it will need to be
                reviewed by an admin. During this time, your car will not be
                able to receive bookings.
              </i>
            </Typography>
          </Stack>
        </Container>

        {/* Buttons */}
        <Stack sx={{ mt: 5 }} direction="row" spacing={2} justifyContent="end">
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EditPrice;
