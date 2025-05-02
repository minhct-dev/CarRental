/* eslint-disable react/prop-types */
import { Box, Grid2, Typography } from "@mui/material";

const TermOfUseInfo = ({data}) => {
  return (
    <Box>
      <Typography variant="h6" color="initial">
        Term of use
      </Typography>




      <Grid2 container sx={{ ml: 2,mt:3 }} rowSpacing={2} columnSpacing={2}>
        {data.carTermOfUses.map((item, index) => (
          <Grid2 key={index} size={6}>
            <Typography
              variant="body1"
              fontSize={"15px"}
              fontWeight={400}
              color="initial"
            >
              {index+1}. {item}
            </Typography>
          </Grid2>
        ))}
        
      
      </Grid2>
    </Box>
  );
};

export default TermOfUseInfo;
