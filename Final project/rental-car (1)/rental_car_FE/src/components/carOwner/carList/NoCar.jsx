import noCar from "../../../assets/deals-2.png";
import { Stack, Typography } from "@mui/material";

function NoCar() {
    return (
        <Stack sx={{ justifyContent: "center", alignItems: "center", height: "60vh" }}>
            <img src={noCar} alt="no car" style={{ width: "30%" }} />
            <Typography pt={1} variant="h5" fontWeight={600}>No car found! Add a car to see here.</Typography>
        </Stack>
    );
}

export default NoCar;