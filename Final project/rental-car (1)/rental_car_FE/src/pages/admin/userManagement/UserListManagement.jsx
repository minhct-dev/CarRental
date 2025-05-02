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
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    InputAdornment
} from "@mui/material";
import {
    Group as GroupIcon,
    ContactMail as ContactMailIcon,
    FilterList as FilterListIcon,
    Block as BlockIcon,
    ThumbUp as ThumbUpIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

import { useQuery } from '@tanstack/react-query';
import { banUser, sendMail, unBanUser } from '../../../api/adminApi';
import { searchUsers } from '../../../api/adminApi';
import Loading from '../../client/loading/Loading';
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import PagePaginationUser from "./PagePaginationUser";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import "./mail.scss";
import UserDetailsM from './UserDetailsM';

const UserListManagement = () => {
    // States for filters and pagination
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [roleId, setRoleId] = useState("");
    const [sort, setSort] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [customPageSize, setCustomPageSize] = useState(false);
    const [customPageSizeValue, setCustomPageSizeValue] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Create search params object for API call
    const searchParams = {
        searchTerm: debouncedSearchTerm || undefined,
        roleId: roleId || undefined,
        status: status === 'BANNED' ? undefined : status || undefined,
        isBan: status === 'BANNED' ? true : status === 'ACTIVE' ? false : undefined,
        sort: sort || undefined,
      };
    // Use React Query to fetch user data with searchUsers API
    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ["user-search", page, pageSize, {
            searchTerm: debouncedSearchTerm,
            roleId,
            status,
            sort,
        }],
        queryFn: () => searchUsers(page, searchParams),
        keepPreviousData: true
    });

    // Status color mapping
    const getStatusColor = (status, banStatus) => {
        if (banStatus) return 'error';
        switch(status) {
          case 'ACTIVE': return 'success';
          case 'INACTIVE': return 'warning';
          default: return 'default';
        }
      };

    
    const getStatusDisplay = (status, banStatus) => {
        return banStatus 
          ? 'BANNED' 
          : status === 'NOT_ACTIVE' 
            ? 'NOT ACTIVE' 
            : status;
      };
      

    // Handle dialog details
    const handleViewDetails = (userId) => {
        setSelectedUserId(userId);
        setDetailsOpen(true);
    };

    // Send email API mutation
    const { mutate: sendMailMutate } = useMutation({
        mutationFn: (id) => sendMail(id),
    });

    // Ban user API mutation
    const { mutate: banUserMutate } = useMutation({
        mutationFn: (id) => banUser(id),
    });

    // Unban user API mutation
    const { mutate: unbanUserMutate } = useMutation({
        mutationFn: (id) => unBanUser(id),
        onMutate: () => {
            Swal.fire({
                title: 'Processing',
                html: 'Unbanning User, please wait...',
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        },
        onSuccess: () => {
            refetch();
            Swal.fire({
                icon: "success",
                title: "User Unbanned",
                text: "Restoring Account Successfully",
                timer: 10000
            });
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong while unbanning the user.",
                confirmButtonColor: "#d33"
            });
        }
    });

    // Handle Ban Confirmation
    const handleBan = (id, email) => {
        Swal.fire({
            title: "Ban User Confirmation",
            icon: "warning",
            html: `
                <div class="mb-3">
                    <label for="user-email" class="form-label">User Email</label>
                    <input type="text" id="user-email" class="form-control" value="${email}" readonly>
                </div>
                <div class="mb-3">
                    <label for="ban-hours" class="form-label">Ban Duration (hours)</label>
                    <input type="number" id="ban-hours" class="form-control" min="1" value="24" placeholder="Number of hours">
                </div>
                <div class="mb-3">
                    <label for="ban-reason" class="form-label">Reason for Ban</label>
                    <textarea id="ban-reason" class="form-control" rows="3" placeholder="Enter reason for banning this user..."></textarea>
                </div>
            `,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Ban User",
            confirmButtonColor: "#d33",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const hours = document.getElementById('ban-hours').value;
                const reason = document.getElementById('ban-reason').value;
    
                // Validate ban duration (must be positive number)
                if (!hours || isNaN(hours) || parseInt(hours) <= 0) {
                    Swal.showValidationMessage('Ban duration must be a positive number');
                    return false;
                }
    
                // Validate reason
                if (!reason) {
                    Swal.showValidationMessage('Please provide a reason for banning the user');
                    return false;
                }
    
                return { id, hours: parseInt(hours), reason };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Processing',
                    html: 'Banning user, please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
    
                banUserMutate(
                    { userId: id, hours: result.value.hours, reason: result.value.reason },
                    {
                        onSuccess: () => {
                            Swal.close();
                            refetch();
                            Swal.fire({
                                icon: "success",
                                title: "User Banned",
                                text: `User has been banned.`,
                                timer: 10000
                            });
                        },
                        onError: (error) => {
                            Swal.close();
                            console.error('API Error:', error);
                            Swal.fire({
                                icon: "error",
                                title: "Error!",
                                text: "Something went wrong while banning the user.",
                                confirmButtonColor: "#d33"
                            });
                        }
                    }
                );
            }
        });
    };

    // Handle unban
    const handleUnBan = (id) => {
        Swal.fire({
            title: "Unban Confirmation",
            icon: "question",
            text: "Are you sure you want to unban this user?",
            showConfirmButton: true,
            showCancelButton: true,
        }).then((data) => {
            if (data.isConfirmed) {
                unbanUserMutate(id);
            }
        });
    };

    // Handle Ban and Unban Button
    const handleButtonType = (userId, status, email, banhours) => {
        return [
            ...(status.toUpperCase() === "ACTIVE"
                ? banhours === 0
                    ? [{
                        label: "Ban User",
                        color: "error",
                        icon: <BlockIcon />,
                        onClick: () => handleBan(userId, email),
                    }]
                    : [{
                        label: "UnBan User",
                        color: "success",
                        icon: <ThumbUpIcon />,
                        onClick: () => handleUnBan(userId),
                    }]
                : []),

            {
                label: "View Details",
                color: "primary",
                icon: <VisibilityIcon />,
                onClick: () => handleViewDetails(userId),
            }
        ];
    };

    // Handle send mail
    const handleSendMail = (id, email) => {
        Swal.fire({
            title: "Send Email",
            icon: "question",
            html: `
            <div class="mb-3">
              <label for="email-recipient" class="form-label">Recipient</label>
              <input type="text" id="email-recipient" class="form-control" value="${email}" >
            </div>
            <div class="mb-3">
              <label for="email-message" class="form-label">Message <span id="char-count">0/200</span></label>
              <textarea 
                id="email-message" 
                class="form-control" 
                rows="5" 
                maxlength="200" 
                placeholder="Enter your message here..."
                oninput="document.getElementById('char-count').textContent = this.value.length + '/200'"
              ></textarea>
            </div>
          `,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Send Email",
            cancelButtonText: "Cancel",
            customClass: {
                popup: 'custom-popup-class',
                input: 'custom-input-class'
            },
            didOpen: () => {
                // Initialize character counter
                document.getElementById('email-message').addEventListener('input', function () {
                    const currentLength = this.value.length;
                    document.getElementById('char-count').textContent = currentLength + '/200';
                });
            },
            preConfirm: () => {
                const subject = document.getElementById('email-recipient').value;
                const content = document.getElementById('email-message').value;

                if (!subject || !content) {
                    Swal.showValidationMessage('Please fill in message field');
                    return false;
                }

                return { id, subject, content };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading popup while sending email
                Swal.fire({
                    title: 'Sending Email',
                    html: 'Please wait while sending the email...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Send the email with the email, subject and message
                sendMailMutate(
                    { userId: id, subject: result.value.subject, content: result.value.content },
                    {
                        onSuccess: () => {
                            // Close the loading popup and show success message
                            Swal.fire({
                                title: "Success",
                                text: "Email has been sent successfully",
                                icon: "success",
                                timer: 10000
                            });
                        },
                        onError: () => {
                            // Close the loading popup and show error message
                            Swal.fire({
                                title: "Error",
                                text: "Failed to send email. Please try again.",
                                icon: "error"
                            });
                        }
                    }
                );
            }
        });
    };

    // Fix search debouncing to prevent excessive refetching
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // Wait 500ms after user stops typing before updating

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Effect to handle filter changes
    useEffect(() => {
        if (debouncedSearchTerm !== undefined) {
            setPage(1); // Reset to page 1 when search term changes
            refetch();
        }
    }, [debouncedSearchTerm]);

    // Effect to handle other filter changes
    useEffect(() => {
        if (status !== undefined || roleId !== undefined || sort !== undefined) {
            setPage(1); // Reset to page 1 when other filters change
            refetch();
        }
    }, [status, roleId, sort]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f0f2f5",
                py: 4
            }}
        >
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
                                User Management
                            </Typography>
                            <Typography variant="body2" color="#333">
                                Manage your user account and their account approval here.
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Filters & Search */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{
                        mb: 3,
                        backgroundColor: 'white',
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 1
                    }}
                >
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                            <MenuItem value="NOT_ACTIVE">Not Active</MenuItem>
                            <MenuItem value="BANNED">Banned</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Role</InputLabel>
                        <Select
                            label="Role"
                            value={roleId}
                            onChange={(e) => setRoleId(Number(e.target.value))} // Convert to number
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value={1}>User</MenuItem>
                            <MenuItem value={2}>Car Owner</MenuItem>
                            <MenuItem value={3}>Driver</MenuItem>
                            <MenuItem value={4}>Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sort}
                            label="Sort By"
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="desc">Newest</MenuItem>
                            <MenuItem value="asc">Oldest</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Search Users"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // No need to call refetch here - debounced search will handle it
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => {
                                    // Immediately apply search term without waiting for debounce
                                    setDebouncedSearchTerm(searchTerm);
                                    setPage(1);
                                    refetch();
                                }}>
                                    <FilterListIcon color="action" />
                                </IconButton>
                            )
                        }}
                    />
                </Stack>

                {/* Table Section */}
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 2,
                        boxShadow: 2
                    }}
                >
                    <Table>
                        <TableHead sx={{ backgroundColor: "#9999FF" }}>
                            <TableRow>
                                {["ID", "User", "Name", "Email", "Phone", "Dob", "Role", "Status", "Actions"].map((header) => (
                                    <TableCell
                                        key={header}
                                        sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: "1.1rem" }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!userData?.users || userData.users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            alignItems="center"
                                            justifyContent="center"
                                            height="100%"
                                        >
                                            <SentimentDissatisfiedIcon sx={{ fontSize: 100 }} />
                                            <Typography variant="h6" gutterBottom>
                                                No data available
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                There are no users to display at this time.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                userData.users.map((request) => (
                                    <TableRow
                                        key={request.id}
                                        hover
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{request.id}</TableCell>
                                        <TableCell>
                                            <Avatar
                                                src={request.avatarUrl}
                                                alt={request.name}
                                                sx={{ width: 45, height: 45 }}
                                            />
                                        </TableCell>
                                        <TableCell>{request.name}</TableCell>
                                        <TableCell>{request.email}</TableCell>
                                        <TableCell>{request.phone}</TableCell>
                                        <TableCell>{request.dob}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.roles}
                                                size="medium"
                                                sx={{
                                                    backgroundColor:
                                                        request.roles === 'admin' ? '#9999FF' :
                                                            request.roles === 'driver' ? '#00CCCC' :
                                                                request.roles === 'user' ? '#0099FF' :
                                                                    request.roles === 'carOwner' ? '#CC6600' :
                                                                        'default',
                                                    color:
                                                        request.roles === 'admin' ? '#FFFFFF' :
                                                            request.roles === 'driver' ? '#FFFFFF' :
                                                                request.roles === 'user' ? '#FFFFFF' :
                                                                    request.roles === 'carOwner' ? '#FFFFFF' :
                                                                        'default',
                                                    width: '90px',
                                                    justifyContent: 'center',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusDisplay(request.status, request.banStatus)}
                                                size="medium"
                                                color={getStatusColor(request.status, request.banStatus)}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                {handleButtonType(request.id, request.status, request.email, request.banDuration).map((buttonConfig, index) => (
                                                    <Tooltip key={index} title={buttonConfig.label}>
                                                        <IconButton
                                                            color={buttonConfig.color}
                                                            onClick={buttonConfig.onClick}
                                                            size="medium"
                                                        >
                                                            {buttonConfig.icon}
                                                        </IconButton>
                                                    </Tooltip>
                                                ))}
                                                <Tooltip title="send mail to customer">
                                                    <IconButton color="success"
                                                        onClick={() => handleSendMail(request.id, request.email)}>
                                                        <ContactMailIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination Indicator */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Page {userData?.currentPage || 1} of {userData?.totalPages || 1}
                    </Typography>
                </Box>

                {/* Page Size Selection and Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, mb: 2 }}>
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel id="page-size-select-label">Items Per Page</InputLabel>
                        {!customPageSize ? (
                            <Select
                                labelId="page-size-select-label"
                                value={pageSize}
                                onChange={(e) => {
                                    if (e.target.value === "custom") {
                                        setCustomPageSize(true);
                                    } else {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                        refetch(); // Refetch with new page size
                                    }
                                }}
                                size="small"
                                label="Items Per Page"
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                            </Select>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    value={customPageSizeValue}
                                    onChange={(e) => setCustomPageSizeValue(e.target.value)}
                                    type="number"
                                    size="small"
                                    InputProps={{
                                        inputProps: { min: 1 },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        const newSize = Number(customPageSizeValue);
                                                        if (newSize > 0) {
                                                            setPageSize(newSize);
                                                            setCustomPageSize(false);
                                                            setPage(1);
                                                            refetch(); // Refetch with new page size
                                                        }
                                                    }}
                                                    size="small"
                                                    sx={{ padding: '4px' }}
                                                >
                                                    <CheckCircleIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setCustomPageSize(false);
                                                        setCustomPageSizeValue("");
                                                    }}
                                                    size="small"
                                                    sx={{ padding: '4px' }}
                                                >
                                                    <CancelIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                        )}
                    </FormControl>

                    <PagePaginationUser
                        page={userData?.currentPage || 1}
                        pageCount={userData?.totalPages || 1}
                        setPagination={(newPage) => {
                            setPage(newPage);
                            refetch(); // Refetch when page changes
                        }}
                        siblingCount={1}
                    />
                </Box>

                {/* User Details Modal */}
                <UserDetailsM
                    open={detailsOpen}
                    handleClose={() => setDetailsOpen(false)}
                    userId={selectedUserId}
                    refetchList={refetch}
                />
            </Container>
        </Box>
    );
};

export default UserListManagement;