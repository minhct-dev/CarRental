import { Box, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import logoLight from "../../../assets/logo-white.png";
import logoDark from "../../../assets/logo-dark.png";
import HeaderAvatar from "./HeaderAvatar";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../../../api/userApi";
import Loading from "../../../pages/client/loading/Loading";
import PrivateNav from "./PrivateNav";

// eslint-disable-next-line react/prop-types
const HeaderNav = ({ paddingX, paddingY, home }) => {

  const login = useSelector((state) => state.auth.login)

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    enabled: login
  })

  let navData = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "How it work",
      link: "/?scrollTo=howItWork",
    },
    {
      title: "Why Us",
      link: "/?scrollTo=whyUs",
    },
    {
      title: "Comment",
      link: "/?scrollTo=comment",
    },

  ];


  if (isLoading) {
    return <Loading></Loading>
  }
  return (
    <Box sx={{ padding: `${paddingY} ${paddingX}` }}>
      <Stack
        alignItems={"center"}
        direction="row"
        spacing={2}
        justifyContent="space-between"
      >
        <Box>
          <Stack alignItems={"center"} direction="row" spacing={1}>
            <img
              src={home ? logoDark : logoLight}
              width={50}
              height={50}
              alt=""
            />
            <Typography
              sx={{
                fontStyle: "italic",
                fontWeight: 700,
                transition: "all 0.2",
              }}
              variant="h6"
              color={home == true ? "text.primary" : "white"}
            >
              Car Rental
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={2.5}>
          {navData.map((item, index) => (
            <NavLink
              style={{
                color: home == true ? "black" : "white",
                textDecoration: "none",
                fontSize: "14px",
              }}
              key={index}
              variant="text"
              to={item.link}
            >
              {item.title}
            </NavLink>
          ))}
        </Stack>
        <Box>

          <PrivateNav><HeaderAvatar data={data} home={home}></HeaderAvatar></PrivateNav>

        </Box>
      </Stack>
    </Box>
  );
};

export default HeaderNav;
