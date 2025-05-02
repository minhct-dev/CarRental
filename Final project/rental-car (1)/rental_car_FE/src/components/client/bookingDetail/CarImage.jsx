import { Box, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const smallImgStyle = {
  width: "100%",
  height: "8rem",
  objectFit: "cover",
  overflow: "hidden",
  cursor: "pointer",
  filter: "brightness(80%)",
  transition: "0.3s",
};

const CarImage = ({ carImg }) => {
  const imagesData = carImg?.map((image) => ({
    original: image,
    thumbnail: image,
  }));

  const [openGallery, setOpenGallery] = useState(false);

  return (
    <>
      <Stack direction={"column"} sx={{ gap: 1, width: "55%" }}>
        <Box
          sx={{ width: "100%", cursor: "pointer" }}
          onClick={() => setOpenGallery(true)}
        >
          <img
            src={carImg?.[0]}
            alt="car1"
            style={{
              width: "100%",
              height: "370px",
              objectFit: "cover",
              overflow: "hidden",
            }}
          />
        </Box>

        <Stack direction={"row"} sx={{ gap: 1, justifyContent: "center" }}>
          <Box sx={{ width: "33.3%" }} onClick={() => setOpenGallery(true)}>
            <img src={carImg?.[1]} alt="car1" style={smallImgStyle} />
          </Box>
          <Box sx={{ width: "33.3%" }} onClick={() => setOpenGallery(true)}>
            <img src={carImg?.[2]} alt="car1" style={smallImgStyle} />
          </Box>
          <Box
            sx={{ width: "33.3%", position: "relative", cursor: "pointer" }}
            onClick={() => setOpenGallery(true)}
          >
            <img src={carImg?.[3]} alt="car1" style={smallImgStyle} />
            {
              carImg?.length > 4 && (<Typography
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
                {carImg?.length - 4}+
              </Typography>)
            }
            
          </Box>
        </Stack>
      </Stack>
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
    </>
  );
};

export default CarImage;
