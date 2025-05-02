import { Box } from '@mui/material'
import { Container } from 'react-bootstrap'
import HeaderNav from './HeaderNav'
import { useLocation } from 'react-router-dom'

const Header = () => {
 const location = useLocation();
 if(location.pathname != "/"){
    return (
        <Box
        sx={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          backgroundColor:"secondary.main"
        }}
      >
        <Container style={{ width: "70%" }}>
          <HeaderNav home={false} paddingX={"0"} paddingY={"10px"}></HeaderNav>
        </Container>
      </Box>
      )
 }
  
}

export default Header