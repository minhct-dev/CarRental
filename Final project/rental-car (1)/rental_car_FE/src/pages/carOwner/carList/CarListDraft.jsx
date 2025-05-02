import { useQuery } from "@tanstack/react-query";
import { getListDraftApi } from "../../../api/carApi";
import { Box, Stack, Typography } from "@mui/material";
import image from "../../../assets/no-items.png";
import Loading from "../../client/loading/Loading";
import CarDraftCard from "../../../components/carOwner/carList/CarDraftCard";
import { Container } from "react-bootstrap";
const CarListDraft = () => {
  let { data, isLoading } = useQuery({
    queryKey: ["list-draft"],
    queryFn: getListDraftApi,
  });

  if (isLoading) {
    return <Loading></Loading>;
  }
  console.log(data);

  return (
    <Box sx={{ minHeight: "80vh" }}>
      {data.listCarDraftResponse.length === 0 ? (
        <Box>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <img src={image} alt="No Draft Cars" />
          </Stack>
          <Typography variant="h6" textAlign="center">
            Not Found any Draft Car
          </Typography>
        </Box>
      ) : (
        <Box>
          <Container style={{width:"90%"}}>
              <Stack direction={"row"} gap={3} flexWrap={"wrap"}>
                {data.listCarDraftResponse.map((car, index) => (
                  <CarDraftCard key={index} car={car} />
                ))}
              </Stack>
            </Container>
        </Box>
      )}
    </Box>
  );
};

export default CarListDraft;
