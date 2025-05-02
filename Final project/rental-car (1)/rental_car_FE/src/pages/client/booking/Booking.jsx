/* eslint-disable no-unused-vars */
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import RootBooking from "../../../components/client/booking/RootBooking";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import Loading from "../loading/Loading";
import { useEffect, useState } from "react";
import { rentCarApi } from "../../../api/bookingApi";
import Swal from "sweetalert2";
import NotFound from "../../../components/err/NotFound";
import NotPermisson from "../../../components/err/NotPermisson";

const steps = ["Booking Information", "Payment", "Finish"];

export default function Booking() {
  let profile = useSelector((state) => state.auth.profile);
  const [activeStep, setActiveStep] = useState(0);
  const [driverLicense, setDriverLicense] = useState(
    profile?.drivingLicenseUrl[0] || null
  );
  const [driverLicenseBack, setDriverLicenseBack] = useState(
    profile?.drivingLicenseUrl[1] || null
  );

  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [driverLicenseBackFile, setDriverLicenseBackFile] = useState(null);

  const [err, setError] = useState(false);
  const [driver, setDriver] = useState(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);
  const [request, setRequest] = useState(null);
  const [check, setCheck] = useState(false);
  const handleCheck = (e) => {
    const checked = e.target.checked;
    setCheck(checked);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => rentCarApi(data),
    onSuccess: () => {
      setActiveStep(2);
    },
    onError: (e) => {
      if (
        e.response.data.message == "Booking time overlaps with another booking."
      ) {
        setError(true);
        setActiveStep(2);
      } else {
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
        setActiveStep(1);
      }
    },
  });
  const data = useSelector((state) => state.booking);
  const [selectVoucher, setSelectVoucher] = useState(data.voucher);

  if (!profile) {
    return <NotPermisson></NotPermisson>;
  }
  if (data.car == null) {
    return <NotFound></NotFound>;
  }

  const handleNext = async () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep == 1) {
        let form = new FormData();
        let dataRequest = {
          ...request,
          carId: data.id,
          from: data.startDate,
          to: data.endDate,
          driverId: driver != null ? driver.userId : null,
        };

        form.append("obj", JSON.stringify(dataRequest));
        form.append("paymentChoice", 1);
        form.append("driverLicenseFront", driverLicenseFile);
        form.append("driverLicenseBack", driverLicenseBackFile);
        form.append(
          "voucherCode",
          selectVoucher == null ? "" : selectVoucher.code
        );
        mutate(form);
      } else {
        setActiveStep(prevActiveStep + 1);
      }
    });
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (isPending) {
    return <Loading></Loading>;
  } else {
    return (
      <Box
        sx={{
          width: "100%",
          pt: 5,
          pb: 5,
          background: "linear-gradient(to top, #ece9e6, #ffffff)",
        }}
      >
        <Stepper sx={{ width: "50%", margin: "auto" }} activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Container>
          {/* Stepper */}

          {/* Step content */}
          {activeStep === steps.length ? (
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
          ) : (
            <>
              <Box sx={{ mt: 2 }}>
                <RootBooking
                  startDate={data.startDate}
                  endDate={data.endDate}
                  driver={driver}
                  setDriver={setDriver}
                  err={err}
                  driverLicense={driverLicense}
                  driverLicenseBack={driverLicenseBack}
                  setDriverLicense={setDriverLicense}
                  setDriverLicenseBack={setDriverLicenseBack}
                  profile={profile}
                  activeStep={activeStep}
                  handleNext={handleNext}
                  handleBack={handleBack}
                  selectVoucher={selectVoucher}
                  setSelectVoucher={setSelectVoucher}
                  data={data}
                  setRequest={setRequest}
                  check={check}
                  setDriverLicenseBackFile={setDriverLicenseBackFile}
                  setDriverLicenseFile={setDriverLicenseFile}
                  handleCheck={handleCheck}
                ></RootBooking>
              </Box>
            </>
          )}
        </Container>
      </Box>
    );
  }
}
