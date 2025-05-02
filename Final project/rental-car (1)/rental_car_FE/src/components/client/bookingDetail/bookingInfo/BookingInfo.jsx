import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "../../profile/profile.scss";
import { Form } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditDriverLicense from "./EditDriverLicense";
import { editBookingDetailApi } from "../../../../api/bookingApi";
import SearchDriverModal from "./../../booking/Step1Component/SearchDriverModal";
import { formatVND } from "../../../../helper/function";
const schema = yup.object({
  name: yup.string().required("Full Name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits")
    .required("Phone is required"),
  dob: yup.string().required("Date of Birth is required"),
  nationalId: yup
    .string()
    .matches(/^\d{12}$/, "National ID must be exactly 12 digits"),
});

const formatISODate = (dateString) => {
  const dob = new Date(dateString);
  return dob.toISOString();
};

const editPermission = (status) => {
  if (status?.toLowerCase() === "pending_deposit") {
    return true;
  }
};

const handleDriverStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return { color: "#FFA733", label: "Pending" };
    case "confirm":
      return { color: "green", label: "Approved" };
    case "cancel":
      return { color: "red", label: "Rejected" };
    default:
      return { color: "#FFA733", label: "Pending" };
  }
};

const editDriverPermission = (driverStatus, status) => {
  if (
    driverStatus?.toLowerCase() === "confirm" ||
    status?.toLowerCase() !== "pending_deposit"
  ) {
    return true;
  }
  return false;
};

function BookingInfo({
  province,
  setSelectProvince,
  setSelectDistrict,
  setSelectWard,
  district,
  ward,
  selectDistrict,
  selectProvince,
  selectWard,
  bookingDetail,
}) {
  const [frontLicense, setFrontLicense] = useState(bookingDetail?.frontImg);
  const [backLicense, setBackLicense] = useState(bookingDetail?.backImg);

  const permission = editPermission(bookingDetail?.status);
  const [nullAddress, setNullAddress] = useState(null);

  //driver select address
  const [selectDriver, setSelectDriver] = useState(null);
  const [show, setShow] = useState(false);
  const [cancelDriver, setCancelDriver] = useState(null);
  const handleClose = () => {
    setShow(false);
  };
  const queryClient = useQueryClient();

  // set renter address
  useEffect(() => {
    if (bookingDetail?.province) {
      setSelectProvince(bookingDetail.province);
    }
    if (bookingDetail?.district) {
      setSelectDistrict(bookingDetail.district);
    }
    if (bookingDetail?.ward) {
      setSelectWard(bookingDetail.ward);
    }
  }, []);

  //select driver after cancel
  useEffect(() => {
    setCancelDriver(null);
  }, [selectDriver]);

  const { mutate } = useMutation({
    mutationFn: ({ id, data, frontFile, backFile }) =>
      editBookingDetailApi(id, data, frontFile, backFile),
    onSuccess: () => {
      Swal.close();
      setSelectDriver(null);
      setCancelDriver(null);
      queryClient.invalidateQueries({ queryKey: ["bookingDetail"] });
      queryClient.invalidateQueries({ queryKey: ["search-driver"] });
      Swal.fire({
        title: "Success!",
        text: "Update driver successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: () => {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Update failed. Booking is in progress",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
  // form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      name: bookingDetail?.name || "",
      phone: bookingDetail?.phone || "",
      dob: bookingDetail?.dob.split("T")[0] || "",
      nationalId: bookingDetail?.nationalId || "",
      addressDetail: bookingDetail?.addressDetail || "",
    },
  });
  // submit form
  const submitForm = (data) => {
    if (!selectProvince || !selectDistrict || !selectWard) {
      setNullAddress("Please select address!");
      window.scrollTo(0, window.scrollY - 300);
      return;
    }
    setNullAddress(null);
    Swal.fire({
      title: "Processing...",
      text: "It will take a few seconds.",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    let content = {
      ...data,
      dob: formatISODate(data.dob),
      wardCode: selectWard.code,
      districtCode: selectDistrict.code,
      provinceCode: selectProvince.code,
      driverId: selectDriver?.userId || cancelDriver,
    };

    mutate({
      id: bookingDetail.bookingId,
      data: content,
      frontFile: null,
      backFile: null,
    });
  };
  //cancel driver
  const handleCancelDriver = () => {
    setSelectDriver(null);
    setCancelDriver(0);
  };

  return (
    <Box
      sx={{
        py: "1rem",
        px: "2.5rem",
        backgroundColor: "white",
        borderRadius: "13px",
        mt: "1rem",
      }}
    >
      <Box>
        <Typography variant="h6" color="initial">
          Renter information
        </Typography>

        <Form onSubmit={handleSubmit(submitForm)}>
          <Container
            sx={{ px: 3, pb: 1, pt: 2, width: "83%" }}
            className="profile-account"
          >
            <Grid2 container columnSpacing={5} alignItems={"stretch"}>
              <Grid2 size={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Full name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    disabled
                    {...register("name")}
                    type="text"
                    placeholder="Enter Full Name"
                  />
                </Form.Group>
              </Grid2>

              <Grid2 size={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    placeholder="Enter email"
                    value={bookingDetail?.email}
                  />
                </Form.Group>
              </Grid2>

              <Grid2 size={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Phone Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    disabled={!permission}
                    type="text"
                    placeholder="Enter Phone Number"
                    {...register("phone")}
                  />
                </Form.Group>
                {errors.phone && (
                  <p
                    style={{ fontSize: "15px", fontStyle: "italic" }}
                    className="text-danger"
                  >
                    {errors.phone?.message}
                  </p>
                )}
              </Grid2>

              <Grid2 size={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    National ID <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    disabled
                    {...register("nationalId")}
                    type="text"
                    placeholder="National ID"
                  />
                </Form.Group>
              </Grid2>

              <Grid2 size={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Date of birth <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control disabled {...register("dob")} type="date" />
                </Form.Group>
              </Grid2>
              <Grid2 size={6}>
                <Form.Group className="mb-3">
                  <Stack direction={"column"}>
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      License Driver :
                    </Form.Label>

                    {(bookingDetail?.frontImg || bookingDetail?.backImg) && (
                      <Stack direction={"column"} spacing={2}>
                        <Stack direction={"row"} justifyContent={"center"}>
                          <img
                            src={frontLicense}
                            style={{
                              width: "130px",
                              height: "70px",
                              objectFit: "contain",
                            }}
                            alt={`License driver`}
                          />
                          <img
                            src={backLicense}
                            style={{
                              width: "130px",
                              height: "70px",
                              objectFit: "contain",
                            }}
                            alt={`License driver`}
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                </Form.Group>
              </Grid2>
              <Grid2 size={6}>
                <Form.Group className="mb-3" id="form-password">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Select province
                  </Form.Label>
                  <Autocomplete
                    disabled={!permission}
                    disablePortal
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    }}
                    options={province}
                    getOptionLabel={(option) => option.name}
                    value={
                      province?.find((p) => p.code === selectProvince?.code) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      setSelectProvince(newValue ? newValue : null);
                      setSelectDistrict(null);
                      setSelectWard(null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ "& input": { fontWeight: 400 } }}
                        {...params}
                      />
                    )}
                  />
                  {selectProvince == null && nullAddress && (
                    <p
                      style={{ fontSize: "15px", fontStyle: "italic" }}
                      className="text-danger"
                    >
                      {nullAddress}
                    </p>
                  )}
                </Form.Group>
              </Grid2>

              <Grid2 size={6}>
                <Form.Group className="mb-3" id="form-password">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Select district
                  </Form.Label>
                  <Autocomplete
                    disabled={!permission}
                    disablePortal
                    sx={{
                      width: "100%",
                      "& input": { fontWeight: 400 },
                      "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    }}
                    options={district || []}
                    getOptionLabel={(option) => option.name}
                    value={
                      district?.find((p) => p.code === selectDistrict?.code) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      setSelectDistrict(newValue ? newValue : null);
                      setSelectWard(null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ "& input": { fontWeight: 400 } }}
                        {...params}
                      />
                    )}
                  />
                  {selectDistrict == null && nullAddress && (
                    <p
                      style={{ fontSize: "15px", fontStyle: "italic" }}
                      className="text-danger"
                    >
                      {nullAddress}
                    </p>
                  )}
                </Form.Group>
              </Grid2>

              <Grid2 size={6}>
                <Form.Group className="mb-3" id="form-password">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Select ward
                  </Form.Label>
                  <Autocomplete
                    disabled={!permission}
                    disablePortal
                    sx={{
                      width: "100%",
                      "& input": { fontWeight: 400 },
                      "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    }}
                    options={ward || []}
                    getOptionLabel={(option) => option.name}
                    value={
                      ward?.find((p) => p.code === selectWard?.code) || null
                    }
                    onChange={(event, newValue) => {
                      setSelectWard(newValue ? newValue : null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ "& input": { fontWeight: 400 } }}
                        {...params}
                      />
                    )}
                  />
                  {selectWard == null && nullAddress && (
                    <p
                      style={{ fontSize: "15px", fontStyle: "italic" }}
                      className="text-danger"
                    >
                      {nullAddress}
                    </p>
                  )}
                </Form.Group>
              </Grid2>

              <Grid2 size={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                    Address Detail
                  </Form.Label>
                  <Form.Control
                    disabled={!permission}
                    {...register("addressDetail")}
                    type="text"
                  />
                </Form.Group>
              </Grid2>
            </Grid2>
          </Container>
          {/* driver info */}
          <Box>
            <Typography variant="h6" color="initial">
              Driver information
            </Typography>
            <Container
              sx={{ px: 3, pb: 3, pt: 2, width: "83%" }}
              className="profile-account"
            >
              <Grid2 container columnSpacing={5} alignItems={"stretch"}>
                {selectDriver == null && bookingDetail?.driverId == 0 && (
                  <Grid2 size={12}>
                    <Stack
                      direction={"row"}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="span" color="inherit">
                        You haven&apos;t booked driver
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setShow(true)}
                        sx={{ mb: 3 }}
                        disabled={!permission}
                      >
                        Book driver
                      </Button>
                    </Stack>
                  </Grid2>
                )}
                {(selectDriver != null || bookingDetail?.driverId != 0) && (
                  <>
                    {bookingDetail?.driverStatus === "CANCEL" && (
                      <Grid2 size={12} sx={{ pb: 2 }}>
                        <Typography
                          variant="p"
                          sx={{ fontStyle: "italic", color: "red" }}
                        >
                          Your driver has rejected your request. You could book
                          another driver or continue without driver by clicking
                          cancel button below then click Save.
                        </Typography>
                      </Grid2>
                    )}
                    <Grid2 size={6}>
                      Price:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {cancelDriver === 0
                          ? ""
                          : `${formatVND(
                              selectDriver?.price ?? bookingDetail?.driverPrice
                            )} /day`}
                      </span>
                    </Grid2>
                    <Grid2 size={6}>
                      <Stack
                        direction={"row"}
                        sx={{ justifyContent: "space-between" }}
                      >
                        {selectDriver == null && (
                          <Typography variant="span" color="inherit">
                            Status:{" "}
                            {cancelDriver !== 0 && (
                              <span
                                style={{
                                  color: handleDriverStatus(
                                    bookingDetail?.driverStatus
                                  )?.color,
                                  fontWeight: "bold",
                                }}
                              >
                                {
                                  handleDriverStatus(
                                    bookingDetail?.driverStatus
                                  )?.label
                                }
                              </span>
                            )}
                          </Typography>
                        )}
                        <Stack direction={"row"} gap={2}>
                          <Button
                            variant="contained"
                            onClick={() => setShow(true)}
                            sx={{ mb: 3 }}
                            disabled={editDriverPermission(
                              bookingDetail?.driverStatus,
                              bookingDetail?.status
                            )}
                          >
                            Change driver
                          </Button>
                          {selectDriver == null && cancelDriver != 0 && (
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ mb: 3 }}
                              disabled={editDriverPermission(
                                bookingDetail?.driverStatus,
                                bookingDetail?.status
                              )}
                              onClick={handleCancelDriver}
                            >
                              Cancel
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Grid2>
                  </>
                )}

                {!(
                  cancelDriver == null &&
                  selectDriver === null &&
                  bookingDetail?.driverId === 0
                ) && (
                  <>
                    <Grid2 size={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          Full name <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            cancelDriver === 0
                              ? ""
                              : selectDriver?.driverName ??
                                bookingDetail?.driverName
                          }
                          disabled
                        />
                      </Form.Group>
                    </Grid2>

                    <Grid2 size={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          Email <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          value={
                            cancelDriver === 0
                              ? ""
                              : selectDriver?.email ??
                                bookingDetail?.driverEmail
                          }
                        />
                      </Form.Group>
                    </Grid2>

                    <Grid2 size={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          Phone Number <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          value={
                            cancelDriver === 0
                              ? ""
                              : selectDriver?.phoneNumber ??
                                bookingDetail?.driverPhone
                          }
                        />
                      </Form.Group>
                    </Grid2>

                    <Grid2 size={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          National ID <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          value={
                            cancelDriver === 0
                              ? ""
                              : selectDriver?.nationalId ??
                                bookingDetail?.driverNationalId
                          }
                        />
                      </Form.Group>
                    </Grid2>

                    <Grid2 size={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          Date of birth <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          disabled
                          type="date"
                          value={
                            cancelDriver === 0
                              ? ""
                              : selectDriver?.dob?.split("T")[0] ??
                                bookingDetail?.driverDob?.split("T")[0]
                          }
                        />
                      </Form.Group>
                    </Grid2>

                    <Grid2 size={6}>
                      <Form.Group className="mb-3">
                        <Stack direction={"column"}>
                          <Form.Label
                            style={{ fontSize: "14px", fontWeight: 400 }}
                          >
                            License Driver :
                          </Form.Label>

                          {cancelDriver !== 0 && (
                            <Stack direction="row" justifyContent="center">
                              {(
                                selectDriver?.drivingLicense ??
                                bookingDetail?.driveLicense
                              )?.map((image) => (
                                <img
                                  key={image}
                                  src={image}
                                  style={{
                                    width: "130px",
                                    height: "70px",
                                    objectFit: "contain",
                                  }}
                                  alt="License driver"
                                />
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      </Form.Group>
                    </Grid2>
                  </>
                )}
              </Grid2>
            </Container>
          </Box>
          <Typography
            variant="span"
            color="red"
            sx={{ fontSize: "0.8rem", fontStyle: "italic" }}
          >
            <strong>Note:</strong> You can change or cancel the driver, but
            don’t forget to click the <strong>Save</strong> button to apply the
            changes.
          </Typography>
          <Stack direction={"row"} justifyContent={"end"}>
            <Button disabled={!permission} type="submit" variant="contained">
              Save
            </Button>
          </Stack>
        </Form>
        <SearchDriverModal
          startDate={formatISODate(bookingDetail?.from)}
          endDate={formatISODate(bookingDetail?.to)}
          setDriver={setSelectDriver}
          open={show}
          handleClose={handleClose}
        ></SearchDriverModal>
      </Box>
    </Box>
  );
}

export default BookingInfo;
