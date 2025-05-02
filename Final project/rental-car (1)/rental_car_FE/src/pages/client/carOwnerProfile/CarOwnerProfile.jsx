import { Stack } from "@mui/material";
import {  useParams } from "react-router-dom";
import OwnerInfo from "../../../components/client/carOwnerProfile/ownerInfo/OwnerInfo";
import ListCar from "../../../components/client/carOwnerProfile/listCar/ListCar";
import ListFeedback from "../../../components/client/carOwnerProfile/listFeedback/ListFeedback";
import { useQuery } from "@tanstack/react-query";
import { getCarOwnerProfile } from "../../../api/userApi";
import { useState } from "react";
import Loading from "./../loading/Loading";
import NotFound from "./../../../components/err/NotFound";

function CarOwnerProfile() {
  const { id } = useParams();
  const [carPage, setCarPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["carOwnerProfile", id, carPage, feedbackPage],
    queryFn: () => getCarOwnerProfile({ ownerId: id, carPage, feedbackPage }),
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <NotFound />;
  }

  return (
    <Stack
      direction={"column"}
      sx={{ backgroundColor: "#F6F6F6", py: 9, gap: 3 }}
    >
      <OwnerInfo data={data} />
      <ListCar
        carList={data?.carList?.cars}
        page={carPage}
        setPage={setCarPage}
        totalPages={data?.carList?.totalPages}
      />
      <ListFeedback
        feedbackList={data?.carFeedbackList}
        page={feedbackPage}
        setPage={setFeedbackPage}
        totalPages={data?.carFeedbackList?.totalPages}
        averageRating={data?.averageRating}
      />
    </Stack>
  );
}

export default CarOwnerProfile;
