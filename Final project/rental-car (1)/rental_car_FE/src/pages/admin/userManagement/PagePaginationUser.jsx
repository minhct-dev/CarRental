
import { Pagination, Box } from '@mui/material';

const PagePagination = ({ page, pageCount, setPagination, siblingCount = 1 }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      mt: 2, 
      mb: 2,
    }}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, value) => setPagination(value)}
        shape="rounded"
        variant="outlined"
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={siblingCount}
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 500,
          },
          '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: '#8a79f0',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#6200ee',
            }
          },
          '& .MuiPaginationItem-page:hover': {
            backgroundColor: 'rgba(138, 121, 240, 0.1)',
          }
        }}
      />
    </Box>
  );
};

export default PagePagination;