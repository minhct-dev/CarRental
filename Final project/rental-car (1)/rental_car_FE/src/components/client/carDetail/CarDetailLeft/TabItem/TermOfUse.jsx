/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid2,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";
import { formatVND } from "../../../../../helper/function";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import GavelIcon from "@mui/icons-material/Gavel";
import CancelIcon from "@mui/icons-material/Cancel";
const TermOfUse = ({ data }) => {
  const cancellationPolicy = [
    {
      condition: "Car owner has not confirmed the booking",
      fee: "Free of charge",
      icon: <CheckCircle sx={{ color: green[500] }} />,
    },
    {
      condition: "Car owner has accepted the booking",
      fee: "Up to 100% of the deposit",
      icon:  <Cancel sx={{ color: red[500] }} />,
    },
 
  ];

  return (
    <Box>
      {/* Base Price and Deposit */}
      <Typography variant="h6" color="initial">
        <CreditCardIcon></CreditCardIcon> Price
      </Typography>
      <Typography
        variant="body1"
        fontSize={"15px"}
        fontWeight={400}
        color="initial"
        sx={{ mt: 2, mb: 1, ml: 2 }}
      >
        Basic price: {formatVND(data.basePrice)} /day
      </Typography>
      <Typography
        variant="body1"
        fontSize={"15px"}
        fontWeight={400}
        color="initial"
        sx={{ mb: 3, ml: 2 }}
      >
        Deposit: {formatVND(data.deposit)}
      </Typography>

      {/* Term of Use */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" color="initial">
          <GavelIcon></GavelIcon>Term of Use
        </Typography>
        <Box sx={{ ml: 2, mt: 3 }}>
          <Grid2 container rowSpacing={2}>
            {data.carTermOfUses.map((item, index) => (
              <Grid2 key={index} size={6}>
                <Typography
                  variant="body1"
                  fontSize={"15px"}
                  fontWeight={400}
                  color="initial"
                  sx={{ mb: 1 }}
                >
                  {index + 1}. {item}
                </Typography>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Box>

      {/* Cancellation Policy */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" color="initial" sx={{ mb: 2 }}>
          <CancelIcon></CancelIcon> Car Rental Cancellation Policy
        </Typography>

        <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
                  Cancellation Timing
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 16, width:"200px" }}>
                  Cancellation Fee
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cancellationPolicy.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.condition}</TableCell>
                  <TableCell>
                    {row.icon} {row.fee}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TermOfUse;
