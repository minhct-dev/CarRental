import {
  Alert,
  Backdrop,
  Box,
  Grid2,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatVND } from "./../../../helper/function";

const style = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -20%)",
  width: "50vw",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  px: 5,
  py: 3,
  maxHeight: "95vh",
  overflowY: "auto",
};

function DraftViewModal({
  open,
  handleClose,
  draft,
  draftStatus,
  draftRejectMessage,
  roles,
  draftProvinceName,
  draftDistrictName,
  draftWardName,
}) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Grid2 container spacing={2}>
            {draftStatus === "REJECTED" && (
              <Grid2 size={12}>
                <Alert severity="error">
                  <strong>Your update profile request is rejected:</strong>{" "}
                  {draftRejectMessage}
                </Alert>
              </Grid2>
            )}
            <Grid2 size={12}>
              <Typography
                variant="span"
                sx={{ fontWeight: 600, fontSize: "1.3rem" }}
              >
                Personal infomation
              </Typography>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  Full name
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draft?.name}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  Phone number
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draft?.phone}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  National ID
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draft?.nationalId}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  Date of birth
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draft?.dob}
                </Typography>
              </Stack>
            </Grid2>
            {roles?.find((role) => role === "driver") && (
              <>
                <Grid2 size={6}>
                  <Stack direction={"column"}>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 400, color: "#999BA0" }}
                    >
                      Driver Experience (years)
                    </Typography>
                    <Typography variant="span" sx={{ fontWeight: 500 }}>
                      {draft?.driverExp}
                    </Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={6}>
                  <Stack direction={"column"}>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 400, color: "#999BA0" }}
                    >
                      Driver price / day
                    </Typography>
                    <Typography variant="span" sx={{ fontWeight: 500 }}>
                      {draft?.price ? formatVND(draft?.price) : ""}
                    </Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={6}>
                  <Stack direction={"column"}>
                    <Typography
                      variant="span"
                      sx={{ fontWeight: 400, color: "#999BA0" }}
                    >
                      LateFee / Hours
                    </Typography>
                    <Typography variant="span" sx={{ fontWeight: 500 }}>
                      {draft?.lateFee ? formatVND(draft?.lateFee) : ""}
                    </Typography>
                  </Stack>
                </Grid2>
              </>
            )}
            {roles?.find((role) => role === "carOwner") && (
              <Grid2 size={6}>
                <Stack direction={"column"}>
                  <Typography
                    variant="span"
                    sx={{ fontWeight: 400, color: "#999BA0" }}
                  >
                    Description
                  </Typography>
                  <Typography variant="span" sx={{ fontWeight: 500 }}>
                    {draft?.description}
                  </Typography>
                </Stack>
              </Grid2>
            )}

            <Grid2 size={6}>
              <Stack direction={"column"}>
                {draft?.drivingLicenseUrl?.length > 0 && (
                  <Typography
                    variant="span"
                    sx={{ fontWeight: 400, color: "#999BA0" }}
                  >
                    License driver
                  </Typography>
                )}
                <Stack direction={"row"} sx={{ gap: 1, pt: 0.5}}>
                  {draft?.drivingLicenseUrl?.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "50%",
                        height: "5.5rem",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        style={{  height:"100%", objectFit: "cover" }}
                        src={img}
                      />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Grid2>
            <Grid2 size={12}>
              <Typography
                variant="span"
                sx={{ fontWeight: 600, fontSize: "1.3rem" }}
              >
                Address
              </Typography>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  Province
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draftProvinceName}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  District
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draftDistrictName}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  Ward
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draftWardName}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Stack direction={"column"}>
                <Typography
                  variant="span"
                  sx={{ fontWeight: 400, color: "#999BA0" }}
                >
                  Address detail
                </Typography>
                <Typography variant="span" sx={{ fontWeight: 500 }}>
                  {draft?.addressDetail}
                </Typography>
              </Stack>
            </Grid2>
          </Grid2>
        </Box>
      </Modal>
    </div>
  );
}

export default DraftViewModal;
