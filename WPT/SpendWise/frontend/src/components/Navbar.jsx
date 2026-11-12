import { useState, useEffect } from "react";

import {
  AppBar,Toolbar,Typography,Button,Box,Avatar,IconButton,
} from "@mui/material";

import { Menu } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/images/logo.jpeg";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"));

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || "");

  const token = localStorage.getItem("token");

  // PROFILE IMAGE AND USER UPDATES
  useEffect(() => {
    const handleProfileImageUpdate = (event) => {
      setProfileImage(
        event.detail || localStorage.getItem("profileImage") || ""
      );
    };

    const handleUserUpdate = (event) => {
      setUser(event.detail || JSON.parse(localStorage.getItem("user") || "{}"));
    };

    const handleStorageChange = () => {
      setProfileImage(localStorage.getItem("profileImage") || "");
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    window.addEventListener("profileImageUpdated", handleProfileImageUpdate);
    window.addEventListener("profileUserUpdated", handleUserUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("profileImageUpdated",handleProfileImageUpdate);
      window.removeEventListener("profileUserUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");

    navigate("/");
    window.location.reload();
  };

  const buttonStyle = {
    borderRadius: 2,
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#172033",
        borderBottom: "1px solid #E5E7EB",
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "75px",
          gap: 2,
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          {/* HAMBURGER MENU */}
          {token && (
            <IconButton
              onClick={onMenuClick}
              sx={{
                color: "#2563EB",
                backgroundColor: "#EFF6FF",
                mr: 1,
                "&:hover": {
                  backgroundColor: "#DBEAFE",
                },
              }}
            >
              <Menu />
            </IconButton>
          )}

          {/* LOGO */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="SpendWise Logo"
              sx={{
                width: 45,
                height: 45,
                objectFit: "contain",
                mr: 1,
              }}
            />

            <Typography variant="h5" fontWeight="bold" color="#172033">
              Spend<span style={{ color: "#2563EB" }}>Wise</span>
            </Typography>
          </Box>
        </Box>

        {/* PUBLIC NAVIGATION */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/" color="inherit" sx={buttonStyle}>
            Home
          </Button>

          <Button component={Link} to="/about" color="inherit" sx={buttonStyle}>
            About Us
          </Button>

          <Button component={Link} to="/contact" color="inherit" sx={buttonStyle}>
            Contact
          </Button>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {token ? (
            <>
              {/* USER PROFILE */}
              <Box
                component={Link}
                to={
                  user.role === "admin"? "/admin/profile": "/user/profile"
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                  cursor: "pointer",
                  borderRadius: 2,
                  p: 0.8,
                  "&:hover": {
                    backgroundColor: "#EFF6FF",
                  },
                }}
              >
                <Avatar
                  src={profileImage || undefined}
                  alt={user.username || "User"}
                  sx={{
                    width: 42,
                    height: 42,
                    backgroundColor: "#DBEAFE",
                    color: "#2563EB",
                    fontWeight: "bold",
                  }}
                >
                  {!profileImage &&
                    (user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U")}
                </Avatar>

                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="#172033"
                  >
                    {user.username || "User"}
                  </Typography>

                  <Typography variant="caption" color="#64748B">
                    {user.role || "Member"}
                  </Typography>
                </Box>
              </Box>

              {/* LOGOUT */}
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#2563EB",
                  "&:hover": {
                    backgroundColor: "#1D4ED8",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  ...buttonStyle,
                  borderColor: "#2563EB",
                  color: "#2563EB",
                }}
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#2563EB",
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
