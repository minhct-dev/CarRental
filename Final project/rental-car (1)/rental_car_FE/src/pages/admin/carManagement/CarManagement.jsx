import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  Grid2,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";
import CarRentalIcon from "@mui/icons-material/CarRental";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  approveCarDraftApi,
  approveUpdateCarApi,
  getListDraftRequest,
} from "../../../api/carApi";
import Loading from "../../client/loading/Loading";
import dayjs from "dayjs";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Swal from "sweetalert2";
import RejectModal from "./RejectModal";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CarManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let size = searchParams.get("size") || 5;
  let typeSearch = searchParams.get("type") || null;
  let statusSearch = searchParams.get("status") || null;
  let sort = searchParams.get("sort") || "id:desc";
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["list-request-draft"],
    queryFn: () =>
      getListDraftRequest(page, size, typeSearch, statusSearch, sort),
  });
  useEffect(() => {
    refetch();
  }, [searchParams]);

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);

  const handleChangeParam = (data) => {
    // Tạo một object chứa các tham số cũ (từ searchParams hiện tại)
    // Cập nhật searchParams với các tham số mới
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      // Lặp qua từng tham số và cập nhật
      data.forEach(({ key, value }) => {
        newParams.set(key, value); // Cập nhật mỗi tham số với giá trị mới
      });

      return newParams;
    });
  };

  const handleChangeSize = (e) => {
    let number = parseInt(e.target.value);
    if (number < 1 || number > 10) {
      number = 5;
    }
    handleChangeParam([
      {
        key: "page",
        value: 1,
      },
      {
        key: "size",
        value: number,
      },
    ]);
  };

  const handlePageChange = (event, value) => {
    handleChangeParam([{ key: "page", value }]);
  };

  const handleSearchType = (e) => {
    handleChangeParam([
      {
        key: "page",
        value: 1,
      },
      {
        key: "type",
        value: e.target.value,
      },
    ]);
  };

  const handleSearchStatus = (e) => {
    handleChangeParam([
      {
        key: "page",
        value: 1,
      },
      {
        key: "status",
        value: e.target.value,
      },
    ]);
  };

  const handleSort = (e) => {
    handleChangeParam([
      {
        key: "page",
        value: 1,
      },
      {
        key: "sort",
        value: e.target.value,
      },
    ]);
  };

  const handleOpen = (id, type) => {
    setId(id);
    setOpen(true);
    setType(type);
  };
  const handleClose = () => {
    setId(null);
    setOpen(false);
    setType(null);
  };
  const handleType = (type) => {
    if (type == "create") {
      return {
        name: "Create",
        color: "#673AB7",
      };
    } else {
      return {
        name: "Update",
        color: "#FF9800",
      };
    }
  };

  const handleStatus = (status) => {
    if (status == "pending") {
      return {
        name: "Pending",
        color: "orange",
      };
    } else if (status == "allow") {
      return {
        name: "Approve",
        color: "green",
      };
    } else if (status == "reject") {
      return {
        name: "Reject",
        color: "red",
      };
    }
    else{
      return {
        name: "Cancel",
        color: "gray",
      };
    }
  };

  const { mutate } = useMutation({
    mutationFn: (id) => approveCarDraftApi(id),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "The request has been approved successfully.",
        confirmButtonColor: "#4CAF50",
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while approving the request.",
        confirmButtonColor: "#d33",
      });
    },
  });
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (id) => approveUpdateCarApi(id),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "The request has been approved successfully.",
        confirmButtonColor: "#4CAF50",
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while approving the request.",
        confirmButtonColor: "#d33",
      });
    },
  });

  const handleApprove = (id, type) => {
    Swal.fire({
      icon: "question",
      title: "Approve Request",
      text: "Are you sure to approve this request?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4CAF50",
      reverseButtons: true,
      preConfirm: () => {
        Swal.fire({
          title: "Processing...",
          text: "Please wait while we approve the request.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Hiển thị loading
          },
        });

        return new Promise((resolve) => {
          const mutationFn = type === "update" ? mutateUpdate : mutate;
          mutationFn(id, {
            onSuccess: resolve,
            onError: resolve,
          });
        });
      },
    });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Stack sx={{ my: 3 }} direction={"row"} spacing={1}>
          <CarRentalIcon
            sx={{ color: "primary.main", fontSize: "33px" }}
          ></CarRentalIcon>
          <Typography
            variant="h6"
            fontSize={"23px"}
            color="initial"
            sx={{ my: 2 }}
          >
            List Car Requests
          </Typography>
        </Stack>

        <Box sx={{ my: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Summary
          </Typography>

          <Grid2 justifyContent={"center"} columnSpacing={3} container>
            <Grid2 size={3}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  padding: "15px 10px",
                }}
              >
                <Stack direction={"row"} spacing={1}>
                  <Box
                    sx={{
                      backgroundColor: "#fff8e1",
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      textAlign: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ color: "#ffc107", transform: "translateY(-10%)" }}
                    ></AccessTimeIcon>
                  </Box>

                  <Stack direction={"column"}>
                    <Typography
                      variant="body2"
                      fontSize={"13px"}
                      color="text.secondary"
                    >
                      Pending Request
                    </Typography>
                    <Typography variant="body1" color="initial">
                      {data.noOfPendingRequests} Request
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid2>

            <Grid2 size={3}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  padding: "15px 10px",
                }}
              >
                <Stack direction={"row"} spacing={1}>
                  <Box
                    sx={{
                      backgroundColor: "#7ed67258",
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      textAlign: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <CheckIcon
                      sx={{ color: "#4eb31d", transform: "translateY(-10%)" }}
                    ></CheckIcon>
                  </Box>

                  <Stack direction={"column"}>
                    <Typography
                      variant="body2"
                      fontSize={"13px"}
                      color="text.secondary"
                    >
                      Approve Request
                    </Typography>
                    <Typography variant="body1" color="initial">
                      {data.noOfAcceptedRequests} Request
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid2>

            <Grid2 size={3}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  padding: "15px 10px",
                }}
              >
                <Stack direction={"row"} spacing={1}>
                  <Box
                    sx={{
                      backgroundColor: "#f0a1a158",
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      textAlign: "center",
                      borderRadius: " 10px",
                    }}
                  >
                    <CancelOutlinedIcon
                      sx={{ color: "red", transform: "translateY(-10%)" }}
                    ></CancelOutlinedIcon>
                  </Box>

                  <Stack direction={"column"}>
                    <Typography
                      variant="body2"
                      fontSize={"13px"}
                      color="text.secondary"
                    >
                      Reject Request
                    </Typography>
                    <Typography variant="body1" color="initial">
                      {data.noOfRejectedRequests} Request
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Stack
            sx={{ mb: 2 }}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="body1" color="text.secondary">
              Data Request
            </Typography>
            <Stack
              alignItems={"center"}
              sx={{ width: "50%" }}
              justifyContent={"end"}
              direction={"row"}
              spacing={2}
            >
              <Box sx={{ backgroundColor: "white", width: "30%" }}>
                <FormControl size="medium" fullWidth>
                  <InputLabel sx={{ color: "text.secondary" }}>
                    Select Status
                  </InputLabel>
                  <Select
                    defaultValue={statusSearch}
                    onChange={handleSearchStatus}
                    label="Select Status"
                  >
                    <MenuItem value={"PENDING"}>Pending</MenuItem>
                    <MenuItem value={"ALLOW"}>Allow</MenuItem>
                    <MenuItem value={"REJECT"}>Reject</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ backgroundColor: "white", width: "30%" }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "text.secondary" }}>
                    Select Type
                  </InputLabel>
                  <Select
                    defaultValue={typeSearch}
                    onChange={handleSearchType}
                    label="Select Type"
                  >
                    <MenuItem value={"CREATE"}>Create</MenuItem>
                    <MenuItem value={"UPDATE"}>Update</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ backgroundColor: "white", width: "30%" }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "text.secondary" }}>
                    Sort By
                  </InputLabel>
                  <Select
                    defaultValue={sort}
                    onChange={handleSort}
                    label="Select Type"
                  >
                    <MenuItem value={"id:desc"}>Sort by newest</MenuItem>
                    <MenuItem value={"id:asc"}>Sort by oldest</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Car Image</TableCell>
                  <TableCell>Car Name</TableCell>
                  <TableCell>Owner name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Request Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.listCarRequestResponses.map((request) => {
                  let typeName = handleType(request.type.toLowerCase());
                  let statusName = handleStatus(request.status.toLowerCase());
                  return (
                    <TableRow key={request.draftId}>
                      <TableCell>{request.draftId}</TableCell>
                      <TableCell>
                        <img
                          style={{
                            width: "150px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          src={request.carImgUrl}
                          alt=""
                        />
                      </TableCell>
                      <TableCell>{request.carName}</TableCell>
                      <TableCell>{request.userName}</TableCell>
                      <TableCell
                        sx={{ color: typeName.color, fontWeight: 500 }}
                      >
                        {typeName.name}
                      </TableCell>
                      <TableCell
                        sx={{ color: statusName.color, fontWeight: 700 }}
                      >
                        {statusName.name}
                      </TableCell>

                      <TableCell>
                        {dayjs(request.requestTime).format("DD/MM/YYYY HH:ss")}
                      </TableCell>
                      <TableCell>
                        <Stack direction={"row"} spacing={1}>
                          {/* Nút xem chi tiết */}
                          <Tooltip title="View Details" arrow>
                            <Button
                              onClick={() =>
                                navigate("/admin/car-detail/" + request.draftId)
                              }
                              sx={{
                                backgroundColor: "#2196F3",
                                p: "5px 10px",
                                minWidth: "35px",
                              }}
                            >
                              <RemoveRedEyeOutlinedIcon
                                sx={{ color: "white" }}
                              />
                            </Button>
                          </Tooltip>

                          {request.status == "PENDING" && (
                            <Tooltip title="Approve Request" arrow>
                              <Button
                                onClick={() =>
                                  handleApprove(request.draftId, request.type)
                                }
                                sx={{
                                  backgroundColor: "#4CAF50",
                                  p: "5px 10px",
                                  minWidth: "35px",
                                }}
                              >
                                <CheckIcon sx={{ color: "white" }} />
                              </Button>
                            </Tooltip>
                          )}
                          {/* Nút phê duyệt */}

                          {/* Nút từ chối */}
                          {request.status == "PENDING" && (
                            <Tooltip title="Reject Request" arrow>
                              <Button
                                onClick={() =>
                                  handleOpen(request.draftId, request.type)
                                }
                                sx={{
                                  backgroundColor: "red",
                                  p: "5px 10px",
                                  minWidth: "35px",
                                }}
                              >
                                <CancelOutlinedIcon sx={{ color: "white" }} />
                              </Button>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      <Stack
        sx={{ my: 3 }}
        alignItems={"center"}
        direction={"row"}
        justifyContent={"center"}
      >
        <Pagination
          onChange={handlePageChange}
          count={data.totalPages}
          page={data.pageNumber}
          color="primary"
        />
        <TextField
          onChange={handleChangeSize}
          label={"size"}
          value={size}
          sx={{ backgroundColor: "white", width: "60px" }}
          size="small"
          type="number"
        />
      </Stack>
      <RejectModal
        type={type}
        id={id}
        open={open}
        handleClose={handleClose}
      ></RejectModal>
    </Box>
  );
};

export default CarManagement;
