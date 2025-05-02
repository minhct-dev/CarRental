import { Box, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Container } from "react-bootstrap";
import ImageGallery from "react-image-gallery";
const PreviewEdit = ({ process }) => {
  let arrImage = process.carImages.filter((item) => item.type == "CAR_IMAGE");
  const imagesData = arrImage?.map((image) => ({
    original: image.url,
    thumbnail: image.url,
  }));

  const [openGallery, setOpenGallery] = useState(false);

  return (
    <Box
      sx={{
        paddingTop: "20px",
      }}
    >
      <Container>
        <Typography
          sx={{ textAlign: "center", fontSize: "25px", fontWeight: 500, my: 2 }}
          variant="h6"
          color="initial"
        >
          Edit {process.name} ( {process.licencePlate} )
        </Typography>
        <Stack direction={"row"} spacing={2} sx={{ with: "100%" }}>
          <Box sx={{ width: "60%" }}>
            <img
              style={{ width: "100%", height: "418px", objectFit: "cover" }}
              src={arrImage != null && arrImage[0].url}
              alt=""
            />
          </Box>
          <Stack
            sx={{ width: "40%" }}
            justifyContent={"space-between"}
            direction={"column"}
            spacing={1}
          >
            <Box>
              <img
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                src={arrImage != null && arrImage[1].url}
                alt=""
              />
            </Box>

            <Box onClick={() => setOpenGallery(true)} sx={{ position: "relative", cursor: "pointer" }}>
              <img
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  filter: "brightness(50%)",
                }}
                src={arrImage != null && arrImage[2].url}
                alt="Car 5"
              />
              <Typography
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: "35px",
                  fontWeight: "400",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                {arrImage?.length - 3}+
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Container>
      <Modal
        open={openGallery}
        onClose={() => setOpenGallery(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{ width: "80%", bgcolor: "white", borderRadius: "10px", p: 2 }}
        >
          <ImageGallery
            items={imagesData}
            showThumbnails={true}
            showPlayButton={false}
            showFullscreenButton={true}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default PreviewEdit;
