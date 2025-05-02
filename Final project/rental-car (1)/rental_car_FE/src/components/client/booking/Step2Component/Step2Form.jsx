import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { formatVND } from "../../../../helper/function";
import image from "../../../../assets/wallet.png";
import image2 from "../../../../assets/wallet2.png";
import image3 from "../../../../assets/money.png";
import image4 from "../../../../assets/atm-card.png";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
const today = dayjs().format("YYYY-MM-DD"); // Ngày hôm nay
const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY-MM-DD"); // 1 tháng trước
const Step2Form = ({ handleNext, handleBack, profile, data }) => {
  return (
    <Box
      sx={{
        padding: "30px",
        width: "70%",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        backgroundColor: "white",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h6" color="initial">
        Payment Infomation
      </Typography>
      <Container>
        <FormControl sx={{ mt: 3, width: "100%" }}>
          <FormLabel>Please select your payment method :</FormLabel>
          <RadioGroup defaultValue={1}>
            <Stack>
              <FormControlLabel
                sx={{ mt: 1 }}
                value={1}
                label={
                  <Box display="flex" alignItems="center">
                    <img
                      src={image2}
                      alt="Wallet"
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    My Wallet
                  </Box>
                }
                control={<Radio />}
              />
              <Stack
                direction={"column"}
                justifyContent={"center"}
                sx={{ ml: 3 }}
                spacing={2}
              >
                <Box sx={{ mt: 5 }}>
                  <Stack
                    sx={{ width: "100%" }}
                    direction={"row"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Box
                      sx={{
                        width: "50%",
                        height: "180px",
                        background:
                          "linear-gradient(to bottom, #8e2de2, #4a00e0)",
                        borderRadius: "35px",
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
                          </Box>

                          <img width={40} src={image} alt="" />
                        </Stack>
                        <Typography
                          variant="h6"
                          fontSize={"30px"}
                          fontWeight={400}
                          color="white"
                          sx={{ ml: 1 }}
                        >
                          {formatVND(profile.walletBalance)}
                        </Typography>
                      </Container>
                    </Box>
                  </Stack>
                </Box>

                {data.car.deposit <= profile.walletBalance ? (
                  <Typography
                    variant="body1"
                    textAlign={"center"}
                    color="green"
                    fontWeight={400}
                  >
                    ( Your wallet balance is sufficient )
                  </Typography>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      textAlign={"center"}
                      color="red"
                      fontWeight={400}
                    >
                      Your wallet balance is insufficient, Please go to wallet
                      to top up and try again!
                    </Typography>
                    <Link to={`/wallet?from=${oneMonthAgo}&to=${today}`} style={{ marginTop: "3px", textAlign: "center" }}>
                      Go to my wallet to top up
                    </Link>
                  </>
                )}
              </Stack>
            </Stack>
            <FormControlLabel
              sx={{ mt: 1 }}
              value={2}
              disabled
              label={
                <Box display="flex" alignItems="center">
                  <img
                    src={image3}
                    alt="Wallet"
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                  Cash
                </Box>
              }
              control={<Radio />}
            />
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="body1"
                fontWeight={400}
                fontSize={15}
                color="text.secondary"
              >
                {" "}
                ( This feature will be available in the future )
              </Typography>
            </Box>
            <FormControlLabel
              sx={{ mt: 1 }}
              value={3}
              disabled
              label={
                <Box display="flex" alignItems="center">
                  <img
                    src={image4}
                    alt="Wallet"
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                  Bank Transfer
                </Box>
              }
              control={<Radio />}
            />
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="body1"
                fontWeight={400}
                fontSize={15}
                color="text.secondary"
              >
                {" "}
                ( This feature will be available in the future )
              </Typography>
            </Box>
          </RadioGroup>
        </FormControl>

        <Stack
          sx={{ mt: 5 }}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Button
            disabled={data.car.deposit > profile.walletBalance}
            variant="contained"
            onClick={handleNext}
          >
            Next
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Step2Form;
