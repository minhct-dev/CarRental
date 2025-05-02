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
import { useState } from "react";
import ImageStep2 from "../addCar/input/ImageStep2";
import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

const EditDetail = ({
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
  data,
  handleSubmit,
  register,
  control,
  errors,
  submit,
  selectCarFunction,
  setSelectCarFunction,
  err,
  images,
  setImages,
}) => {
  // eslint-disable-next-line no-unused-vars
  const handleSelectCarFunction = (id) => {
    setSelectCarFunction(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Bỏ nếu đã chọn
          : [...prev, id] // Thêm nếu chưa chọn
    );
  };
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

 
  

  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "50px",
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
        <form onSubmit={handleSubmit(submit)}>
          {err && (
            <Alert sx={{ my: 3 }} severity="error">
              Please select some car function
            </Alert>
          )}
          <Grid2 sx={{ mt: 5 }} container rowSpacing={5} columnSpacing={5}>
            <Grid2 item size={6}>
              <Box>
                <Typography fontWeight={400} variant="body1" color="initial">
                  Mileage: <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack direction={"row"} justifyContent={"end"}>
                  <TextField
                    disabled={data.status == "PENDING"}
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
              </Box>
            </Grid2>

            <Grid2 item size={6}>
              <Box>
                <Typography fontWeight={400} variant="body1" color="initial">
                  Fuel Comsumption:
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"end"}
                  spacing={1}
                  alignItems={"center"}
                >
                  <TextField
                    disabled={data.status == "PENDING"}
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
                  <Typography variant="body1" color="initial">
                    Liter/ 100 Km
                  </Typography>
                </Stack>
              </Box>
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
                        disabled={data.status == "PENDING"}
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
                        sx={{ width: "60%" }}
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
                        disabled={
                          data.status === "PENDING" || selectProvince == null
                        }
                        getOptionLabel={(option) => option.name}
                        onChange={(e, v) => {
                          field.onChange(v ? v.code : null);
                          setSelectDistrict(v);
                          setSelectWard(null);
                        }}
                        sx={{ width: "60%" }}
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
                        disabled={
                          data.status === "PENDING" || selectDistrict == null
                        }
                        getOptionLabel={(option) => option.name}
                        onChange={(e, v) => {
                          field.onChange(v ? v.code : null);
                          setSelectWard(v);
                        }}
                        sx={{ width: "60%" }}
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
                  disabled={data.status == "PENDING"}
                  error={Boolean(errors.addressDetails)}
                  helperText={
                    Boolean(errors.addressDetails) &&
                    errors.addressDetails.message
                  }
                  sx={{
                    width: "60%",
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
                sx={{ mt: 1 }}
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
                        readonly: true,
                        height: 500,
                        width: 800,
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
              justifyContent={"center"}
              rowSpacing={1}
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
                        disabled={data.status == "PENDING"}
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
            isPending={data.status == "PENDING"}
          ></ImageStep2>

          <Stack sx={{ mt: 3 }} direction={"row"} spacing={1}>
            <Typography
              variant="body1"
              fontSize={"15px"}
              fontWeight={"400"}
              color="initial"
            >
              Note:
            </Typography>
            <Typography variant="body1" color="red">
              <i>
                If you edit this car&apos;s information, it will need to be
                reviewed by an admin. During this time, your car will not be
                able to receive bookings.
              </i>
            </Typography>
          </Stack>

          {data.status != "PENDING" && (
            <Stack sx={{ mt: 2 }} direction={"row"} spacing={1}>
              <Typography
                variant="body1"
                fontSize={"15px"}
                fontWeight={"400"}
                color="initial"
                sx={{ width: "100px" }}
              >
                Reject Reason:
              </Typography>
              <Typography variant="body1" color="red">
                <i>{data.rejectMessage}</i>
              </Typography>
            </Stack>
          )}

          <Stack
            sx={{ mt: 3 }}
            direction={"row"}
            spacing={2}
            justifyContent={"end"}
          >
            {data.status != "PENDING" && (
              <Button type="submit" variant="contained">
                Save
              </Button>
            )}
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default EditDetail;
