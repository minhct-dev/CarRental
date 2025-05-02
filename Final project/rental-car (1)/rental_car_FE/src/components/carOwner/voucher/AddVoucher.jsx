import { useQuery } from "@tanstack/react-query";
import { getListCarVoucherApi } from "../../../api/voucherApi";
import SaveVoucherPage from "./SaveVoucherPage";
import Loading from "../../../pages/client/loading/Loading";

const AddVoucher = () => {
  const { data: listCar, isLoading: carLoading } = useQuery({
    queryKey: ["list-car-drop"],
    queryFn: getListCarVoucherApi,
  });
  if(carLoading){
    return <Loading></Loading>
  }
  return <SaveVoucherPage listCar={listCar}></SaveVoucherPage>;
};

export default AddVoucher;
