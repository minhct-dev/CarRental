import { Box, Stack } from "@mui/material";
import { Container } from "react-bootstrap";
import CarDetailInfomation from "../../../components/client/carDetail/CarDetailInfomation";
import CarDetailImages from "../../../components/client/carDetail/CarImage/CarDetailImages";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCarApi } from "../../../api/carApi";
import Loading from "../loading/Loading";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getVoucherListOnCarApi } from "../../../api/voucherApi";
import NotFound from "../../../components/err/NotFound";

const CarDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  //view feedback - Tuan
  const [page, setPage] = useState(1);

  // ✅ Kiểm tra nếu param không có start_date và end_date thì set mặc định
  const startDate = searchParams.get("from");
  const endDate = searchParams.get("to");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      const defaultStartDate = dayjs()
        .add(1, "day")
        .hour(12)
        .minute(0)
        .second(0)
        .toISOString(); // Ngày mai 12h
      const defaultEndDate = dayjs()
        .add(2, "day")
        .hour(14)
        .minute(0)
        .second(0)
        .toISOString(); // Ngày kia 14h

      // ✅ Cập nhật params vào URL
      setSearchParams({
        from: startDate || defaultStartDate,
        to: endDate || defaultEndDate,
      });
    }
  }, [startDate, endDate, id]);

  // ✅ Gọi API với id
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["car", id, startDate, endDate, page],
    queryFn: () => getCarApi(id, startDate, endDate, page),
    enabled: !!(id && startDate && endDate),
  });

  const { data: voucher, isLoading: voucherLoading } = useQuery({
    queryKey: ["car-voucher", id],
    queryFn: () => getVoucherListOnCarApi(id),
  });

  if (isLoading || voucherLoading) {
    return <Loading />;
  }
  if (isError) {
    return <NotFound></NotFound>;
  }

  return (
    <Box sx={{ pt: 5, pb: 5 }}>
      <Container style={{ width: "70%" }}>
        <Stack direction={"column"} spacing={1}>
          <Box sx={{ width: "100%" }}>
            <CarDetailImages images={data?.carImages}></CarDetailImages>
          </Box>
          <Box sx={{ width: "100%" }}>
            <CarDetailInfomation
              voucher={voucher}
              refetch={refetch}
              id={id}
              data={data}
              page={page}
              setPage={setPage}
            ></CarDetailInfomation>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default CarDetail;
