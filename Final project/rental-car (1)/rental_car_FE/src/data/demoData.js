import car1 from "../assets/car1.jpg";
import car2 from "../assets/car2.jpg";
import car3 from "../assets/car3.jpg";

export const DEMO_MAX_PRICE = 5000000;
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";

// The lookup IDs and car metadata use the schema and lookup values in rental_car_db.sql.
export const DEMO_PROVINCES = [
  { code: "01", name: "Hà Nội", slug: "HANOI", type: "Thành phố Trung ương" },
  { code: "48", name: "Đà Nẵng", slug: "DANANG", type: "Thành phố Trung ương" },
  { code: "79", name: "TP. Hồ Chí Minh", slug: "HOCHIMINH", type: "Thành phố Trung ương" },
];

export const DEMO_DISTRICTS = [
  { code: "001", name: "Ba Đình", type: "Quận", provinceCode: "01" },
  { code: "002", name: "Hoàn Kiếm", type: "Quận", provinceCode: "01" },
  { code: "491", name: "Thanh Khê", type: "Quận", provinceCode: "48" },
  { code: "492", name: "Hải Châu", type: "Quận", provinceCode: "48" },
  { code: "760", name: "Quận 1", type: "Quận", provinceCode: "79" },
  { code: "770", name: "Quận 3", type: "Quận", provinceCode: "79" },
];

export const DEMO_WARDS = [
  { code: "00001", name: "Phúc Xá", type: "Phường", districtCode: "001" },
  { code: "00004", name: "Trúc Bạch", type: "Phường", districtCode: "001" },
  { code: "00037", name: "Phúc Tân", type: "Phường", districtCode: "002" },
  { code: "00040", name: "Đồng Xuân", type: "Phường", districtCode: "002" },
  { code: "20206", name: "Thanh Khê Tây", type: "Phường", districtCode: "491" },
  { code: "20207", name: "Thanh Khê Đông", type: "Phường", districtCode: "491" },
  { code: "20227", name: "Thanh Bình", type: "Phường", districtCode: "492" },
  { code: "20230", name: "Thuận Phước", type: "Phường", districtCode: "492" },
  { code: "26734", name: "Tân Định", type: "Phường", districtCode: "760" },
  { code: "26740", name: "Bến Nghé", type: "Phường", districtCode: "760" },
  { code: "27139", name: "Võ Thị Sáu", type: "Phường", districtCode: "770" },
  { code: "27142", name: "Phường 9", type: "Phường", districtCode: "770" },
];

export const DEMO_BRANDS = [
  { id: 3, name: "Audi" },
  { id: 4, name: "BMW" },
  { id: 11, name: "Ford" },
  { id: 15, name: "Honda" },
  { id: 16, name: "Hyundai" },
  { id: 20, name: "Kia" },
  { id: 24, name: "MAZDA" },
  { id: 25, name: "Mercedes-Benz" },
  { id: 32, name: "Tesla" },
  { id: 33, name: "Toyota" },
];

// Model IDs, brand IDs and type IDs are from car_model, car_brand and car_type in the SQL dump.
export const DEMO_CARS = [
  [99001, "A6", 3, 15, 1, 2022, "Black", "GASOLINE", "AUTOMATIC", 5, "01", "001", "00001", 1550000, car2],
  [99002, "3 Series", 4, 28, 1, 2023, "Blue", "GASOLINE", "AUTOMATIC", 5, "01", "002", "00037", 1750000, car1],
  [99003, "Mustang", 11, 110, 14, 2022, "Red", "GASOLINE", "AUTOMATIC", 4, "79", "760", "26740", 2500000, car2],
  [99004, "Accord", 15, 141, 1, 2023, "White", "GASOLINE", "AUTOMATIC", 5, "01", "002", "00040", 1450000, car1],
  [99005, "Civic", 15, 143, 4, 2022, "Gray", "GASOLINE", "AUTOMATIC", 5, "48", "492", "20227", 1050000, car3],
  [99006, "CR-V", 15, 147, 5, 2023, "White", "GASOLINE", "AUTOMATIC", 7, "48", "491", "20206", 1650000, car1],
  [99007, "Elantra", 16, 157, 1, 2022, "Silver", "GASOLINE", "AUTOMATIC", 5, "79", "770", "27139", 850000, car3],
  [99008, "Kona", 16, 162, 6, 2023, "Green", "GASOLINE", "AUTOMATIC", 5, "79", "760", "26734", 950000, car1],
  [99009, "Tucson", 16, 169, 5, 2024, "Black", "GASOLINE", "AUTOMATIC", 5, "01", "001", "00004", 1350000, car1],
  [99010, "Sportage", 20, 203, 5, 2023, "White", "GASOLINE", "AUTOMATIC", 5, "48", "492", "20230", 1250000, car3],
  [99011, "CX-5", 24, 234, 5, 2023, "Red", "GASOLINE", "AUTOMATIC", 5, "79", "770", "27142", 1300000, car2],
  [99012, "C-Class", 25, 241, 1, 2022, "Black", "GASOLINE", "AUTOMATIC", 5, "01", "002", "00037", 2200000, car1],
  [99013, "Model 3", 32, 329, 15, 2024, "White", "ELECTRIC", "AUTOMATIC", 5, "79", "760", "26740", 1800000, car3],
  [99014, "Camry", 33, 337, 1, 2023, "Silver", "GASOLINE", "AUTOMATIC", 5, "01", "001", "00001", 1500000, car1],
  [99015, "Corolla", 33, 340, 4, 2022, "Blue", "GASOLINE", "AUTOMATIC", 5, "48", "491", "20207", 900000, car3],
].map(([id, model, brandId, modelId, typeId, productionYear, color, fuelType, transmissionType, chair, provinceCode, districtCode, wardCode, pricePerDay, imageUrl], index) => {
  const brand = DEMO_BRANDS.find((item) => item.id === brandId);
  const province = DEMO_PROVINCES.find((item) => item.code === provinceCode);
  const district = DEMO_DISTRICTS.find((item) => item.code === districtCode);
  const ward = DEMO_WARDS.find((item) => item.code === wardCode);
  const carType = ({ 1: "Sedan", 4: "Hatchback", 5: "SUV", 6: "Crossover", 14: "Muscle Car", 15: "Hybrid & Electric Vehicle" })[typeId];
  return {
    id,
    name: `${brand.name} ${model}`,
    imageUrl,
    transmissionType,
    color,
    fuelType,
    chair,
    productionYear,
    brand: brand.name,
    brandId,
    model,
    modelId,
    carType,
    carTypeId: typeId,
    ward: ward.name,
    wardCode,
    district: district.name,
    districtCode,
    province: province.name,
    provinceCode,
    status: "AVAILABLE",
    rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    numberOfBookings: 12 + index * 3,
    pricePerDay,
  };
});

export const DEMO_COLORS = [...new Set(DEMO_CARS.map((car) => car.color))];

export const getDemoCars = () => {
  try {
    const localCars = JSON.parse(localStorage.getItem("rental-car-demo-cars") || "[]");
    return [...(Array.isArray(localCars) ? localCars : []), ...DEMO_CARS];
  } catch {
    return DEMO_CARS;
  }
};

export const searchDemoCars = (filters = {}) => {
  const list = getDemoCars().filter((car) => {
    const brands = filters.brandId == null ? [] : [String(filters.brandId)];
    const models = (filters.modelId || []).map(String);
    const colors = (filters.color || []).map((value) => value.toLowerCase());
    const transmissions = (filters.transmissionType || []).map((value) => value.toUpperCase());
    const fuels = (filters.fuelType || []).map((value) => value.toUpperCase());
    return (!brands.length || brands.includes(String(car.brandId))) &&
      (!models.length || models.includes(String(car.modelId))) &&
      (!colors.length || colors.includes(car.color.toLowerCase())) &&
      (!transmissions.length || transmissions.includes(car.transmissionType)) &&
      (!fuels.length || fuels.includes(car.fuelType)) &&
      (!filters.provinceCode || filters.provinceCode === car.provinceCode) &&
      (!filters.districtCode || filters.districtCode === car.districtCode) &&
      (!filters.wardCode || filters.wardCode === car.wardCode) &&
      (filters.minPrice == null || car.pricePerDay >= filters.minPrice) &&
      (filters.maxPrice == null || car.pricePerDay <= filters.maxPrice);
  });
  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.max(1, Number(filters.pageSize) || 6);
  return {
    cars: list.slice((page - 1) * pageSize, page * pageSize),
    totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
    totalCars: list.length,
  };
};

export const saveDemoCar = (car) => {
  const current = JSON.parse(localStorage.getItem("rental-car-demo-cars") || "[]");
  localStorage.setItem("rental-car-demo-cars", JSON.stringify([car, ...(Array.isArray(current) ? current : [])]));
};

export const getDemoCarById = (id) => getDemoCars().find((car) => String(car.id) === String(id));
