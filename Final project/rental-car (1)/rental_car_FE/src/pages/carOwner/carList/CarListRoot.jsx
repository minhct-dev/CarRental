import { useState } from "react";
import { Tabs, Tab, Box, Container } from "@mui/material";
import CarList from "./CarList";
import CarListDraft from "./CarListDraft";
import { useSearchParams } from "react-router-dom";

export const CarListRoot = () => {
  const [searchParams] = useSearchParams();
  const draft = searchParams.get("draft");

  // Ép kiểu về số và dùng giá trị mặc định là 0 nếu không có giá trị
  const [tabIndex, setTabIndex] = useState(draft ? Number(draft) : 0);

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", pt: "5vh", backgroundColor: "#FAFAFB" }}>
      <Container>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="car list tabs"
        >
          <Tab sx={{ textTransform: "none" }} label="Published Cars" />
          <Tab sx={{ textTransform: "none" }} label="Car pending approval" />
        </Tabs>
      </Container>
      <Box sx={{ p: 2 }}>
        {tabIndex === 1 ? <CarListDraft /> : <CarList />}
      </Box>
    </Box>
  );
};
