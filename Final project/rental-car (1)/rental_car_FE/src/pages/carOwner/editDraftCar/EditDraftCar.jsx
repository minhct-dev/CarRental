import { useQuery } from "@tanstack/react-query";
import {  getDetailCarDraft } from "../../../api/carApi";
import Loading from "../../client/loading/Loading";

import NotFound from "../../../components/err/NotFound";
import { useParams } from "react-router-dom";

import EditCarDraftIndex from "./EditCarDraftIndex";

const EditDraftCar = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["edit-data", id],
    queryFn: () => getDetailCarDraft(id),
    enabled: id != null,
  });

  console.log(data);
  

  if(isError || !id){
    return <NotFound></NotFound>
  }
  if(isLoading){
    return <Loading></Loading>
  }
  return <EditCarDraftIndex data={data} id={id}></EditCarDraftIndex>;
};

export default EditDraftCar;
