/* eslint-disable react/display-name */
import { Button, Stack } from "@mui/material";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Swal from "sweetalert2";

const CropImage = forwardRef(({ handleSave }, ref) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const uploadRef = useRef();
  const CROP_WIDTH = 290;
  const CROP_HEIGHT = 200;
  const ASPECT_RATIO = CROP_WIDTH / CROP_HEIGHT;

  // Expose onCropDone to parent
  useImperativeHandle(ref, () => ({
    onCropDone,
  }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon:"error",
          text:"Please select image file"
        })
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "px",
          width: CROP_WIDTH,
          height: CROP_HEIGHT,
        },
        ASPECT_RATIO,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const onCropDone = () => {
    if (completedCrop && imgRef.current) {
      const image = imgRef.current;
      const crop = completedCrop;

      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const extension = blob.type.split("/")[1];
            const file = new File([blob], `image.${extension}`, {
              type: blob.type,
            });

            const url = URL.createObjectURL(file);
            handleSave(file, url);
          }
        },
        "image/png",
        1.0
      );
    }
  };

  return (
    <div className="p-5">
      <input
        ref={uploadRef}
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {!selectedImage && (
        <Stack direction={"row"} justifyContent={"center"}>
          <Button
            onClick={() => uploadRef.current.click()}
            startIcon={<CloudUploadIcon />}
            variant="contained"
          >
            Click to upload
          </Button>
        </Stack>
      )}

      {selectedImage && (
        <>
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ASPECT_RATIO}
            minWidth={CROP_WIDTH}
            minHeight={CROP_HEIGHT}
            keepSelection
          >
            <img
              ref={imgRef}
              src={selectedImage}
              alt="Preview"
              onLoad={onImageLoad}
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
              }}
            />
          </ReactCrop>
        </>
      )}
    </div>
  );
});

export default CropImage;
