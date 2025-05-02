/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Grid2,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "./profile.scss";
import { Form } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AvatarModal from "./modal/AvatarModal";
import EditDriverLicense from "./../bookingDetail/bookingInfo/EditDriverLicense";
import { getProfileDraftApi, updateDraftProfile } from "./../../../api/userApi";
import { useQueryClient } from "@tanstack/react-query";
import { Alert } from "@mui/material";
import Loading from "../../../pages/client/loading/Loading";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../api/addressApi";
import DraftViewModal from "../../driver/profile/DraftViewModal";
import dayjs from "dayjs";

// eslint-disable-next-line no-unused-vars

const schema = yup.object({
  name: yup.string().required("Full Name is required"),
  dob: yup
    .date()
    .typeError("Date of birth is required")
    .required("Date of birth is required")
    .test("is-18", "You must be at least 18 years old", (value) => {
      return value && dayjs().diff(dayjs(value), "year") >= 18;
    }),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits")
    .required("Phone is required"),

  nationalId: yup
    .string()
    .matches(/^\d{12}$/, "National ID must be exactly 12 digits"),
  addressDetail: yup.string().required("Address detail is required"),
});

const convertDate = (dob) => {
  if (!dob) return "";
  const parts = dob.split("/");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-MM-dd
};

const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "";

  const parts = dateString.split("-");
  if (parts.length !== 3) return "";

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const editPermission = (draftStatus) => {
  if (draftStatus && draftStatus === "PENDING") {
    return true;
  }
  return false;
};

const ChangeProfile = ({
  data,
  province,
  setSelectProvince,
  setSelectDistrict,
  setSelectWard,
  district,
  ward,
  selectDistrict,
  selectProvince,
  selectWard,
}) => {
  useEffect(() => {
    if (data.provinceName) {
      setSelectProvince(data.provinceName);
    }
    if (data.districtName) {
      setSelectDistrict(data.districtName);
    }
    if (data.wardName) {
      setSelectWard(data.wardName);
    }
  }, []);

  const [show, setShow] = useState(false);
  const [showLicense, setShowLicense] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleCloseLicense = () => {
    setShowLicense(false);
  };
  // driver license change
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState(null);
  const [frontLicense, setFrontLicense] = useState(null);
  const [backLicense, setBackLicense] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [tempFrontFile, setTempFrontFile] = useState(null);
  const [tempBackFile, setTempBackFile] = useState(null);
  const permission = editPermission(data.draftStatus);

  const handleImageChange = (event, setImage, setTempFile) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setTempFile((prevFile) => {
        return file;
      });
    }
  };

  const closeModal = () => {
    setBackImage(null);
    setFrontImage(null);
    setImageError(null);
    setTempFrontFile(null);
    setTempBackFile(null);
    handleCloseLicense();
  };
  const handleSaveLicense = () => {
    if (
      (tempFrontFile != null && tempBackFile == null) ||
      (tempFrontFile == null && tempBackFile != null)
    ) {
      setImageError("You have to choose both images!");
    }
    if (
      (tempFrontFile && tempBackFile) ||
      (tempFrontFile == null && tempBackFile == null)
    ) {
      setFrontFile(tempFrontFile);
      setBackFile(tempBackFile);

      setBackImage(null);
      setFrontImage(null);
      setShowLicense(false);
      setImageError(null);
    }
  };

  useEffect(() => {
    if (frontFile instanceof File) {
      const frontPreviewImg = URL.createObjectURL(frontFile);
      setFrontLicense(frontPreviewImg);
    }

    if (backFile instanceof File) {
      const backPreviewImg = URL.createObjectURL(backFile);
      setBackLicense(backPreviewImg);
    }
  }, [frontFile, backFile]);

  const { mutate } = useMutation({
    mutationFn: (data) => updateDraftProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      Swal.fire({
        title: "Success!",
        text: "Update profile successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      name: data?.name || "",
      phone: data?.phone || "",
      dob: convertDate(data?.dob) || "",
      nationalId: data?.nationalId || "",
      addressDetail: data?.addressDetail || "",
      description: data?.description || "",
    },
  });

  const submitForm = (data) => {
    if (!selectProvince || !selectDistrict || !selectWard) {
      setNullAddress("Please select address!");
      return;
    }
    setNullAddress(null);
    let content = {
      ...data,
      dob: dayjs(data.dob).format("DD/MM/YYYY"),
      wardCode: selectWard,
      districtCode: selectDistrict,
      provinceCode: selectProvince,
    };
    const formData = new FormData();
    formData.append("obj", JSON.stringify(content));
    if (frontFile) {
      formData.append("files", frontFile);
    }
    if (backFile) {
      formData.append("files", backFile);
    }
    mutate(formData);
  };

  // View draft update
  const [nullAddress, setNullAddress] = useState(null);
  const [openDraft, setOpenDraft] = useState(false);
  const handleOpenDraft = () => setOpenDraft(true);
  const handleCloseDraft = () => setOpenDraft(false);
  const handleSeeDetail = () => {
    handleOpenDraft();
  };
  // api get draft details
  const shouldFetchDraft =
    data?.draftId != 0 &&
    (data?.draftStatus === "PENDING" || data?.draftStatus === "REJECTED");

  const { data: draftProfile, isLoading: isLoadingDraft } = useQuery({
    queryKey: ["draftProfile", data?.draftId, data?.draftStatus],
    queryFn: getProfileDraftApi,
    enabled: shouldFetchDraft,
  });

  // draft address
  const [draftProvince, setDraftProvince] = useState(null);
  const [draftDistrict, setDraftDistrict] = useState(null);
  const [draftWard, setDraftWard] = useState(null);
  useEffect(() => {
    getProvinceApi().then((res) => {
      setDraftProvince(res);
    });
  }, [draftProfile]);
  useEffect(() => {
    if (draftProfile?.provinceName) {
      setDraftWard(null);
      getDistrictApi(draftProfile?.provinceName).then((res) => {
        setDraftDistrict(res);
      });
    }
  }, [draftProfile?.provinceName]);
  useEffect(() => {
    if (draftProfile?.districtName) {
      getWardApi(draftProfile?.districtName).then((res) => {
        setDraftWard(res);
      });
    }
  }, [draftProfile?.districtName]);
  const draftProvinceName = draftProvince?.find(
    (p) => p.code === draftProfile?.provinceName
  )?.name;
  const draftDistrictName = draftDistrict?.find(
    (p) => p.code === draftProfile?.districtName
  )?.name;
  const draftWardName = draftWard?.find(
    (p) => p.code === draftProfile?.wardName
  )?.name;

  if (isLoadingDraft) return <Loading />;
  return (
    <Box
      sx={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: "10px",
      }}
    >
      <Stack direction={"row"} sx={{ height: "100%" }} spacing={3}>
        <Box
          sx={{
            width: "55%",
            backgroundColor: "primary.main",
            borderBottomLeftRadius: "10px",
            borderTopLeftRadius: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            direction={"column"}
            alignItems={"center"}
            sx={{ mt: "10%" }}
            spacing={1}
          >
            <Box
              onClick={() => setShow(true)}
              sx={{ position: "relative", cursor: "pointer" }}
            >
              <Avatar
                src={data.avatarUrl}
                sx={{ width: "100px", height: "100px" }}
              ></Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: "5%",
                  width: "27px",
                  height: "27px",
                  textAlign: "center",
                  lineHeight: "27px",
                  backgroundColor: "#f3f3f3",
                  borderRadius: "50%",
                }}
              >
                <EditNoteIcon></EditNoteIcon>
              </Box>
            </Box>
            <Typography
              fontSize={"18px"}
              fontWeight={600}
              variant="body1"
              color="white"
            >
              Hello, {data.name}
            </Typography>
            <Typography
              fontSize={"14px"}
              fontWeight={500}
              variant="body1"
              color="white"
            >
              {data?.roles.find((role) => role === "carOwner")
                ? "Car owner"
                : "Customer"}
            </Typography>
          </Stack>
        </Box>

        <Box>
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              pb: 3,
              pt: 5,
              px: 2,
              alignItems: "center",
            }}
          >
            <Typography
              variant="h3"
              fontSize={"23px"}
              fontWeight={600}
              color="initial"
            >
              Edit My Profile
            </Typography>
            {data?.draftStatus === "PENDING" ? (
              <Alert severity="info">
                Your update profile request is pending.{" "}
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={handleSeeDetail}
                  color="inherit"
                >
                  View detail
                </Link>
              </Alert>
            ) : data?.draftStatus === "REJECTED" ? (
              <Alert severity="error">
                Your update profile request is rejected.{" "}
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={handleSeeDetail}
                  color="inherit"
                >
                  View detail
                </Link>
              </Alert>
            ) : null}
          </Stack>
          <Box sx={{ px: 3, pb: 3 }} className="profile-account">
            <Form onSubmit={handleSubmit(submitForm)}>
              <Grid2 container spacing={2} alignItems={"stretch"}>
                <Grid2 size={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      Full name <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      disabled={permission}
                      {...register("name")}
                      type="text"
                      placeholder="Enter Full Name"
                    />
                    {errors.name && (
                      <p
                        style={{ fontSize: "15px", fontStyle: "italic" }}
                        className="text-danger"
                      >
                        {errors.name?.message}
                      </p>
                    )}
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
                      placeholder="Enter Full Name"
                      value={data?.email || ""}
                    />
                  </Form.Group>
                </Grid2>

                <Grid2 size={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      Phone Number <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      disabled={permission}
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
                      disabled={permission}
                      {...register("nationalId")}
                      type="text"
                      placeholder="National ID"
                    />
                  </Form.Group>
                  {errors.nationalId && (
                    <p
                      style={{ fontSize: "15px", fontStyle: "italic" }}
                      className="text-danger"
                    >
                      {errors.nationalId?.message}
                    </p>
                  )}
                </Grid2>

                <Grid2 size={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      Date of birth <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      {...register("dob")}
                      type="date"
                      disabled={permission}
                    />
                  </Form.Group>
                  {errors.dob && (
                    <p
                      style={{ fontSize: "15px", fontStyle: "italic" }}
                      className="text-danger"
                    >
                      {errors.dob?.message}
                    </p>
                  )}
                </Grid2>

                <Grid2 size={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      License Driver :
                    </Form.Label>
                    <Stack direction={"column"} spacing={2}>
                      {frontLicense != null || backLicense != null ? (
                        <Stack direction={"row"} justifyContent={"center"}>
                          <img
                            src={frontLicense || data.drivingLicenseUrl[0]}
                            style={{
                              width: "130px",
                              height: "70px",
                              objectFit: "contain",
                            }}
                            alt={`License driver`}
                          />
                          <img
                            src={backLicense || data.drivingLicenseUrl[1]}
                            style={{
                              width: "130px",
                              height: "70px",
                              objectFit: "contain",
                            }}
                            alt={`License driver`}
                          />
                        </Stack>
                      ) : data.drivingLicenseUrl[0] != null &&
                        data.drivingLicenseUrl[1] != null ? (
                        <Stack direction={"row"} justifyContent={"center"}>
                          {data.drivingLicenseUrl.map((item, index) => (
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
                      ) : null}
                      <Stack direction={"row"} justifyContent={"center"}>
                        <Button
                          disabled={permission}
                          onClick={() => setShowLicense(true)}
                          variant="contained"
                          color="primary"
                        >
                          Change License Driver
                        </Button>
                      </Stack>
                    </Stack>
                  </Form.Group>
                </Grid2>

                <Grid2 size={6}>
                  <Form.Group className="mb-3" id="form-password">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      Select province <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Autocomplete
                      disabled={permission}
                      disablePortal
                      sx={{ width: "100%" }}
                      size="small"
                      options={province}
                      getOptionLabel={(option) => option.name}
                      value={
                        province?.find((p) => p.code === selectProvince) || null
                      }
                      onChange={(event, newValue) => {
                        setSelectProvince(newValue ? newValue.code : null);
                        setSelectDistrict(null);
                        setSelectWard(null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ "& input": { fontWeight: 400 } }}
                          {...params}
                          error={selectProvince === null && !!nullAddress}
                          helperText={
                            selectProvince === null ? nullAddress : ""
                          }
                        />
                      )}
                    />
                  </Form.Group>
                </Grid2>

                <Grid2 size={6}>
                  <Form.Group className="mb-3" id="form-password">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      Select district <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Autocomplete
                      disabled={permission}
                      disablePortal
                      sx={{ width: "100%", "& input": { fontWeight: 400 } }}
                      size="small"
                      options={district || []}
                      getOptionLabel={(option) => option.name}
                      value={
                        district?.find((p) => p.code === selectDistrict) || null
                      }
                      onChange={(event, newValue) => {
                        setSelectDistrict(newValue ? newValue.code : null);
                        setSelectWard(null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ "& input": { fontWeight: 400 } }}
                          {...params}
                          error={selectDistrict === null && !!nullAddress}
                          helperText={
                            selectDistrict === null ? nullAddress : ""
                          }
                        />
                      )}
                    />
                  </Form.Group>
                </Grid2>

                <Grid2 size={6}>
                  <Form.Group className="mb-3" id="form-password">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      Select ward <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Autocomplete
                      disabled={permission}
                      disablePortal
                      sx={{ width: "100%", "& input": { fontWeight: 400 } }}
                      size="small"
                      options={ward || []}
                      getOptionLabel={(option) => option.name}
                      value={ward?.find((p) => p.code === selectWard) || null}
                      onChange={(event, newValue) =>
                        setSelectWard(newValue ? newValue.code : null)
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ "& input": { fontWeight: 400 } }}
                          {...params}
                          error={selectWard === null && !!nullAddress}
                          helperText={selectWard === null ? nullAddress : ""}
                        />
                      )}
                    />
                  </Form.Group>
                </Grid2>

                <Grid2 size={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                      Address Detail <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      {...register("addressDetail")}
                      type="text"
                      disabled={permission}
                    />
                    {errors.addressDetail && (
                      <p
                        style={{ fontSize: "15px", fontStyle: "italic" }}
                        className="text-danger"
                      >
                        {errors.addressDetail?.message}
                      </p>
                    )}
                  </Form.Group>
                </Grid2>
                {data?.roles.find((role) => role === "carOwner") && (
                  <Grid2 size={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                        Description
                      </Form.Label>
                      <Form.Control
                        {...register("description")}
                        type="text"
                        disabled={permission}
                      />
                    </Form.Group>
                  </Grid2>
                )}
              </Grid2>
              <Stack sx={{ mt: 3 }} direction={"row"} justifyContent={"end"}>
                <Button type="submit" variant="contained" disabled={permission}>
                  Save
                </Button>
              </Stack>
            </Form>
          </Box>
        </Box>
      </Stack>

      <AvatarModal show={show} handleClose={handleClose}></AvatarModal>
      <EditDriverLicense
        imageError={imageError}
        show={showLicense}
        handleClose={handleCloseLicense}
        closeModal={closeModal}
        handleSaveLicense={handleSaveLicense}
        setFrontImage={setFrontImage}
        setBackImage={setBackImage}
        frontImage={frontImage}
        backImage={backImage}
        handleImageChange={handleImageChange}
        setTempFrontFile={setTempFrontFile}
        setTempBackFile={setTempBackFile}
      />
      <DraftViewModal
        open={openDraft}
        handleClose={handleCloseDraft}
        draft={draftProfile}
        draftStatus={data?.draftStatus}
        draftRejectMessage={data?.draftRejectMessage}
        roles={data.roles}
        draftProvinceName={draftProvinceName}
        draftDistrictName={draftDistrictName}
        draftWardName={draftWardName}
      />
    </Box>
  );
};

export default ChangeProfile;
