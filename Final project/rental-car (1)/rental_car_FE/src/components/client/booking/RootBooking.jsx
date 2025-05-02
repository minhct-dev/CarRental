import { Box, Stack } from "@mui/material";
import Step1Form from "./Step1Component/Step1Form";
import PreviewBooking from "./preview/PreviewBooking";
import Step2Form from "./Step2Component/Step2Form";
import Step3Form from "./Step3Component/Step3Form";

const RootBooking = ({
  activeStep,
  handleNext,
  handleBack,
  data,
  profile,
  setRequest,
  setDriverLicense,
  setDriverLicenseBack,
  driverLicense,
  driverLicenseBack,
  err,
  startDate,
  endDate,
  driver,
  setDriver,
  check,
  handleCheck,
  setDriverLicenseBackFile,
  setDriverLicenseFile,
  selectVoucher,
  setSelectVoucher
}) => {
  return (
    <Box sx={{ mt: 5 }}>
      <Stack direction={"row"} spacing={2} alignItems={"start"}>
        {activeStep == 0 && (
          <Step1Form
            driverLicense={driverLicense}
            driverLicenseBack={driverLicenseBack}
            setDriverLicense={setDriverLicense}
            setDriverLicenseBack={setDriverLicenseBack}
            setRequest={setRequest}
            profile={profile}
            handleNext={handleNext}
            startDate={startDate}
            endDate={endDate}
            driver={driver}
            setDriver={setDriver}
            check={check}
            handleCheck={handleCheck}
            setDriverLicenseBackFile={setDriverLicenseBackFile}
            setDriverLicenseFile={setDriverLicenseFile}
          ></Step1Form>
        )}
        {activeStep == 1 && (
          <Step2Form
            handleBack={handleBack}
            handleNext={handleNext}
            profile={profile}
            data={data}
          ></Step2Form>
        )}
        {activeStep == 2 && (
          <Step3Form err={err} handleBack={handleBack}></Step3Form>
        )}
        {activeStep != 2 && (
          <PreviewBooking
            selectVoucher={selectVoucher}
            setSelectVoucher={setSelectVoucher}
            data={data}
          />
        )}
      </Stack>
    </Box>
  );
};
export default RootBooking;
