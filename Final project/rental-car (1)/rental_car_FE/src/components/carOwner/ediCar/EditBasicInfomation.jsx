import {
  Box,
  Typography,
  TextField,
  Grid2,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Button,
} from "@mui/material";
import { Container } from "react-bootstrap";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Controller } from "react-hook-form";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
const EditBasicInfomation = ({
  data,
  selectBrand,
  model,
  brand,
  selectModel,
  setSelectModel,
  carType,
  process,
  setValue,
  errors,
  register,
  control,
  handleSubmit,
  submit,
  registrationPaper,
  setRegistrationPaper,
  insurance,
  setInsurance,
  cetificatePaper,
  setCetificatePaper,
}) => {
  const fuelType = ["Gasoline", "Diesel", "Electric", "Hybrid"];
  const registrationRef = useRef();
  const cetificatePaperRef = useRef();
  const insuranceRef = useRef();
  const handleClickRegis = () => {
    registrationRef.current.click();
  };
  const handleClickCetificate = () => {
    cetificatePaperRef.current.click();
  };
  const handleClickInsuracne = () => {
    insuranceRef.current.click();
  };

  const [selectType, setSelectType] = useState(process?.carType || null);

  const handleregistrationPaper = (e) => {
    setRegistrationPaper(e.target.files[0]);
  };
  const handleCetificatePaper = (e) => {
    setCetificatePaper(e.target.files[0]);
  };
  const handleInsurance = (e) => {
    setInsurance(e.target.files[0]);
  };
  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "50px",
      }}
    >
      <Container style={{ width: "90%" }}>
        <Typography
          sx={{ textAlign: "center", fontSize: "20px", fontWeight: 500 }}
          variant="h6"
          color="initial"
        >
          Basic Infomation
        </Typography>
        <form onSubmit={handleSubmit(submit)}>
          <Grid2
            sx={{ mt: 5 }}
            alignItems={"start"}
            container
            columnSpacing={7}
            rowSpacing={7}
          >
            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  License Plate: <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  error={Boolean(errors.licencePlate)}
                  helperText={
                    Boolean(errors.licencePlate) && errors.licencePlate.message
                  }
                  {...register("licencePlate")}
                  size="small"
                  sx={{
                    width: "60%",
                    label: { color: "text.secondary" },
                    "& input": {
                      fontWeight: 400,
                      fontSize: "15px",
                    },
                  }}
                  variant="standard"
                />
              </Box>
            </Grid2>

            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  Color: <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  error={Boolean(errors.color)}
                  helperText={Boolean(errors.color) && errors.color.message}
                  {...register("color")}
                  sx={{
                    width: "60%",
                    label: { color: "text.secondary" },
                    "& input": {
                      fontWeight: 400,
                      fontSize: "15px",
                    },
                  }}
                  variant="standard"
                />
              </Box>
            </Grid2>
            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  Brand: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="carBrandId"
                  control={control}
                  defaultValue={null} // Giá trị mặc định
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={data}
                      size="small"
                      getOptionLabel={(option) => option.name}
                      value={brand} // Xác định giá trị hiện tại
                      onChange={(e, value) => {
                        field.onChange(value ? value.id : null); // Lưu ID vào form
                        selectBrand(value); // Cập nhật state bên ngoài
                        setValue("carModelId", null);
                      }}
                      sx={{ width: "60%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(errors.carBrandId)}
                          helperText={
                            Boolean(errors.carBrandId) &&
                            errors.carBrandId.message
                          }
                          label="Select Brand"
                          sx={{
                            label: { color: "text.secondary" },
                            "& input": {
                              fontWeight: 400,
                              fontSize: "15px",
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid2>
            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  Model: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="carModelId"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={model}
                      size="small"
                      getOptionLabel={(option) => option.name}
                      value={selectModel} // Xác định giá trị hiện tại
                      onChange={(e, value) => {
                        field.onChange(value ? value.id : null); // Lưu ID vào form
                        setSelectModel(value); // Cập nhật state bên ngoài
                      }}
                      // Disable nếu chưa chọn Brand
                      sx={{ width: "60%" }}
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(errors.carModelId)}
                          helperText={
                            Boolean(errors.carModelId) &&
                            errors.carModelId.message
                          }
                          {...params}
                          label="Select Model"
                          sx={{
                            label: { color: "text.secondary" },
                            "& input": {
                              fontWeight: 400,
                              fontSize: "15px",
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid2>

            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  Production Year: <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  error={Boolean(errors.productionYear)}
                  helperText={
                    Boolean(errors.productionYear) &&
                    errors.productionYear.message
                  }
                  type="number"
                  {...register("productionYear")}
                  sx={{
                    width: "60%",
                    label: { color: "text.secondary" },
                    "& input": {
                      fontWeight: 400,
                      fontSize: "15px",
                    },
                  }}
                  variant="standard"
                />
              </Box>
            </Grid2>

            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  No of Seat: <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  error={Boolean(errors.noOfSeats)}
                  helperText={
                    Boolean(errors.noOfSeats) && errors.noOfSeats.message
                  }
                  {...register("noOfSeats")}
                  type="number"
                  sx={{
                    width: "60%",
                    label: { color: "text.secondary" },
                    "& input": {
                      fontWeight: 400,
                      fontSize: "15px",
                    },
                  }}
                  variant="standard"
                />
              </Box>
            </Grid2>

            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  Transmission: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="transmissionType"
                  control={control}
                  defaultValue="AUTOMATIC"
                  render={({ field }) => (
                    <ToggleButtonGroup
                      {...field}
                      color="primary"
                      exclusive
                      sx={{ width: "60%" }}
                      onChange={(_, value) =>
                        field.onChange(value || "AUTOMATIC")
                      } // Nếu không chọn, giữ giá trị mặc định
                    >
                      <ToggleButton
                        sx={{ textTransform: "none" }}
                        value="MANUAL"
                      >
                        Manual
                      </ToggleButton>
                      <ToggleButton
                        sx={{ textTransform: "none" }}
                        value="AUTOMATIC"
                      >
                        Automatic
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
              </Box>
            </Grid2>
            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  Fuel Type: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="fuelType"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={fuelType}
                      size="small"
                      sx={{ width: "60%" }}
                      onChange={(_, value) => field.onChange(value || null)} // Nếu không chọn, giữ giá trị mặc định
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(errors.fuelType)}
                          helperText={
                            Boolean(errors.fuelType) && errors.fuelType.message
                          }
                          {...params}
                          label="Select Fuel Type"
                          sx={{
                            label: { color: "text.secondary" },
                            "& input": {
                              fontWeight: 400,
                              fontSize: "15px",
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid2>

            <Grid2 item size={6}>
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Typography variant="body1" color="initial">
                  Car Type: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="carTypeId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={carType}
                      size="small"
                      value={selectType}
                      getOptionLabel={(option) => option.name}
                      sx={{ width: "60%" }}
                      onChange={(_, value) => {
                        field.onChange(value.id || null);
                        setSelectType(value);
                      }} // Nếu không chọn, giữ giá trị mặc định
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(errors.carTypeId)}
                          helperText={
                            Boolean(errors.carTypeId) &&
                            errors.carTypeId.message
                          }
                          {...params}
                          label="Select Car Type"
                          sx={{
                            label: { color: "text.secondary" },
                            "& input": {
                              fontWeight: 400,
                              fontSize: "15px",
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid2>
          </Grid2>

          <Box sx={{ mt: 5 }}>
            <Typography
              sx={{ textAlign: "center", fontSize: "20px", fontWeight: 500 }}
              variant="h6"
              color="initial"
            >
              Document
            </Typography>
            <Stack
              sx={{ mt: 5 }}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Stack
                sx={{ width: "30%", height: "200px" }}
                direction={"column"}
                spacing={2}
              >
                <Typography fontWeight={"400"} variant="body1">
                  Registration Paper: <span style={{ color: "red" }}>*</span>
                </Typography>
                <input
                  ref={registrationRef}
                  onChange={handleregistrationPaper}
                  type="file"
                  style={{ display: "none" }}
                />
                {registrationPaper == null ? (
                  <Stack
                    sx={{
                      border: "1px dashed #ccc",
                      cursor: "pointer",
                      height: "100%",
                    }}
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    onClick={handleClickRegis}
                  >
                    <Stack
                      direction={"column"}
                      spacing={0}
                      alignItems={"center"}
                    >
                      <FileUploadIcon
                        sx={{ color: "text.secondary" }}
                      ></FileUploadIcon>
                      <Typography
                        fontSize={"15px"}
                        variant="body1"
                        color="text.secondary"
                        fontWeight={400}
                      >
                        Select File
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Box>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <i className="fa-solid fa-file"></i>
                      <Link
                        to={registrationPaper.name}
                        variant="body1"
                        color="initial"
                      >
                        {registrationPaper.name.length > 20
                          ? registrationPaper.name.substring(0, 20) + "..."
                          : registrationPaper.name}
                      </Link>
                    </Stack>
                    <Button
                      sx={{ mt: 2 }}
                      onClick={handleClickRegis}
                      variant="contained"
                    >
                      Change File
                    </Button>
                  </Box>
                )}
              </Stack>

              <Stack
                sx={{ width: "30%", height: "200px" }}
                direction={"column"}
                spacing={2}
              >
                <Typography fontWeight={"400"} variant="body1">
                  Cetificate Paper: <span style={{ color: "red" }}>*</span>
                </Typography>
                <input
                  ref={cetificatePaperRef}
                  onChange={handleCetificatePaper}
                  type="file"
                  style={{ display: "none" }}
                />
                {cetificatePaper == null ? (
                  <Stack
                    sx={{
                      border: "1px dashed #ccc",
                      cursor: "pointer",
                      height: "100%",
                    }}
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    onClick={handleClickCetificate}
                  >
                    <Stack
                      direction={"column"}
                      spacing={0}
                      alignItems={"center"}
                    >
                      <FileUploadIcon
                        sx={{ color: "text.secondary" }}
                      ></FileUploadIcon>
                      <Typography
                        fontSize={"15px"}
                        variant="body1"
                        color="text.secondary"
                        fontWeight={400}
                      >
                        Select File
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Box>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <i className="fa-solid fa-file"></i>
                      <Link
                        to={cetificatePaper.name}
                        variant="body1"
                        color="initial"
                      >
                        {cetificatePaper.name.length > 20
                          ? cetificatePaper.name.substring(0, 20) + "..."
                          : cetificatePaper.name}
                      </Link>
                    </Stack>
                    <Button
                      sx={{ mt: 2 }}
                      onClick={handleClickCetificate}
                      variant="contained"
                    >
                      Change File
                    </Button>
                  </Box>
                )}
              </Stack>

              <Stack
                sx={{ width: "30%", height: "200px" }}
                direction={"column"}
                spacing={2}
              >
                <Typography fontWeight={400} variant="body1" color="initial">
                  Insurance: <span style={{ color: "red" }}>*</span>
                </Typography>
                <input
                  ref={insuranceRef}
                  onChange={handleInsurance}
                  type="file"
                  style={{ display: "none" }}
                />
                {insurance == null ? (
                  <Stack
                    sx={{
                      border: "1px dashed #ccc",
                      cursor: "pointer",
                      height: "100%",
                    }}
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    onClick={handleClickInsuracne}
                  >
                    <Stack
                      direction={"column"}
                      spacing={0}
                      alignItems={"center"}
                    >
                      <FileUploadIcon
                        sx={{ color: "text.secondary" }}
                      ></FileUploadIcon>
                      <Typography
                        fontSize={"15px"}
                        variant="body1"
                        color="text.secondary"
                        fontWeight={400}
                      >
                        Select File
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Box>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <i className="fa-solid fa-file"></i>
                      <Link to={insurance.name} variant="body1" color="initial">
                        {insurance.name.length > 20
                          ? insurance.name.substring(0, 20) + "..."
                          : insurance.name}
                      </Link>
                    </Stack>
                    <Button
                      sx={{ mt: 2 }}
                      onClick={handleClickInsuracne}
                      variant="contained"
                    >
                      Change File
                    </Button>
                  </Box>
                )}
              </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <Typography
                variant="body1"
                fontSize={"15px"}
                fontWeight={"400"}
                color="initial"
              >
                File Type:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                .doc, .docx, .pdf, .jpg, .jpe, .png
              </Typography>
            </Stack>
          </Box>

          <Stack sx={{ mt: 2 }} direction={"row"} spacing={1}>
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
          <Stack
            direction={"row"}
            justifyContent={"end"}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default EditBasicInfomation;
