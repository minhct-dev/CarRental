import { useQuery } from "@tanstack/react-query";
import {
  getListCarVoucherApi,
  getVoucherDetailApi,
} from "../../../api/voucherApi";
import Loading from "../../../pages/client/loading/Loading";
import SaveVoucherPage from "./SaveVoucherPage";
import { useParams } from "react-router-dom";
import NotFound from "../../err/NotFound";

const EditVoucher = () => {
  const { id } = useParams();

  const { data: listCar, isLoading: carLoading } = useQuery({
    queryKey: ["list-car-drop"],
    queryFn: getListCarVoucherApi,
  });

  const { data: voucherDetail, isLoading } = useQuery({
    queryKey: ["voucher-detail", id],
    queryFn: () => getVoucherDetailApi(id),
    enabled: !!id,
  });

  if (carLoading || isLoading) {
    return <Loading></Loading>;
  }
  if (!voucherDetail) {
    return <NotFound></NotFound>;
  }
  return (
    <SaveVoucherPage
      selectId={id}
      voucherDetail={voucherDetail}
      listCar={listCar}
    ></SaveVoucherPage>
  );
};

export default EditVoucher;
