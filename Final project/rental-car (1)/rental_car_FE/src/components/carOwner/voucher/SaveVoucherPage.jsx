import {
  Box,
  Stack,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  Autocomplete,
  Checkbox,
  Grid2,
  IconButton,
  Container,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addNewVoucherCarOwnerApi,
  createVoucherAdminApi,
  editVoucherAdminApi,
  editVoucherCarOwner,
} from "../../../api/voucherApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useSelector } from "react-redux";
import { getModelApi } from "../../../api/carApi";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { deFormatPrice, formatPrice } from "../../../helper/function";
// Validation Schema using Yup

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const SaveVoucherPage = ({ listCar, voucherDetail, selectId, brand }) => {
  const profile = useSelector((state) => state.auth.profile);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
    setFocus,
    clearErrors,
    control,
  } = useForm({
    defaultValues: {
      code: voucherDetail?.code || "",
      name: voucherDetail?.name || "",
      scope: voucherDetail?.scope || "PUBLIC",
      description: voucherDetail?.description || "",
      listCarId: [],
      startDate: null,
      endDate: null,
      quantity:
        voucherDetail?.quantity == null || voucherDetail?.quantity == -1
          ? ""
          : voucherDetail?.quantity,
      percentRate: voucherDetail?.percentRate || "",
      maxPrice: voucherDetail?.maxPrice || "",
      fixedPrice: voucherDetail?.fixedPrice || "",
      listModelId: [],
      brandId: null,
    },
  });
  const [selectBrand, setSelectBrand] = useState(null);
  const { data: model } = useQuery({
    queryKey: ["model", selectBrand],
    queryFn: () => getModelApi(selectBrand),
    enabled: selectBrand != null,
  });

  useEffect(() => {
    if (voucherDetail) {
      if (voucherDetail.quantity != -1) {
        setIsSelectQuantity(true);
      }
      if (voucherDetail.listCarId.length > 0) {
        let defaultListCar = [];
        voucherDetail.listCarId.forEach((element) => {
          let item = listCar.find((i) => i.carId == element);
          defaultListCar.push(item);
        });
        setValue("listCarId", defaultListCar);
        setIsSelectCarChecked(true);
      }
      if (voucherDetail.startDate != "") {
        setValue("startDate", dayjs(voucherDetail.startDate));
        setValue("endDate", dayjs(voucherDetail.endDate));
        setIsSelectDate(true);
      }
      if (voucherDetail.percentRate != 0) {
        setDiscountMethod(0);
        if (voucherDetail.maxPrice != 0) {
          setValue("maxPrice", formatPrice(voucherDetail.maxPrice));
        }
      }
      if (voucherDetail.percentRate == 0) {
        setDiscountMethod(1);
        setValue("fixedPrice", formatPrice(voucherDetail.fixedPrice));
      }
      if (voucherDetail.brandId != null && voucherDetail.brandId != 0) {
        let item = brand.find((i) => i.id == voucherDetail.brandId);
        setSelectBrand(voucherDetail.brandId);
        setIsSelectBrand(true);
        setValue("brandId", item);
      }

      if (voucherDetail?.imageUrl) {
        setPreviewUrl(voucherDetail.imageUrl);
      }
    }
  }, [voucherDetail]);
  // Cập nhật khi model trong trường hợp update
  useEffect(() => {
    if (voucherDetail?.listModelId.length > 0) {
      let defaultListModel = [];
      voucherDetail.listModelId.forEach((element) => {
        let item = model?.find((i) => i.id == element);
        defaultListModel.push(item);
      });

      setValue("listModelId", defaultListModel);
      setIsSelectModel(true);
    }
  }, [model]);

  const { mutate } = useMutation({
    mutationFn: (data) => {
      if (!profile.roles.includes("admin")) {
        return addNewVoucherCarOwnerApi(data);
      } else {
        return createVoucherAdminApi(data);
      }
    },
    onSuccess: () => {
      if (profile.roles.includes("admin")) {
        navigate("/admin/voucher");
      } else {
        navigate("/car-owner/voucher");
      }
      Swal.fire({
        icon: "success",
        text: "Add new voucher success",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
      });
    },
  });

  const { mutate: editVoucher } = useMutation({
    mutationFn: (data) => {
      if (!profile.roles.includes("admin")) {
        return editVoucherCarOwner(selectId, data);
      } else {
        return editVoucherAdminApi(selectId, data);
      }
    },
    onSuccess: () => {
      if (profile.roles.includes("admin")) {
        navigate("/admin/voucher");
      } else {
        navigate("/car-owner/voucher");
      }
      queryClient.refetchQueries(["list-voucher-owner"]);
      Swal.fire({
        icon: "success",
        text: "Edit voucher success",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
      });
    },
  });

  const [isSelectCarChecked, setIsSelectCarChecked] = useState(false); // New state to control if checkbox is checked
  const [isSelectDate, setIsSelectDate] = useState(false);
  const [isSelectQuantity, setIsSelectQuantity] = useState(false);
  const [isSelectBrand, setIsSelectBrand] = useState(false);
  //state for select model
  const [isSelectModel, setIsSelectModel] = useState(false);
  const [discountMethod, setDiscountMethod] = useState(0);

  // Sample data for car options
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChangeClick = () => {
    fileInputRef.current.click();
  };

  // This is the array for all input fields, making the code much cleaner.
  const inputFields = [
    {
      name: "code",
      label: "Code",
      type: "text",
      required: true,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
  ];

  const onsubmit = (data) => {
    const errors = {}; // Store errors
    if (data.code == "") {
      errors.code = {
        type: "manual",
        message: "Code is required",
      };
    }
    if (data.code.length < 5) {
      errors.code = {
        type: "manual",
        message: "Code have min length is 5 characters",
      };
    }
    if (data.code.length > 10) {
      errors.code = {
        type: "manual",
        message: "Code have max lenghth is 10 characters",
      };
    }
    if (data.name == "") {
      errors.name = {
        type: "manual",
        message: "Voucher name is required",
      };
    }

    if (discountMethod == 0) {
      if (data.percentRate === "" || data.percentRate === undefined) {
        errors.percentRate = {
          type: "manual",
          message: "Please enter percent amount",
        };
      } else if (isNaN(data.percentRate)) {
        errors.percentRate = {
          type: "manual",
          message: "Percent amount must be a number",
        };
      } else if (
        parseFloat(data.percentRate) <= 0 ||
        parseFloat(data.percentRate) > 100
      ) {
        errors.percentRate = {
          type: "manual",
          message: "Percent amount is greater than 0 and lower than 100",
        };
      }
      if (deFormatPrice(data.maxPrice) < 0) {
        errors.maxPrice = {
          type: "manual",
          message: "Max price cannot be negative",
        };
      }
    }
    if (discountMethod == 1) {
      if (data.fixedPrice === "" || data.fixedPrice === undefined) {
        errors.fixedPrice = {
          type: "manual",
          message: "Please enter discount amount",
        };
      }
    }
    if (isSelectDate) {
      if (data.startDate && data.endDate) {
        // Kiểm tra startDate phải bé hơn endDate
        const start = dayjs(data.startDate);
        const end = dayjs(data.endDate);

        if (start.isAfter(end)) {
          errors.endDate = {
            type: "manual",
            message: "End date must be after start date",
          };
        }
      }
    }

    if (isSelectQuantity) {
      if (parseInt(data.quantity) < 0) {
        errors.quantity = {
          type: "manual",
          message: "Quantity is greater than 0",
        };
      }
    }
    if (Object.keys(errors).length > 0) {
      // Set all errors at once
      Object.entries(errors).forEach(([key, value]) => {
        setError(key, value);
        setFocus(key);
      });
      return; // Stop execution if there are errors
    }
    const formattedData = {
      ...data,
      startDate: data.startDate
        ? dayjs(data.startDate).format("YYYY-MM-DD")
        : "",
      endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : "",
      listCarId: data.listCarId ? data.listCarId.map((car) => car.carId) : [],
      listModelId:
        data.listModelId.length > 0
          ? data.listModelId.map((model) => model.id)
          : [],
      maxPrice: data.maxPrice != "" ? deFormatPrice(data.maxPrice) : "",
      brandId: selectBrand,
      fixedPrice: data.fixedPrice != "" ? deFormatPrice(data.fixedPrice) : "",
      quantity:
        data.quantity === "" || data.quantity === undefined
          ? -1
          : parseInt(data.quantity),
    };

    if (profile.roles.includes("admin")) {
      delete formattedData.listCarId;
      let formData = new FormData();
      formData.append("obj", JSON.stringify(formattedData));
      formData.append("systemImg", selectedFile);
      if (selectId && voucherDetail) {
        editVoucher(formData);
      } else {
        mutate(formData);
      }
    } else {
      delete formattedData.listModelId;
      delete formattedData.brandId;
      if (selectId && voucherDetail) {
        editVoucher(formattedData);
      } else {
        mutate(formattedData);
      }
    }
  };

  const handleChangeDiscountMethod = (e) => {
    let method = e.target.value;
    if (method == 0) {
      setValue("fixedPrice", "");
    } else {
      setValue("percentRate", "");
      setValue("maxPrice", "");
    }
    setDiscountMethod(method);
  };

  const handleIsSelectCar = () => {
    if (isSelectCarChecked) {
      setValue("listCarId", []);
    }
    setIsSelectCarChecked(!isSelectCarChecked);
  };
  const handleIsSelectDate = () => {
    if (isSelectDate) {
      setValue("startDate", null);
      setValue("endDate", null);
    }
    setIsSelectDate(!isSelectDate);
  };

  const handleIsSelectQuantity = () => {
    if (isSelectQuantity) {
      setValue("quantity", "");
    }
    setIsSelectQuantity(!isSelectQuantity);
  };
  //handleIsselectBrand
  const handleIsSelectBrand = () => {
    if (isSelectBrand) {
      setValue("brandId", null);
      setSelectBrand(null);
      setValue("listModelId", []);
      setIsSelectModel(false);
    }
    setIsSelectBrand(!isSelectBrand);
  };

  const handleIsSelectModel = () => {
    if (isSelectModel) {
      setValue("listModelId", []);
    }
    setIsSelectModel(!isSelectModel);
  };

  function getRandomCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const handleRandomCode = () => {
    setValue("code", getRandomCode());
  };
  return (
    <Box
      sx={{
        pt: "5vh",
        pb: 5,
        backgroundColor: profile.roles.includes("admin")
          ? "transparent"
          : "#FAFAFB",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit(onsubmit)}
        style={{
          width: "90%",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          borderRadius: "10px",
        }}
      >
        <Container>
          <Typography sx={{ my: 3 }} variant="h6" color="initial">
            {selectId ? "Edit Voucher" : "Add New Voucher"}
          </Typography>
          <Grid2 rowSpacing={2} columnSpacing={3} container>
            {inputFields.map((field, index) => (
              <Grid2 size={6} key={index}>
                <Stack direction="row" justifyContent="space-between">
                  <Box sx={{ width: "20%" }}>
                    <Typography
                      fontWeight={400}
                      variant="body1"
                      color="initial"
                    >
                      {field.label} :{" "}
                      {field.required && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "80%", display: "flex", gap: 3 }}>
                    <TextField
                      {...register(field.name)}
                      size="small"
                      type={field.type}
                      fullWidth
                      error={!!errors[field.name]}
                      helperText={errors[field.name]?.message}
                      placeholder={field.label}
                      sx={{
                        width: "60%",
                        label: { color: "#ccc" },
                        "& input": { fontWeight: 400, fontSize: "15px" },
                      }}
                      onChange={(e) => {
                        if (field.name === "code") {
                          setValue(field.name, e.target.value.toUpperCase());
                        } else {
                          register(field.name).onChange(e);
                        }
                      }}
                    />
                    {field.name === "code" && (
                      <Button onClick={handleRandomCode}>Random Code</Button>
                    )}
                  </Box>
                </Stack>
              </Grid2>
            ))}

            <Grid2 size={6}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Box sx={{ width: "20%" }}>
                  <Typography fontWeight={400} variant="body1" color="initial">
                    Scope :
                  </Typography>
                </Box>
                <Box sx={{ width: "80%" }}>
                  <FormControl component="fieldset">
                    <Controller
                      name="scope"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          {...field}
                          defaultValue={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value); // Cập nhật giá trị vào form
                          }}
                        >
                          <FormControlLabel
                            value="PRIVATE"
                            control={<Radio />}
                            label="Private"
                          />
                          <FormControlLabel
                            value="PUBLIC"
                            control={<Radio />}
                            label="Public"
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Box>
              </Stack>
            </Grid2>

            <Grid2 size={12}>
              <Box sx={{ width: "100%" }}>
                <FormControl sx={{ width: "100%" }} component="fieldset">
                  <RadioGroup value={discountMethod} name="discountMethod">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label={
                          <>
                            Discount by percentage
                            {discountMethod == 0 && (
                              <span style={{ color: "red", marginLeft: "5px" }}>
                                *
                              </span>
                            )}
                          </>
                        }
                        onChange={handleChangeDiscountMethod}
                      />
                      {discountMethod == 0 && (
                        <Stack
                          sx={{ width: "60%" }}
                          direction={"row"}
                          spacing={2}
                        >
                          <TextField
                            label="Discount Percent (%) "
                            {...register("percentRate")}
                            error={!!errors.percentRate}
                            helperText={errors.percentRate?.message}
                            type="number"
                            size="small"
                            sx={{
                              width: "50%",
                              label: { color: "#ccc" },
                              "& input": {
                                fontWeight: 400,
                                fontSize: "15px",
                              },
                            }}
                          />
                          <TextField
                            label="Max price (Optional)"
                            {...register("maxPrice")}
                            type="text"
                            size="small"
                            onChange={(e) =>
                              setValue("maxPrice", formatPrice(e.target.value))
                            }
                            error={!!errors.maxPrice}
                            helperText={errors.maxPrice?.message}
                            sx={{
                              width: "50%",
                              label: { color: "#ccc" },
                              "& input": {
                                fontWeight: 400,
                                fontSize: "15px",
                              },
                            }}
                          />
                        </Stack>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label={
                          <>
                            Discount Amount
                            {discountMethod == 1 && (
                              <span style={{ color: "red", marginLeft: "5px" }}>
                                *
                              </span>
                            )}
                          </>
                        }
                        onChange={handleChangeDiscountMethod}
                      />

                      {discountMethod == 1 && (
                        <TextField
                          label="Discount amount (VND)"
                          {...register("fixedPrice")}
                          error={!!errors.fixedPrice}
                          helperText={errors.fixedPrice?.message}
                          type="text"
                          onChange={(e) =>
                            setValue("fixedPrice", formatPrice(e.target.value))
                          }
                          size="small"
                          sx={{
                            width: "30%",
                            label: { color: "#ccc" },
                            "& input": {
                              fontWeight: 400,
                              fontSize: "15px",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid2>

            {/* select target car */}
            {!profile.roles.includes("admin") && (
              <Grid2 size={8}>
                <Typography variant="body2" color="text.secondary">
                  Select if you want to add a voucher for any car{" "}
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Box sx={{ width: "30%" }}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelectCarChecked}
                            onChange={handleIsSelectCar}
                          />
                        }
                        label="Select Car:"
                      />
                    </Stack>
                  </Box>
                  {isSelectCarChecked && (
                    <Box sx={{ width: "60%" }}>
                      <Controller
                        name="listCarId"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            options={listCar || []}
                            sx={{ width: "100% !important" }}
                            size="small"
                            disabled={!isSelectCarChecked}
                            value={watch("listCarId")} // ✅
                            onChange={(e, v) => {
                              field.onChange(v); // ✅ Cập nhật giá trị thành mảng ID
                            }}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.carName}
                            // Kiểm tra trùng khớp giữa option và value
                            getOptionSelected={(option, value) =>
                              option.carId === value.carId
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.carId === value.carId
                            }
                            renderOption={(props, option, { selected }) => {
                              const { key, ...optionProps } = props;
                              return (
                                <li key={key} {...optionProps}>
                                  <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option.carName} ({" "}
                                  <span style={{ fontSize: "15px" }}>
                                    {option.licensePlate}
                                  </span>
                                  )
                                </li>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Car"
                                error={!!errors.listCarId}
                                helperText={errors.listCarId?.message}
                                sx={{
                                  label: { color: "text.secondary" },
                                  "& input": {
                                    fontWeight: 400,
                                    fontSize: "15px",
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid2>
            )}

            {/* select for target brand */}
            {profile.roles.includes("admin") && (
              <Grid2 size={8}>
                <Typography variant="body2" color="text.secondary">
                  Select if you want to add a voucher for any brand{" "}
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Box sx={{ width: "30%" }}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelectBrand}
                            onChange={handleIsSelectBrand}
                          />
                        }
                        label="Select Brand:"
                      />
                    </Stack>
                  </Box>
                  {isSelectBrand && (
                    <Box sx={{ width: "60%" }}>
                      <Controller
                        name="brandId"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={brand || []}
                            sx={{ width: "100% !important" }}
                            size="small"
                            value={watch("brandId")} // ✅
                            onChange={(e, v) => {
                              setSelectBrand(v.id);
                              field.onChange(v); // ✅ Cập nhật giá trị thành mảng ID
                            }}
                            ư
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Brand"
                                error={!!errors.brandId}
                                helperText={errors.brandId?.message}
                                sx={{
                                  label: { color: "text.secondary" },
                                  "& input": {
                                    fontWeight: 400,
                                    fontSize: "15px",
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid2>
            )}
            {/* select for target model */}
            {profile.roles.includes("admin") && selectBrand && (
              <Grid2 size={8}>
                <Typography variant="body2" color="text.secondary">
                  Select if you want to add a voucher for any model{" "}
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Box sx={{ width: "30%" }}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelectModel}
                            onChange={handleIsSelectModel}
                          />
                        }
                        label="Select Model:"
                      />
                    </Stack>
                  </Box>
                  {isSelectModel && (
                    <Box sx={{ width: "60%" }}>
                      <Controller
                        name="listModelId"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            options={model || []}
                            sx={{ width: "100% !important" }}
                            size="small"
                            value={watch("listModelId")} // Giữ nguyên giá trị là mảng các đối tượng hoặc ID
                            onChange={(e, v) => {
                              field.onChange(v); // Cập nhật giá trị thành mảng đối tượng hoặc mảng ID
                            }}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option?.name}
                            getOptionSelected={(option, value) =>
                              option.id === value.id
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            renderOption={(props, option, { selected }) => {
                              const { key, ...optionProps } = props;
                              return (
                                <li key={key} {...optionProps}>
                                  <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option.name}
                                </li>
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Model"
                                error={!!errors.listCarId}
                                helperText={errors.listCarId?.message}
                                sx={{
                                  label: { color: "text.secondary" },
                                  "& input": {
                                    fontWeight: 400,
                                    fontSize: "15px",
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid2>
            )}

            <Grid2 size={8}>
              <Typography variant="body2" color="text.secondary">
                Select if you want the voucher to be valid for a specific period{" "}
              </Typography>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems="start"
                sx={{ mt: 2 }}
              >
                <Box sx={{ width: "30%" }}>
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelectDate}
                          onChange={handleIsSelectDate}
                        />
                      }
                      label="Select Date :"
                    />
                  </Stack>
                </Box>
                {isSelectDate && (
                  <Box sx={{ width: "60%" }}>
                    <Stack direction={"column"} spacing={1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box>
                          <DatePicker
                            disabled={!isSelectDate}
                            label="From Date"
                            defaultValue={watch("startDate")}
                            onChange={(newValue) => {
                              setValue("startDate", newValue);
                              clearErrors("startDate");
                            }}
                            slotProps={{
                              textField: {
                                size: "small", // Đặt kích thước nhỏ cho TextField bên trong DatePicker
                                sx: {
                                  width: "100%",
                                  label: { color: "text.secondary" },
                                  "& input": {
                                    fontWeight: 400,
                                    fontSize: "15px",
                                  },
                                },
                                error: !!errors.startDate,
                                helperText: errors.startDate?.message,
                              },
                            }}
                          />
                        </Box>
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box>
                          <DatePicker
                            label="To Date"
                            disabled={!isSelectDate}
                            defaultValue={watch("endDate")}
                            onChange={(newValue) => {
                              setValue("endDate", newValue);
                              clearErrors("endDate");
                            }}
                            slotProps={{
                              textField: {
                                size: "small", // Đặt kích thước nhỏ cho TextField bên trong DatePicker
                                sx: {
                                  width: "100%",
                                  label: { color: "text.secondary" },
                                  "& input": {
                                    fontWeight: 400,
                                    fontSize: "15px",
                                  },
                                },
                                error: !!errors.endDate,
                                helperText: errors.endDate?.message,
                              },
                            }}
                          />
                        </Box>
                      </LocalizationProvider>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Grid2>

            <Grid2 size={8}>
              <Typography variant="body2" color="text.secondary">
                Select if you want to set a voucher quantity
              </Typography>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Box sx={{ width: "30%" }}>
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelectQuantity}
                          onChange={handleIsSelectQuantity}
                        />
                      }
                      label="Select Quantity :"
                    />
                  </Stack>
                </Box>
                {isSelectQuantity && (
                  <Box sx={{ width: "60%" }}>
                    <Stack direction={"column"} spacing={1}>
                      <TextField
                        size="small"
                        fullWidth
                        label={"Quantity"}
                        type="number"
                        {...register("quantity")}
                        disabled={!isSelectQuantity}
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                        sx={{
                          width: "100%",
                          label: { color: "text.secondary" },
                          "& input": {
                            fontWeight: 400,
                            fontSize: "15px",
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Grid2>

            <Grid2 size={12}>
              <Typography variant="body2" color="text.secondary">
                Description
              </Typography>
              <Stack
                direction="row"
                justifyContent="center" // ✅ Căn giữa theo chiều ngang
                alignItems="center"
                sx={{ mt: 2, width: "100%" }}
              >
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const wordCount = value
                        ?.replace(/<[^>]*>/g, "") // loại bỏ thẻ HTML
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length;
                      return (
                        wordCount <= 100 ||
                        "Nội dung không được vượt quá 100 từ"
                      );
                    },
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Editor
                        apiKey="c4y5k5sibpiohlgiyvsqk5b896c1d028ybc9tfcwea3qd1qm"
                        init={{
                          height: 400,
                          width: 700,
                          plugins: [
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
                          ],
                          toolbar:
                            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                          tinycomments_mode: "embedded",
                          tinycomments_author: "Author name",
                        }}
                        value={field.value}
                        // ✅ Đồng bộ giá trị với react-hook-form
                        onEditorChange={(content) => field.onChange(content)} // ✅ Cập nhật giá trị
                      />
                    </Box>
                  )}
                />
              </Stack>
              {errors.description && (
                <Box sx={{ width: "100%", mt: 1 }}>
                  <Typography
                    textAlign={"center"}
                    sx={{ color: "red", fontSize: "14px" }}
                  >
                    {errors.description.message}
                  </Typography>
                </Box>
              )}
            </Grid2>

            {profile.roles.includes("admin") && (
              <Grid2 size={12}>
                <Typography variant="body2" color="text.secondary">
                  Select Thumbnail
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={"center"}
                  sx={{ mt: 2, width: "100%" }}
                >
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {!previewUrl && (
                    <Button
                      variant="contained"
                      onClick={handleUploadButtonClick}
                    >
                      Upload Image
                    </Button>
                  )}
                  {previewUrl && (
                    <Box
                      sx={{
                        width: "300px",
                        height: "200px",
                        display: "flex",

                        gap: 2,

                        position: "relative", // Needed for absolute positioning of the button
                      }}
                    >
                      <Box>
                        <img
                          src={previewUrl}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt="Preview"
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }} // Add background for better visibility
                          onClick={handleImageChangeClick}
                        >
                          <PhotoCamera />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Grid2>
            )}
          </Grid2>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
          >
            <Button type="submit" variant="contained">
              Save Voucher
            </Button>
          </Box>
        </Container>
      </form>
    </Box>
  );
};

export default SaveVoucherPage;
