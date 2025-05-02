import { useQuery } from "@tanstack/react-query";
import { getVoucherDetailApi } from "../../../api/voucherApi";
import { useParams } from "react-router-dom";
import Loading from "../../client/loading/Loading";
import SaveVoucherPage from "../../../components/carOwner/voucher/SaveVoucherPage";
import { getBrandApi } from "../../../api/carApi";

const UpdateVoucherAdmin = () => {
  const { id } = useParams();
  const { data: voucherDetail, isLoading } = useQuery({
    queryKey: ["voucher-detail", id],
    queryFn: () => getVoucherDetailApi(id),
    enabled: !!id,
  });
  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["brand"],
    queryFn: getBrandApi,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  if (isLoading || brandLoading) {
    return <Loading></Loading>;
  }

  console.log(voucherDetail);
  
  return (
    <SaveVoucherPage
      selectId={id}
      brand={brand}
      voucherDetail={voucherDetail}
      listCar={brand}
    ></SaveVoucherPage>
  );
};

export default UpdateVoucherAdmin;
