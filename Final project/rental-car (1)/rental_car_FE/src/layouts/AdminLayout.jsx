import { Box, Stack } from "@mui/material";
import Header from "../components/admin/Header";
import SideBar from "../components/admin/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import NotPermisson from "../components/err/NotPermisson";

const AdminLayout = () => {
  const [toggle, setToggle] = useState(false);

  const profile = useSelector((state) => state.auth.profile); // role là một mảng
  // Kiểm tra nếu role chứa "driver" hoặc "carowner"
  const hasAccess = profile?.roles.includes("admin");
  if (!hasAccess) {
    return <NotPermisson></NotPermisson>;
  }
  return (
    <>
      <Header toggle={toggle} setToggle={setToggle}></Header>
      <Stack direction={"row"} spacing={1}>
        <Box sx={{ width: toggle ? "73px" : "270px" }}>
          <SideBar toggle={toggle}></SideBar>
        </Box>
        <Box
          sx={{
            width: `calc(100% - ${toggle ? "73px" : "270px"})`,
            paddingTop: "90px",
            backgroundColor: "primary.background",
          }}
        >
          <Outlet></Outlet>
        </Box>
      </Stack>
    </>
  );
};

export default AdminLayout;
