import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Paper,
    Divider,
    Checkbox,
    Avatar,
    IconButton,
    Chip,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useQuery, useMutation } from "@tanstack/react-query";
import { updateUser, userProfile } from "../../../api/adminApi";
import { getProvinceApi, getDistrictApi, getWardApi } from '../../../api/addressApi';
import Swal from "sweetalert2";
import Loading from '../../client/loading/Loading';

const UserDetailsM = ({ open, handleClose, userId, refetchList }) => {
    const [editMode, setEditMode] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [email, setEmail] = useState("");
    
    // Add validation states
    const [emailError, setEmailError] = useState("");
    const [roleError, setRoleError] = useState("");

    const [locationNames, setLocationNames] = useState({
        province: "",
        district: "",
        ward: ""
    });

    console.log("UserDetails component rendering with userId:", userId, "open:", open);

    const { data: userDetails, isLoading, refetch } = useQuery({
        queryKey: ["user-details", userId],
        queryFn: () => {
            console.log("Fetching draft data for ID:", userId);
            return userProfile(userId);
        },
        enabled: !!userId && open,
        // Add retry logic
        retry: 3,
        retryDelay: 1000,
        // Add error handling
        onError: (err) => {
            console.error("Error fetching user details:", err);
            Swal.fire({
                icon: "error",
                title: "Data Loading Error",
                text: `Failed to load user data: ${err.message || "Unknown error"}`,
                didOpen: () => {
                    document.querySelector('.swal2-container').style.zIndex = 2000;
                }
            });
        }
    });

    useEffect(() => {
        async function fetchLocationNames() {
            if (!userDetails) return;

            try {
                // Fetch province data
                if (userDetails.provinceName) {
                    const provinces = await getProvinceApi();
                    const provinceObj = provinces.find(p => p.code === userDetails.provinceName);

                    if (provinceObj) {
                        setLocationNames(prev => ({ ...prev, province: provinceObj.name }));

                        // Fetch district data with the province code
                        if (userDetails.districtName) {
                            const districts = await getDistrictApi(userDetails.provinceName);
                            const districtObj = districts.find(d => d.code === userDetails.districtName);

                            if (districtObj) {
                                setLocationNames(prev => ({ ...prev, district: districtObj.name }));

                                // Fetch ward data with the district code
                                if (userDetails.wardName) {
                                    const wards = await getWardApi(userDetails.districtName);
                                    const wardObj = wards.find(w => w.code === userDetails.wardName);

                                    if (wardObj) {
                                        setLocationNames(prev => ({ ...prev, ward: wardObj.name }));
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching location names:", error);
            }
        }

        fetchLocationNames();
    }, [userDetails]);

    const { mutate: updateRoleMutate } = useMutation({
        mutationFn: (data) => updateUser(userId, data),
        onMutate: () => {
            // Set the SweetAlert z-index higher than MUI Dialog
            const swalConfig = {
                title: 'Processing',
                html: 'Updating user information...',
                didOpen: () => {
                    Swal.showLoading();
                    // Force the SweetAlert to be on top
                    document.querySelector('.swal2-container').style.zIndex = 2000;
                }
            };
            Swal.fire(swalConfig);
        },
        onSuccess: () => {
            refetch();
            refetchList();
            // Set the SweetAlert z-index higher than MUI Dialog
            const swalConfig = {
                icon: "success",
                title: "Updated Successfully",
                text: "User information has been updated.",
                timer: 2000,
                didOpen: () => {
                    // Force the SweetAlert to be on top
                    document.querySelector('.swal2-container').style.zIndex = 2000;
                }
            };
            Swal.fire(swalConfig);
            setEditMode(false);
            
            // Clear validation errors after successful save
            setEmailError("");
            setRoleError("");
        },
        onError: (error) => {
            // Set the SweetAlert z-index higher than MUI Dialog
            const swalConfig = {
                icon: "error",
                title: "Error!",
                text: error.message || "Something went wrong while updating user information.",
                confirmButtonColor: "#d33",
                didOpen: () => {
                    // Force the SweetAlert to be on top
                    document.querySelector('.swal2-container').style.zIndex = 2000;
                }
            };
            Swal.fire(swalConfig);
        }
    });
    
    useEffect(() => {
        if (userDetails) {
            setEmail(userDetails?.email || "");
            setSelectedRoles(userDetails?.roles || []);
            
            // Clear validation errors when data loads
            setEmailError("");
            setRoleError("");
        }
    }, [userDetails]);

    const roleOptions = ["user", "carOwner", "driver", "admin"];
    const roleMap = roleOptions.reduce((map, role, index) => {
        map[role] = index + 1;
        return map;
    }, {});

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSave = () => {
        console.log('selectedRoles:', selectedRoles);
        
        // Reset validation errors
        setEmailError("");
        setRoleError("");
        
        let hasError = false;
        
        // Validate email
        if (!email.trim()) {
            setEmailError("Email cannot be empty");
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        }
        
        // Validate roles
        if (selectedRoles.length === 0) {
            setRoleError("Please select at least one role");
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        if (!userId) {
            console.error("Invalid user ID:", userId);
            Swal.fire({
                icon: "error",
                title: "Invalid User ID",
                text: "User ID cannot be null.",
                didOpen: () => {
                    document.querySelector('.swal2-container').style.zIndex = 2000;
                }
            });
            return;
        }

        const roleIds = selectedRoles.map(role => roleMap[role]);
        console.log('roleIds:', roleIds);
        console.log('roleMap:', roleMap);
        console.log('email:', email);
        console.log('userId:', userId);
        updateRoleMutate({
            email: email,
            roleIds: roleIds
        });
    };

    if (isLoading) {
        return <Loading />;
    }

    const isDriver = selectedRoles.includes("driver");

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: '#8a79f0',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} /> User Profile
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>
                    {/* Left side - Header and Personal Info */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: '35%' },
                            bgcolor: '#f6f3ff',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRight: '1px solid #e0e0e0'
                        }}
                    >
                        <Avatar
                            src={userDetails?.avatarUrl || ""}
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: '#8a79f0',
                                mb: 2,
                                fontSize: '3rem',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            {userDetails?.name ? userDetails?.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>

                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                            {userDetails?.name || "User Name"}
                        </Typography>

                        <Box sx={{ mt: 1, mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                            {selectedRoles.map((role) => (
                                <Chip
                                    key={role}
                                    label={role}
                                    sx={{
                                        bgcolor: '#8a79f0',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}
                                />
                            ))}
                        </Box>

                        <Divider flexItem sx={{ my: 2 }} />

                        <Stack spacing={2} width="100%">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BadgeIcon sx={{ mr: 2, color: '#8a79f0' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">ID</Typography>
                                    <Typography variant="body1">{userDetails?.id || "N/A"}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BadgeIcon sx={{ mr: 2, color: '#8a79f0' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">National ID</Typography>
                                    <Typography variant="body1">{userDetails?.nationalId || "N/A"}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarTodayIcon sx={{ mr: 2, color: '#8a79f0' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                                    <Typography variant="body1">{userDetails?.dob || "N/A"}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon sx={{ mr: 2, color: '#8a79f0' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                                    <Typography variant="body1">{userDetails?.phone || "N/A"}</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Right side - Detailed Information */}
                    <Box sx={{ width: { xs: '100%', md: '65%' }, p: 3 }}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ color: '#8a79f0', fontWeight: 'bold' }}>
                                Details Information
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                                onClick={editMode ? handleSave : () => setEditMode(true)}
                                sx={{
                                    bgcolor: editMode ? '#4caf50' : '#8a79f0',
                                    '&:hover': {
                                        bgcolor: editMode ? '#3d8b40' : '#7b6ad9',
                                    }
                                }}
                            >
                                {editMode ? 'Save Changes' : 'Edit'}
                            </Button>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <EmailIcon sx={{ mr: 2, mt: 1, color: '#8a79f0' }} />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            // Clear email error when user types
                                            if (emailError) setEmailError("");
                                        }}
                                        disabled={!editMode}
                                        variant="outlined"
                                        size="small"
                                        error={!!emailError}
                                        helperText={emailError}
                                    />
                                </Box>
                            </Grid>

                            {editMode && (
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <BadgeIcon sx={{ mr: 2, mt: 1, color: '#8a79f0' }} />
                                        <FormControl 
                                            fullWidth 
                                            size="small" 
                                            error={!!roleError}
                                        >
                                            <InputLabel id="roles-label">Roles</InputLabel>
                                            <Select
                                                labelId="roles-label"
                                                multiple
                                                value={selectedRoles.map(role => roleMap[role])}
                                                onChange={(e) => {
                                                    const clickedId = e.target.value[e.target.value.length - 1]; // ID vừa được click
                                                    const selectedRole = roleOptions[clickedId - 1];

                                                    // Nếu đã chọn => bỏ chọn
                                                    if (selectedRoles.includes(selectedRole)) {
                                                        setSelectedRoles([]);
                                                    } else {
                                                        setSelectedRoles([selectedRole]); // chỉ chọn 1
                                                    }
                                                    
                                                    // Clear role error when user selects a role
                                                    if (roleError) setRoleError("");
                                                }}
                                                renderValue={() => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selectedRoles.map((role) => (
                                                            <Chip key={role} label={role} size="small" />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {roleOptions.map((role, index) => (
                                                    <MenuItem key={role} value={index + 1}>
                                                        <Checkbox checked={selectedRoles.includes(role)} />
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {roleError && <FormHelperText>{roleError}</FormHelperText>}
                                        </FormControl>
                                    </Box>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <HomeIcon sx={{ mr: 2, mt: 1, color: '#8a79f0' }} />
                                    <TextField
                                        fullWidth
                                        label="Address Detail"
                                        value={userDetails?.addressDetail || ""}
                                        disabled
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Province"
                                    value={locationNames.province || userDetails?.provinceName || ""}
                                    disabled
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="District"
                                    value={locationNames.district || userDetails?.districtName || ""}
                                    disabled
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Ward"
                                    value={locationNames.ward || userDetails?.wardName || ""}
                                    disabled
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>

                            {isDriver && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider>
                                            <Chip
                                                icon={<DriveEtaIcon />}
                                                label="Driver Information"
                                                sx={{ bgcolor: '#8a79f0', color: 'white' }}
                                            />
                                        </Divider>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Driver Experience"
                                            value={userDetails?.driverExp || ""}
                                            disabled
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Late Fee"
                                            value={userDetails?.lateFee || ""}
                                            disabled
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            value={userDetails?.price || ""}
                                            disabled
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 2, color: '#8a79f0', fontWeight: 'bold' }}>
                                    License Images
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                height: 200,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: '8px',
                                                border: '2px dashed #8a79f0',
                                                bgcolor: '#f9f7ff'
                                            }}
                                        >
                                            {userDetails?.drivingLicenseUrl ? (
                                                <img
                                                    src={userDetails?.drivingLicenseUrl?.[0]}
                                                    alt="License Front"
                                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <Typography color="text.secondary">Front side license not available</Typography>
                                            )}
                                        </Paper>
                                        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                            Front Side
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                height: 200,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: '8px',
                                                border: '2px dashed #8a79f0',
                                                bgcolor: '#f9f7ff'
                                            }}
                                        >
                                            {userDetails?.drivingLicenseUrl ? (
                                                <img
                                                    src={userDetails?.drivingLicenseUrl?.[1]}
                                                    alt="License Back"
                                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <Typography color="text.secondary">Back side license not available</Typography>
                                            )}
                                        </Paper>
                                        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                            Back Side
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ bgcolor: '#f6f3ff', py: 2, px: 3 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        borderColor: '#8a79f0',
                        color: '#8a79f0',
                        '&:hover': {
                            borderColor: '#7b6ad9',
                            bgcolor: 'rgba(138, 121, 240, 0.08)'
                        }
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailsM;