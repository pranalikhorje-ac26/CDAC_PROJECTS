import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

import logo from "../assets/images/logo.jpeg";

function Footer() {
  return (
    <Box sx={{
        backgroundColor: "#172554",
        color: "white",
        py: 4,
        mt: 5,
      }}>
      <Container maxWidth="lg">

        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
          }}>

          {/* Company Information */}
          <Box sx={{ maxWidth: 280 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>

              <Box
                component="img"
                src={logo}
                alt="SpendWise Logo"
                sx={{ width: 40, height: 40, mr: 1 }}
              />

              <Typography variant="h5" fontWeight="bold">
                SpendWise
              </Typography>

            </Box>

            <Typography variant="body2" sx={{ color: "#CBD5E1", lineHeight: 1.8 }}>
              Manage your expenses, plan your budget,
              and achieve your financial goals with SpendWise.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Quick Links
            </Typography>

            <Button component={Link} to="/" sx={{ color: "#CBD5E1", display: "block" }}>
              Home
            </Button>

            <Button component={Link} to="/about" sx={{ color: "#CBD5E1", display: "block" }}>
              About Us
            </Button>

            <Button component={Link} to="/contact" sx={{ color: "#CBD5E1", display: "block" }}>
              Contact Us
            </Button>
          </Box>

          {/* Our Services */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Our Services
            </Typography>

            <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 1 }}>
              Expense Tracking
            </Typography>

            <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 1 }}>
              Budget Management
            </Typography>

            <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 1 }}>
              Savings Goals
            </Typography>
          </Box>

        </Box>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: "1px solid #334155",
            mt: 4,
            pt: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
            © 2026 SpendWise. All Rights Reserved.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

export default Footer;