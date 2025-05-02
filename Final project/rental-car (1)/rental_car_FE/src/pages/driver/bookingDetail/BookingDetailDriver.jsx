import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid2,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { AccountCircle, Email, Phone, CreditCard } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getBookingApi } from "../../../api/bookingApi";
import Loading from "../../client/loading/Loading";
import PlaceIcon from "@mui/icons-material/Place";
import dayjs from "dayjs";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CarImage from "../../../components/client/bookingDetail/CarImage";
import CardInfo from './../../../components/driver/bookingDetail/CardInfo';
let dataInput = [
  {
    label: "Full Name",
    name: "name",
    icon: <AccountCircle sx={{ fontSize: "18px" }}></AccountCircle>,
    type: "text",
    hoder: "Enter Full Name",
  },
  {
    label: "Date of birth",
    name: "dob",
    type: "date",
    hoder: "Enter Date of Birth",
  },
  {
    label: "Phone Number",
    name: "phone",
    icon: <Phone sx={{ fontSize: "18px" }}></Phone>,
    type: "text",
    hoder: "Enter Phone Number",
  },
  {
    label: "Email Address",
    name: "email",
    icon: <Email sx={{ fontSize: "18px" }}></Email>,
    type: "text",
    hoder: "Enter Email Address",
  },
  {
    label: "National ID",
    name: "nationalId",
    icon: <CreditCard sx={{ fontSize: "18px" }}></CreditCard>,
    type: "text",
    hoder: "Enter National Id",
  },
];
function BookingDetailDriver() {
    const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["car-owner-booking-detail", id],
    queryFn: () => getBookingApi(id),
  });

  console.log(data);

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box sx={{ pt: "5vh", backgroundColor: "#FAFAFB", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "30px",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            minHeight: "80vh",
          }}
        >
          <Box>
          <Breadcrumbs aria-label="breadcrumb">
      <Box
        component={Link}
        to="/"
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        Home
      </Box>
      <Box
        component={Link}
        to="/car-owner/request"
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        Booking list
      </Box>
      <Typography color="text.primary">Booking details</Typography>
    </Breadcrumbs>
          </Box>

          <Box>
            <Container sx={{ width: "95%" }}>
              <Stack direction={"row"} sx={{ pt: "1.4rem" }}>
                <CarImage carImg={data?.carImg} />
                <CardInfo onwer={true} bookingDetail={data} carName={"BMW"} />
              </Stack>
            </Container>
          </Box>

          <Box>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ ml: 10 }} variant="h6" color="initial">
                Rental Infomation
              </Typography>

              <Container sx={{ width: "80%" }}>
                <Grid2
                  sx={{ mt: 3 }}
                  container
                  columnSpacing={3}
                  rowSpacing={3}
                >
                  {dataInput.map((item, index) => {
                    if (item.type != "date") {
                      return (
                        <Grid2 size={6} key={index}>
                          <Stack spacing={1}>
                            <Typography fontSize={14} fontWeight={500}>
                              {item.label}:{" "}
                            </Typography>
                            <TextField
                              size="small"
                              disabled
                              value={data[item.name]}
                              sx={{
                                "& input": {
                                  fontSize: "15px",
                                  fontWeight: 400,
                                },
                                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                  color: "#ccc",
                                  transition: "color 0.3s ease",
                                },
                                "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                                  {
                                    color: "primary.main",
                                  },
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      {item.icon}
                                    </InputAdornment>
                                  ),
                                },
                              }}
                              fullWidth
                            />
                          </Stack>
                        </Grid2>
                      );
                    } else {
                      return (
                        <Grid2 size={6} key={index}>
                          <Stack spacing={1}>
                            <Typography fontSize={14} fontWeight={500}>
                              {item.label}:{" "}
                            </Typography>
                            <TextField
                              size="small"
                              disabled
                              value={dayjs(data[item.name]).format(
                                "DD/MM/YYYY"
                              )}
                              sx={{
                                "& input": {
                                  fontSize: "15px",
                                  fontWeight: 400,
                                },
                                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                  color: "#ccc",
                                  transition: "color 0.3s ease",
                                },
                                "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                                  {
                                    color: "primary.main",
                                  },
                              }}
                              slotProps={{
                                input: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DateRangeIcon></DateRangeIcon>
                                    </InputAdornment>
                                  ),
                                },
                              }}
                              fullWidth
                            />
                          </Stack>
                        </Grid2>
                      );
                    }
                  })}

                  {data.backImg && (
                    <Grid2 size={6}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          Driver License
                        </Typography>
                        <Stack direction={"row"} spacing={2}>
                          <img
                            src={data.backImg}
                            style={{
                              width: "50%",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                          <img
                            src={data.frontImg}
                            style={{
                              width: "50%",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                        </Stack>
                      </Stack>
                    </Grid2>
                  )}
                </Grid2>
                <Grid2
                  sx={{ mt: 2 }}
                  columnSpacing={3}
                  rowSpacing={3}
                  container
                >
                  <Grid2 size={6}>
                    <Stack spacing={1}>
                      <Typography fontSize={14} fontWeight={500}>
                        Province
                      </Typography>
                      <TextField
                        value={data.province.name}
                        size="small"
                        disabled
                        sx={{
                          "& input": {
                            fontSize: "15px",
                            fontWeight: 400,
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#ccc",
                            transition: "color 0.3s ease",
                          },
                          "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                            {
                              color: "primary.main",
                            },
                        }}
                        fullWidth
                      />
                    </Stack>
                  </Grid2>
                  <Grid2 size={6}>
                    <Stack spacing={1}>
                      <Typography fontSize={14} fontWeight={500}>
                        District
                      </Typography>
                      <TextField
                        size="small"
                        value={data.district.name}
                        disabled
                        sx={{
                          "& input": {
                            fontSize: "15px",
                            fontWeight: 400,
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#ccc",
                            transition: "color 0.3s ease",
                          },
                          "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                            {
                              color: "primary.main",
                            },
                        }}
                        fullWidth
                      />
                    </Stack>
                  </Grid2>

                  <Grid2 size={6}>
                    <Stack spacing={1}>
                      <Typography fontSize={14} fontWeight={500}>
                        Ward
                      </Typography>
                      <TextField
                        size="small"
                        disabled
                        value={data.ward.name}
                        sx={{
                          "& input": {
                            fontSize: "15px",
                            fontWeight: 400,
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#ccc",
                            transition: "color 0.3s ease",
                          },
                          "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                            {
                              color: "primary.main",
                            },
                        }}
                        fullWidth
                      />
                    </Stack>
                  </Grid2>

                  <Grid2 size={6}>
                    <Stack spacing={1}>
                      <Typography fontSize={14} fontWeight={500}>
                        Address Detail
                      </Typography>
                      <TextField
                        size="small"
                        disabled
                        value={data.addressDetail}
                        sx={{
                          "& input": {
                            fontSize: "15px",
                            fontWeight: 400,
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: "#ccc",
                            transition: "color 0.3s ease",
                          },
                          "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                            {
                              color: "primary.main",
                            },
                        }}
                        fullWidth
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PlaceIcon></PlaceIcon>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Stack>
                  </Grid2>
                </Grid2>
              </Container>
            </Box>

            {data.driverEmail && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ ml: 10 }} variant="h6" color="initial">
                  Driver Infomation
                </Typography>

                <Container sx={{ width: "80%" }}>
                  <Grid2
                    alignItems={"start"}
                    sx={{ mt: 3 }}
                    container
                    columnSpacing={3}
                    rowSpacing={3}
                  >
                    {dataInput.map((item, index) => {
                      if (item.type != "date") {
                        let name =
                          "driver" +
                          item.name.substring(0, 1).toUpperCase() +
                          item.name.substring(1);
                        return (
                          <Grid2 size={6} key={index}>
                            <Stack spacing={1}>
                              <Typography fontSize={14} fontWeight={500}>
                                {item.label}:{" "}
                              </Typography>
                              <TextField
                                value={data[name]}
                                size="small"
                                disabled
                                sx={{
                                  "& input": {
                                    fontSize: "15px",
                                    fontWeight: 400,
                                  },
                                  "& .MuiInputAdornment-root .MuiSvgIcon-root":
                                    {
                                      color: "#ccc",
                                      transition: "color 0.3s ease",
                                    },
                                  "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                                    {
                                      color: "primary.main",
                                    },
                                }}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {item.icon}
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                                fullWidth
                              />
                            </Stack>
                          </Grid2>
                        );
                      } else {
                        return (
                          <Grid2 size={6} key={index}>
                            <Stack spacing={1}>
                              <Typography fontSize={14} fontWeight={500}>
                                Date of Birth:{" "}
                              </Typography>
                              <Stack spacing={1}>
                                <TextField
                                  size="small"
                                  disabled
                                  value={dayjs(data?.driverDob).format(
                                    "DD/MM/YYYY"
                                  )}
                                  sx={{
                                    "& input": {
                                      fontSize: "15px",
                                      fontWeight: 400,
                                    },
                                    "& .MuiInputAdornment-root .MuiSvgIcon-root":
                                      {
                                        color: "#ccc",
                                        transition: "color 0.3s ease",
                                      },
                                    "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                                      {
                                        color: "primary.main",
                                      },
                                  }}
                                  slotProps={{
                                    input: {
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <DateRangeIcon></DateRangeIcon>
                                        </InputAdornment>
                                      ),
                                    },
                                  }}
                                  fullWidth
                                />
                              </Stack>
                            </Stack>
                          </Grid2>
                        );
                      }
                    })}

                    <Grid2 size={6}>
                      <Typography fontSize={14} fontWeight={500}>
                        License Driver:{" "}
                      </Typography>
                      <Stack sx={{ mt: 1 }} spacing={2} direction={"row"}>
                        {data?.driveLicense.map((item, index) => {
                          return (
                            <img
                              src={item}
                              key={index}
                              style={{
                                objectFit: "cover",
                                height: "100px",
                                width: "100%",
                              }}
                              alt=""
                            />
                          );
                        })}
                      </Stack>
                    </Grid2>
                  </Grid2>

                  <Grid2
                    sx={{ mt: 2 }}
                    columnSpacing={3}
                    rowSpacing={3}
                    container
                  >
                    <Grid2 size={6}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          Province
                        </Typography>
                        <TextField
                          value={data.driverProvince.name}
                          size="small"
                          disabled
                          sx={{
                            "& input": {
                              fontSize: "15px",
                              fontWeight: 400,
                            },
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                              color: "#ccc",
                              transition: "color 0.3s ease",
                            },
                            "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                              {
                                color: "primary.main",
                              },
                          }}
                          fullWidth
                        />
                      </Stack>
                    </Grid2>
                    <Grid2 size={6}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          District
                        </Typography>
                        <TextField
                          size="small"
                          value={data.driverDistrict.name}
                          disabled
                          sx={{
                            "& input": {
                              fontSize: "15px",
                              fontWeight: 400,
                            },
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                              color: "#ccc",
                              transition: "color 0.3s ease",
                            },
                            "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                              {
                                color: "primary.main",
                              },
                          }}
                          fullWidth
                        />
                      </Stack>
                    </Grid2>

                    <Grid2 size={6}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          Ward
                        </Typography>
                        <TextField
                          size="small"
                          disabled
                          value={data.driverWard.name}
                          sx={{
                            "& input": {
                              fontSize: "15px",
                              fontWeight: 400,
                            },
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                              color: "#ccc",
                              transition: "color 0.3s ease",
                            },
                            "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                              {
                                color: "primary.main",
                              },
                          }}
                          fullWidth
                        />
                      </Stack>
                    </Grid2>

                    <Grid2 size={6}>
                      <Stack spacing={1}>
                        <Typography fontSize={14} fontWeight={500}>
                          Address Detail
                        </Typography>
                        <TextField
                          size="small"
                          disabled
                          value={data.driverAddressDetail}
                          sx={{
                            "& input": {
                              fontSize: "15px",
                              fontWeight: 400,
                            },
                            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                              color: "#ccc",
                              transition: "color 0.3s ease",
                            },
                            "& .Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root":
                              {
                                color: "primary.main",
                              },
                          }}
                          fullWidth
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PlaceIcon></PlaceIcon>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Stack>
                    </Grid2>
                  </Grid2>
                </Container>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default BookingDetailDriver;