import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import ImageStep2 from "./input/ImageStep2";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
const schema = yup.object({
  mileage: yup
    .number()
    .typeError("Mileage must be a number")
    .required("Mileage cannot be null")
    .min(1, "Mileage must be at least 1"),

  fuelConsumption: yup
    .number()
    .typeError("Fuel consumption must be a number")
    .min(0, "Invalid fuel consumption"),

  provinceCode: yup.string().required("Invalid province"),
  districtCode: yup.string().required("Invalid district"),
  wardCode: yup.string().required("Invalid ward"),
  addressDetails: yup.string().required("Address details cannot be blank"),
  description: yup
    .string()
    .nullable()
    .test(
      "maxWords",
      "Description is too long",
      function (value) {
        const wordCount = value ? value.trim().split(/\s+/).length : 0;
        return wordCount <= 250;
      }
    ), // Cho phép null hoặc chuỗi rỗng
});

const Step2 = ({
  carFunction,
  province,
  selectProvince,
  setSelectProvince,
  district,
  selectDistrict,
  setSelectDistrict,
  ward,
  selectWard,
  setSelectWard,
  process,
  mutate,
  backSave,
  err,
  setErr,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      mileage: process?.mileage || "", // @Min(1)
      fuelConsumption: process?.fuelConsumption || "", // @Min(0)
      provinceCode: process?.provinceCode || null, // @NotBlank
      districtCode: process?.districtCode || null, // @NotBlank
      wardCode: process?.wardCode || null, // @NotBlank
      addressDetails: process?.addressDetail || "", // @NotBlank
      description: process?.description || "", // Không có @NotBlank => có thể null
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const [selectCarFunction, setSelectCarFunction] = useState(
    process?.carFunctionsId || []
  );

  const handleSelectCarFunction = (id) => {
    setSelectCarFunction(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Bỏ nếu đã chọn
          : [...prev, id] // Thêm nếu chưa chọn
    );
  };

  useEffect(() => {
    if (process?.carImages) {
      const updatedImages = images.map((item, index) => {
        const matchedImage = process.carImages.filter(
          (carImage) => carImage.type === "CAR_IMAGE"
        )[index];

        return matchedImage ? { ...item, preview: matchedImage.url } : item;
      });

      setImages(updatedImages);
    }
  }, [process?.carImages]);
  const [images, setImages] = useState([
    { file: null, preview: null, index: 0 },
    { file: null, preview: null, index: 1 },
    { file: null, preview: null, index: 2 },
    { file: null, preview: null, index: 3 },
    { file: null, preview: null, index: 4 },
  ]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
    setSelectedImageIndex(null);
  };
  const handleOpen = (index) => {
    setSelectedImageIndex(index);
    setOpenModal(true);
  };

  const handleSave = (file, url) => {
    console.log(selectedImageIndex);

    let newArr = [...images];
    newArr[selectedImageIndex] = {
      file,
      preview: url,
      index: selectedImageIndex,
    };
    setImages(newArr);
    handleClose();
  };

  const handleClickSubmit = (type) => {
    handleSubmit((data) => onsubmit(data, type))();
  };

  const onsubmit = async (data, type) => {
    if (selectCarFunction.length == 0) {
      setErr("Please select car function");
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
      return;
    }
    if (process.step <= 1) {
      let index = images.findIndex((item) => item.preview == null);
      if (index != -1) {
        setErr("Please select all image of car");
        window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
        return;
      }
    }

    setErr(null);
    let formData = new FormData();
    let newData = { ...data, carFunctionsId: selectCarFunction };
    formData.append("obj", JSON.stringify(newData));
    for (const item of images) {
      if (item.file) {
        formData.append("file", item.file);
      } else {
        const response = await fetch(item.preview);
        const blob = await response.blob();
        // Lấy extension từ type
        const extension = blob.type.split("/")[1];
        const file = new File([blob], `image.${extension}`, {
          type: blob.type,
        });
        formData.append("file", file);
      }
    }
    formData.append("type", process.step > 1 ? "UPDATE" : "CREATE");
    formData.append("draftId", process.id);
    if (type == "next") {
      mutate(formData);
    } else {
      backSave(formData);
    }
    // mutate(formData);
  };

  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "50px",
        backgroundColor: "white",
      }}
    >
      <Container style={{ width: "100%" }}>
        <Typography
          sx={{ textAlign: "center", fontSize: "20px", fontWeight: 500 }}
          variant="h6"
          color="initial"
        >
          Details Infomation
        </Typography>
        <form onSubmit={handleSubmit(onsubmit)}>
          {err && (
            <Alert sx={{ my: 3 }} severity="error">
              {err}
            </Alert>
          )}
          <Grid2 sx={{ mt: 5 }} container rowSpacing={5} columnSpacing={5}>
            <Grid2 item size={6}>
              <Stack direction={"row"} alignItems={"end"}>
                <Typography
                  fontWeight={400}
                  sx={{ width: "30%" }}
                  variant="body1"
                  color="initial"
                >
                  Mileage: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack sx={{ width: "70%" }} direction={"row"}>
                  <TextField
                    error={Boolean(errors.mileage)}
                    helperText={
                      Boolean(errors.mileage) && errors.mileage.message
                    }
                    {...register("mileage")}
                    type="number"
                    sx={{
                      width: "80%",
                      label: { color: "text.secondary" },
                      "& input": {
                        fontWeight: 400,
                        fontSize: "15px",
                      },
                    }}
                    variant="standard"
                  />
                </Stack>
              </Stack>
            </Grid2>

            <Grid2 item size={6}>
              <Stack direction={"row"} alignItems={"end"}>
                <Typography
                  sx={{ width: "40%" }}
                  fontWeight={400}
                  variant="body1"
                  color="initial"
                >
                  Fuel Comsumption: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack
                  direction={"row"}
                  alignItems={"end"}
                  spacing={1}
                  sx={{ width: "60%" }}
                >
                  <TextField
                    error={Boolean(errors.fuelConsumption)}
                    helperText={
                      Boolean(errors.fuelConsumption) &&
                      errors.fuelConsumption.message
                    }
                    {...register("fuelConsumption")}
                    type="number"
                    sx={{
                      width: "50%",
                      label: { color: "text.secondary" },
                      "& input": {
                        fontWeight: 400,
                        fontSize: "15px",
                      },
                    }}
                    variant="standard"
                  />
                  <Typography
                    sx={{ width: "50%" }}
                    variant="body1"
                    color="initial"
                  >
                    Liter/ 100 Km
                  </Typography>
                </Stack>
              </Stack>
            </Grid2>

            <Grid2 item size={12}>
              <Typography fontWeight={400} variant="body1" color="initial">
                Address: <span style={{ color: "red" }}>*</span>
              </Typography>
              <Stack
                sx={{ mt: 2 }}
                spacing={2}
                direction="column"
                alignItems="center"
              >
                <Controller
                  name="provinceCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={province || []} // Make sure `province` is the array you're using
                        size="small"
                        value={selectProvince} // Ensure `selectProvince` is correctly set
                        getOptionLabel={(option) => option.name} // The label displayed in the dropdown
                        onChange={(e, v) => {
                          field.onChange(v ? v.code : null); // Use the code for the selected province
                          setSelectDistrict(null); // Reset district selection
                          setSelectWard(null); // Reset ward selection
                          setSelectProvince(v); // Set the selected province object
                        }}
                        sx={{ width: "70%" }}
                        renderInput={(params) => (
                          <TextField
                            error={Boolean(errors.provinceCode)} // Show error if there's an error
                            helperText={
                              Boolean(errors.provinceCode) &&
                              errors.provinceCode.message // Display the error message
                            }
                            variant="standard"
                            {...params}
                            sx={{
                              label: { color: "text.secondary" },
                              "& input": {
                                fontWeight: 400,
                                fontSize: "15px",
                              },
                            }}
                            label="City/Province" // Label of the dropdown
                          />
                        )}
                      />
                    );
                  }}
                />

                <Controller
                  name="districtCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={district || []}
                        size="small"
                        value={selectDistrict}
                        disabled={selectProvince != null ? false : true}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, v) => {
                          field.onChange(v ? v.code : null);
                          setSelectDistrict(v);
                          setSelectWard(null);
                        }}
                        sx={{ width: "70%" }}
                        renderInput={(params) => (
                          <TextField
                            error={Boolean(errors.districtCode)}
                            helperText={
                              Boolean(errors.districtCode) &&
                              errors.districtCode.message
                            }
                            variant="standard"
                            {...params}
                            sx={{
                              label: { color: "text.secondary" },
                              "& input": {
                                fontWeight: 400,
                                fontSize: "15px",
                              },
                            }}
                            label="District"
                          />
                        )}
                      />
                    );
                  }}
                />

                <Controller
                  name="wardCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={ward || []}
                        size="small"
                        value={selectWard}
                        disabled={selectDistrict != null ? false : true}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, v) => {
                          field.onChange(v ? v.code : null);
                          setSelectWard(v);
                        }}
                        sx={{ width: "70%" }}
                        renderInput={(params) => (
                          <TextField
                            error={Boolean(errors.wardCode)}
                            helperText={
                              Boolean(errors.wardCode) &&
                              errors.wardCode.message
                            }
                            variant="standard"
                            {...params}
                            sx={{
                              label: { color: "text.secondary" },
                              "& input": {
                                fontWeight: 400,
                                fontSize: "15px",
                              },
                            }}
                            label="Select Ward"
                          />
                        )}
                      />
                    );
                  }}
                />

                <TextField
                  {...register("addressDetails")}
                  error={Boolean(errors.addressDetails)}
                  helperText={
                    Boolean(errors.addressDetails) &&
                    errors.addressDetails.message
                  }
                  sx={{
                    width: "70%",
                    label: { color: "text.secondary" },
                    "& input": {
                      fontWeight: 400,
                      fontSize: "15px",
                    },
                  }}
                  label="Address Detail"
                  variant="standard"
                />
              </Stack>
            </Grid2>

            <Grid2 item size={12}>
              <Typography fontWeight={400} variant="body1" color="initial">
                Decription:
              </Typography>
              <Stack
                sx={{ mt: 2 }}
                spacing={2}
                direction="column"
                alignItems="center"
              >
                <Controller
                  name="description" // Tên của trường mà bạn muốn lưu dữ liệu
                  control={control} // Cung cấp control từ React Hook Form
                  defaultValue="" // Giá trị mặc định
                  render={({ field }) => (
                    <Editor
                      apiKey="c4y5k5sibpiohlgiyvsqk5b896c1d028ybc9tfcwea3qd1qm"
                      // eslint-disable-next-line no-unused-vars
                      onEditorChange={(content, editor) =>
                        field.onChange(content)
                      }
                      init={{
                        height: 500,
                        plugins: [
                          // Core editing features
                          "anchor",
                          "autolink",
                          "charmap",
                          "codesample",
                          "emoticons",
                          "image",
                          "link",
                          "lists",
                          "media",
                          "searchreplace",
                          "table",
                          "visualblocks",
                          "wordcount",
                          // Your account includes a free trial of TinyMCE premium features
                          // Try the most popular premium features until Mar 31, 2025:
                        ],
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                        tinycomments_mode: "embedded",
                        tinycomments_author: "Author name",
                        mergetags_list: [
                          { value: "First.Name", title: "First Name" },
                          { value: "Email", title: "Email" },
                        ],
                        ai_request: (request, respondWith) =>
                          respondWith.string(() =>
                            Promise.reject("See docs to implement AI Assistant")
                          ),
                      }}
                      value={field.value}
                    />
                  )}
                />
              </Stack>
            </Grid2>
          </Grid2>
          {errors.description && (
            <Stack direction={"row"} justifyContent={"center"}>
              <p
                style={{
                  color: "red",
                  marginTop: "5px",
                  fontSize: "14px",
                }}
              >
                {errors.description.message}
              </p>
            </Stack>
          )}

          <Box sx={{ mt: 5 }}>
            <Typography
              sx={{ textAlign: "center", fontSize: "20px", fontWeight: 500 }}
              variant="h6"
              color="initial"
            >
              Additional Function <span style={{ color: "red" }}>*</span>
            </Typography>

            <Grid2
              sx={{ mt: 5 }}
              rowSpacing={1}
              justifyContent={"center"}
              columnSpacing={5}
              container
            >
              {carFunction?.map((item, index) => {
                return (
                  <Grid2 size={2.5} key={index}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      spacing={1}
                      alignItems={"center"}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <i className={item.icon}></i>
                        <Typography
                          fontWeight={400}
                          fontSize={"15px"}
                          variant="body1"
                          color="text.secondary"
                        >
                          {item.name}
                        </Typography>
                      </Stack>
                      <Checkbox
                        checked={selectCarFunction.includes(item.id)}
                        onChange={() => handleSelectCarFunction(item.id)}
                      />
                    </Stack>
                  </Grid2>
                );
              })}
            </Grid2>
          </Box>

          <ImageStep2
            openModal={openModal}
            handleSave={handleSave}
            handleClose={handleClose}
            images={images}
            handleOpen={handleOpen}
          ></ImageStep2>

          <Stack
            sx={{ mt: 5 }}
            direction={"row"}
            spacing={2}
            justifyContent={"end"}
          >
            <Button
              type="button"
              onClick={() => handleClickSubmit("back")}
              variant="contained"
            >
              Back Step
            </Button>
            <Button
              type="button"
              onClick={() => handleClickSubmit("next")}
              variant="contained"
            >
              Next Step
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default Step2;
