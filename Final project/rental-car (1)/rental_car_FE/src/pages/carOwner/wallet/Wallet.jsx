import { Box, Stack } from "@mui/material";
import { Container } from "react-bootstrap";

import { useQuery } from "@tanstack/react-query";


import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProfileApi } from "../../../api/userApi";
import Loading from "../../client/loading/Loading";
import WalletBalence from "../../../components/client/wallet/WalletBalence";
import WalletTable from "../../../components/client/wallet/WalletTable";
import { walletHistoryApi } from "../../../api/walletApi";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
const WalletCarOwner = () => {
  const [searchParams,setSearchParams] = useSearchParams();
  // Lấy giá trị tham số từ URL
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 5;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const trans = searchParams.get("transaction");
  const transactionRef = useRef(null);
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    retry: 0,
  });
  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD"); // Ngày hôm nay
    const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY-MM-DD"); // 1 tháng trước
    
    console.log(oneMonthAgo);
        // Kiểm tra `from` hợp lệ
    const isValidFrom =
      from &&
      dayjs(from, "YYYY-MM-DD", true).isValid() &&
      dayjs(from).isSameOrAfter(oneMonthAgo) &&
      dayjs(from).isBefore(today);

    // Kiểm tra `to` hợp lệ
    const isValidTo =
      to &&
      dayjs(to, "YYYY-MM-DD", true).isValid() &&
      dayjs(to).isSameOrBefore(today) &&
      dayjs(to).isSameOrAfter(oneMonthAgo);

    // Nếu `from` hoặc `to` không hợp lệ, cập nhật lại URL
    if (!isValidFrom || !isValidTo) {
      searchParams.set("from", isValidFrom ? from : oneMonthAgo);
      searchParams.set("to", today);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);
  useLayoutEffect(() => {
    if (trans) {
      setTimeout(() => {
        transactionRef.current.scrollIntoView({ behavior: "smooth" }); // Cuộn mượt
      }, 50); // Đợi 500ms để phần tử xuất hiện
    }
  }, [trans, page, size, from, to]);

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["wallet-history", page, size, from, to],
    queryFn: () => walletHistoryApi(page, size, from, to),
  });

  if (isLoading || historyLoading) {
    return <Loading />;
  }

  

  return (
    <Box sx={{ mb: 5, mt: 5 }}>
      <Container style={{ width: "90%" }}>
       

        <Box>
          <Stack direction={"column"} spacing={2}>
            <Box>
              <WalletBalence data={data} />
            </Box>
            <Box ref={transactionRef}>
              <WalletTable
                page={page}
                size={size}
                from={from}
                to={to}
                totalPages={history.totalPages}
                history={history.history}
                searchParams={searchParams}
              />
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default WalletCarOwner;
