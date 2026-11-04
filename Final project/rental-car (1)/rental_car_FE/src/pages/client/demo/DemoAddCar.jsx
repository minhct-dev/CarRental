import { useMemo, useState } from "react";
import { Box, Button, Container, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DEMO_BRANDS, DEMO_CARS, DEMO_DISTRICTS, DEMO_PROVINCES, DEMO_WARDS, saveDemoCar } from "../../../data/demoData";

const DemoAddCar = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ brandId: "33", modelId: "337", provinceCode: "01", districtCode: "001", district: "Ba Đình", wardCode: "00001", ward: "Phúc Xá", pricePerDay: "1200000", color: "White", year: "2023", seats: "5", fuelType: "GASOLINE", transmissionType: "AUTOMATIC" });
  const models = useMemo(() => DEMO_CARS.filter((car) => String(car.brandId) === form.brandId), [form.brandId]);
  const selectedModel = models.find((car) => String(car.modelId) === form.modelId) || models[0];
  const setField = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  const handleProvinceChange = (event) => {
    const provinceCode = event.target.value;
    const district = DEMO_DISTRICTS.find((item) => item.provinceCode === provinceCode);
    const ward = DEMO_WARDS.find((item) => item.districtCode === district?.code);
    setForm((prev) => ({ ...prev, provinceCode, districtCode: district?.code, district: district?.name, wardCode: ward?.code, ward: ward?.name }));
  };
  const handleBrandChange = (event) => {
    const brandId = event.target.value;
    const firstModel = DEMO_CARS.find((car) => String(car.brandId) === brandId);
    setForm((prev) => ({ ...prev, brandId, modelId: String(firstModel?.modelId || "") }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedModel || Number(form.pricePerDay) <= 0) return;
    const province = DEMO_PROVINCES.find((item) => item.code === form.provinceCode);
    const car = {
      ...selectedModel,
      id: `demo-${Date.now()}`,
      name: `${selectedModel.brand} ${selectedModel.model}`,
      province: province?.name || "Hà Nội",
      provinceCode: form.provinceCode,
      districtCode: form.districtCode,
      district: form.district,
      wardCode: form.wardCode,
      ward: form.ward,
      pricePerDay: Number(form.pricePerDay),
      color: form.color,
      productionYear: Number(form.year),
      chair: Number(form.seats),
      fuelType: form.fuelType,
      transmissionType: form.transmissionType,
      status: "AVAILABLE",
      imageUrl: selectedModel.imageUrl,
    };
    try {
      saveDemoCar(car);
      await Swal.fire({ icon: "success", title: "Demo car added", text: "Saved in this browser only. It is not sent to a server." });
      navigate("/search");
    } catch {
      Swal.fire({ icon: "error", title: "Could not save demo car", text: "Check that browser storage is available." });
    }
  };

  return <>
    <Container sx={{ minHeight: "100vh", pt: 8, pb: 8 }}>
      <Box sx={{ maxWidth: 760, mx: "auto", mt: 6, p: { xs: 2, sm: 4 }, bgcolor: "white", borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" fontWeight={700}>Add a car — Demo</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>This preview saves a sample listing to this browser only. No account, backend, documents, or license plate required.</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField select label="Brand" value={form.brandId} onChange={handleBrandChange} required>{DEMO_BRANDS.map((brand) => <MenuItem key={brand.id} value={String(brand.id)}>{brand.name}</MenuItem>)}</TextField>
            <TextField select label="Model" value={selectedModel ? String(selectedModel.modelId) : ""} onChange={setField("modelId")} required>{models.map((car) => <MenuItem key={car.modelId} value={String(car.modelId)}>{car.model}</MenuItem>)}</TextField>
            <TextField select label="Province / city" value={form.provinceCode} onChange={handleProvinceChange} required>{DEMO_PROVINCES.map((province) => <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>)}</TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth type="number" label="Price per day (VND)" value={form.pricePerDay} onChange={setField("pricePerDay")} inputProps={{ min: 1 }} required />
              <TextField fullWidth label="Color" value={form.color} onChange={setField("color")} required />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth type="number" label="Production year" value={form.year} onChange={setField("year")} inputProps={{ min: 1990, max: new Date().getFullYear() }} required />
              <TextField fullWidth select label="Seats" value={form.seats} onChange={setField("seats")}>{[2, 4, 5, 7, 9].map((seat) => <MenuItem key={seat} value={String(seat)}>{seat}</MenuItem>)}</TextField>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth select label="Fuel" value={form.fuelType} onChange={setField("fuelType")}>{["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"].map((fuel) => <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>)}</TextField>
              <TextField fullWidth select label="Transmission" value={form.transmissionType} onChange={setField("transmissionType")}>{["AUTOMATIC", "MANUAL"].map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}</TextField>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button type="submit" variant="contained">Save demo car</Button>
              <Button component={Link} to="/search" variant="outlined">Cancel</Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Container>
  </>;
};

export default DemoAddCar;
