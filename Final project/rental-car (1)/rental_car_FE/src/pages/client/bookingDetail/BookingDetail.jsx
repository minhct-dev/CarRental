import { Box, Container, Stack } from "@mui/material";
import MyBreadcrumbs from "../../../components/client/bookingDetail/MyBreadCrumbs";
import CarImage from "../../../components/client/bookingDetail/CarImage";
import CardInfo from "../../../components/client/bookingDetail/CardInfo";
import { useParams } from "react-router-dom";
import BookingDetailTab from "../../../components/client/bookingDetail/BookingDetailTab";
import { getProfileApi } from "../../../api/userApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../api/addressApi";
import Loading from "../loading/Loading";
import { getBookingApi } from "../../../api/bookingApi";
import { getCarDetailApi } from "../../../api/carApi";
import NotFound from "./../../../components/err/NotFound";

function BookingDetail() {
  const { id } = useParams();
  const [selectProvince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });

  const {
    data: bookingDetail,
    isLoading: isBookingLoading,
    isError: isBookingError,
  } = useQuery({
    queryKey: ["bookingDetail"],
    queryFn: () => getBookingApi(id),
  });

  const { data: carDetail, isLoading: isCarLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () =>
      getCarDetailApi(
        bookingDetail.carId,
        bookingDetail?.from + "Z",
        bookingDetail?.to + "Z",
        1
      ),
      enabled: !!bookingDetail,
  });

  useEffect(() => {
    getProvinceApi().then((res) => {
      setProvince(res);
    });
  }, [data]);
  useEffect(() => {
    if (selectProvince) {
      setWard(null);
      getDistrictApi(selectProvince.code).then((res) => {
        setDistrict(res);
      });
    }
  }, [selectProvince]);
  useEffect(() => {
    if (selectDistrict) {
      getWardApi(selectDistrict.code).then((res) => {
        setWard(res);
      });
    }
  }, [selectDistrict]);

  if (isLoading || isBookingLoading || isCarLoading) {
    return <Loading></Loading>;
  }
  console.log(carDetail);

  return (
    <Box sx={{ backgroundColor: isBookingError ? "white" : "#F7F7F7" }}>
      {isBookingError ? (
        <NotFound />
      ) : (
        <Container sx={{ px: "3rem", py: "1.5rem", width: "85%" }}>
          <MyBreadcrumbs />
          <Stack direction={"row"} sx={{ pt: "1.4rem" }}>
            <CarImage carImg={bookingDetail?.carImg} />
            {!isBookingLoading && bookingDetail && (
              <CardInfo
                bookingDetail={bookingDetail}
                carName={carDetail?.name}
              />
            )}
          </Stack>
          <BookingDetailTab
            district={district}
            ward={ward}
            setSelectProvince={setSelectProvince}
            setSelectDistrict={setSelectDistrict}
            setSelectWard={setSelectWard}
            province={province}
            data={data}
            selectDistrict={selectDistrict}
            selectProvince={selectProvince}
            selectWard={selectWard}
            carDetail={carDetail}
            bookingDetail={bookingDetail}
          />
        </Container>
      )}
    </Box>
  );
}

export default BookingDetail;
