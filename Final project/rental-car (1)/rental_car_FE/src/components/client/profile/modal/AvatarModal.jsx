/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, Button } from "@mui/material";
import { Modal } from "react-bootstrap";
import Avatar from "react-avatar-edit";
import { useMutation } from "@tanstack/react-query";
import { uploadAvatarApi } from "../../../../api/userApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../../main";

const AvatarModal = ({ show, handleClose }) => {
  const [preview, setPreview] = useState(null);
  const onClose = () => {
    setPreview(null);
  };
  const closeModal = () => {
    setPreview(null);
    handleClose();
  };

  const onCrop = (preview) => {
    setPreview(preview);
  };
  const handleUpload = () => {
    fetch(preview)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "avatar.png", { type: "image/png" });
        let formData = new FormData();
        formData.append("file", file);
        mutate(formData);
      });
  };

  const { mutate } = useMutation({
    mutationFn: (data) => uploadAvatarApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile'])
      closeModal()
      Swal.fire({
        icon: "success",
        text: "Change avatar success",
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        text: "Lỗi ",
      });
    },
  });

  return (
    <Modal size="lg" show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Change Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar width={300} height={300} onCrop={onCrop} onClose={onClose} />
          {preview && (
            <Box mt={2} textAlign="center">
              <h4>Ảnh xem trước:</h4>
              <img
                src={preview}
                alt="Preview"
                width={150}
                height={150}
                style={{ borderRadius: "50%" }}
              />
            </Box>
          )}
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          color="secondary"
          onClick={closeModal}
        >
          Cancle
        </Button>
        <Button onClick={handleUpload} variant="contained" color="primary">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvatarModal;
