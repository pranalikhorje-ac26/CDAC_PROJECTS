import { Box, Container, Typography, Paper } from "@mui/material";

// import Navbar from "../components/Navbar";

import {
  ReceiptLong,
  AccountBalanceWallet,
  Savings,
} from "@mui/icons-material";

function About() {
  return (
    <>
      {/* <Navbar /> */}

      <Box sx={{ backgroundColor: "#F1F5FC", py: 7 }}>

        <Container maxWidth="lg">

          {/* About Information */}
          <Paper
            elevation={0}
            sx={{
              maxWidth: "950px",
              mx: "auto",
              p: 4,
              borderRadius: 3,
              border: "1px solid #DBEAFE",
              backgroundColor: "#FFFFFF",
              mb: 7,
              transition: "all 0.4s ease",

              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 30px rgba(37,99,235,0.15)",
                borderColor: "#2563EB",
              },
            }}
          >

            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                // fontWeight: "bold",
                fontSize: 35,
                // color: "#1D4ED8",
                mb: 3,
              }}
            >
              About <span style={{ color: "purple" }}>Spend</span><span style={{ color: "#2563EB" }}>Wise</span>
            </Typography>

            <Typography
              sx={{
                fontSize: 18,
                color: "#475569",
                maxWidth: "750px",
                textAlign: "center",
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              SpendWise is a personal expense tracking application
              designed to make money management simple and convenient.
              Track your income, manage expenses, create budgets,
              and achieve your savings goals in one place.
            </Typography>

          </Paper>

          {/* Features Heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>

            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: 35,
                color: "#172554",
              }}
            >
              What We Offer
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                fontSize: 16,
                mt: 1,
                letterSpacing: 0.3,
              }}
            >
              Smart tools to track, save, and take control of your money.
            </Typography>

          </Box>

          {/* Three Feature Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >

            {/* Expense Tracking */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid #BFDBFE",
                backgroundColor: "#FFFFFF",
                transition: "all 0.3s ease",

                "&:hover": {
                  backgroundColor: "#EDE9FE",
                  borderColor: "#7C3AED",
                  transform: "translateY(-8px)",
                  boxShadow: "0 10px 25px rgba(37,99,235,0.18)",
                },
              }}
            >

              <ReceiptLong
                sx={{
                  fontSize: 45,
                  color: "#2563EB",
                  mb: 2,
                  transition: "0.3s",
                }}
              />

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                color="#1E3A8A"
              >
                Expense Management
              </Typography>

              <Typography
                color="#475569"
                sx={{ lineHeight: 1.8 }}
              >
                Record and manage your daily income and expenses.
                Keep all your transactions organized in one place.
              </Typography>

            </Paper>

            {/* Budget Management */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid #DDD6FE",
                backgroundColor: "#FFFFFF",
                transition: "all 0.3s ease",

                "&:hover": {
                  backgroundColor: "#EDE9FE",
                  borderColor: "#7C3AED",
                  transform: "translateY(-8px)",
                  boxShadow: "0 10px 25px rgba(124,58,237,0.18)",
                },
              }}
            >

              <AccountBalanceWallet
                sx={{
                  fontSize: 45,
                  color: "#7C3AED",
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                color="#5B21B6"
              >
                Budget Management
              </Typography>

              <Typography
                color="#475569"
                sx={{ lineHeight: 1.8 }}
              >
                Create monthly budgets, monitor your spending,
                and maintain better control over your finances.
              </Typography>

            </Paper>

            {/* Savings Goals */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid #BBF7D0",
                backgroundColor: "#FFFFFF",
                transition: "all 0.3s ease",

                "&:hover": {
                  backgroundColor: "#EDE9FE",
                  borderColor: "#7C3AED",
                  transform: "translateY(-8px)",
                  boxShadow: "0 10px 25px rgba(22,163,74,0.18)",
                },
              }}
            >

              <Savings
                sx={{
                  fontSize: 45,
                  color: "#16A34A",
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                color="#166534"
              >
                Savings Goals
              </Typography>

              <Typography
                color="#475569"
                sx={{ lineHeight: 1.8 }}
              >
                Set savings targets, add money to your goals,
                and track your progress.
              </Typography>

            </Paper>

          </Box>

          {/* Closing Section */}
          <Box
            sx={{
              textAlign: "center",
              mt: 7,
              py: 4,
              px: 2,
              borderRadius: 4,
              background: "linear-gradient(135deg, #EFF6FF, #EDE9FE)",
            }}
          >

            <Typography
              variant="h4"
              fontWeight="bold"
              mb={2}
              sx={{
                background: "linear-gradient(90deg, #2563EB, #7C3AED)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Manage Your Money Smarter!
            </Typography>

            <Typography
              sx={{
                color: "#475569",
                fontSize: 17,
                mb: 1,
              }}
            >
              Every rupee counts. Make every financial decision smarter.
            </Typography>

            <Typography sx={{
                color: "#64748B",
                fontSize: 15,
                fontStyle: "italic",
              }}>
              Spend wisely today for a better financial future tomorrow.
            </Typography>
          </Box>
        </Container>

      </Box>
    </>
  );
}

export default About;