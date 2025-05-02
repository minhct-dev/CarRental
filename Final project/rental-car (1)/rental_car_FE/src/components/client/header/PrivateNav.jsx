import { Button, Stack } from "@mui/material"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


const PrivateNav = ({ children }) => {
    const login = useSelector((state) => state.auth.login)
    const navigate = useNavigate()
    if (login) {
        return children
    }
    else {
        return (<Stack direction="row" spacing={2}>
            <Button
                onClick={() => navigate("/auth?page=login")}
                sx={{ borderRadius: "10px" }}
                variant="contained"
            >
                Login
            </Button>
            <Button
                onClick={() => navigate("/auth?page=register")}
                sx={{ borderRadius: "10px" }}
                variant="contained"
            >
                Register
            </Button>
        </Stack>)
    }
}

export default PrivateNav