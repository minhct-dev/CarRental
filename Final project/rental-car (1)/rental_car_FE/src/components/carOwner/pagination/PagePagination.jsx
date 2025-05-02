import { Box, Pagination, Stack, TextField } from "@mui/material";

function PagePagination({ pageCount, page, pageSize, setPagination }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pt: 3,
      }}
      position={"relative"}
    >
      <Pagination
        count={pageCount}
        color="primary"
        page={page}
        onChange={(_, value) => setPagination(value, pageSize)}
      />
      <Stack
        sx={{
          width: "7rem",
          alignItems: "center",
          fontSize: "1rem",
        }}
        position={"absolute"}
        left={"88%"}
        direction={"row"}
      >
        <TextField
          type="number"
          size="small"
          sx={{ width: "100%", fontSize: "0.875rem" }} // Adjust font size here
          onChange={(e) => {
            const newSize = Number(e.target.value);
            if (newSize >= 1 && newSize <= 9) {
              setPagination(page, newSize);
            }
          }}
          value={pageSize}
        />
        per page
      </Stack>
    </Box>
  );
}

export default PagePagination;
