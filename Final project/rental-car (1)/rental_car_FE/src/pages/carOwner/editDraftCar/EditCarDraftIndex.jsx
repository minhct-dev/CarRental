import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Container } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getBrandApi,
  getCarFunctionApi,
  getCarType,
  getModelApi,
  reEditDraftCarApi,
} from "../../../api/carApi";
import PreviewEdit from "../../../components/carOwner/ediCar/PreviewEdit";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../api/addressApi";
import { useEffect } from "react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import EditDetail from "../../../components/carOwner/editCarDraft/EditDetail";
import EditBasicInfomation from "../../../components/carOwner/editCarDraft/EditBasicInfomation";
import EditPrice from "../../../components/carOwner/editCarDraft/EditPrice";
import { useNavigate } from "react-router-dom";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const schema = yup.object({
  licencePlate: yup
    .string()
    .required("Please enter licence plate")
    .matches(
      /^([1-9][0-9])([A-Z]?)-([0-9]{5}|[0-9]{2,3}\.[0-9]{2,5})$/,
      "License Plate is invalid"
    ),
  color: yup.string().required("Please enter color"),
  carBrandId: yup.string().required("Please select car brand"),
  carModelId: yup.string().required("Please select car model"),
  productionYear: yup
    .number()
    .typeError("Production Year must be a number")
    .required("Please enter production year")
    .min(1990, "Production Year is invalid")
    .max(2030, "Production Year is invalid"),
  noOfSeats: yup
    .number()
    .typeError("No of seats must be a number")
    .required("Please enter no of seat")
    .min(1, "No of seat must be at least 1"),
  fuelType: yup.string().required("Please select fuel type"),
  carTypeId: yup.string().required("Please select car type"),
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
  description: yup.string().nullable(), // Cho phép null hoặc chuỗi rỗng
  basePrice: yup
    .string()
    .min(0, "Base price must be greater than or equal to 0"),
  deposit: yup.string().min(0, "Deposit must be greater than or equal to 0"),
  otherText: yup.string().when("carTermOfUse", {
    is: (value) => value.includes("Other"),
    then: (schema) => schema.required("Other term is required"),
    lateFee: yup.string().min(0, "Deposit must be greater than or equal to 0"),
  }),
});

export default function EditCarDraftIndex({ data, id }) {
  const [tab, setTab] = React.useState(0);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const [selectprovince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);
  const [selectBrand, setSelectBrand] = useState(null);
  const [selectModel, setSelectModel] = useState(null);
  const [selectType, setSelectType] = useState(null);

  const [images, setImages] = useState([
    { file: null, preview: null, index: 0 },
    { file: null, preview: null, index: 1 },
    { file: null, preview: null, index: 2 },
    { file: null, preview: null, index: 3 },
    { file: null, preview: null, index: 4 },
  ]);
  const { data: brand } = useQuery({
    queryKey: ["brand"],
    queryFn: getBrandApi,
  });
  const { data: model } = useQuery({
    queryKey: ["model", selectBrand],
    queryFn: () => getModelApi(selectBrand.id),
    enabled: selectBrand != null,
  });

  const { data: carType } = useQuery({
    queryKey: ["car-type"],
    queryFn: getCarType,
  });

  const { data: province } = useQuery({
    queryKey: ["province"],
    queryFn: getProvinceApi,
  });
  const { data: district } = useQuery({
    queryKey: ["district", selectprovince?.code],
    queryFn: () => getDistrictApi(selectprovince.code),
    enabled: !!selectprovince?.code, // Only enable when selectprovince.code is available
  });

  const { data: ward } = useQuery({
    queryKey: ["ward", selectDistrict?.code],
    queryFn: () => getWardApi(selectDistrict.code),
    enabled: !!selectDistrict?.code, // Only enable when selectprovince.code is available
  });

  useEffect(() => {
    if (data.carImages) {

      const updatedImages = images.map((item, index) => {
        const matchedImage = data.carImages.filter(
          (carImage) => carImage.type === "CAR_IMAGE"
        )[index];

        return matchedImage ? { ...item, preview: matchedImage.url } : item;
      });
      console.log(updatedImages);

      setImages(updatedImages);
    }
  }, [data.carImages]);

  
  const [registrationPaper, setRegistrationPaper] = useState(
    data?.carImages.find((item) => item.type === "REGISTRATION_IMAGE")
      ? {
          name: data.carImages.find(
            (item) => item.type === "REGISTRATION_IMAGE"
          ).url,
        }
      : null
  );

  const [cetificatePaper, setCetificatePaper] = useState(
    data?.carImages.find((item) => item.type === "CERTIFICATE_IMAGE")
      ? {
          name: data.carImages.find((item) => item.type === "CERTIFICATE_IMAGE")
            .url,
        }
      : null
  );

  const [insurance, setInsurance] = useState(
    data?.carImages.find((item) => item.type === "INSURANCE_IMAGE")
      ? {
          name: data.carImages.find((item) => item.type === "INSURANCE_IMAGE")
            .url,
        }
      : null
  );

  const { mutate } = useMutation({
    mutationFn: (data) => reEditDraftCarApi(data),
    onSuccess: () => {
      navigate("/car-owner/car-list?draft=1");
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        title: "Edit Car Error",
        text: e.response.data.message
      });
    },
  });

  useEffect(() => {
    if (data && province) {
      let provinceObject = province.find(
        (item) => item.code === data.provinceCode
      );
      setSelectProvince(provinceObject);
    }
  }, [data, province]);

  const { data: carFunction } = useQuery({
    queryKey: ["car-function"],
    queryFn: getCarFunctionApi,
  });

  // Khi selectProvince đã set xong => load district từ process
  useEffect(() => {
    if (data && district) {
      let districtObject = district.find(
        (item) => item.code === data.districtCode
      );
      setSelectDistrict(districtObject);
    }
  }, [data, district]);

  useEffect(() => {
    setSelectBrand(data?.carBrand);
    setSelectModel(data?.carModel);
  }, [data]);

  // Khi selectDistrict đã set xong => load ward từ process
  useEffect(() => {
    if (data && ward) {
      let wardObject = ward.find((item) => item.code === data.wardCode);
      setSelectWard(wardObject);
    }
  }, [data, ward]);
  const handleSelectBrand = (id) => {
    setSelectBrand(id);
    setSelectModel(null);
  };
  const arr = [
    "No Smoking",
    "No food in car",
    "No pet in car",
    "Return on time",
    "Other",
  ];
  //check other text in step 3
  const [selectedOther, setSelectedOther] = useState(false);

  // check default term of use
  const otherText =
    data?.carTermOfUses?.find((term) => !arr.includes(term)) || "";
  const defaultTerm = () => {
    let defaultTermUse = [];
    if (data.carTermOfUses != null) {
      defaultTermUse = data.carTermOfUses;
      if (otherText !== "") {
        defaultTermUse = [...defaultTermUse, "Other"];
      }
    }
    return defaultTermUse;
  };

  //set select othher  if have
  useEffect(() => {
    if (otherText !== "") {
      setSelectedOther(true);
    }
  }, [otherText]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      licencePlate: data?.licencePlate || "",
      color: data?.color || "",
      carBrandId: data?.carBrand.id || "",
      carModelId: data?.carModel.id || "",
      productionYear: data?.productionYear,
      noOfSeats: data?.noOfSeats,
      transmissionType: data?.transmissionType || "AUTOMATIC",
      fuelType: data?.fuelType || null,
      carTypeId: data?.carType.id || null,
      mileage: data?.mileage || "", // @Min(1)
      fuelConsumption: data?.fuelConsumption || "", // @Min(0)
      provinceCode: data?.provinceCode, // @NotBlank
      districtCode: data?.districtCode, // @NotBlank
      wardCode: data?.wardCode, // @NotBlank
      addressDetails: data?.addressDetail || "", // @NotBlank
      description: data?.description || "", // Không có @NotBlank => có thể null
      carTermOfUse: defaultTerm(),
      otherText: otherText,
      basePrice: data?.basePrice || "",
      deposit: data?.deposit || "",
      lateFee: data?.lateFee || "",
    },
    resolver: yupResolver(schema),
    mode: "all",
  });
  const [selectCarFunction, setSelectCarFunction] = useState(
    data?.carFunctionsId || []
  );
  const [carFunctionErr, setCarFunctionErr] = useState(null);

  const onSubmit = async (data) => {
    if (selectCarFunction.length == 0) {
      setCarFunctionErr(true);
      return;
    }
    let newTerm = [...data.carTermOfUse];
    if (newTerm.includes("Other")) {
      newTerm = newTerm.filter((item) => item !== "Other"); // Xóa "Other"
      if (data.otherText) {
        newTerm.push(data.otherText); // Thêm giá trị otherText
      }
    }

    newTerm = newTerm.filter((item) => item != null);
    const payload = {
      ...data,
      basePrice: parseInt(data.basePrice.replace(/\./g, "") || 0), // Chuyển về số nguyên
      deposit: parseInt(data.deposit.replace(/\./g, "") || 0), // Chuyển về số nguyên
      lateFee:
        isNaN(data.lateFee) && data.lateFee.includes(".")
          ? parseInt(data.lateFee.replace(/\./g, "") || 0)
          : data.lateFee, // Kiểm tra nếu là chuỗi và có dấu chấm,
      carTermOfUse: newTerm, // Cập nhật lại terms
      carFunctionsId: selectCarFunction,
    };
    // ✅ Xóa key `otherText`
    delete payload.otherText;

    let formdata = new FormData();
    for (const item of images) {
      if (item.file) {
        formdata.append("file", item.file);
      } else {
        const response = await fetch(item.preview);
        const blob = await response.blob();
        // Lấy extension từ type
        const extension = blob.type.split("/")[1];
        const file = new File([blob], `image.${extension}`, {
          type: blob.type,
        });
        formdata.append("file", file);
      }
    }

    formdata.append("obj", JSON.stringify(payload));
    formdata.append("file", images);
    formdata.append("draftId", id);
    if (registrationPaper instanceof File) {
      formdata.append("registration", registrationPaper);
    }
    if (cetificatePaper instanceof File) {
      formdata.append("certificate", cetificatePaper);
    }
    if (insurance instanceof File) {
      formdata.append("insurance", insurance);
    }
    mutate(formdata);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Container style={{ width: "90%" }}>
        <PreviewEdit process={data}></PreviewEdit>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 5 }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              sx={{ textTransform: "none" }}
              label="Basic Infomation"
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label="Detail Infomation"
              {...a11yProps(1)}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label="Term of use"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <EditBasicInfomation
            selectModel={selectModel}
            setSelectModel={setSelectModel}
            brand={selectBrand}
            selectBrand={handleSelectBrand}
            model={model}
            data={brand}
            carType={carType}
            selectType={selectType}
            setSelectType={setSelectType}
            process={data}
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            handleSubmit={handleSubmit}
            submit={onSubmit}
            registrationPaper={registrationPaper}
            setRegistrationPaper={setRegistrationPaper}
            insurance={insurance}
            setInsurance={setInsurance}
            cetificatePaper={cetificatePaper}
            setCetificatePaper={setCetificatePaper}
          ></EditBasicInfomation>
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <EditDetail
            carFunction={carFunction}
            ward={ward}
            setSelectWard={setSelectWard}
            selectWard={selectWard}
            selectDistrict={selectDistrict}
            setSelectDistrict={setSelectDistrict}
            selectProvince={selectprovince}
            setSelectProvince={setSelectProvince}
            district={district}
            province={province}
            data={data}
            id={id}
            control={control}
            errors={errors}
            setValue={setValue}
            handleSubmit={handleSubmit}
            register={register}
            selectCarFunction={selectCarFunction}
            setSelectCarFunction={setSelectCarFunction}
            submit={onSubmit}
            images={images}
            setImages={setImages}
            err={carFunctionErr}
          ></EditDetail>
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={2}>
          <EditPrice
            setValue={setValue}
            handleSubmit={handleSubmit}
            setSelectedOther={setSelectedOther}
            selectedOther={selectedOther}
            control={control}
            errors={errors}
            arr={arr}
            data={data}
            submit={onSubmit}
          ></EditPrice>
        </CustomTabPanel>
      </Container>
    </Box>
  );
}
