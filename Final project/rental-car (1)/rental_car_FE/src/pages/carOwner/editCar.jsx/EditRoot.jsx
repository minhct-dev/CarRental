import { useQuery } from "@tanstack/react-query";
import { getDataEditApi } from "../../../api/carApi";
import Loading from "../../client/loading/Loading";
import EditCar from "./EditCar";
import NotFound from "../../../components/err/NotFound";
import { useParams } from "react-router-dom";

const EditRoot = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["edit-data", id],
    queryFn: () => getDataEditApi(id),
    enabled: id != null,
  });


  if(isError || !id){
    return <NotFound></NotFound>
  }
  if(isLoading){
    return <Loading></Loading>
  }
  return <EditCar data={data} id={id}></EditCar>;
};

export default EditRoot;
