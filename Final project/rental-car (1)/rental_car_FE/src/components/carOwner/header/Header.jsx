import { Badge, Box, InputAdornment, Stack } from "@mui/material";
import { Container } from "react-bootstrap";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Avatar, Button, Typography, TextField } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifyMessageApi } from "../../../api/chatApi";

const Header = ({ data }) => {
  const { data: notifyApi, isError } = useQuery({
    queryKey: ["notify-message"],
    queryFn: getNotifyMessageApi,
  });

  

  useEffect(() => {
    if (notifyApi && !isError) {
      setNotify(notifyApi.length);
    }
  }, [notifyApi]);

  console.log(notifyApi);

  const socket = useSelector((state) => state.stomps.client);
  const profile = useSelector((state) => state.auth.profile);
  const [notify, setNotify] = useState(0);
  useEffect(() => {
    if (!socket) return;
    const subscription = socket.subscribe(
      `/user/${profile.id}/queue/notify`,
      (message) => {
        let payload = JSON.parse(message.body)
        if(payload.type == "seen"){
          setNotify(prev => prev - payload.numberOfSeenMessages);
        }
        else{
          setNotify(prev => prev + 1);
        }
        
        
      }
    );
    return () => {
      subscription.unsubscribe(); // cleanup tránh leak socket
    };
  }, [socket]);

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "8vh", // ✅ Đặt height thành 10% chiều cao màn hình
        borderBottom: "1px solid #dddd",
        display: "flex", // ✅ Cần display: flex để căn giữa theo chiều dọc
        alignItems: "center", // ✅ Căn giữa theo chiều dọc
        position: "fixed",
        backgroundColor: "white",
        width: "83%",
        right: 0,
        zIndex: 99,
      }}
    >
      <Container style={{ width: "95%" }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"} // ✅ Căn giữa theo chiều dọc cho Stack
        >
          <Box>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <MenuOutlinedIcon></MenuOutlinedIcon>
              <TextField
                placeholder="Search ..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray" }} />{" "}
                      {/* ✅ Icon search */}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "250px", // ✅ Đặt chiều rộng tùy chỉnh
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px", // ✅ Bo tròn viền
                  },
                }}
              />
            </Stack>
          </Box>
          <Box sx={{ position: "relative" }}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Badge
                onClick={() => navigate("/car-owner/chat")}
                badgeContent={notify}
                color="primary"
              >
                <MailOutlineOutlinedIcon color="action" />
              </Badge>

              <Button>
                <Stack
                  sx={{ cursor: "pointer" }}
                  direction={"row"}
                  alignItems={"center"} // ✅ Căn giữa icon + text
                  spacing={1}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src={data.profile.avatarUrl}
                    sx={{ width: 35, height: 35 }}
                  />
                  <Typography
                    sx={{
                      fontSize: "15px",
                      color: "text.primary",
                    }}
                    variant="body1"
                  >
                    {data.profile.name}
                  </Typography>
                </Stack>
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;
