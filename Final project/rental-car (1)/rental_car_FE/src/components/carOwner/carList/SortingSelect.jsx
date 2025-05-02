import { FormControl, MenuItem, Select } from "@mui/material";

function SortingSelect({ value, onChange }) {
  return (
      <FormControl size="small" sx={{ minWidth:"15rem" }}>
          <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              displayEmpty
              sx={{fontSize: "1rem"}}
          >
              <MenuItem value="created_at:desc"sx={{fontSize: "1rem"}}>Latest to Newest</MenuItem>
              <MenuItem value="created_at:asc" sx={{fontSize: "1rem"}}>Newest to Latest</MenuItem>
              <MenuItem value="base_price:asc" sx={{fontSize: "1rem"}}>Price: Low to High</MenuItem>
              <MenuItem value="base_price:desc" sx={{fontSize: "1rem"}}>Price: High to Low</MenuItem>
          </Select>
      </FormControl>
  );
}
export default SortingSelect;