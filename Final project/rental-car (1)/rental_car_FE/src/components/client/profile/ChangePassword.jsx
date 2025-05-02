import { Box, Button, Stack, Typography } from "@mui/material";
import "./profile.scss";
import { Container, Form } from "react-bootstrap";
import "./profile.scss";
const ChangePassword = () => {
  return (
    <Box className="profile-account">
      <Container style={{ width: "35vw" }}>
        <Box
          sx={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            borderRadius: "10px",
            padding: "10px 50px 50px",
          }} 
        >
            <Typography sx={{my:5}} variant="h3" fontSize={"20px"} fontWeight={500} color="initial">Change password</Typography>
          <Stack direction={"column"} spacing={2}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                  New Password :<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type={"password"}
                  placeholder={"Enter new password"}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px", fontWeight: 400 }}>
                  Confirm New Password :<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type={"password"}
                  placeholder={"Enter cofirm new password"}
                />
              </Form.Group>

             <Stack sx={{mt:5}} direction={"row"} justifyContent={"end"}>
                <Button variant="contained">Save</Button>
             </Stack>
            </Form>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
