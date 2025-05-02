import {
  Autocomplete,
  Box,
  Button,
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
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditDriverLicense from "./EditDriverLicense";
import { editBookingDetailApi } from "../../../../api/bookingApi";

const schema = yup.object({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
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
  if (
    status?.toLowerCase() === "confirmed" ||
    status?.toLowerCase() === "pending_deposit"
  ) {
    return true;
  }
};
function DriverInfo({
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
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [tempFrontFile, setTempFrontFile] = useState(null);
  const [tempBackFile, setTempBackFile] = useState(null);
  const [err, setErr] = useState(null);
  const permission = editPermission(bookingDetail.status);

  console.log(selectDistrict, selectWard, selectProvince);
  
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
    setErr(null);
    handleCloseLicense();
  };
  const [showLicense, setShowLicense] = useState(false);

  const handleCloseLicense = () => {
    setShowLicense(false);
  };
  const handleSaveLicense = () => {
    if (tempFrontFile) {
      setFrontFile(tempFrontFile);
    }
    if (tempBackFile) {
      setBackFile(tempBackFile);
    }
    setBackImage(null);
    setFrontImage(null);
    setShowLicense(false);
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

  useEffect(() => {
    if (bookingDetail.province) {
      setSelectProvince(bookingDetail.province);
    }
    if (bookingDetail.district) {
      setSelectDistrict(bookingDetail.district);
    }
    if (bookingDetail.ward) {
      setSelectWard(bookingDetail.ward);
    }
  }, []);

  const { mutate } = useMutation({
    mutationFn: ({ id, data, frontFile, backFile }) =>
      editBookingDetailApi(id, data, frontFile, backFile),
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Update driver successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: "Update failed. Booking is in progress",
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
      name: bookingDetail?.name || "",
      email: bookingDetail?.email || "",
      phone: bookingDetail?.phone || "",
      dob: bookingDetail?.dob.split("T")[0] || "",
      nationalId: bookingDetail?.nationalId || "",
      addressDetail: bookingDetail?.addressDetail || "",
    },
  });

  const submitForm = (data) => {
    let content = {
      ...data,
      dob: formatISODate(data.dob),
      wardCode: selectWard,
      districtCode: selectDistrict,
      provinceCode: selectProvince,
    };

    mutate({
      id: bookingDetail.id,
      data: content,
      frontFile: frontFile || null,
      backFile: backFile || null,
    });
  };

  return (
    <Box>
      <Typography variant="h6" color="initial">
        Driver information
      </Typography>
      <Box sx={{ px: 3, pb: 3 }} className="profile-account">
        <Form onSubmit={handleSubmit(submitForm)}>
          <Grid2 container spacing={2} alignItems={"stretch"}>
            <Grid2 size={6}>
              <Form.Group className="mb-3" id="form-password">
                <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                  Select province
                </Form.Label>
                <Autocomplete
                  readOnly={!permission}
                  disablePortal
                  sx={{ width: "100%" }}
                  size="small"
                  options={province}
                  getOptionLabel={(option) => option.name}
                  value={
                    province?.find((p) => p.code === selectProvince) || null
                  }
                  onChange={(event, newValue) =>
                    setSelectProvince(newValue ? newValue.code : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      sx={{ "& input": { fontWeight: 400 } }}
                      {...params}
                    />
                  )}
                />
              </Form.Group>
            </Grid2>

            <Grid2 size={6}>
              <Form.Group className="mb-3" id="form-password">
                <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                  Select district
                </Form.Label>
                <Autocomplete
                  readOnly={!permission}
                  disablePortal
                  sx={{ width: "100%", "& input": { fontWeight: 400 } }}
                  size="small"
                  options={district || []}
                  getOptionLabel={(option) => option.name}
                  value={
                    district?.find((p) => p.code === selectDistrict) || null
                  }
                  onChange={(event, newValue) =>
                    setSelectDistrict(newValue ? newValue.code : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      sx={{ "& input": { fontWeight: 400 } }}
                      {...params}
                    />
                  )}
                />
              </Form.Group>
            </Grid2>

            <Grid2 size={6}>
              <Form.Group className="mb-3" id="form-password">
                <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                  Select ward
                </Form.Label>
                <Autocomplete
                  readOnly={!permission}
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
                    />
                  )}
                />
              </Form.Group>
            </Grid2>

            <Grid2 size={6}>
              <Form.Group className="mb-3" id="form-password">
                <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                  Select driver
                </Form.Label>
                <Autocomplete
                  readOnly={!permission}
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
                    />
                  )}
                />
              </Form.Group>
            </Grid2>
          </Grid2>
          <Stack sx={{ mt: 3 }} direction={"row"} justifyContent={"end"}>
            <Button disabled={!permission} type="submit" variant="contained">
              Save
            </Button>
          </Stack>
        </Form>
      </Box>
      <EditDriverLicense
        show={showLicense}
        handleClose={handleCloseLicense}
        closeModal={closeModal}
        err={err}
        frontImage={frontImage}
        setFrontImage={setFrontImage}
        setFrontFile={setFrontFile}
        backImage={backImage}
        setBackImage={setBackImage}
        setBackFile={setBackFile}
        handleImageChange={handleImageChange}
        setFrontLicense={setFrontLicense}
        setBackLicense={setBackLicense}
        handleSaveLicense={handleSaveLicense}
        setTempFrontFile={setTempFrontFile}
        setTempBackFile={setTempBackFile}
      />
    </Box>
  );
}

export default DriverInfo;
