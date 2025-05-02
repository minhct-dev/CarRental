/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import { Stack } from "react-bootstrap";

const ConmonTitle = ({title, para}) => {
  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography
        sx={{ textAlign: "center", fontSize: "30px", fontWeight: 700 }}
        variant="h23"
        color="initial"
      >
        {title}
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          width: "50%",
          margin: "auto",
          fontSize: "13px",
          color: "text.secondary",
        }}
        variant="body1"
        color="initial"
      >
        {para}
      </Typography>
    </Stack>
  );
};

export default ConmonTitle;
