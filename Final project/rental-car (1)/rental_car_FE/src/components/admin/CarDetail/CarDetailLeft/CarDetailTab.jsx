/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BasicInfomation from "./TabItem/BasicInfomation";
import Detail from "./TabItem/Detail";
import TermOfUse from "./TabItem/TermOfUse";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CarDetailTab({data}) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Detail"
            sx={{ textTransform: "none" }}
            {...a11yProps(0)}
          />
          <Tab
            label="Basic Infomation"
            sx={{ textTransform: "none" }}
            {...a11yProps(1)}
          />
          <Tab
            label="Term of use"
            sx={{ textTransform: "none" }}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Detail data={data}></Detail>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BasicInfomation data={data}></BasicInfomation>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TermOfUse data={data}></TermOfUse>
      </CustomTabPanel>
    </Box>
  );
}
