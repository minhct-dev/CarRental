import { useState, useEffect } from 'react';
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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    Tooltip,
    Chip,
} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import PagePaginationUser from "./PagePaginationUser";
import Badge from '@mui/material/Badge';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import AddUserForm from './AddUser';
import PersonIcon from '@mui/icons-material/Person';
import { useMutation, useQuery } from "@tanstack/react-query";
import { approveDraft, getUserDraft, rejectDraft } from "../../../api/adminApi";
import Swal from "sweetalert2";
import Loading from '../../client/loading/Loading';
import UserDetails from './UserDetails';
import RejectionDialog from './RejectDraft';

const UserListDraft = () => {
    const [page, setPage] = useState(1);
    const [draftStatus, setStatus] = useState("");
    const [sort, setSort] = useState("");
    const [searchInput, setSearchInput] = useState(""); // For input field
    const [searchTerm, setSearchTerm] = useState(""); // For actual search query
    const [showFilters, setShowFilters] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedDraftId, setSelectedDraftId] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
    
    // Use the page, status, sort, and searchTerm in the query key to refetch when they change
    const { data: draftList, isLoading, refetch: refetchDrafts } = useQuery({
        queryKey: ["user-draft", page, draftStatus, sort, searchTerm],
        queryFn: () => getUserDraft(page, draftStatus, sort, searchTerm),
    });

    const handleViewDetails = (draftId) => {
        setSelectedDraftId(draftId);
        setDetailsOpen(true);
    };

    // When status or sort changes, reset to page 1
    useEffect(() => {
        setPage(1);
    }, [draftStatus, sort, searchTerm]);

    // Handle search input change (just updates the input field, doesn't trigger search)
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle search submission - only this will trigger the actual search
    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    // Handle search on Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Reset search
    const resetSearch = () => {
        setSearchInput("");
        setSearchTerm("");
    };

    // Updated reject mutation to handle reasons
    const { mutate: rejectMutate } = useMutation({
        mutationFn: ({ id, reasons }) => rejectDraft(id, reasons),
        onMutate: () => {
            Swal.fire({
                title: 'Processing',
                html: 'In process of Rejecting Draft, please wait...',
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        },
        onSuccess: () => {
            refetchDrafts();
            Swal.fire({
                icon: "success",
                title: "Draft Rejected",
                text: "Draft has been successfully rejected",
                timer: 10000
            });
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong while Rejecting the draft.",
                confirmButtonColor: "#d33"
            });
        }
    });

    const { mutate: approveMutate } = useMutation({
        mutationFn: (id) => approveDraft(id),
        onMutate: () => {
            Swal.fire({
                title: 'Processing',
                html: 'In process of Approving Draft, please wait...',
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        },
        onSuccess: () => {
            refetchDrafts();
            Swal.fire({
                icon: "success",
                title: "Draft Accepted",
                text: "Draft Accepted Successfully",
                timer: 10000
            });
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong while Approving the draft.",
                confirmButtonColor: "#d33"
            });
        }
    });

    const handleApprove = (id) => {
        Swal.fire({
            title: "Approve Confirmation",
            icon: "question",
            text: "When you accept, the system will immediately approve this user. Are you sure you want to approve this user?",
            showConfirmButton: true,
            showCancelButton: true,
        }).then((data) => {
            if (data.isConfirmed) {
                approveMutate(id);
            }
        });
    };

    // Updated to open the rejection dialog
    const handleReject = (id) => {
        setSelectedDraftId(id);
        setRejectionDialogOpen(true);
    };

    // New function to handle rejection with reasons
    const handleConfirmReject = (draftId, reasons) => {
        rejectMutate({ id: draftId, reasons });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (isLoading) {
        return <Loading />;
    }

    // Count statuses from the full dataset (not just current page)
    const pendingCount = draftList?.numberOfPending || 0;
    const approvedCount = draftList?.numberOfApprove || 0;
    const rejectedCount = draftList?.numberOfReject || 0;

    // Total count from overall data
    const totalCount = draftList?.numberOfAll || 0;

    const statusItems = [
        { 
            title: 'Pending',
            count: pendingCount,
            color: '#f8c931',
            icon: <HourglassEmptyIcon sx={{ fontSize: 48, color: '#f8c931' }} />,
            gradientFrom: '#fff9e6',
            gradientTo: '#fffcf0'
        },
        {
            title: 'Approved',
            count: approvedCount,
            color: '#4caf50',
            icon: <CheckCircleIcon sx={{ fontSize: 48, color: '#4caf50' }} />,
            gradientFrom: '#e8f5e9',
            gradientTo: '#f1f8f1'
        },
        {
            title: 'Rejected',
            count: rejectedCount,
            color: '#f44336',
            icon: <CancelIcon sx={{ fontSize: 48, color: '#f44336' }} />,
            gradientFrom: '#fee8e7',
            gradientTo: '#fff1f0'
        }
    ];

    // Get items safely
    const items = draftList?.drafts || [];

    // Get pagination info from the backend
    const totalPages = draftList?.totalPages || 1;
    const currentPage = draftList?.currentPage || 1;

    const isSearchActive = searchTerm.trim() !== '';

    return (
        <Box sx={{ minHeight: "120", backgroundColor: "#f4f4f4", py: 3 }}>
            <Container maxWidth="xl">
                {/* Title Section */}
                <Stack direction="column" spacing={3} sx={{ mb: 4 }}>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            mb: 4,
                            backgroundColor: 'white',
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 1
                        }}
                    >
                        <GroupIcon sx={{ color: "#6200ee", fontSize: "57px" }} />
                        <Stack direction="column" >
                            <Typography
                                variant="h5"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            >
                                {isSearchActive ? "User Search Results" : "Requested Draft"}
                            </Typography>
                            <Typography variant="body2" color="#333">
                                {isSearchActive
                                    ? "Viewing search results for users matching your criteria."
                                    : "Manage your user draft and their draft approval here."}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Status Boxes */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={4}
                    sx={{ mb: 6, mt: 2, width: "100%" }}
                >
                    {statusItems.map((item, index) => (
                        <Paper
                            key={index}
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 3,
                                borderRadius: '12px',
                                borderLeft: `4px solid ${item.color}`,
                                background: `linear-gradient(135deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)`,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                        {item.count}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {item.icon}
                                </Box>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>

                {/* New Filter and Search Section */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#8a79f0',
                        borderRadius: '8px',
                        mb: 3,
                        p: 1,
                        color: 'white',
                        height: '70px'
                    }}
                >
                    {/* Left side - All users */}
                    <Typography variant="h6" sx={{ pl: 2, display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 2, fontSize: 40 }} />
                        {isSearchActive ? "Search Results" : "All users"}
                        <Typography component="span" sx={{ color: 'white', ml: 1 }}>
                            {totalCount}
                        </Typography>
                    </Typography>

                    {/* Right side - Search and Filters */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        {/* Search */}
                        <TextField
                            placeholder="Search by name or email"
                            size="small"
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#7a67e0',
                                    borderRadius: '4px',
                                    color: '#f0f0ff',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#a89be3',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#b3a5ff',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#d1c7ff',
                                    },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#d1c7ff',
                                    opacity: 1,
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#b0a0ff' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: isSearchActive && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={resetSearch} sx={{ color: '#b0a0ff' }}>
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Search Button */}
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            sx={{
                                backgroundColor: '#fff',
                                color: '#1e1e1e',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        >
                            Search
                        </Button>

                        {/* Filters Button */}
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                borderColor: '#555',
                                color: 'white',
                                '&:hover': {
                                    borderColor: '#777',
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                                }
                            }}
                        >
                            Filters
                        </Button>

                        {/* Add User Button */}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#fff',
                                color: '#1e1e1e',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                            onClick={handleClickOpen}
                        >
                            Add user
                        </Button>

                        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ maxWidth: "550px", margin: "auto" }}>
                            <DialogContent>
                                <AddUserForm handleClose={handleClose} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Box>

                {/* Expandable Filters */}
                {showFilters && (
                    <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={draftStatus}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                }}
                                label="Status"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="ACCEPTED">Approved</MenuItem>
                                <MenuItem value="REJECTED">Rejected</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="sort-select-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                label="Sort By"
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="desc">Newest</MenuItem>
                                <MenuItem value="asc">Oldest</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                )}

                {/* Table Section */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>UserID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.length > 0 ? (
                                items.map((item) => {
                                    const id = item.draftId;
                                    const userId = item.userId || "N/A";
                                    const email = item.email || "N/A";
                                    const createdAt = item.createdAt || "N/A";
                                    const updatedAt = item.updatedAt || "N/A";
                                    const status = item.draftStatus;

                                    return (
                                        <TableRow key={id}>
                                            <TableCell>{id || "N/A"}</TableCell>
                                            <TableCell>{userId}</TableCell>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>{createdAt}</TableCell>
                                            <TableCell>{updatedAt}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={status || "N/A"}
                                                    variant="outlined"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '0.85rem',
                                                        backgroundColor:
                                                            status === "ACCEPTED"
                                                                ? '#4caf50'
                                                                : status === "REJECTED"
                                                                    ? '#f44336'
                                                                    : status === "PENDING"
                                                                        ? '#ff9800'
                                                                        : '#e0e0e0',

                                                        color:
                                                            status === "ACCEPTED"
                                                                ? '#000'
                                                                : status === "REJECTED"
                                                                    ? '#000'
                                                                    : status === "PENDING"
                                                                        ? '#000'
                                                                        : '#000',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction={"row"} gap={1.5} flexWrap={"wrap"} alignItems="center">
                                                    <Tooltip title="View Detail" onClick={() => handleViewDetails(id)}>
                                                        <IconButton>
                                                            <Badge color="secondary">
                                                                <VisibilityIcon sx={{ color: "blue" }} />
                                                            </Badge>
                                                        </IconButton>
                                                    </Tooltip>

                                                    {status === "PENDING" && (
                                                        <>
                                                            <Tooltip title="Accept Draft">
                                                                <IconButton onClick={() => handleApprove(id)}>
                                                                    <Badge color="secondary">
                                                                        <CheckCircleIcon sx={{ color: "green" }} />
                                                                    </Badge>
                                                                </IconButton>
                                                            </Tooltip >
                                                            <Tooltip title="Reject Draft">
                                                                <IconButton onClick={() => handleReject(id)}>
                                                                    <Badge color="secondary">
                                                                        <CancelIcon sx={{ color: "red" }} />
                                                                    </Badge>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        {isSearchActive
                                            ? "No search results found. Try different search terms."
                                            : "No data available"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, mb: 2 }}>
                <PagePaginationUser
                    page={currentPage}
                    pageCount={totalPages}
                    setPagination={setPage}
                />
            </Box>
            <UserDetails
                open={detailsOpen}
                handleClose={() => setDetailsOpen(false)}
                draftId={selectedDraftId}
                refetchList={refetchDrafts}
            />

            {/* Add the Rejection Dialog component */}
            <RejectionDialog
                open={rejectionDialogOpen}
                handleClose={() => setRejectionDialogOpen(false)}
                onReject={handleConfirmReject}
                draftId={selectedDraftId}
            />
        </Box>
    );
};

export default UserListDraft;