import { Paper, Typography, List, ListItem, Box } from "@mui/material";
import { ArrowDropUp } from "@mui/icons-material";
import { formatVND } from "../../../helper/function";

const PopularStocks = ({ data }) => (
  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: "450px" }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      A few new transactions
    </Typography>
    <List>
      {data.map((item, index) => (
        <ListItem
          key={index}
          sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "purple" }}
            >
              Booking Id: {item.bookingId}
            </Typography>
            <Typography variant="body2" sx={{ color: "green" }}>
              Top up
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ fontWeight: "bold", mr: 0.5 }}>
              {formatVND(item.profit)}
            </Typography>
            <ArrowDropUp sx={{ color: "green" }} />
          </Box>
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default PopularStocks;
