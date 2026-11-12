import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";

import logo from "../assets/images/logo.jpeg";

function Register() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_no, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Registration Function
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Check empty fields
    if (username.trim() === "" ||email.trim() === "" ||
      phone_no.trim() === "" ||password === "" ||
      confirmPassword === "") {
      setError("Please fill all the fields.");
      return;
    }

    // Name validation
    if (username.trim().split(/\s+/).length < 2) {
      setError("Please enter your full name (at least two words).");
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Mobile number validation
    if (!/^[6-9][0-9]{9}$/.test(phone_no)) {
      setError("Enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    try {
      // Send registration data to backend
      await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        phone_no: "+91" + phone_no,
        password: password,
      });

      alert("Registration successful! Please login.");

      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message ||"Registration failed. Please try again.");
    }
  };

  return (
    <>
      {/* HOME PAGE NAVBAR */}
      <Navbar />

      {/* REGISTRATION PAGE */}
      <Box sx={{
          minHeight: "calc(100vh - 75px)",
          backgroundColor: "#F5F7FB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
          px: 2,
          boxSizing: "border-box",
        }}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 450,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            border: "1px solid #E5E7EB",
          }}>
          {/* LOGO */}
          <Box component="img"
            src={logo}
            alt="SpendWise Logo"
            sx={{
              width: 60,
              height: 60,
              objectFit: "contain",
            }}/>

          <Typography variant="h4" fontWeight="bold" mb={1}>
            Spend<span style={{ color: "#2563EB" }}>Wise</span>
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Create your account and start managing your money.
          </Typography>

          {/* REGISTRATION FORM */}
          <Box component="form" onSubmit={handleRegister}>

            {/* FULL NAME */}
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />

            {/* EMAIL */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* MOBILE NUMBER */}
            <TextField
              fullWidth
              label="Mobile Number"
              margin="normal"
              value={phone_no}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      +91
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  maxLength: 10,
                  inputMode: "numeric",
                },
              }}/>

            {/* PASSWORD */}
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
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}/>

            {/* CONFIRM PASSWORD */}
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }>
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />)}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}/>

            {/* ERROR MESSAGE */}
            {error && (
              <Typography color="error" mt={2}>
                {error}
              </Typography>
            )}

            {/* REGISTER BUTTON */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{mt: 3,py: 1.5,
                backgroundColor: "#2563EB",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#1D4ED8",
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(37, 99, 235, 0.25)",
                },
              }}>
              Register
            </Button>
          </Box>

          {/* LOGIN LINK */}
          <Typography sx={{mt:3 ,color:"text.secondary"}}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563EB" }}>
              Login Now
            </Link>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}

export default Register;
