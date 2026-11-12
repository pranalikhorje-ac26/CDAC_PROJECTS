import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PieChartIcon from "@mui/icons-material/PieChart";
import StarIcon from "@mui/icons-material/Star";

import wallet from "../assets/images/home.jpeg";

function HeroSection() {
  return (
    <Box sx={{ backgroundColor: "#F5F7FB", py: 5 }}>
      <Container maxWidth="lg">

        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1, minWidth: "280px" }}>
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                color: "#172554",
                fontSize: { xs: 38, md: 48 },
              }}
            >
              Track Your
            </Typography>

            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                color: "#2563EB",
                fontSize: { xs: 38, md: 48 },
              }}
            >
              Expenses{" "}
              <Box component="span" sx={{ color: "#172554" }}>
                Easily
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                mt: 2,
                fontSize: 16,
                maxWidth: 420,
              }}
            >
              Plan your budget, manage your money,
              and reach your financial goals.
            </Typography>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                mt: 3,
                px: 3,
                py: 1.2,
                borderRadius: 5,
                backgroundColor: "#2563EB",
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#1D4ED8",
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              Get Started →
            </Button>
          </Box>

          {/* Right Image */}
          <Box sx={{ flex: 1, textAlign: "center", minWidth: "280px" }}>
            <Box
              component="img"
              src={wallet}
              alt="SpendWise Finance Wallet"
              sx={{
                width: "100%",
                maxWidth: 480,
                height: "auto",
                objectFit: "contain",
                transition: "transform 0.4s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>
        </Box>

        {/* Feature Cards */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 4,
            backgroundColor: "#E8F0FF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: 3,
              textAlign: "center",
            }}
          >

            {/* Track Spending */}
            <Box
              sx={{
                minWidth: 150,
                p: 2,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  backgroundColor: "#DBEAFE",
                  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.15)",
                },
                "&:hover .featureIcon": {
                  transform: "scale(1.2) rotate(-5deg)",
                },
              }}
            >
              <TrendingUpIcon
                className="featureIcon"
                sx={{
                  fontSize: 38,
                  color: "#2563EB",
                  transition: "transform 0.3s ease",
                }}
              />

              <Typography fontWeight="bold">
                Track Spending
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Know where your money goes
              </Typography>
            </Box>

            {/* Set Budget */}
            <Box sx={{
                minWidth: 150,
                p: 2,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  backgroundColor: "#EDE9FE",
                  boxShadow: "0 8px 20px rgba(124, 58, 237, 0.15)",
                },
                "&:hover .featureIcon": {
                  transform: "scale(1.2) rotate(10deg)",
                },
              }}
            >
              <PieChartIcon
                className="featureIcon"
                sx={{
                  fontSize: 38,
                  color: "#2563EB",
                  transition: "transform 0.3s ease",
                }}
              />

              <Typography fontWeight="bold">
                Set Budget
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Stay on budget always
              </Typography>
            </Box>

            {/* Achieve Goals */}
            <Box sx={{
                minWidth: 150,
                p: 2,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  backgroundColor: "#DCFCE7",
                  boxShadow: "0 8px 20px rgba(22, 163, 74, 0.15)",
                },
                "&:hover .featureIcon": {
                  transform: "scale(1.2) rotate(10deg)",
                },
              }}>
              <StarIcon
                className="featureIcon"
                sx={{
                  fontSize: 38,
                  color: "#2563EB",
                  transition: "transform 0.3s ease",
                }} />

              <Typography fontWeight="bold">
                Achieve Goals
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Save more, dream bigger
              </Typography>
            </Box>

          </Box>
        </Paper>

      </Container>
    </Box>
  );
}

export default HeroSection;