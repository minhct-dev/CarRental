import { Box, Stack, Typography } from "@mui/material";
import { Container } from "react-bootstrap";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../../../api/userApi";
import Loading from "../loading/Loading";
import { useSearchParams } from "react-router-dom";
import WalletTable from "../../../components/client/wallet/WalletTable";
import WalletBalence from "../../../components/client/wallet/WalletBalence";
import { walletHistoryApi } from "../../../api/walletApi";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useSelector } from "react-redux";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
const Wallet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Lấy giá trị tham số từ URL
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 5;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const profile = useSelector((state) => state.auth.profile);
  const transactionRef = useRef(null);
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    retry: 0,
  });
  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD"); // Ngày hôm nay
    const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY-MM-DD"); // 1 tháng trước
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

  const isAdmin = profile.roles.includes("admin");

  const {
    data: history,
    isLoading: historyLoading,
    refetch,
  } = useQuery({
    queryKey: ["wallet-history"],
    queryFn: () => walletHistoryApi(page, size, from, to),
  });

  useEffect(() => {
    if (transactionRef.current) {
      refetch();
    }
  }, [searchParams]);

  if (isLoading || historyLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ mb: 5, mt: isAdmin ? 1 : 5, padding: isAdmin ? "30px" : "" }}>
      <Container
        style={{
          width: isAdmin ? "95%" : "70%",
        }}
      >
        {!isAdmin && (
          <Box
            sx={{
              width: "100%",
              backgroundColor: "primary.main",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Box
                sx={{
                  backgroundColor: "text.light",
                  width: "35px",
                  height: "35px",
                  textAlign: "center",
                  borderRadius: "10px",
                  lineHeight: "35px",
                }}
              >
                <KeyboardArrowLeftIcon
                  sx={{ fontSize: "15px", color: "text.secondary" }}
                ></KeyboardArrowLeftIcon>
              </Box>

              <Stack direction={"column"} spacing={0.5}>
                <Typography
                  variant="h2"
                  color="white"
                  fontSize={"20px"}
                  fontWeight={700}
                >
                  My wallet
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}

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

export default Wallet;
