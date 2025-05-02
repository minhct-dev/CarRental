import { Typography, Stack } from "@mui/material";
import robot from "../../../assets/robot-error.png";

function ErrorPage() {
    return (
        <Stack sx={{ justifyContent: "center", alignItems: "center", height: "85vh", pb:1 }}>
            <img src={robot} alt="no car" style={{ width: "25%" }} />
            <Typography pt={1} variant="h5" fontWeight={600}>Sorry. Something went wrong.</Typography>
        </Stack>

    );
}

export default ErrorPage;