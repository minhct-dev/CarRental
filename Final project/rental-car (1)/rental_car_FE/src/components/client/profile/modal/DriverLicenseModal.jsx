import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Modal } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { useMutation } from "@tanstack/react-query";
import { updateLicenseDriverApi } from "../../../../api/userApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../../main";

const DriverLicenseModal = ({ show, handleClose }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [err, setErr] = useState(null);
  const handleImageChange = (event, setImage, setFile) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setFile(file);
    }
  };

  const { mutate } = useMutation({
    mutationFn: (data) => updateLicenseDriverApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      closeModal();
      Swal.fire({
        icon: "success",
        text: "Update driver license success",
      });
    },
    onError: () => {
      closeModal();
      Swal.fire({
        icon: "error",
        text: "Update driver license fail",
      });
    },
  });

  const handleUpload = () => {
    console.log(frontFile);
    console.log(backFile);
    if (frontFile == null || backFile == null) {
      setErr("You must upload exactly two images for the driving license");
    } else {
      let formData = new FormData();
      formData.append("files", frontFile);
      formData.append("files", backFile);
      mutate(formData);
    }
  };
  const closeModal = () => {
    setBackImage(null);
    setFrontImage(null);
    setErr(null);
    setBackFile(null);
    setFrontFile(null);
    handleClose();
  };

  return (
    <Modal size="lg" show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>License Driver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack alignItems={"center"} direction={"column"} spacing={2}>
          {err && (
            <Alert sx={{ width: "70%" }} severity="error">
              {err}
            </Alert>
          )}
          {/* License Front Image */}
          <Stack
            direction={"row"}
            spacing={3}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              sx={{ fontWeight: 400, fontSize: "15px" }}
              variant="body1"
            >
              License Driver Front Image:
            </Typography>
            <Box
              sx={{
                width: "250px",
                height: "130px",
                border: "1px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                objectFit: "cover",
              }}
              component="label"
            >
              {frontImage ? (
                <img
                  src={frontImage}
                  alt="Front License"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <AddIcon sx={{ fontSize: 40, color: "#aaa" }} />
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  handleImageChange(e, setFrontImage, setFrontFile)
                }
              />
            </Box>
          </Stack>

          {/* License Back Image */}
          <Stack
            direction={"row"}
            spacing={3}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              sx={{ fontWeight: 400, fontSize: "15px" }}
              variant="body1"
            >
              License Driver Back Image:
            </Typography>
            <Box
              sx={{
                width: "250px",
                height: "130px",
                border: "1px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
              }}
              component="label"
            >
              {backImage ? (
                <img
                  src={backImage}
                  alt="Back License"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <AddIcon sx={{ fontSize: 40, color: "#aaa" }} />
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  handleImageChange(e, setBackImage, setBackFile)
                }
              />
            </Box>
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={closeModal}
          sx={{ mr: 2 }}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <Button onClick={handleUpload} variant="contained" color="primary">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DriverLicenseModal;
