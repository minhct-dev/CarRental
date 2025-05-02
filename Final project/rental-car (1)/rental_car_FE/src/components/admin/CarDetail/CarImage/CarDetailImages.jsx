/* eslint-disable react/prop-types */
import { Box, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
// eslint-disable-next-line react/prop-types
const CarDetailImages = ({images}) => {

  let imagesArray = images.filter((item) => {
      return item.type == "CAR_IMAGE"
  })
  console.log(imagesArray);
    console.log(imagesArray);
    
  const imagesData = imagesArray?.map((image) => ({
    original: image.url,
    thumbnail: image.url,
  }));

  const [openGallery, setOpenGallery] = useState(false);
  return (
    <>
      <Stack direction={"row"} spacing={2} sx={{ with: "100%" }}>
        <Box sx={{ width: "60%" }}>
          <img
            style={{ width: "100%", height: "418px", objectFit: "cover" }}
            src={imagesArray != null && imagesArray[0].url}
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
              src={imagesArray != null && imagesArray[1].url}
              alt=""
            />
          </Box>

          <Box
            onClick={() => setOpenGallery(true)}
            sx={{ position: "relative", cursor: "pointer" }}
          >
            <img
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                filter: "brightness(50%)",
              }}
              src={imagesArray != null && imagesArray[2].url}
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
              {imagesArray?.length - 3}+
            </Typography>
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

export default CarDetailImages;
