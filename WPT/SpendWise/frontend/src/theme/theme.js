import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2563EB",
        },
        secondary: {
            main: "#7C3AED",
        },
        background: {
            default: "#F5F7FB",
            paper: "#FFFFFF",
        },
        success: {
            main: "#16A34A",
        },
        error: {
            main: "#EF4444",
        },
        text: {
            primary: "#172033",
            secondary: "#64748B",
        },
    },

    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },

    shape: {
        borderRadius: 10,
    },
});

export default theme;