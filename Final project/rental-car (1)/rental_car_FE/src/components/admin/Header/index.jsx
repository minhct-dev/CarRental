import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import logo from "../../../assets/logo-dark.png";
import MenuIcon from "@mui/icons-material/Menu";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune"; // Icon giống ảnh
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from "@mui/icons-material/Settings";

const Header = ({setToggle, toggle}) => {  
  return (
    <Box sx={{ padding: "15px", position:"fixed", width:"100vw", backgroundColor:"white" , zIndex:5}}>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack sx={{ width: "50%" }} direction={"row"} spacing={5}>
          <Stack
            alignItems={"center"}
            sx={{ width: "250px" }}
            justifyContent={"space-between"}
            direction="row"
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <img width={45} src={logo} alt="" />
              <Typography fontSize={"20px"} variant="h6" color="initial">
                Rental Car
              </Typography>
            </Stack>

            <Box
              onClick={() => setToggle(!toggle)}
              sx={{
                backgroundColor: "#ede7f6",
                width: "40px",
                height: "40px",
                cursor:"pointer",
                lineHeight: "40px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <MenuIcon sx={{ color: "#5e35b1", fontSize: "23px" }}></MenuIcon>
            </Box>
          </Stack>

          <Box sx={{ width: "50%" }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search..."
              sx={{

                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      sx={{
                        backgroundColor: "#ede7f6",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                      }}
                    >
                      <TuneIcon sx={{ color: "#5e35b1", fontSize: "23px" }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} sx={{ width: "50%" }} spacing={2} justifyContent={"end"}>
          <Box>
            <Badge
              badgeContent={4} // Số lượng thông báo
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "14px",
                  fontWeight: "bold",
                  minWidth: "22px",
                  height: "22px",
                  borderRadius: "50%",
                },
              }}
            >
              <Box sx={{backgroundColor:"#ede7f6" ,width:"40px", height:"40px", lineHeight:"40px", textAlign:"center", borderRadius:"5px"}}>
              <NotificationsNoneIcon sx={{ color: "#5e35b1", fontSize: "25px" }} />
              </Box>
            </Badge>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              backgroundColor: "#e3f2fd", // Nền xanh nhạt
              borderRadius: "50px",
              padding: "8px 15px",
              width: "auto",
            }}
          >
            {/* Avatar với viền nền vàng */}
            <Avatar
              src="https://via.placeholder.com/50"
              sx={{
                width: 30,
                height: 30,
            
              }}
            />
            {/* Icon Cài đặt */}
            <SettingsIcon sx={{ color: "#1976d2", fontSize: 25 }} />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
