import { Box, Button, Container, Stack } from "@mui/material";
import SortingSelect from "../../../components/carOwner/carList/SortingSelect";
import CarInfo from "../../../components/carOwner/carList/CarInfo";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useSearchParams, useNavigate } from "react-router-dom";
import NoCar from "../../../components/carOwner/carList/NoCar";
import Loading from "../../client/loading/Loading";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  carListAPI,
  deleteDraftApi,
  getProcessDraftApi,
} from "../../../api/carApi";
import ErrorPage from "../../client/errorPage/ErrorPage";
import PagePagination from "../../../components/carOwner/pagination/PagePagination";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
import { useEffect } from "react";
import { useSelector } from "react-redux";
function CarList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.profile);
  console.log(profile);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 6;
  const sortOption = searchParams.get("sort") || "created_at:desc";

  const setPagination = (newPage, newPageSize) => {
    setSearchParams({ page: newPage, pageSize: newPageSize, sort: sortOption });
  };

  //set page to 1 when pageSize change
  useEffect(() => {
    if (page != 1) {
      setPagination(1, pageSize);
    }
  }, [pageSize]);

  // Query lấy danh sách xe
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cars", sortOption, page, pageSize],
    queryFn: () => carListAPI(sortOption, page, pageSize),
  });

  // Query lấy process draft (nhưng tắt `enabled` để không gọi tự động)
  // eslint-disable-next-line no-unused-vars
  const { data: process, refetch } = useQuery({
    queryKey: ["process"],
    queryFn: getProcessDraftApi,
    enabled: false,
  });

  const { mutate } = useMutation({
    mutationFn: (id) => deleteDraftApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["process"]);
      navigate("/car-owner/add-car");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
      });
    },
  });

  // Xử lý khi bấm vào nút "Add Car"
  const handleAddCar = async () => {
    if (profile.status == "INACTIVE") {
      Swal.fire({
        icon: "error",
        title: "Active Account",
        text: "Please Update Your Profile To Active Account",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Go to Profile",
        reverseButtons: true,
      }).then((r) => {
        if (r.isConfirmed) {
          navigate("/car-owner/profile");
        }
      });
    }
    // Gọi query để lấy process
    else {
      const result = await refetch();
      if (!result.data) {
        // Nếu không có process, điều hướng đến trang tạo xe mới
        navigate("/car-owner/add-car");
      } else {
        // Nếu đã có process, hiện Swal.fire
        Swal.fire({
          title: "You already have a draft process",
          text: "Do you want to continue or create a new one?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Continue",
          cancelButtonText: "Create new",
        }).then((res) => {
          if (res.isConfirmed) {
            // Nếu chọn tiếp tục → điều hướng đến trang add car
            navigate("/car-owner/add-car");
          } else if (res.dismiss === Swal.DismissReason.cancel) {
            mutate(result.data.id);
          }
        });
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Container>
        <Stack
          direction={"row"}
          sx={{
            mt: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleAddCar}
            variant="contained"
            color="primary"
            size="small"
            sx={{ gap: 1, fontWeight: "bold", fontSize: "0.8rem" }}
          >
            <AddCircleIcon sx={{ width: "1.2rem" }} /> Add car
          </Button>
          <SortingSelect
            value={sortOption}
            onChange={(value) =>
              setSearchParams({ page, pageSize, sort: value })
            }
          />
        </Stack>
      </Container>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorPage />
      ) : data?.myListCar?.length > 0 ? (
        <>
          {/* car list */}
          <Box sx={{ display: "flex", mt: 3, justifyContent: "center" }}>
            <Container>
              <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
                {data.myListCar.map((car, index) => (
                  <CarInfo key={index} car={car} />
                ))}
              </Stack>
            </Container>
          </Box>
          {/* pagination */}
          <PagePagination
            pageCount={data.totalPages}
            page={page}
            pageSize={pageSize}
            setPagination={setPagination}
          />
        </>
      ) : (
        <NoCar />
      )}
    </Container>
  );
}

export default CarList;
