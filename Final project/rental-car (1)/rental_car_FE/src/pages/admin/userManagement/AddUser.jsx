import { useState } from "react";
import { Button, TextField, MenuItem, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Person as PersonIcon } from "@mui/icons-material"; 
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { createUser } from "../../../api/adminApi";

export default function AddUserForm({ handleClose }) {
    
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        role: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        role: "",
    });

    // Hàm để cập nhật giá trị trường nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });

        // Kiểm tra lại lỗi khi người dùng thay đổi giá trị

        if (name === "email") {
            if (!validateEmail(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: "Invalid email format (example: user@gmail.com)",
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: "",
                }));
            }
        }

        if (name === "password") {
            if (!validatePassword(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password:
                        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 6 characters long",
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: "",
                }));
            }
        }

        if (name === "role") {
            if (!value) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    role: "Role is required",
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    role: "",
                }));
            }
        }
    };

    // Hàm kiểm tra email hợp lệ
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    // Hàm kiểm tra mật khẩu hợp lệ
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    // Hàm kiểm tra tính hợp lệ của form
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Kiểm tra các trường trống
        Object.keys(userData).forEach((key) => {
            if (!userData[key] && key !== "role") {
                newErrors[key] = `${key} is required`;
                isValid = false;
            }
        });

        // Kiểm tra email hợp lệ
        if (userData.email && !validateEmail(userData.email)) {
            newErrors.email = "Invalid email format (example: user@gmail.com)";
            isValid = false;
        }

        // Kiểm tra mật khẩu hợp lệ
        if (userData.password && !validatePassword(userData.password)) {
            newErrors.password =
                "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 6 characters long";
            isValid = false;
        }

        // Kiểm tra role có được chọn
        if (!userData.role) {
            newErrors.role = "Role is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Hàm gửi form khi hợp lệ
    const { mutate } = useMutation({
            mutationFn: (data) => createUser(data),
            onMutate: () => {
                Swal.fire({
                    title: 'Processing',
                    html:'Unbanning User, please wait...',
                    didOpen: () => {
                        Swal.showLoading();
                    }
                    });
                },
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "User Addes",
                    text: "Adding Account Successfully",
                    timer: 10000
                });
            },
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Something went wrong while Adding the user.",
                    confirmButtonColor: "#d33"
                });
            }
        });
    const handleSubmit = () => {
        if (validateForm()) {
            const roleMapping = {
                "user": "1",
                "carOwner": "2",
                "driver": "3",
                "admin": "4"
            };
    
            const formattedData = {
                email: userData.email,
                password: userData.password,
                roleIds: [roleMapping[userData.role]] // Chuyển đổi role thành roleIds
            };
    
            mutate(formattedData); // Gửi dữ liệu ở đây
            handleClose(); // Đóng pop-up sau khi gửi dữ liệu hợp lệ
        }
    };

    return (
        <Box sx={{ width: "400px", textAlign: "center", mt: 2, mx: "auto"  }}>
            {/* Close button */}
            <IconButton
                onClick={handleClose}
                sx={{ position: "absolute", right: 10, top: 10, color: "#7a67e0" }}
            >
                <CloseIcon />
            </IconButton>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                
                <PersonIcon sx={{ fontSize: 80, color: "#7a67e0", marginBottom: 2 }} /> 
                <Typography variant="h5" color="#333">
                    Add New User
                </Typography>
            </Box>

            {/* Input Fields */}
            <TextField
                fullWidth
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
                error={!!errors.email}
                helperText={errors.email}
                size="small"
            />
            <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
                error={!!errors.password}
                helperText={errors.password}
                size="small"
            />
            <TextField
                select
                fullWidth
                label="Role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                sx={{ mb: 3 }}
                error={!!errors.role}
                helperText={errors.role}
                size="small"
            >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="carOwner">carOwner</MenuItem>
            </TextField>

            {/* Submit Button */}
            <Button
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#7a67e0",
                    "&:hover": { backgroundColor: "#6b5ac8" },
                    borderRadius: "8px",
                    textTransform: "none",
                    width: "50%", // Thu nhỏ nút submit
                    margin: "0 auto", // Căn giữa
                }}
                onClick={handleSubmit} // Gửi form và đóng pop-up
            >
                Submit
            </Button>
        </Box>
    );
}
