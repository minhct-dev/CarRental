import { useQuery } from "@tanstack/react-query";
import SaveVoucherPage from "../../../components/carOwner/voucher/SaveVoucherPage";
import Loading from "../../client/loading/Loading";
import { getBrandApi } from "../../../api/carApi";

const AddVoucherAdmin = () => {

   const { data: brand, isLoading } = useQuery({
      queryKey: ["brand"],
      queryFn: getBrandApi,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 30,
    });
  if (isLoading) {
    return <Loading></Loading>;
  }
  return <SaveVoucherPage brand={brand}></SaveVoucherPage>;
};

export default AddVoucherAdmin;
