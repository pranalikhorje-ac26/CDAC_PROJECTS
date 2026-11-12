import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  Savings,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#7C83FD",
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
  });

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);

  const [savings, setSavings] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryResponse,
        monthlyResponse,
        categoryResponse,
        transactionResponse,
        savingsResponse,
      ] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/monthly-summary"),
        api.get("/dashboard/expense-by-category"),
        api.get("/dashboard/recent-transactions"),
        api.get("/dashboard/savings-overview"),
      ]);

      // DASHBOARD SUMMARY
      const summaryData = summaryResponse.data.data || {};

      setSummary({
        balance: summaryData.balance || 0,
        totalIncome: summaryData.totalIncome || 0,
        totalExpense: summaryData.totalExpense || 0,
      });

      // MONTHLY SUMMARY
      const monthlyRecords =
        monthlyResponse.data.monthlySummary || [];

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const currentMonthData = monthlyRecords.find(
        (item) =>
          item.month === currentMonth &&
          item.year === currentYear
      );

      const income = currentMonthData?.totalIncome || 0;
      const expense = currentMonthData?.totalExpense || 0;

      setMonthlyIncome(income);
      setMonthlyExpense(expense);

      // SAVINGS RATE
      const rate =
        income > 0
          ? ((income - expense) / income) * 100
          : 0;

      setSavingsRate(Math.max(0, rate));

      // SAVINGS OVERVIEW
      const savingsAmount =
        savingsResponse.data.summary?.totalSavedAmount || 0;

      setSavings(savingsAmount);

      // CATEGORY CHART
      const categoryRecords =
        categoryResponse.data.expenses || [];

      const formattedCategories = categoryRecords.map(
        (item, index) => ({
          name: item.categoryName || "Other",
          value: item.totalExpense || 0,
          color: COLORS[index % COLORS.length],
        })
      );

      setCategoryData(formattedCategories);

      // MONTHLY CHART - LAST SIX MONTHS
      const lastSixMonths = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(
          currentYear,
          currentMonth - 1 - i,
          1
        );

        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const record = monthlyRecords.find(
          (item) =>
            item.year === year &&
            item.month === month
        );

        lastSixMonths.push({
          month: date.toLocaleString("en-IN", {
            month: "short",
          }),
          income: record?.totalIncome || 0,
          expenses: record?.totalExpense || 0,
        });
      }

      setMonthlyData(lastSixMonths);

      // RECENT TRANSACTIONS
      setRecentTransactions(
        transactionResponse.data.transactions || []
      );

    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Total Balance",
      amount: formatCurrency(summary.balance),
      subtitle: "Your available balance",
      icon: <AccountBalanceWallet />,
      color: "#2563EB",
      background: "#E8EEFF",
    },
    {
      title: "Monthly Income",
      amount: formatCurrency(monthlyIncome),
      subtitle: "This month",
      icon: <TrendingUp />,
      color: "#16A34A",
      background: "#E2F3E9",
    },
    {
      title: "Monthly Expenses",
      amount: formatCurrency(monthlyExpense),
      subtitle: "This month",
      icon: <TrendingDown />,
      color: "#EF4444",
      background: "#FCE7E7",
    },
    {
      title: "Savings Rate",
      amount: `${savingsRate.toFixed(1)}%`,
      subtitle: "Of your monthly income",
      icon: <Savings />,
      color: "#7C3AED",
      background: "#F0E7FF",
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ width: "100%" }}>

        {/* DASHBOARD HEADING */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#172554",
              mb: 1,
            }}
          >
            Dashboard
          </Typography>

          <Typography color="#64748B">
            Welcome to SpendWise! Manage your income and expenses easily.
          </Typography>
        </Box>

        {/* ERROR MESSAGE */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" onClick={fetchDashboardData}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <Grid container spacing={3}>
              {dashboardCards.map((item, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, lg: 3 }}
                  key={index}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      border: "1px solid #F1F5F9",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.09)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography color="#64748B">
                            {item.title}
                          </Typography>

                          <Typography
                            variant="h5"
                            fontWeight={700}
                            color="#172033"
                            sx={{ mt: 1.5 }}
                          >
                            {item.amount}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="#94A3B8"
                            display="block"
                            mt={1}
                          >
                            {item.subtitle}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: 62,
                            height: 62,
                            borderRadius: 3,
                            backgroundColor: item.background,
                            color: item.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "& svg": {
                              fontSize: 28,
                            },
                          }}
                        >
                          {item.icon}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* CHARTS */}
            <Grid container spacing={3} sx={{ mt: 1 }}>

              {/* SPENDING BY CATEGORY */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    minHeight: 420,
                    height: "100%",
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#2563EB"
                      mb={3}
                    >
                      Spending by Category
                    </Typography>

                    {categoryData.length === 0 ? (
                      <Box
                        sx={{
                          height: 320,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          color: "#94A3B8",
                        }}
                      >
                        <Box
                          sx={{
                            width: 170,
                            height: 170,
                            borderRadius: "50%",
                            border: "22px solid #E8EEFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          ₹0
                        </Box>

                        <Typography fontWeight={600}>
                          No spending data available
                        </Typography>

                        <Typography variant="body2" mt={0.5}>
                          Add transactions to view your spending.
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={categoryData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={100}
                              // paddingAngle={0}
                            >
                              {categoryData.map((item, index) => (
                                <Cell
                                  key={index}
                                  fill={item.color}
                                />
                              ))}
                            </Pie>

                            <Tooltip
                              formatter={(value) => formatCurrency(value)}
                            />

                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* MONTHLY OVERVIEW */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    minHeight: 420,
                    height: "100%",
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#2563EB"
                      mb={3}
                    >
                      Monthly Overview
                    </Typography>

                    <Box sx={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer>
                        <BarChart data={monthlyData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />

                          <XAxis dataKey="month" />

                          <YAxis />

                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                          />

                          <Legend />

                          <Bar
                            dataKey="income"
                            name="Income"
                            fill="#36BCE5"
                            radius={[5, 5, 0, 0]}
                          />

                          <Bar
                            dataKey="expenses"
                            name="Expenses"
                            fill="#FF4D4F"
                            radius={[5, 5, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* RECENT TRANSACTIONS */}
            <Card
              elevation={0}
              sx={{
                mt: 3,
                borderRadius: 4,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#172554"
                  >
                    Recent Transactions
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => navigate("/user/transactions")}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    View All
                  </Button>
                </Box>

                {recentTransactions.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 5,
                      color: "#64748B",
                    }}
                  >
                    <Typography fontWeight={600}>
                      No transactions available yet.
                    </Typography>

                    <Typography variant="body2" mt={1}>
                      Your recent transactions will appear here.
                    </Typography>
                  </Box>
                ) : (
                  recentTransactions.map((transaction) => (
                    <Box key={transaction._id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 2,
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography fontWeight={600} color="#172033">
                            {transaction.description ||
                              transaction.categoryId?.name ||
                              "Transaction"}
                          </Typography>

                          <Typography variant="body2" color="#64748B">
                            {transaction.categoryId?.name || "Other"} •{" "}
                            {transaction.date
                              ? new Date(transaction.date).toLocaleDateString("en-IN")
                              : ""}
                          </Typography>
                        </Box>

                        <Typography
                          fontWeight={700}
                          color={
                            transaction.type === "income"
                              ? "#16A34A"
                              : "#EF4444"
                          }
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </Box>

                      <Divider />
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
