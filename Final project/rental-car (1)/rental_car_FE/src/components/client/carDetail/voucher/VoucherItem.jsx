import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import VoucherSVG from "./VoucherSVG";
import { formatVND } from "../../../../helper/function";
import VoucherDisabel from "./VoucherDisabel";
import parse from "html-react-parser";
import { useState } from "react";

const VoucherItem = ({ data, handleSelectVoucher }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Stack
        justifyContent={"space-between"}
        alignItems={"start"}
        direction="row"
      >
        <Stack direction={"row"} alignItems={"start"} spacing={1}>
          {data.usable ? (
            <VoucherSVG />
          ) : (
            <VoucherDisabel />
          )}
          <Stack direction={"column"}>
            <Typography variant="body1" color="initial">
              {data.code}
            </Typography>
            <Typography fontSize={"14px"} variant="body2" color="text.secondary">
              {data.percentRate == 0
                ? `Discount of ${formatVND(data.fixedPrice)}`
                : ` Get ${data.percentRate}% off  ${
                    data.maxPrice == 0
                      ? ""
                      : `(up to ${formatVND(data.maxPrice)})`
                  }.`}{" "}
              <span
                onClick={() => setOpen(!open)}
                style={{
                  textDecoration: "underline",
                  color: "#767676",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Detail
              </span>
            </Typography>
          </Stack>
        </Stack>
        <Button
          disabled={!data.usable}
          onClick={() => handleSelectVoucher(data)}
          variant="contained"
        >
          Apply Now
        </Button>
      </Stack>

      {/* Detail open with Collapse */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Stack
          direction={"column"}
          spacing={1}
          sx={{
            border: "1px solid #ccc",
            mt: 2,
            p: "10px",
            borderRadius: "10px",
          }}
        >
          <Stack direction={"row"} justifyContent={"center"}>
            <VoucherSVG width={"70"} height={"70"} />
          </Stack>
          <Typography variant="h6" textAlign={"center"} color="initial">
            {data.name}
          </Typography>
          <Box>{parse(data.description)}</Box>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default VoucherItem;
