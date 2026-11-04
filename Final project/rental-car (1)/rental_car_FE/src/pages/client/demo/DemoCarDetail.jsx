import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Grid2,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddRoad,
  DepartureBoard,
  Description,
  EvStation,
  Gavel,
  Place,
  ViewCompact,
} from "@mui/icons-material";
import { Link, useSearchParams, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getDemoCarById } from "../../../data/demoData";
import { formatVND } from "../../../helper/function";
import DateModal from "../listCar/modal/DateModal";

const DEMO_TERMS = [
  "Return the car with the same fuel level",
  "Keep the vehicle clean and in good condition",
  "Do not use the car for illegal activities",
  "Contact the owner before extending the rental",
];

const DemoCarDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const car = getDemoCarById(id);

  const galleryImages = useMemo(() => {
    if (!car) return [];
    return [car.imageUrl, car.imageUrl, car.imageUrl].map((image) => ({
      original: image,
      thumbnail: image,
    }));
  }, [car]);

  const start = searchParams.get("from") || dayjs().add(1, "day").hour(12).toISOString();
  const end = searchParams.get("to") || dayjs().add(2, "day").hour(14).toISOString();
  const rentalDays = Math.max(1, Math.floor(dayjs(end).diff(dayjs(start), "day", true)));
  const deposit = Math.round((car.pricePerDay || 0) * 2);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  useEffect(() => {
    if (!fromParam || !toParam) {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        if (!fromParam) next.set("from", start);
        if (!toParam) next.set("to", end);
        return next;
      }, { replace: true });
    }
  }, [end, fromParam, setSearchParams, start, toParam]);

  if (!car) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5">Demo car not found</Typography>
        <Button component={Link} to="/search" sx={{ mt: 2 }}>Back to cars</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 5 }}>
      <Container sx={{ width: { xs: "100%", md: "70%" }, maxWidth: "none !important" }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} sx={{ width: "100%", height: { xs: "auto", md: 418 } }}>
            <Box
              component="img"
              src={car.imageUrl}
              alt={car.name}
              sx={{ width: { xs: "100%", md: "60%" }, height: { xs: 260, md: 418 }, objectFit: "cover", borderRadius: 1 }}
            />
            <Stack sx={{ display: { xs: "none", md: "flex" }, width: "40%" }} justifyContent="space-between" spacing={1}>
              <Box sx={{ height: 200, overflow: "hidden" }}>
                <Box component="img" src={car.imageUrl} alt={`${car.name} demo photo`} sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1 }} />
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => setGalleryOpen(true)}
                aria-label="Open demo car photo gallery"
                sx={{ position: "relative", p: 0, height: 200, border: 0, overflow: "hidden", cursor: "pointer", borderRadius: 1 }}
              >
                <Box component="img" src={car.imageUrl} alt={`${car.name} demo photo`} sx={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(50%)" }} />
                <Typography sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "white", fontSize: 24, fontWeight: 600 }}>View photos</Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={3}>
            <Box sx={{ width: { xs: "100%", md: "65%" }, minWidth: 0 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Typography sx={{ fontSize: { xs: 28, md: 35 }, fontWeight: 700 }} variant="h2">{car.name}</Typography>
                  <Tooltip title="Chat is unavailable in this static demo">
                    <span><Button disabled variant="contained" size="small">Chat</Button></span>
                  </Tooltip>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={car.rating || 0} precision={0.5} readOnly size="small" />
                  <Typography color="text.secondary">{car.rating || 0} ({car.noOfRatings || 0} reviews)</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <DepartureBoard color="primary" fontSize="small" />
                  <Typography color="text.secondary">No of rides: {car.numberOfBookings || 0}</Typography>
                  <Place color="primary" fontSize="small" />
                  <Typography color="text.secondary">{[car.ward, car.district, car.province].filter(Boolean).join(" - ")}</Typography>
                </Stack>
              </Stack>

              <Box sx={{ mt: 2 }}>
                <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} aria-label="Demo car information tabs">
                  <Tab label="Detail" />
                  <Tab label="Basic Information" />
                  <Tab label="Term of use" />
                </Tabs>
                <Box role="tabpanel" hidden={activeTab !== 0} sx={{ px: 2, py: 3 }}>
                  {activeTab === 0 && <Stack spacing={2}>
                    <Typography variant="h6"><AddRoad fontSize="small" /> Mileage</Typography>
                    <Typography>Odometer reading: {car.mileage || "42,000"} km</Typography>
                    <Typography variant="h6"><EvStation fontSize="small" /> Fuel consumption</Typography>
                    <Typography>Fuel consumption: {car.fuelConsumption || "7.5"} L/100km</Typography>
                    <Typography variant="h6"><Place fontSize="small" /> Address</Typography>
                    <Typography>Address detail: {car.district}, {car.province} (demo location)</Typography>
                    <Typography variant="h6"><Description fontSize="small" /> Description</Typography>
                    <Typography>{car.description || `A ${car.productionYear} ${car.name}, prepared as a sample listing for the static website preview.`}</Typography>
                    <Typography variant="h6"><ViewCompact fontSize="small" /> Feature</Typography>
                    <Grid2 container spacing={2}>
                      {(car.features || ["Air conditioning", "Bluetooth", "Backup camera"]).map((feature) => <Grid2 key={feature} size={{ xs: 6, sm: 4 }}><Typography>{feature}</Typography></Grid2>)}
                    </Grid2>
                  </Stack>}
                </Box>
                <Box role="tabpanel" hidden={activeTab !== 1} sx={{ px: 2, py: 3 }}>
                  {activeTab === 1 && <>
                    <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
                    <Grid2 container spacing={2}>
                      {[["Licence Plate", "Not included in demo"], ["Color", car.color], ["Brand Name", car.brand], ["Model", car.model], ["Production Year", car.productionYear], ["No. of seats", car.chair], ["Transmission", car.transmissionType], ["Fuel", car.fuelType]].map(([label, value]) => <Grid2 key={label} size={{ xs: 12, sm: 6 }}><Typography><b>{label}:</b> {value}</Typography></Grid2>)}
                    </Grid2>
                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Documents</Typography>
                    <Typography color="text.secondary">Vehicle documents are not included in this public demo.</Typography>
                  </>}
                </Box>
                <Box role="tabpanel" hidden={activeTab !== 2} sx={{ px: 2, py: 3 }}>
                  {activeTab === 2 && <Stack spacing={2}>
                    <Typography variant="h6"><Gavel fontSize="small" /> Term of Use — Demo</Typography>
                    <Typography>Basic price: {formatVND(car.pricePerDay)} /day</Typography>
                    <Typography>Deposit: {formatVND(deposit)}</Typography>
                    {DEMO_TERMS.map((term, index) => <Typography key={term}>{index + 1}. {term}</Typography>)}
                    <Typography variant="h6" sx={{ mt: 2 }}>Cancellation policy</Typography>
                    <Typography color="text.secondary">Sample policy only; this preview does not create a booking or charge a fee.</Typography>
                  </Stack>}
                </Box>
              </Box>

              <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                <Typography variant="h6">Car owner</Typography>
                <Typography sx={{ mt: 1 }}>Demo owner</Typography>
                <Typography variant="body2" color="text.secondary">Contact information is unavailable in this static preview.</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6">Feedback</Typography>
                <Typography sx={{ mt: 1 }} color="text.secondary">Demo review summary only. Reviews are not connected to a backend.</Typography>
              </Paper>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "35%" } }}>
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={700}>{formatVND(car.pricePerDay)} <Typography component="span" color="text.secondary" fontSize={15}>/ Day</Typography></Typography>
                  <Box onClick={() => setDateModalOpen(true)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setDateModalOpen(true); }} sx={{ mt: 2, py: 2, borderBlock: "1px solid", borderColor: "divider", cursor: "pointer" }}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Box><Typography variant="body2">Pick Up Date</Typography><Typography fontWeight={600}>{dayjs(start).format("DD/MM/YYYY HH:mm")}</Typography></Box>
                      <Divider orientation="vertical" flexItem />
                      <Box><Typography variant="body2">Drop Off Date</Typography><Typography fontWeight={600}>{dayjs(end).format("DD/MM/YYYY HH:mm")}</Typography></Box>
                    </Stack>
                  </Box>
                  <Stack spacing={1} sx={{ py: 2 }}>
                    <PriceRow label="Base Price" value={`${formatVND(car.pricePerDay)} /day`} />
                    <PriceRow label="Deposit" value={formatVND(deposit)} />
                    <PriceRow label="Status" value={<Chip size="small" color="success" label="Available · Demo" />} />
                  </Stack>
                  <Divider />
                  <Stack spacing={1} sx={{ py: 2 }}>
                    <PriceRow label="Subtotal" value={`${formatVND(car.pricePerDay)} × ${rentalDays} day`} />
                    <PriceRow label="Voucher" value="Unavailable in demo" />
                    <PriceRow label="Total" value={formatVND((car.pricePerDay || 0) * rentalDays)} strong />
                  </Stack>
                  <Button fullWidth variant="contained" disabled>Booking unavailable in demo</Button>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6">Additional Fees</Typography>
                  <Typography sx={{ mt: 1 }} color="text.secondary">Sample late return fee: {formatVND(car.lateFee || 50000)} / hour. No charge is made in this demo.</Typography>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Container>

      <Dialog open={galleryOpen} onClose={() => setGalleryOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent><ImageGallery items={galleryImages} showPlayButton={false} showFullscreenButton /></DialogContent>
      </Dialog>
      <DateModal show={dateModalOpen} handleClose={() => setDateModalOpen(false)} />
    </Box>
  );
};

const PriceRow = ({ label, value, strong = false }) => (
  <Stack direction="row" justifyContent="space-between" spacing={1}>
    <Typography fontWeight={strong ? 700 : 400}>{label}</Typography>
    <Typography textAlign="right" fontWeight={strong ? 700 : 400}>{value}</Typography>
  </Stack>
);

export default DemoCarDetail;
