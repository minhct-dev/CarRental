import { Box, Button, Rating, Stack, Typography } from "@mui/material";
import { Container } from "react-bootstrap";
import ControlledCarousel from "./input/Step4Slider";
import { formatVND } from "../../../helper/function";
import { useMutation } from "@tanstack/react-query";
import { addStep4Api } from "../../../api/carApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Step4 = ({ process,handlePageChange }) => {
  let arrImage = process?.carImages.filter((item) => item.type == "CAR_IMAGE");
  let navigate = useNavigate()
  const {mutate} = useMutation({
    mutationFn:(data) => addStep4Api(data),
    onSuccess: ()=>{
      navigate("/car-owner/car-list?draft=1")
    },
    onError:() => {
      Swal.fire({
        icon:"error"
      })
    }
  })

  const handleBack = () => {
    handlePageChange("step",2)
  }

  const handleSubmit = () => {
      let form = new FormData()
      form.append("draftId", process.id)
      mutate(form)
  }

  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
        padding: "50px",
      }}
    >
      <Container style={{ width: "90%" }}>
        <Typography
          sx={{ textAlign: "center", fontSize: "25px", fontWeight: 500, mt: 1 }}
          variant="h6"
          color="initial"
        >
          Preview
        </Typography>
        <Stack sx={{ mt: 3 }} direction={"row"} spacing={5}>
          <Box sx={{ width: "50%" }}>
            <ControlledCarousel images={arrImage}></ControlledCarousel>
          </Box>
          <Box>
            <Typography fontSize={"25px"} variant="h6" color="initial">
              {process.name}
            </Typography>
            <Stack sx={{ mt: 2 }} direction={"row"} spacing={2}>
              <Typography fontSize={"16px"} variant="body1" color="initial">
                Rating :{" "}
              </Typography>
              <Stack direction={"column"}>
                <Rating readOnly defaultValue={0} precision={0.5} />
                <Typography variant="body1" color="initial">
                  (No rating yet)
                </Typography>
              </Stack>
            </Stack>

            <Stack sx={{ mt: 2 }} direction={"row"} spacing={2}>
              <Typography fontSize={"16px"} variant="body1" color="initial">
                No of rides :{" "}
              </Typography>
              <Typography variant="body1" color="initial">
                0
              </Typography>
            </Stack>

            <Stack sx={{ mt: 2 }} direction={"row"} spacing={2}>
              <Typography fontSize={"16px"} variant="body1" color="initial">
                Base Price :{" "}
              </Typography>
              <Typography  variant="body1" color="initial">
                {formatVND(process.basePrice)} <span style={{color:"gray", fontSize:"14px", fontWeight:400}}>/ 1 Day</span>
              </Typography>
            </Stack>

            <Stack sx={{ mt: 2 }} direction={"row"} spacing={2}>
              <Typography fontSize={"16px"} variant="body1" color="initial">
                License Plate :{" "}
              </Typography>
              <Typography variant="body1" color="initial">
                {process.licencePlate}
              </Typography>
            </Stack>

            <Stack sx={{ mt: 2 }} direction={"row"} spacing={2}>
              <Typography fontSize={"16px"} variant="body1" color="initial">
                Status:
              </Typography>
              <Typography variant="body1" color="green">
                Available
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="hello" color="initial"></Typography>
          </Box>
        </Stack>
      </Container>
      <Stack sx={{ mt: 5 }} direction="row" spacing={2} justifyContent="end">
        <Button onClick={handleBack} variant="contained">
          Back Step
        </Button>
        <Button  onClick={handleSubmit} type="submit" variant="contained">
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default Step4;
