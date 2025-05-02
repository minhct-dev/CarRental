import { Box, Container, Pagination, Stack, Typography } from "@mui/material";
import CarCard from "./CarCard";
import NoCar from "../noItemFound/NoCar";
function ListCar({ carList, totalPages, page, setPage }) {
  return (
    <Container
      sx={{
        width: "70%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          px: 3.5,
          py: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          List of cars
        </Typography>
        <Stack
          direction={"row"}
          sx={{
            gap: 3,
            flexWrap: "wrap",
            pt: 5,
            justifyContent: "center",
          }}
        >
          {carList?.length > 0 ? (
            carList.map((car) => <CarCard key={car?.carId} car={car} />)
          ) : (
            <NoCar />
          )}
        </Stack>
        <Stack direction={"row"} sx={{ justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      </Box>
    </Container>
  );
}

export default ListCar;
