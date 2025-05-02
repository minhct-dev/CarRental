import { Typography, Stack } from "@mui/material";
import noFeedback from "../../../assets/no-feedback.png";

function NoFeedback() {
    return ( 
        <Stack sx={{ justifyContent: "center", alignItems: "center", height: "70vh" }}>
            <img src={noFeedback} alt="No feedback" style={{ width: "30%" }} />
            <Typography pt={2} variant="h5" fontWeight={600}>You have no feedback.</Typography>
        </Stack>
     );
}

export default NoFeedback;