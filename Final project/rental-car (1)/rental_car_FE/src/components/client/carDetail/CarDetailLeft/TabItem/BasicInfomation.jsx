/* eslint-disable react/prop-types */
import {
  Box,
  Grid2,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const BasicInfomation = ({ data }) => {
  return (
    <Box>
      <Typography variant="h6" color="initial">
        Basic Information
      </Typography>
      <Grid2 container sx={{ mt: 3, mb: 3 }} rowSpacing={2} columnSpacing={2}>
        {/* Danh sách thông tin */}
        {[
          { label: "Licence Plate:", value: data?.licencePlate },
          { label: "Color:", value: data?.color },
          { label: "Brand Name:", value: data?.brand },
          { label: "Model:", value: data?.model },
          { label: "Production Year:", value: data?.productionYear },
          { label: "No of seat:", value: data?.noOfSeats },
          { label: "Transmission:", value: data?.transmissionType },
          { label: "Fuel:", value: data?.fuelType },
        ].map((item, index) => (
          <Grid2 key={index} size={6}>
            <Stack sx={{ ml: 5 }} direction="row" spacing={1}>
              <Typography variant="body1">{item.label}</Typography>
              <Typography variant="body1" fontSize="15px" fontWeight={400}>
                {item.value}
              </Typography>
            </Stack>
          </Grid2>
        ))}
      </Grid2>
      <Typography variant="h6" color="initial">
        Documents
      </Typography>

      <Table sx={{ ml: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell align="start">Name</TableCell>
            <TableCell align="start">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell align="start">Registration Images</TableCell>
            {data.book_checked && data?.registrationImages?.length > 0 ? (
              <TableCell>
                <Link to={data?.registrationImages[0]}>Click to download</Link>
              </TableCell>
            ) : (
              <TableCell
                sx={{
                  color:
                    data?.registrationImages != null &&
                    data?.registrationImages.length > 0
                      ? "green"
                      : "red",
                }}
                align="start"
              >
                {data?.registrationImages != null &&
                data?.registrationImages.length > 0
                  ? "Verified"
                  : "Not Verify"}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell align="start">Certificate Images</TableCell>
            {data.book_checked ? (
              <TableCell>
                <Link to={data?.certificateImages[0]}>Click to download</Link>
              </TableCell>
            ) : (
              <TableCell
                sx={{
                  color:
                    data?.certificateImages != null &&
                    data?.certificateImages.length > 0
                      ? "green"
                      : "red",
                }}
                align="start"
              >
                {data?.certificateImages != null &&
                data?.certificateImages.length > 0
                  ? "Verified"
                  : "Not Verify"}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell align="start">Insurance Image</TableCell>

            {data.book_checked ? (
              <TableCell>
                <Link to={data?.insuranceImages[0]}>Click to download</Link>
              </TableCell>
            ) : (
              <TableCell
                sx={{
                  color:
                    data?.insuranceImages != null &&
                    data?.insuranceImages.length > 0
                      ? "green"
                      : "red",
                }}
                align="start"
              >
                {data?.insuranceImages != null &&
                data?.insuranceImages.length > 0
                  ? "Verified"
                  : "Not Verify"}
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default BasicInfomation;
