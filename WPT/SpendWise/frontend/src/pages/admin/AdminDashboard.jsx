import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    People,
    ReceiptLong,
    TrendingUp,
    TrendingDown,
    AccountBalanceWallet,
} from "@mui/icons-material";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function AdminDashboard() {
    const [summary, setSummary] = useState({
        totalUsers: 0,
        totalTransactions: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalBalance: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAdminSummary = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/dashboard-summary");

            setSummary(response.data.data);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch admin dashboard data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminSummary();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const cards = [
        {
            title: "Total Users",
            value: summary.totalUsers,
            icon: <People />,
            color: "#2563EB",
            background: "#DBEAFE",
        },
        {
            title: "Total Transactions",
            value: summary.totalTransactions,
            icon: <ReceiptLong />,
            color: "#7C3AED",
            background: "#EDE9FE",
        },
        {
            title: "Total Income",
            value: formatCurrency(summary.totalIncome),
            icon: <TrendingUp />,
            color: "#16A34A",
            background: "#DCFCE7",
        },
        {
            title: "Total Expenses",
            value: formatCurrency(summary.totalExpense),
            icon: <TrendingDown />,
            color: "#EF4444",
            background: "#FEE2E2",
        },
        {
            title: "Total Balance",
            value: formatCurrency(summary.totalBalance),
            icon: <AccountBalanceWallet />,
            color: "#0891B2",
            background: "#CFFAFE",
        },
    ];

    return (
        <DashboardLayout>
            <Box>
                {/* PAGE HEADER */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#172033",
                            mb: 1,
                        }}
                    >
                        Admin Dashboard
                    </Typography>

                    <Typography color="text.secondary">
                        Welcome to SpendWise Admin Panel. Monitor your platform's
                        overall financial activity.
                    </Typography>
                </Box>

                {/* ERROR MESSAGE */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Typography
                                component="button"
                                onClick={fetchAdminSummary}
                                sx={{
                                    border: 0,
                                    background: "transparent",
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}>
                                Retry
                            </Typography>
                        }>
                        {error}
                    </Alert>
                )}

                {/* LOADING */}
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 8,
                        }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* SUMMARY CARDS */}
                        <Grid container spacing={3}>
                            {cards.map((card) => (
                                <Grid
                                    size={{ xs: 12, sm: 6, lg: 4 }}
                                    key={card.title}
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            border: "1px solid #E5E7EB",
                                            height: "100%",
                                            transition: "0.3s",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
                                            },
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
                                                    color="text.secondary"
                                                    fontWeight={600}
                                                >
                                                    {card.title}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 3,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor: card.background,
                                                        color: card.color,
                                                    }}
                                                >
                                                    {card.icon}
                                                </Box>
                                            </Box>

                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#172033",
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {card.value}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* INFORMATION SECTION */}
                        <Card
                            elevation={0}
                            sx={{
                                mt: 4,
                                borderRadius: 4,
                                border: "1px solid #E5E7EB",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="#172033"
                                    gutterBottom
                                >
                                    Platform Overview
                                </Typography>

                                <Typography color="text.secondary">
                                    These statistics represent the combined financial
                                    activity of all registered users on SpendWise.
                                    Use the navigation menu to manage users,
                                    transactions, and reports.
                                </Typography>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Box>
        </DashboardLayout>
    );
}

export default AdminDashboard;