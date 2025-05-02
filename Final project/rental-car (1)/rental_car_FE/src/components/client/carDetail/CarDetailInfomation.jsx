/* eslint-disable react/prop-types */
import { Box, Stack } from "@mui/material";
import CarDetailHead from "./CarDetailLeft/CarDetailHead";
import CarDetailPrice from "./CarDetailRight/CarDetailPrice";
import CarDetailBody from "./CarDetailLeft/CarDetailBody";
import CarFeedback from "./feedback/CarFeedback";
import CarOwnerInfo from "./carOwnerInfo/CarOwnerInfo";

const CarDetailInfomation = ({data, id,refetch, voucher, page, setPage}) => {
 
  
  return (
    <Stack sx={{ width: "100%", mt:2 }} justifyContent={"space-between"} direction={"row"} spacing={1}>
        <Box sx={{width:"65%"}}>
            <CarDetailHead data={data}></CarDetailHead>
            <CarDetailBody data={data}></CarDetailBody>
            <CarOwnerInfo data={data}/>
            <CarFeedback data={data} page={page} setPage={setPage}/>
        </Box>
        <Box sx={{width:"35%"}}>
            <CarDetailPrice voucher={voucher} refetch={refetch} id={id} data={data}></CarDetailPrice>
        </Box>
    </Stack>
  );
};

export default CarDetailInfomation;
