import { Box } from "@mui/material";
import { Container } from "react-bootstrap";
import MyTabs from "./TabPanel";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getProfileApi } from "../../../api/userApi";
import {
  getDistrictApi,
  getProvinceApi,
  getWardApi,
} from "../../../api/addressApi";
import Loading from "../../../pages/client/loading/Loading";

const ProfileCarOwner = () => {
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
      <Container style={{ width: "90%" }}>
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

export default ProfileCarOwner;
