import { Box, Stack } from "@mui/material";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDraftDetailAdminApi } from "../../../api/carApi";
import Loading from "../../client/loading/Loading";
import CarDetailInfomation from "../../../components/admin/CarDetail/CarDetailInfomation";
import CarDetailImages from "../../../components/admin/CarDetail/CarImage/CarDetailImages";



const CarDetailAdmin = () => {
  const { id } = useParams();
  // ✅ Gọi API với id
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["car", id],
    queryFn: () => getDraftDetailAdminApi(id),
    enabled: !!id,
  });

  console.log(data);
  

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box >
      <Container style={{ width: "95%", backgroundColor:"white", padding:"30px", borderRadius:"10px" }}>
        <Stack direction={"column"} spacing={1}>
          <Box sx={{ width: "100%" }}>
            <CarDetailImages images={data.carImages}></CarDetailImages>
          </Box>
          <Box sx={{ width: "100%" }}>
            <CarDetailInfomation
              refetch={refetch}
              id={id}
              data={data}
            ></CarDetailInfomation>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default CarDetailAdmin;
