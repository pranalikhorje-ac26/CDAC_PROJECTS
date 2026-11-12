import { useState, useEffect } from "react";

import {
  AppBar,Toolbar,Typography,Box,IconButton,Avatar,Button,
} from "@mui/material";

import { Menu } from "@mui/icons-material";

import { Link } from "react-router-dom";

import logo from "../assets/images/logo.jpeg";

function DashboardNavbar({ onMenuClick }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  // LISTEN FOR PROFILE UPDATES
  useEffect(() => {
    const handleProfileImageUpdate = (event) => {
      setProfileImage(event.detail || localStorage.getItem("profileImage") || "");
    };

    const handleUserUpdate = (event) => {
      setUser(
        event.detail || JSON.parse(localStorage.getItem("user") || "{}")
      );
    };

    const handleStorageChange = () => {
      setProfileImage(localStorage.getItem("profileImage") || "");

      setUser(
        JSON.parse(localStorage.getItem("user") || "{}")
      );
    };

    window.addEventListener("profileImageUpdated",handleProfileImageUpdate);

    window.addEventListener("profileUserUpdated",handleUserUpdate);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("profileImageUpdated",handleProfileImageUpdate);

      window.removeEventListener("profileUserUpdated",handleUserUpdate);

      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const buttonStyle = {
    color: "#172033",
    textTransform: "none",
    fontSize: "15px",
    fontWeight: 500,
    "&:hover": {
      color: "#2563EB",
      backgroundColor: "#EFF6FF",
    },
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{backgroundColor: "#FFFFFF",
        color: "#172033",
        borderBottom: "1px solid #E5E7EB",
        zIndex: 1201,
      }}>
      <Toolbar sx={{
          minHeight: "75px",
          justifyContent: "space-between",
        }}>

        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* EXISTING MENU BUTTON */}
          <IconButton
            onClick={onMenuClick}
            sx={{
              color: "#2563EB",
              backgroundColor: "#EFF6FF",
              "&:hover": {
                backgroundColor: "#DBEAFE",
              },
            }}>
            <Menu />
          </IconButton>

          {/* LOGO */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: 1,}}>
            <Box
              component="img"
              src={logo}
              alt="SpendWise Logo"
              sx={{
                width: 45,
                height: 45,
                objectFit: "contain",
              }}/>

            <Typography
              variant="h5"
              fontWeight="bold"
              color="#172033">
              Spend
              <span style={{ color: "#2563EB" }}>Wise</span>
            </Typography>
          </Box>

        </Box>

        {/* NAVIGATION LINKS */}
        <Box sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }} >
          <Button
            component={Link}
            to="/"
            sx={buttonStyle}>Home</Button>

          <Button
            component={Link}
            to="/about"
            sx={buttonStyle}> About Us</Button>

          <Button
            component={Link}
            to="/contact"
            sx={buttonStyle}> Contact</Button>
        </Box>

        {/* USER PROFILE */}
        <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}>

          <Avatar
            src={profileImage || undefined}
            alt={user.username || "User"}
            sx={{
              width: 42,
              height: 42,
              backgroundColor: "#DBEAFE",
              color: "#2563EB",
              fontWeight: "bold",
            }}>
            {!profileImage &&
              (user.username? user.username.charAt(0).toUpperCase(): "U")}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              variant="body1"
              fontWeight="bold"
              color="#172033">
              {user.username || "User"}
            </Typography>

            <Typography
              variant="caption"
              color="#64748B">
              {user.role || "Member"}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardNavbar;
