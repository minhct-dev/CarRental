import Header from "../components/carOwner/header/Header";
import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import SideBar from "../components/carOwner/sideBar/SideBar";
import { useSelector } from "react-redux";
import NotPermisson from "../components/err/NotPermisson";

const DriverLayout = () => {
  const profile = useSelector((state) => state.auth.profile); // role là một mảng
  console.log(profile);
  
  // Kiểm tra nếu role chứa "driver" hoặc "carowner"
  const hasAccess = profile.roles.includes((r) => r === "driver");

  // Nếu không có quyền, điều hướng về trang chủ
  if (!hasAccess) {
    return <NotPermisson></NotPermisson>;
  }

  return (
    <Stack direction={"row"}>
      <Box sx={{ width: "17%", backgroundColor:"red" }}>
        <SideBar data={{ profile }} />
      </Box>
      <Box sx={{ width: "83%" }}>
        <Header data={{ profile }} />
        <Box sx={{ pt: 7 }}>
          <Outlet />
        </Box>
      </Box>
    </Stack>
  );
};

export default DriverLayout;
