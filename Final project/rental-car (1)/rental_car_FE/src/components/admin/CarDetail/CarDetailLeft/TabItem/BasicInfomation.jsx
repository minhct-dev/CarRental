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

const BasicInfomation = ({ data }) => {

  let registrater = data.carImages.filter(item => item.type == "REGISTRATION_IMAGE")
  let cetificate = data.carImages.filter(item => item.type == "CERTIFICATE_IMAGE")
  let isurance = data.carImages.filter(item => item.type == "INSURANCE_IMAGE")
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
          { label: "Brand Name:", value: data?.carBrand.name },
          { label: "Model:", value: data?.carModel.name },
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
            <TableCell align="start">Note</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell align="start">Registration Images</TableCell>
            <TableCell
              align="start"
            >
              <a href={registrater[0].url}>Click to download</a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell align="start">Certificate Images</TableCell>
            <TableCell
              align="start"
            >
               <a href={cetificate[0].url}>Click to download</a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell align="start">Insurance Image</TableCell>
            <TableCell
              
            >
               <a href={isurance[0].url}>Click to download</a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default BasicInfomation;
