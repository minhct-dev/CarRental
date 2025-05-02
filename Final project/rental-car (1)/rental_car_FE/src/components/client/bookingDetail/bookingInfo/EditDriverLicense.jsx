import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Modal } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

function EditDriverLicense({
  show,
  closeModal,
  frontImage,
  setFrontImage,
  backImage,
  setBackImage,
  handleImageChange,
  handleSaveLicense,
  setTempFrontFile,
  setTempBackFile,
  imageError,
}) {
  return (
    <Modal size="lg" show={show} onHide={closeModal}>
      <Modal.Header closeButton>
          <Modal.Title>License Driver</Modal.Title>{" "}
          {imageError && <Alert severity="warning" sx={{position:"absolute", top:5, right:"21.5%"}}>{imageError}</Alert>}
      </Modal.Header>
      <Modal.Body>
        <Stack alignItems={"center"} direction={"column"} spacing={2}>
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
                  handleImageChange(e, setFrontImage, setTempFrontFile)
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
                  handleImageChange(e, setBackImage, setTempBackFile)
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
        <Button onClick={handleSaveLicense} variant="contained" color="primary">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditDriverLicense;
