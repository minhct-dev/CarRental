/* eslint-disable react/prop-types */
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import ChangeProfile from "../../client/profile/ChangeProfile";
import ChangePassword from "../../client/profile/ChangePassword";
import ChangeProfileDriver from "../../../pages/driver/profile/ChangeProfileDriver";

// eslint-disable-next-line react/prop-types
const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const MyTabs = ({
  data,
  province,
  setSelectProvince,
  setSelectDistrict,
  setSelectWard,
  district,
  ward,
  selectDistrict,
  selectProvince,
  selectWard,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      {/* Tabs */}
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab sx={{ textTransform: "none" }} label="Change profile" />
        <Tab sx={{ textTransform: "none" }} label="Change password" />
      </Tabs>

      {/* Tab Panels */}
      <TabPanel value={tabIndex} index={0}>
        {data.roles.includes("driver") ? (
          <ChangeProfileDriver
            ward={ward}
            district={district}
            setSelectProvince={setSelectProvince}
            setSelectDistrict={setSelectDistrict}
            setSelectWard={setSelectWard}
            province={province}
            data={data}
            selectDistrict={selectDistrict}
            selectProvince={selectProvince}
            selectWard={selectWard}
          />
        ) : (
          <ChangeProfile
            ward={ward}
            district={district}
            setSelectProvince={setSelectProvince}
            setSelectDistrict={setSelectDistrict}
            setSelectWard={setSelectWard}
            province={province}
            data={data}
            selectDistrict={selectDistrict}
            selectProvince={selectProvince}
            selectWard={selectWard}
          />
        )}
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ChangePassword></ChangePassword>
      </TabPanel>
    </Box>
  );
};

export default MyTabs;
