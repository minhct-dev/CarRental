import { Box, Button, Grid2, Stack, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImageModal from "./ImageModal";
import RefreshIcon from "@mui/icons-material/Refresh";
const ImageStep2 = ({
  images,
  handleOpen,
  handleSave,
  openModal,
  handleClose,
  isPending
}) => {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        sx={{ textAlign: "center", fontSize: "20px", fontWeight: 500 }}
        variant="h6"
        color="initial"
      >
        Car Images <span style={{ color: "red" }}>*</span>
      </Typography>

      <Typography
        sx={{ textAlign: "center", fontSize: "15px", fontWeight: 400, mt: 2 }}
        variant="h6"
        color="#ccc"
      >
        Note: Please select images for the your car (front, rear, left, right,
        interior).
      </Typography>
      <Grid2 sx={{ mt: 5 }} container columnSpacing={2} rowSpacing={2}>
        {images.map((item) => {
          return (
            <Grid2 key={item.index} size={4}>
              {images[item.index].preview != null ? (
                <Box
                  position={"relative"}
                  sx={{ width: "270px", height: "200px" }}
                >
                  <img
                    style={{
                      borderRadius: "10px",
                      width: "100%",
                      height: "100%",
                    }}
                    src={images[item.index].preview}
                  />
                  <Button
                    onClick={()  => handleOpen(item.index)}
                    sx={{
                      position: "absolute",
                      minWidth: "5px !important",
                      padding: "2px 2px",
                      backgroundColor: "white",
                      top: "10px",
                      right: "10px",
                    }}
                    variant="contained"
                  >
                    {!isPending && <RefreshIcon sx={{ color: "primary.main" }}></RefreshIcon>}
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "270px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "10px",
                    height: "200px",
                    border: "1px dashed #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen(item.index)}
                >
                  <Stack direction={"column"} spacing={1} alignItems={"center"}>
                    <AddPhotoAlternateIcon
                      sx={{ color: "text.secondary" }}
                    ></AddPhotoAlternateIcon>
                    <Typography variant="body1" color="text.secondary">
                      Select Image
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Grid2>
          );
        })}
      </Grid2>

      <ImageModal
        handleSave={handleSave}
        show={openModal}
        handleClose={handleClose}
      ></ImageModal>
    </Box>
  );
};

export default ImageStep2;
