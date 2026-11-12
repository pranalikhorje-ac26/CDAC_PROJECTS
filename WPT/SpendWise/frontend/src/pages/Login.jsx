import { useState } from "react";

import {
  Box,Paper,Typography,
  TextField,Button,InputAdornment,IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import logo from "../assets/images/logo.jpeg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password === "") {
      setError("Please enter email and password.");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),password,
      });

      const loggedInUser = response.data.user;

      // Check selected login type against actual database role
      if (loggedInUser.role !== role) {
        setError("You are not authorized for this login.");
        return;
      }

      // Store authentication token
      localStorage.setItem("token", response.data.token);

      // Store complete user details
      localStorage.setItem("user",JSON.stringify(loggedInUser));

      console.log("Logged-in User:", loggedInUser);

      // Redirect according to backend role
      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (loggedInUser.role === "user") {
        navigate("/user/dashboard");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Your account role is not supported.");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "calc(100vh - 75px)",
          backgroundColor: "#F5F7FB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          boxSizing: "border-box",
        }}>
        <Paper elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            border: "1px solid #E5E7EB",
          }}>
          <Box component="img"
            src={logo}
            alt="SpendWise Logo"
            sx={{ width: 60, height: 60 }}/>

          <Typography variant="h4" fontWeight="bold" mb={1}>
            Spend<span style={{ color: "#2563EB" }}>Wise</span>
          </Typography>

          <Typography sx={{ color: "#424242", mb: 3 }}>
            Welcome back! Please login to continue.
          </Typography>

          {/* LOGIN TYPE */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              fullWidth
              variant={role === "user" ? "contained" : "outlined"}
              onClick={() => setRole("user")}>
              User Login
            </Button>

            <Button
              fullWidth
              variant={role === "admin" ? "contained" : "outlined"}
              onClick={() => setRole("admin")}>
              Admin Login
            </Button>
          </Box>

          {/* LOGIN FORM */}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}/>

            {error && (
              <Typography color="error" mt={2}>
                {error}
              </Typography>)}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: "#2563EB",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#1D4ED8",
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(37, 99, 235, 0.25)",
                },
              }}
            >
              {role === "admin" ? "Admin Login" : "User Login"}
            </Button>
          </Box>

          <Typography sx={{ mt: 3, color: "black" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#2563EB" }}>
              Register Now
            </Link>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}

export default Login;