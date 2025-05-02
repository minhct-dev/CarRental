/* eslint-disable react/prop-types */
import { Box, Button, Stack, Typography } from "@mui/material";
import { formatVND } from "../../../helper/function";
import svg from "../../../assets/mastercard.svg";
import { Container } from "react-bootstrap";
import WalletModel from "./WalletModel";
import { useState } from "react";
const WalletBalence = ({ data }) => {
  const [type, setType] = useState(null);
  const [show, setShow] = useState(false);

  const closeModal = () => {
    setType(null);
    setShow(false);
  };

  const handleTopUp = () => {
    setType(1);
    setShow(true);
    }

    const handleWidthDraw = () => {
        setType(2);
        setShow(true);
    }

  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="h6"
        fontSize={"25px"}
        fontWeight={500}
        color="initial"
      >
        My Balance
      </Typography>

      <Stack
        sx={{ width: "100%" }}
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          sx={{
            width: "40%",
            height: "230px",
            background: "linear-gradient(to bottom, #8e2de2, #4a00e0)",
            borderRadius: "35px",
            position: "relative",
          }}
        >
          <Container style={{ width: "90%" }}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"start"}
              sx={{ mt: 3 }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontSize={"15px"}
                  fontWeight={400}
                  color="#ccc"
                >
                  Current Balance
                </Typography>
                <Typography
                  variant="h6"
                  fontSize={"30px"}
                  fontWeight={400}
                  color="white"
                  sx={{ ml: 2 }}
                >
                  {formatVND(data.walletBalance || 0)}
                </Typography>
              </Box>
              <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <img width={40} src={svg} alt="" />
                <Typography
                  variant="h6"
                  fontSize={"15px"}
                  fontWeight={400}
                  color="#ccc"
                >
                  Rental car
                </Typography>
              </Stack>
            </Stack>

            <Box sx={{ position: "absolute", bottom: "20px" }}>
              <Typography variant="body1" color="#ccc">
                {data.email}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        sx={{ mt: 2 }}
        spacing={2}
      >
        <Button onClick={handleTopUp} variant="contained">Top up</Button>
        <Button onClick={handleWidthDraw} color="error" variant="contained">
          Width draw
        </Button>
      </Stack>

      <WalletModel
        show={show}
        closeModal={closeModal}
        title={type == 1 ? "Top Up" : "Width draw"}
        balance={data.walletBalance}
        type={type}
      ></WalletModel>
    </Box>
  );
};

export default WalletBalence;
