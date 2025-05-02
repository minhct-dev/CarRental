import { Stack, Typography } from "@mui/material";
import NoItem from "../../../../assets/no-item-found.png";
function NoCar() {
  return (
    <Stack direction={"column"} sx={{alignItems:"center", py:7, gap:1}}>
      <img src={NoItem} style={{width:"30%", objectFit:"cover"}}/>
      <Typography variant="span" sx={{fontSize:"1.5rem", fontWeight:500}}>No data found</Typography>
    </Stack>
  );
}

export default NoCar;
