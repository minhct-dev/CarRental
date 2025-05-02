import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
      primary: {
        main: "#8a79f0", // Màu chính 
        light: "#eeebfd",
        background : "#eef2f6"
      },
      secondary: {
        main: "#2e2a40", // Màu phụ 
      },

      text: {
        primary: "#221e36", // Màu chữ
        secondary: "#767268", // Màu chữ phụ
        light: '#f1f2ff'
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      body1: {
        fontSize: "1rem",
        fontWeight: 500,
        color: '#221e36',
      },
    },
    components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    textTransform:'none'
                }
            }
        },
        
    }
    
  });

  export default theme;