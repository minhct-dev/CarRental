import { Box } from "@mui/material";
import ErrorBooking from "./ErrorBooking";
import SuccessBooking from "./SuccessBooking";


const Step3Form = (err) => { 

  return (
    <Box>
      {err.err == true ? (
        <ErrorBooking></ErrorBooking>
      ) : (
        <SuccessBooking></SuccessBooking>
      )}
    </Box>
  );
};

export default Step3Form;
