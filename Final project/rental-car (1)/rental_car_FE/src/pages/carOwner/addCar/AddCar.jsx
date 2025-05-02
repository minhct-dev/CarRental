import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import Step1 from "../../../components/carOwner/addCar/Step1";
import Step2 from "../../../components/carOwner/addCar/Step2";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addStep1Api,
  addStep2Api,
  addStep3Api,
  getBrandApi,
  getCarFunctionApi,
  getCarType,
  getModelApi,
  getProcessDraftApi,
} from "../../../api/carApi";

import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../api/addressApi";
import Loading from "../../client/loading/Loading";
import Step4 from "../../../components/carOwner/addCar/Step4";
import { useSearchParams } from "react-router-dom";
import { queryClient } from "../../../main";
import Swal from "sweetalert2";
import Step3 from "../../../components/carOwner/addCar/Step3";

const steps = [
  "Step 1: Basic",
  "Step 2: Details",
  "Step 3: Pricing",
  "Step 4: Finish",
];

const AddCar = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const saveStep = searchParams.get("step");

  const [selectBrand, setSelectBrand] = useState(null);
  const [selectModel, setSelectModel] = useState(null);
  const [selectType, setSelectType] = useState(null);
  const [activeStep, setActiveStep] = useState(saveStep);

  const [selectprovince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);
  const [errStep2, setErrorStep2] = useState(null);
  const { data: process, isLoading } = useQuery({
    queryKey: ["process"],
    queryFn: getProcessDraftApi,
    retry: 0,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const { data } = useQuery({
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

  const { data: carFunction } = useQuery({
    queryKey: ["car-function"],
    queryFn: getCarFunctionApi,
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
  // handleSave step 1
  const { mutate } = useMutation({
    mutationFn: (data) => addStep1Api(data),
    onSuccess: () => {
      handlePageChange("step", 1);
      queryClient.invalidateQueries(["process"]);
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        title: "Add Car Error",
        text: e.response.data.message,
      });
    },
  });
  // handleSave Step2
  const { mutate: saveStep2 } = useMutation({
    mutationFn: (data) => addStep2Api(data),
    onSuccess: () => {
      setErrorStep2(null);
      handlePageChange("step", 2);
      queryClient.invalidateQueries(["process"]);
    },
    onError: (e) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setErrorStep2(e.response.data.message);
    },
  });

  // handleBack Step2
  const { mutate: backSave2 } = useMutation({
    mutationFn: (data) => addStep2Api(data),
    onSuccess: () => {
      setErrorStep2(null);
      handlePageChange("step", 0);
      queryClient.invalidateQueries(["process"]);
    },
    onError: (e) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setErrorStep2(e.response.data.message);
    },
  });

  //save step3
  const { mutate: saveStep3 } = useMutation({
    mutationFn: (data) => addStep3Api(data),
    onSuccess: () => {
      handlePageChange("step", 3);
      queryClient.invalidateQueries(["process"]);
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        title: "Add Car Error",
        text: e.response.data.message,
      });
    },
  });

  //back step3
  const { mutate: backStep3 } = useMutation({
    mutationFn: (data) => addStep3Api(data),
    onSuccess: () => {
      handlePageChange("step", 1);
      queryClient.invalidateQueries(["process"]);
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        title: "Add Car Error",
        text: e.response.data.message,
      });
    },
  });

  const handlePageChange = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set(key, value); // Thêm hoặc cập nhật tham số
      return params;
    });
  };

  useLayoutEffect(() => {
    if (process == null) {
      setActiveStep(0);
    } else {
      if (saveStep == null) {
        setActiveStep(process?.step);
      } else {
        setActiveStep(parseInt(saveStep));
      }
    }
  }, [process, saveStep]);

  useEffect(() => {
    if (process != null) {
      setSelectBrand(process?.carBrand);
      setSelectModel(process?.carModel);
      if (process?.step == 2) {
        let provinceObject = province?.find(
          (item) => item.code == process.provinceCode
        );
        setSelectProvince(provinceObject);
        let districtObject = district?.find(
          (item) => item.code == process.districtCode
        );
        setSelectDistrict(districtObject);
        let wardObject = ward?.find((item) => item.code == process.wardCode);
        setSelectWard(wardObject);
      }
    }
  }, [process]);
  useEffect(() => {
    if (process && province) {
      let provinceObject = province.find(
        (item) => item.code === process.provinceCode
      );
      setSelectProvince(provinceObject);
    }
  }, [process, province]);
  // Khi selectProvince đã set xong => load district từ process
  useEffect(() => {
    if (process && district) {
      let districtObject = district.find(
        (item) => item.code === process.districtCode
      );
      setSelectDistrict(districtObject);
    }
  }, [process, district]);
  // Khi selectDistrict đã set xong => load ward từ process
  useEffect(() => {
    if (process && ward) {
      let wardObject = ward.find((item) => item.code === process.wardCode);
      setSelectWard(wardObject);
    }
  }, [process, ward]);
  const handleSelectBrand = (id) => {
    setSelectBrand(id);
    setSelectModel(null);
  };
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <Box sx={{ pt: "5vh", backgroundColor: "#FAFAFB" }}>
      <Container style={{ width: "90%" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/car-owner">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/car-owner/car-list">
            List Car
          </Link>
          <Typography sx={{ color: "text.primary" }}>Add new Car</Typography>
        </Breadcrumbs>

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h2"
            fontSize={"25px"}
            fontWeight={500}
            color="initial"
          >
            Add New Car
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 3, p: 2 }}>
            {activeStep === 0 && (
              <Step1
                process={process}
                selectModel={selectModel}
                setSelectModel={setSelectModel}
                brand={selectBrand}
                selectBrand={handleSelectBrand}
                model={model}
                data={data}
                carType={carType}
                mutate={mutate}
                selectType={selectType}
                setSelectType={setSelectType}
              ></Step1>
            )}
            {activeStep === 1 && (
              <Step2
                ward={ward}
                setSelectWard={setSelectWard}
                selectWard={selectWard}
                selectDistrict={selectDistrict}
                setSelectDistrict={setSelectDistrict}
                selectProvince={selectprovince}
                setSelectProvince={setSelectProvince}
                district={district}
                province={province}
                carFunction={carFunction}
                mutate={saveStep2}
                process={process}
                err={errStep2}
                setErr={setErrorStep2}
                backSave={backSave2}
              ></Step2>
            )}
            {activeStep === 2 && (
              <Step3
                mutate={saveStep3}
                process={process}
                saveBack={backStep3}
              ></Step3>
            )}
            {activeStep === 3 && (
              <Step4
                handlePageChange={handlePageChange}
                process={process}
              ></Step4>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AddCar;
