import { Box } from "@mui/material";
import { Container } from "react-bootstrap";

import HeaderNav from "../../header/HeaderNav";
import Landing from "../landing/Landing";
import PickDate from "../landing/PickDate";


const Header = () => {
  return (
    <Box
      sx={{
        height: "550px",
        background: `linear-gradient(
    to bottom,
    rgba(138, 121, 240, 0),
    rgba(138, 121, 240, 0.1)
  )`,
        position: "relative",
      }}
    >
      <Container style={{ width: "70%" }}>
        {/* header */}
        <HeaderNav home={true} paddingX={"0px"} paddingY={"10px"}></HeaderNav>
        <Landing></Landing>
        <PickDate></PickDate>
      </Container>
    </Box>
  );
};

export default Header;
