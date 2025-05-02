import { Box, Button, Stack, Typography } from "@mui/material";
import ImageSlider from "./ImageSlider";
import { formatVND } from "./../../../helper/function";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deteleDraftUpdateApi } from "../../../api/carApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";

const imgStyle = {
  height: "14rem",
};
function CarDraftCard({ car }) {

  const navigate = useNavigate()

  const handleUpdate = () => {
    navigate("/car-owner/edit-car-draft/"+car.draftId)
  }
  const handleStatus = (status) => {
    if (status == "pending") {
      return {
        name: "Pending",
        color: "orange",
      };
    } else {
      return {
        name: "Reject",
        color: "red",
      };
    }
  };
  const handleType = (type) => {
    if(type == "create"){
      return {
        name: "Create",
        color: "#673AB7",
      };
    }
    else{
      return {
        name: "Update",
        color: "orange",
      };
    }
  }
  let statusData = handleStatus(car.status.toLowerCase());
  let typeData  = handleType(car.type.toLowerCase())
 
  const {mutate} = useMutation({
    mutationFn: (id) => deteleDraftUpdateApi(id),
    onSuccess: ()=>{
      queryClient.invalidateQueries(["list-draft"])
    },
    onError : () =>{
      Swal.fire({
        icon:"error",
        text:"Something Err"
      })
    }   
  })

  const handleDelete =() =>{
    Swal.fire({
      icon:"question",
      reverseButtons:true,
      showCancelButton:true,
      showConfirmButton:true,
      title:"Cancel Update",
      text:"Are you sure cancel update this car"
    }).then((r) => {
      if(r.isConfirmed){
        mutate(car.draftId)
      }
    })
  }
  
  return (
    <Stack
      direction={"column"}
      className="car-card"
      sx={{
        backgroundColor: "white",
        borderRadius: "13px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        width: "30%",
        pt: "0.7rem",
        px: "0.7rem",
        pb: 2,
        justifyContent: "space-between",
      }}
    >
      <Stack direction={"column"} sx={{ gap: 2 }}>
        <Box sx={{ width: "100%" }}>
          <ImageSlider>
            {car.carImagesUrl.map((img, index) => (
              <img key={index} src={img} alt={car.imgAlt} style={imgStyle} />
            ))}
          </ImageSlider>
        </Box>
        <Stack direction={"column"} sx={{ px: "0.7rem" }}>
          <Box>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, fontSize: "1.4rem" }}
              >
                {car.brand} {car.model}
              </Typography>
            </Stack>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.2rem",
                fontWeight: 200,
                pl: "3px",
              }}
            ></Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Stack direction={"column"} justifyContent={"start"} spacing={1}>
              <Stack
                alignItems={"start"}
                sx={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
                direction={"column"}
                spacing={1}
              >
                <Typography
                  variant="p"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    alignContent: "center",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {car.district}, {car.province}
                </Typography>

                <Stack direction={"row"} spacing={1}>
                  <Typography
                    variant="p"
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: "400",
                      alignContent: "center",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Type:
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{
                      fontSize: "15px",
                      fontWeight: "blod",
                      alignContent: "center",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      color: typeData.color,
                    }}
                  >
                    {typeData.name}
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                spacing={"3px"}
              >
                <Stack direction={"row"} sx={{ alignItems: "end" }}>
                  <Typography
                    variant="p"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      alignContent: "center",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {formatVND(car.basePrice)}
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: "300",
                      pl: "8px",
                    }}
                  >
                    per day
                  </Typography>
                </Stack>

                <Box>
                  <Typography
                    textTransform={"none"}
                    variant="body1"
                    color={statusData.color}
                  >
                    {statusData.name}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Stack sx={{ mt: 3 }} direction={"row"} spacing={2} justifyContent={"start"}>
              <Button onClick={handleUpdate} variant="contained">View Detail</Button>
              {car.type == "UPDATE" && <Button onClick={handleDelete} variant="contained" color="error">Cancel Update</Button>}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default CarDraftCard;
