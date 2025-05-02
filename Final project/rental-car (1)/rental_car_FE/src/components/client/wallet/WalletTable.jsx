/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Alert,
  Box,
  Button,
  Pagination,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Table } from "react-bootstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { formatVND } from "../../../helper/function";
import dayjs from "dayjs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const WalletTable = ({ history, totalPages, page, size, from, to }) => {
  const today = dayjs().format("YYYY-MM-DD");
  const minDate = dayjs()
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const [searchParams, setSearchParams] = useSearchParams();
  const [start, setStart] = useState(from);
  const [end, setEnd] = useState(to);
  const [err, setErr] = useState(false);
  const changeQuery = (list) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      list.forEach((e) => {
        params.set(e.key, e.value);
      });
      return params;
    });
  };

  const changePage = (v) => {
    changeQuery([
      { key: "page", value: v },
      { key: "transaction", value: true },
    ]);
  };

  const changeSize = (size) => {
    changeQuery([
      { key: "page", value: 1 },
      { key: "size", value: size },
      { key: "transaction", value: true },
    ]);
  };
  const changeDate = (start, end) => {
    changeQuery([
      { key: "page", value: 1 },
      { key: "from", value: start },
      { key: "to", value: end },
      { key: "transaction", value: true },
    ]);
  };

  const changeStartDate = (v) => {
    setStart(dayjs(v).format("YYYY-MM-DD"));
  };
  const changeEndDate = (v) => {
    setEnd(dayjs(v).format("YYYY-MM-DD"));
  };
  const handleSearch = (v) => {
    if (dayjs(start).isAfter(end)) {
      setErr(true);
    } else {
      setErr(false);
      changeDate(start, end);
    }
  };

  console.log(history);
  
  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="h6"
        fontSize={"25px"}
        fontWeight={500}
        color="initial"
      >
        Transation
      </Typography>

      <Box sx={{ ml: 2 }}>
        <Box sx={{ mt: 3 }}>
          {err && (
            <Alert sx={{ width: "50%", margin: "30px auto" }} severity="error">
              Start date cannot be after End date
            </Alert>
          )}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <DatePicker
                label="Start date"
                minDate={dayjs(minDate)}
                maxDate={dayjs(today)}
                value={dayjs(start)}
                onChange={changeStartDate}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
              <DatePicker
                label="End date"
                onChange={changeEndDate}
                value={dayjs(end)}
                minDate={dayjs(minDate)}
                maxDate={dayjs(today)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button onClick={handleSearch} variant="contained">Search</Button>
            </Stack>
          </LocalizationProvider>
        </Box>

        <TableContainer sx={{ mt: 5 }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="left">Type</TableCell>
                <TableCell align="left">Booking</TableCell>
                <TableCell align="left">Car Name</TableCell>
                <TableCell align="left">Date time</TableCell>
                <TableCell align="left">Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history?.map((row, index) => (
                <TableRow
                  key={row.No}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body1" color="initial">
                      {row.No}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="body1"
                      fontWeight={400}
                      color={row.Amount > 0 ? "green" : "red"}
                    >
                      {row.Amount > 0 ? "+" : "-"}{" "}
                      {row.Amount > 0
                        ? formatVND(row.Amount)
                        : formatVND(row.Amount * -1)}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">{row.Type}</TableCell>
                  <TableCell align="left">{row.BookingNo || "N/A"}</TableCell>
                  <TableCell align="left">{row.CarName || "N/A"}</TableCell>
                  <TableCell align="left">{row.DateTime}</TableCell>
                  <TableCell align="left">{row.Note != "" ? row.Note : "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction={"row"}
          justifyContent={"center"}
          spacing={2}
          sx={{ mt: 5 }}
        >
          <Pagination
            page={parseInt(page)}
            onChange={(e, v) => changePage(v)}
            count={totalPages}
            color="primary"
          />
          <TextField
            size="small"
            defaultValue={size}
            label="Size"
            type="number"
            inputProps={{ min: 1, max: 10 }}
            onChange={(e) => {
              let value = parseInt(e.target.value, 10);
              if (value < 1) value = 1;
              if (value > 10) value = 10;
              e.target.value = value; // Cập nhật lại giá trị nếu vượt giới hạn
              changeSize(e.target.value);
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default WalletTable;
