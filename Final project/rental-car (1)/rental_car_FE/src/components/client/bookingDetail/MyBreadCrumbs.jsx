import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box } from '@mui/material';

export default function MyBreadcrumbs() {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Box
        component={Link}
        to="/"
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        Home
      </Box>
      <Box
        component={Link}
        to="/my-booking"
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        My booking
      </Box>
      <Typography color="text.primary">Booking details</Typography>
    </Breadcrumbs>
  );
}
