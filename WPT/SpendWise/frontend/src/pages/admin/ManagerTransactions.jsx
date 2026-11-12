import { useEffect, useState } from "react";

import {
    Box,Typography, Card,
    CardContent,
    Table,TableBody,
    TableCell,TableContainer,TableHead,TableRow,Chip,
    CircularProgress,Alert,Button
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RefreshIcon from "@mui/icons-material/Refresh";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function ManagerTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/transactions");
            setTransactions(response.data.transactions || []);

        } catch (err) {
            setError(err.response?.data?.message ||"Unable to fetch transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <DashboardLayout>
            <Box>

                {/* PAGE HEADER */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 4
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <ReceiptLongIcon
                            sx={{ fontSize: 40, color: "#2563EB" }}
                        />

                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="#172033"
                            >
                                Manage Transactions
                            </Typography>

                            <Typography color="text.secondary">
                                Monitor transactions across all users.
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchTransactions}>
                        Refresh
                    </Button>
                </Box>

                {/* TOTAL TRANSACTIONS */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #E5E7EB"
                    }}>
                    <CardContent>
                        <Typography color="text.secondary">
                            Total Transactions
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            color="#2563EB"
                        >
                            {transactions.length}
                        </Typography>
                    </CardContent>
                </Card>

                {/* TRANSACTION TABLE */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #E5E7EB"
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} mb={3}>
                            All Transactions
                        </Typography>

                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    p: 5
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Alert
                                severity="error"
                                action={
                                    <Button
                                        color="inherit"
                                        onClick={fetchTransactions}
                                    >
                                        Retry
                                    </Button>
                                }
                            >
                                {error}
                            </Alert>
                        ) : transactions.length === 0 ? (
                            <Typography
                                color="text.secondary"
                                textAlign="center"
                                py={4}
                            >
                                No transactions found.
                            </Typography>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow
                                            sx={{ backgroundColor: "#F8FAFC" }}
                                        >
                                            <TableCell><b>Sr. No.</b></TableCell>
                                            <TableCell><b>User</b></TableCell>
                                            <TableCell><b>Category</b></TableCell>
                                            <TableCell><b>Description</b></TableCell>
                                            <TableCell><b>Type</b></TableCell>
                                            <TableCell><b>Amount</b></TableCell>
                                            <TableCell><b>Date</b></TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {transactions.map((transaction, index) => (
                                            <TableRow
                                                key={transaction._id}
                                                hover
                                            >
                                                <TableCell>{index + 1}</TableCell>

                                                <TableCell>
                                                    {transaction.userId?.username || "Unknown"}
                                                </TableCell>

                                                <TableCell>
                                                    {transaction.categoryId?.name || "Uncategorized"}
                                                </TableCell>

                                                <TableCell>
                                                    {transaction.description || "N/A"}
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={transaction.type}
                                                        size="small"
                                                        color={
                                                            transaction.type === "income"
                                                                ? "success"
                                                                : "error"
                                                        }
                                                        sx={{
                                                            textTransform: "capitalize"
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        fontWeight: 700,
                                                        color:
                                                            transaction.type === "income"
                                                                ? "#16A34A"
                                                                : "#EF4444"
                                                    }}
                                                >
                                                    {formatCurrency(transaction.amount)}
                                                </TableCell>

                                                <TableCell>
                                                    {formatDate(transaction.date)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>

            </Box>
        </DashboardLayout>
    );
}

export default ManagerTransactions;