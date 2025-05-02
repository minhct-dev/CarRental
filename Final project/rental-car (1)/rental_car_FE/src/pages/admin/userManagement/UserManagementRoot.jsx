import { useState } from "react";
import { Tabs, Tab, Box, Container } from "@mui/material";
import UserListManagement from "./UserListManagement";
import UserListDraft from "./UserListDraft";
import { useSearchParams } from "react-router-dom";

export const UserListManagementRoot = () => {
  const [searchParams] = useSearchParams();
  const draft = searchParams.get("draft");

  // Ép kiểu về số và dùng giá trị mặc định là 0 nếu không có giá trị
  const [tabIndex, setTabIndex] = useState(draft ? Number(draft) : 0);

  const handleChange = (event, newIndex) => {
    console.log("Tab changed to:", newIndex);
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%", pt: 2, backgroundColor: "#FAFAFB" }}>
      <Container>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="car list tabs"
        >
          <Tab sx={{ textTransform: "none" }} label="User Available" />
          <Tab sx={{ textTransform: "none" }} label="User pending approval" />
        </Tabs>
      </Container>
      <Box sx={{ p: 2 }}>
        {tabIndex === 1 ? <UserListDraft /> : <UserListManagement />}
      </Box>
    </Box>
  );
};
