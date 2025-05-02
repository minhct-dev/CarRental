import { Stack } from "@mui/material";
import BasicInfomation from "../../carDetail/CarDetailLeft/TabItem/BasicInfomation";
import Detail from './../../carDetail/CarDetailLeft/TabItem/Detail';
import TermOfUseInfo from "./TermOfUseInfo";

function CarInfo({carDetail}) {
    return ( 
        <Stack direction={"column"} gap={2}>
            <BasicInfomation data={carDetail}/>
            <Detail data={carDetail}/>
            <TermOfUseInfo data={carDetail}/>
        </Stack>
     );
}

export default CarInfo;