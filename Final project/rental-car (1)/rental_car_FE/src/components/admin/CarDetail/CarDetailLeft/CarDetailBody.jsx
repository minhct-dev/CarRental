import { Box } from "@mui/material"
import CarDetailTab from "./CarDetailTab"


// eslint-disable-next-line react/prop-types
const CarDetailBody = ({data}) => {
  return (
    <Box sx={{mt:2}}>
      <CarDetailTab data={data}></CarDetailTab>
    </Box>
  )
}

export default CarDetailBody