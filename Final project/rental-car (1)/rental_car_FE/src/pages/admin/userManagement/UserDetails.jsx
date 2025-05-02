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
    Avatar,
    IconButton,
    Chip,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useQuery } from "@tanstack/react-query";
import { getlatestDraft} from "../../../api/adminApi";
import { getProvinceApi, getDistrictApi, getWardApi } from '../../../api/addressApi';
import Swal from "sweetalert2";
import Loading from '../../client/loading/Loading';

const UserDetails = ({ open, handleClose, draftId }) => {
    const [selectedRoles] = useState([]);
    const [locationNames, setLocationNames] = useState({
            province: "",
            district: "",
            ward: ""
        });

    console.log("UserDetails component rendering with draftId:", draftId, "open:", open);

    

   const { data: userDetails, isLoading} = useQuery({
        queryKey: ["user-details", draftId],
        queryFn: () => {
            console.log("Fetching draft data for ID:", draftId);
            return getlatestDraft(draftId);
        },
        enabled: !!draftId && open,
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
   

    if (isLoading) {
        return <Loading />;
    }

    // const user = userDetails?.user || {};
    const isDriver = userDetails?.role === "driver" || userDetails?.roles?.includes("driver");
    // const isCarOwner = selectedRoles.includes("carOwner");

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
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <EmailIcon sx={{ mr: 2, mt: 1, color: '#8a79f0' }} />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={userDetails?.email}

                                        disabled= {true}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </Grid>

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
                                    value={locationNames.province || userDetails?.provinceName || "" }
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

export default UserDetails;