import { Box, Stack, Typography } from "@mui/material";
import { Container } from "react-bootstrap";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MyTabs from "./TabPanel";
import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../../../api/userApi";
import Loading from "../loading/Loading";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../api/addressApi";
import { useEffect, useState } from "react";


const Profile = () => {
  const [selectProvince, setSelectProvince] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectWard, setSelectWard] = useState(null);

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

 
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });

  useEffect(() => {
    getProvinceApi().then((res) => {
      setProvince(res);
    });
  }, [data]);
  useEffect(() => {
    if (selectProvince) {
      setWard(null);
      getDistrictApi(selectProvince).then((res) => {
        setDistrict(res);
      });
    }
  }, [selectProvince]);
  useEffect(() => {
    if (selectDistrict) {
      getWardApi(selectDistrict).then((res) => {
        setWard(res);
      });
    }
  }, [selectDistrict]);



  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box sx={{ my: 5 }}>
      <Container style={{ width: "70%" }}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "primary.main",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Box
              sx={{
                backgroundColor: "text.light",
                width: "35px",
                height: "35px",
                textAlign: "center",
                borderRadius: "10px",
                lineHeight: "35px",
              }}
            >
              <KeyboardArrowLeftIcon
                sx={{ fontSize: "15px", color: "text.secondary" }}
              ></KeyboardArrowLeftIcon>
            </Box>

            <Stack direction={"column"} spacing={0.5}>
              <Typography
                variant="h2"
                color="white"
                fontSize={"20px"}
                fontWeight={700}
              >
                Profile Setting
              </Typography>
              <Typography
                variant="body1"
                fontSize={"13px"}
                fontWeight={400}
                color="white"
              >
                {data.email}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Box>
          <MyTabs
            district={district}
            ward={ward}
            setSelectProvince={setSelectProvince}
            setSelectDistrict={setSelectDistrict}
            setSelectWard={setSelectWard}
            province={province}
            data={data}
            selectDistrict={selectDistrict}
            selectProvince={selectProvince}
            selectWard={selectWard}
          ></MyTabs>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
