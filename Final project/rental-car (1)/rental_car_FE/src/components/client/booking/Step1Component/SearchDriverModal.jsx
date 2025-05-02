import {
  Autocomplete,
  Avatar,
  Backdrop,
  Box,
  Button,
  Fade,
  Grid2,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import image from "../../../../assets/11000.jpg";
import { useQuery } from "@tanstack/react-query";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../../api/addressApi";
import { useState } from "react";
import { formatVND } from "../../../../helper/function";
import { searchDriverApi } from "../../../../api/driverApi";
const SearchDriverModal = ({
  open,
  handleClose,
  startDate,
  endDate,
  setDriver,
}) => {
  const style = {
    position: "absolute",
    top: "20%",
    left: "50%",
    minHeight: "500px",
    transform: "translate(-50%, -20%)",
    width: "50vw",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };
  const [selectProvince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);

  const { data } = useQuery({
    queryKey: [
      "search-driver",
      selectProvince?.code,
      selectDistrict?.code,
      selectWard?.code,
    ],
    queryFn: () =>
      searchDriverApi(
        startDate,
        endDate,
        selectProvince?.code,
        selectDistrict?.code,
        selectWard?.code
      ),
    enabled: !!selectProvince,
  });

  const { data: province } = useQuery({
    queryKey: ["province"],
    queryFn: getProvinceApi,
  });

  const { data: district } = useQuery({
    queryKey: ["district", selectProvince?.code],
    queryFn: () => getDistrictApi(selectProvince.code),
    enabled: !!selectProvince?.code, // Only enable when selectprovince.code is available
  });

  const { data: ward } = useQuery({
    queryKey: ["ward", selectDistrict?.code],
    queryFn: () => getWardApi(selectDistrict.code),
    enabled: !!selectDistrict?.code, // Only enable when selectprovince.code is available
  });

  const handleSetDriver = (item) => {
    setDriver(item);
    handleClose();
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Search Driver
              </Typography>
            </Box>
            <Box>
              <Box>
                <Typography sx={{ mt: 3 }} fontSize={14} fontWeight={500}>
                  Select Address To Find Driver
                </Typography>
              </Box>
              <Grid2 sx={{ mt: 2 }} columnSpacing={3} container>
                <Grid2 size={4}>
                  <Autocomplete
                    disablePortal
                    options={province || []}
                    value={selectProvince}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, v) => {
                      setSelectProvince(v);
                      setSelectDistrict(null);
                      setSelectWard(null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          label: { color: "text.secondary" },
                          "& input": {
                            fontWeight: 400,
                            fontSize: "15px",
                          },
                        }}
                        {...params}
                        size="small"
                        label="Province"
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={4}>
                  <Autocomplete
                    disablePortal
                    options={district || []}
                    disabled={selectProvince == null}
                    getOptionLabel={(option) => option.name}
                    value={selectDistrict}
                    onChange={(e, v) => {
                      setSelectDistrict(v);
                      setSelectWard(null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          label: { color: "text.secondary" },
                          "& input": {
                            fontWeight: 400,
                            fontSize: "15px",
                          },
                        }}
                        {...params}
                        size="small"
                        label="District"
                      />
                    )}
                  />
                </Grid2>

                <Grid2 size={4}>
                  <Autocomplete
                    disablePortal
                    options={ward || []}
                    value={selectWard}
                    onChange={(e, v) => setSelectWard(v)}
                    disabled={selectProvince == null || selectDistrict == null}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          label: { color: "text.secondary" },
                          "& input": {
                            fontWeight: 400,
                            fontSize: "15px",
                          },
                        }}
                        {...params}
                        size="small"
                        label="Ward"
                      />
                    )}
                  />
                </Grid2>
              </Grid2>
            </Box>

            {selectProvince == null ? (
              <Box>
                <Stack
                  direction="column"
                  alignItems={"center"}
                  sx={{ mt: 5 }}
                  justifyContent={"center"}
                >
                  <img style={{ width: "300px" }} src={image} alt="" />
                  <Typography variant="body1" color="initial">
                    Please select address to find driver
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ mb: 2 }} variant="body1" color="initial">
                  Seach result
                </Typography>
                {data?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        border: "1px solid #ccc",
                        padding: "20px",
                        borderRadius: "10px",
                      }}
                    >
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"start"}
                      >
                        <Stack direction={"row"} spacing={2}>
                          <Avatar
                            sx={{ width: "90px", height: "90px" }}
                            src={item.avatarUrl}
                          ></Avatar>
                          <Stack direction={"column"} alignItems={"start"}>
                            <Typography variant="body1" color="initial">
                              {item?.driverName}
                            </Typography>

                            <Typography
                              fontSize={"13px"}
                              fontWeight={400}
                              variant="body1"
                              color="initial"
                            >
                              {item.wardCode.name}, {item.districtCode.name},{" "}
                              {item.provinceCode.name}
                            </Typography>
                            <Stack>
                              <Typography
                                fontSize={"13px"}
                                fontWeight={400}
                                variant="body1"
                                color="initial"
                              >
                                Exp : {item?.driverExp} year
                              </Typography>
                              <Typography
                                fontSize={"13px"}
                                fontWeight={400}
                                variant="body1"
                                color="initial"
                              >
                                Number of Booking : {item.noOfBookings}
                              </Typography>
                             
                            </Stack>
                          </Stack>
                        </Stack>
                        <Stack direction={"column"} spacing={1}>
                          <Typography
                            fontSize={"18px"}
                            variant="body1"
                            color="initial"
                          >
                            {formatVND(item.price)} /day
                          </Typography>
                          <Stack direction={"row"}>
                            <Typography
                              fontSize={"15px"}
                              fontWeight={400}
                              variant="body1"
                              color="initial"
                            >
                              Status :
                            </Typography>
                            <Typography
                              fontSize={"15px"}
                              fontWeight={400}
                              variant="body1"
                              color={item.status != "Available" ? "red" : "green"}
                            >
                              {item.status}
                            </Typography>
                          </Stack>
                          <Button
                            onClick={() => handleSetDriver(item)}
                            disabled={
                              item.status != "Available" 
                            }
                            variant="contained"
                          >
                           {" Book Now "}
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            )}

            <Stack sx={{ mt: 5 }} direction={"row"} justifyContent={"end"}>
              <Button onClick={handleClose} variant="contained">
                Cancel
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default SearchDriverModal;
