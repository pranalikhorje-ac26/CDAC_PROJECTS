import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

import { ReceiptLong } from "@mui/icons-material";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET ALL TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/transactions");

      setTransactions(response.data.transactions || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to fetch transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // FORMAT DATE AND TIME
  const formatDateTime = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <DashboardLayout>
      <Box>
        {/* PAGE HEADER */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#172033"
        >
          Transactions
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          View your complete income and expense history.
        </Typography>

        {/* TRANSACTION HISTORY CARD */}
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>

            {/* HEADER */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Transaction History
              </Typography>
            </Box>

            {/* LOADING */}
            {loading && (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <CircularProgress />

                <Typography sx={{ mt: 2 }}>
                  Loading transactions...
                </Typography>
              </Box>
            )}

            {/* ERROR */}
            {!loading && error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && transactions.length === 0 && (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <ReceiptLong
                  sx={{ fontSize: 55, color: "#94A3B8" }}
                />

                <Typography variant="h6" sx={{ mt: 2 }}>
                  No Transactions Found
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Create a category and add an amount to see your
                  transaction history here.
                </Typography>
              </Box>
            )}

            {/* TRANSACTION HISTORY */}
            {!loading && !error && transactions.map((transaction) => (
              <Card
                key={transaction._id}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 3,
                    borderColor: "#2563EB",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {/* LEFT SIDE */}
                  <Box>
                    {/* CATEGORY NAME */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "500",
                        color: "#1D4ED8",
                        fontSize: "20px",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {transaction.categoryId?.name || "No category"}
                    </Typography>

                    {/* DATE AND TIME */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {formatDateTime(transaction.date)}
                    </Typography>

                    {/* DESCRIPTION */}
                    {transaction.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {transaction.description}
                      </Typography>
                    )}
                  </Box>

                  {/* RIGHT SIDE */}
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      fontWeight="bold"
                      fontSize="1.1rem"
                      color={
                        transaction.type === "income"
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      ₹{Number(transaction.amount).toLocaleString("en-IN")}
                    </Typography>

                    <Chip
                      size="small"
                      label={transaction.type}
                      color={
                        transaction.type === "income"
                          ? "success"
                          : "error"
                      }
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}

          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Transactions;