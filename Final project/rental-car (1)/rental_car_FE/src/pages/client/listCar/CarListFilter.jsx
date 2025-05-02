/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import CarBrandModal from "./modal/CarBrandModal";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ColorModal from "./modal/ColorModal";
import CarModelModal from "./modal/CarModelModal";
import CarPriceModal from "./modal/CarPriceModal";
import AddressModal from "./modal/AddressModal";
import DateModal from "./modal/DateModal";
import dayjs from "dayjs";
import TransmissionModal from "./modal/TransmissionModal";
import FuelTypeModal from "./modal/FuelType";
import { getBrandApi, getColorApi, getModelApi } from "../../../api/carApi";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../api/addressApi";
const CarListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let brandSearch = searchParams.get("brand") || null;
  let colorSearch = searchParams.get("colors") || null;
  let modelSearch = searchParams.get("models") || null;
  let transmissionSearch = searchParams.get("transmission") || null;
  let from = searchParams.get("from");
  let to = searchParams.get("to");
  let fuel = searchParams.get("fuel");
  let provinceCode = searchParams.get("province") || null;
  let districtCode = searchParams.get("district") || null;
  let wardCode = searchParams.get("ward") || null;
  const [selectAddress, setSelectAddress] = useState(null);
  const [selectDate, setSelectDate] = useState("");
  const [openBrand, setOpenBrand] = useState(false);
  const handleCloseBrand = () => {
    setOpenBrand(false);
  };
  const [openPrice, setOpenPrice] = useState(false);
  const handleClosePrice = () => {
    setOpenPrice(false);
  };
  const [openColor, setOpenColor] = useState(false);
  const handleCloseColor = () => {
    setOpenColor(false);
  };
  const [openModel, setOpenModel] = useState(false);
  const handleModelColor = () => {
    setOpenModel(false);
  };
  const [openAdress, setOpenAdress] = useState(false);
  const handleAdressColose = () => {
    setOpenAdress(false);
  };
  const [openDate, setOpenDate] = useState(false);
  const handleDateColose = () => {
    setOpenDate(false);
  };
  const [openTransmission, setOpenTransmission] = useState(false);
  const handleTransmissionColose = () => {
    setOpenTransmission(false);
  };
  const [openFuel, setOpenFuel] = useState(false);
  const handleFuelColose = () => {
    setOpenFuel(false);
  };
  const changeParam = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set(key, value);
      return params;
    });
  };
  const { data: brand } = useQuery({
    queryKey: ["brand"],
    queryFn: getBrandApi,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const { data: model } = useQuery({
    queryKey: ["model", brandSearch],
    queryFn: () => getModelApi(brandSearch),
    enabled: brandSearch != null && brandSearch != 0,
  });

  const { data: color } = useQuery({
    queryKey: ["color"],
    queryFn: getColorApi,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const { data: province } = useQuery({
    queryKey: ["province"],
    queryFn: getProvinceApi,
  });
  const { data: district } = useQuery({
    queryKey: ["district", provinceCode],
    queryFn: () => getDistrictApi(provinceCode),
    enabled: provinceCode != null && districtCode != null,
  });
  const { data: ward } = useQuery({
    queryKey: ["ward", districtCode],
    queryFn: () => getWardApi(districtCode),
    enabled: districtCode != null && wardCode != null,
  });


  

  useEffect(() => {
    let data = [];
    if (provinceCode != null) {
      data.push(province?.find((item) => item.code == provinceCode));
    }
    if(districtCode != null){
      data.push(district?.find((item) => item.code == districtCode));
    }
    if(wardCode != null){
      data.push(ward?.find((item) => item.code == wardCode));
    }
    setSelectAddress(data)
  }, [provinceCode, districtCode, wardCode]);

  return (
    <Box
      sx={{
        backgroundColor: "text.light",
        p: 3,
        mb: 5,
        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
      }}
    >
      <Stack direction={"row"} justifyContent={"center"} spacing={5}>
        <Stack
          onClick={() => setOpenAdress(true)}
          sx={{ cursor: "pointer" }}
          direction={"row"}
          spacing={1}
        >
          <PlaceOutlinedIcon
            sx={{ color: "text.secondary" }}
          ></PlaceOutlinedIcon>
          <Typography
            variant="body1"
            color="initial"
            fontWeight={300}
            fontSize={"17px"}
          >
            {!selectAddress || selectAddress == undefined || selectAddress == null || selectAddress.length == 0
              ? "All place"
              : (!selectAddress[2] ? "" : selectAddress[2].name + ", ") +
                (!selectAddress[1] ? "" : selectAddress[1].name + ", ") +
                selectAddress[0]?.name}
          </Typography>
        </Stack>
        <Stack
          onClick={() => setOpenDate(true)}
          sx={{ cursor: "pointer" }}
          direction={"row"}
          spacing={0.5}
        >
          <DateRangeIcon sx={{ color: "text.secondary" }}></DateRangeIcon>
          <Typography
            variant="body1"
            color="initial"
            fontWeight={300}
            fontSize={"17px"}
          >
            {selectDate == ""
              ? dayjs(from).format("HH:mm, DD/MM/YYYY") +
                " - " +
                dayjs(to).format("HH:mm, DD/MM/YYYY")
              : dayjs(selectDate.from).format("HH:mm, DD/MM/YYYY") +
                " - " +
                dayjs(selectDate.to).format("HH:mm, DD/MM/YYYY")}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{ mt: 3 }}
        direction={"row"}
        justifyContent={"center"}
        spacing={2}
      >
        <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
          <FilterListIcon
            sx={{ color: "text.secondary", fontSize: "20px" }}
          ></FilterListIcon>
          <Typography
            variant="body1"
            color="initial"
            fontWeight={500}
            fontSize={"15px"}
          >
            Filter :
          </Typography>
        </Stack>
        <Box
          sx={{
            border: "1px solid #ccc",
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "999px",
            backgroundColor:
              brandSearch == null || brandSearch == 0 ? "" : "primary.main",
          }}
          onClick={() => setOpenBrand(true)}
        >
          <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
            <LanguageOutlinedIcon
              sx={{
                color:
                  brandSearch == null || brandSearch == 0
                    ? "text.secondary"
                    : "white",
                fontSize: "18px",
              }}
            ></LanguageOutlinedIcon>
            <Typography
              variant="body1"
              color={
                brandSearch == null || brandSearch == 0 ? "initial" : "white"
              }
              fontWeight={300}
              fontSize={"15px"}
            >
              Car Brand
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            cursor:
              brandSearch != null && brandSearch != 0 ? "pointer" : "default",
            padding: "5px 10px",
            borderRadius: "999px",
            backgroundColor: modelSearch ? "primary.main" : "",
          }}
          onClick={
            brandSearch != null && brandSearch != 0
              ? () => setOpenModel(true)
              : ""
          }
        >
          <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
            <DirectionsCarOutlinedIcon
              sx={{
                color:
                  brandSearch == null || brandSearch == 0
                    ? "#ccc"
                    : modelSearch
                    ? "white"
                    : "text.secondary",
                fontSize: "18px",
              }}
            ></DirectionsCarOutlinedIcon>
            <Typography
              variant="body1"
              color={
                brandSearch == null || brandSearch == 0
                  ? "#ccc"
                  : modelSearch
                  ? "white"
                  : "initial"
              }
              fontWeight={300}
              fontSize={"15px"}
            >
              Car Model
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "999px",
            backgroundColor: colorSearch ? "primary.main" : "",
          }}
        >
          <Stack
            onClick={() => setOpenColor(true)}
            direction={"row"}
            spacing={0.5}
            alignItems={"center"}
          >
            <ColorLensIcon
              sx={{
                color: colorSearch ? "white" : "text.secondary",
                fontSize: "18px",
              }}
            ></ColorLensIcon>
            <Typography
              variant="body1"
              color={colorSearch ? "white" : "initial"}
              fontWeight={300}
              fontSize={"15px"}
            >
              Car Color
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "999px",
            backgroundColor: transmissionSearch == null ? "" : "primary.main",
          }}
        >
          <Stack
            onClick={() => setOpenTransmission(true)}
            direction={"row"}
            spacing={0.5}
            alignItems={"center"}
          >
            <TuneOutlinedIcon
              sx={{
                color: transmissionSearch == null ? "text.secondary" : "white",
                fontSize: "18px",
              }}
            ></TuneOutlinedIcon>
            <Typography
              variant="body1"
              color={transmissionSearch == null ? "initial" : "white"}
              fontWeight={300}
              fontSize={"15px"}
            >
              Trasmission
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "999px",
            backgroundColor: fuel == null ? "" : "primary.main",
          }}
          onClick={() => setOpenFuel(true)}
        >
          <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
            <LocalGasStationOutlinedIcon
              sx={{
                color: fuel == null ? "text.secondary" : "white",
                fontSize: "18px",
              }}
            ></LocalGasStationOutlinedIcon>
            <Typography
              variant="body1"
              color={fuel == null ? "initial" : "white"}
              fontWeight={300}
              fontSize={"15px"}
            >
              Fuel type
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "999px",
            backgroundColor: "primary.main",
          }}
          onClick={() => setOpenPrice(true)}
        >
          <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
            <LanguageOutlinedIcon
              sx={{ color: "white", fontSize: "18px" }}
            ></LanguageOutlinedIcon>
            <Typography
              variant="body1"
              color="white"
              fontWeight={300}
              fontSize={"15px"}
            >
              Price
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <CarBrandModal
        brand={brand}
        show={openBrand}
        changeParam={changeParam}
        handleClose={handleCloseBrand}
      ></CarBrandModal>
      <ColorModal
        color={color}
        show={openColor}
        handleClose={handleCloseColor}
      ></ColorModal>
      <CarModelModal
        model={model}
        show={openModel}
        handleClose={handleModelColor}
      ></CarModelModal>
      <CarPriceModal
        show={openPrice}
        handleClose={handleClosePrice}
      ></CarPriceModal>

      <AddressModal
        onSave={setSelectAddress}
        show={openAdress}
        handleClose={handleAdressColose}
      ></AddressModal>
      <DateModal
        show={openDate}
        onSave={setSelectDate}
        handleClose={handleDateColose}
      ></DateModal>

      <TransmissionModal
        show={openTransmission}
        handleClose={handleTransmissionColose}
      ></TransmissionModal>
      <FuelTypeModal
        show={openFuel}
        handleClose={handleFuelColose}
      ></FuelTypeModal>
    </Box>
  );
};

export default CarListFilter;
