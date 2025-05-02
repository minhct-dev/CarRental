import {
  Box,
  Button,
  Grid2,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import CarCard from "./CarCard";
import { Container } from "react-bootstrap";
import CarListFilter from "./CarListFilter";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import NotFoundCar from "./NotFoundCar";
import { getMaxPrice, searchCarApi } from "../../../api/carApi";
import CarCardRow from "./CarCardRow";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const CarList = () => {
  const { data: maxPrice, isLoading } = useQuery({
    queryKey: ["max-price"],
    queryFn: getMaxPrice,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [viewGrid, setViewGrid] = useState(true);
  // Lấy params từ URL
  let fromParam = searchParams.get("from");
  let toParam = searchParams.get("to");
  let pageParam = searchParams.get("page") || 1;
  let brand = searchParams.get("brand") || null;
  let colors = searchParams.get("colors") || null;
  let models = searchParams.get("models") || null;
  let province = searchParams.get("province") || null;
  let district = searchParams.get("district") || null;
  let ward = searchParams.get("ward") || null;
  let minPrice = parseInt(searchParams.get("min"));
  let maxSelectedPrice = parseInt(searchParams.get("max"));
  let transmission = searchParams.get("transmission") || null;
  let fuel = searchParams.get("fuel") || null;
  // Nếu không có from và to, đặt mặc định
  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      // Nếu không có from/to, đặt giá trị mặc định
      if (!fromParam || !toParam) {
        const defaultFrom = dayjs()
          .add(1, "day")
          .hour(14)
          .minute(0)
          .second(0)
          .format("YYYY-MM-DDTHH:mm");
        const defaultTo = dayjs()
          .add(2, "day")
          .hour(12)
          .minute(0)
          .format("YYYY-MM-DDTHH:mm");
        params.set("from", defaultFrom);
        params.set("to", defaultTo);
      }

      // Kiểm tra min/max có hợp lệ không (phải là số và trong khoảng)
      if (isNaN(minPrice) || minPrice < 0) minPrice = 0;
      if (isNaN(maxSelectedPrice) || maxSelectedPrice > maxPrice)
        maxSelectedPrice = maxPrice;
      if (
        parseInt(searchParams.get("min")) !== minPrice ||
        parseInt(searchParams.get("max")) !== maxSelectedPrice
      ) {
        params.set("min", minPrice);
        params.set("max", maxSelectedPrice);
      }

      return params;
    });
  }, [
    fromParam,
    minPrice,
    maxSelectedPrice,
    toParam,
    setSearchParams,
    maxPrice,
  ]);
  const [showNotFound, setShowNotFound] = useState(false);
  // Mutation gọi API
  const { mutate, isPending } = useMutation({
    mutationFn: searchCarApi,
    onSuccess: (content) => {
      setData(content);
      // Nếu không có xe, delay hiển thị NotFoundCar sau 1s
      if (!content?.cars || content.cars.length === 0) {
        setTimeout(() => setShowNotFound(true), 1000); // Delay 1s
      } else {
        setShowNotFound(false); // Có xe thì ẩn NotFoundCar
      }
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        text: "Search failed",
      });
    },
  });
  // Gọi API khi `searchParams` thay đổi
  useEffect(() => {
    if (fromParam && toParam) {
      mutate({
        pickupDate: dayjs(fromParam).format("YYYY-MM-DDTHH:mm"),
        dropoffDate: dayjs(toParam).format("YYYY-MM-DDTHH:mm"),
        page: pageParam,
        pageSize: 6,
        pageNumber: pageParam,
        brandId: brand == 0 ? null : brand,
        color: colors != null ? colors.split(",") : null,
        modelId: models != null ? models.split(",") : null,
        minPrice: minPrice != null ? minPrice : null,
        maxPrice: maxSelectedPrice != null ? maxSelectedPrice : null,
        provinceCode: province,
        districtCode: district,
        wardCode: ward,
        transmissionType: transmission != null ? transmission.split(",") : null,
        fuelType: fuel != null ? fuel.split(",") : null,
      });
    }
  }, [
    fromParam,
    brand,
    colors,
    toParam,
    pageParam,
    minPrice,
    maxSelectedPrice,
    models,
    province,
    district,
    ward,
    mutate,
    transmission,
    fuel,
  ]);

  const handlePageChange = (event, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", value.toString());
      return params;
    });
  };

  if (isPending || isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box sx={{ backgroundColor: "text.light", pb: 5, minHeight: "100vh" }}>
      <CarListFilter />
      <Container style={{ width: "70%" }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h5" fontWeight={500} color="initial">
            Find Vehicle
          </Typography>
          <Stack direction={"row"} spacing={0}>
            <Button
              onClick={() => setViewGrid(true)}
              variant={viewGrid ? "contained" : "outlined"}
              sx={{ minWidth: "20px" }}
            >
              <ViewModuleIcon></ViewModuleIcon>
            </Button>
            <Button
              onClick={() => setViewGrid(false)}
              variant={!viewGrid ? "contained" : "outlined"}
              sx={{ minWidth: "20px" }}
            >
              <ViewListIcon></ViewListIcon>
            </Button>
          </Stack>
        </Stack>
        <Stack direction={"column"} justifyContent={"center"} sx={{ mt: 5 }}>
          {isPending ? (
            <Loading /> // Đang fetch dữ liệu, hiển thị Loading
          ) : (
            <Grid2  container rowSpacing={3} columnSpacing={3}>
              {Array.isArray(data?.cars) && data.cars.length > 0 ? (
                data.cars.map((item, index) => (
                  <Grid2 item size={viewGrid ? 4 : 12} key={index}>
                    {viewGrid ? (
                      <CarCard data={item}></CarCard>
                    ) : (
                      <CarCardRow data={item} />
                    )}
                  </Grid2>
                ))
              ) : showNotFound ? ( // Chỉ hiển thị NotFoundCar sau khi delay xong
                <NotFoundCar />
              ) : null}
            </Grid2>
          )}

          {data?.totalPages > 1 && (
            <Stack direction={"row"} justifyContent={"center"}>
              <Pagination
                sx={{ mt: 5 }}
                count={data?.totalPages || 1}
                color="primary"
                page={parseInt(pageParam)}
                onChange={handlePageChange}
              />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default CarList;
