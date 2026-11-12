import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Button,
    TextField,
    MenuItem,
    Stack
} from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SavingsIcon from "@mui/icons-material/Savings";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from "recharts";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function AdminReports() {

    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // DATE FILTER STATES
    const [filterType, setFilterType] = useState("all");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [appliedRange, setAppliedRange] = useState({});

    // FORMAT DATE AS YYYY-MM-DD USING LOCAL DATE
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // FETCH REPORTS
    const fetchReports = async (range = appliedRange) => {
        try {
            setLoading(true);
            setError("");

            const [monthlyResponse, categoryResponse] = await Promise.all([
                api.get("/admin/monthly-summary", {
                    params: range
                }),

                api.get("/admin/expense-by-category", {
                    params: range
                })
            ]);

            const formattedMonthly = (
                monthlyResponse.data.monthlySummary || []
            ).map((item) => ({
                ...item,
                monthName: new Date(
                    item.year,
                    item.month - 1
                ).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric"
                })
            }));

            setMonthlyData(formattedMonthly);
            setCategoryData(categoryResponse.data.expenses || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports({});
    }, []);

    // APPLY DATE FILTER
    const handleApplyFilter = () => {

        const today = new Date();

        let range = {};

        if (filterType === "month") {

            const firstDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

            const lastDay = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            );

            range = {
                startDate: formatDate(firstDay),
                endDate: formatDate(lastDay)
            };

        } else if (filterType === "lastMonth") {

            const firstDay = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );

            const lastDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );

            range = {
                startDate: formatDate(firstDay),
                endDate: formatDate(lastDay)
            };

        } else if (filterType === "year") {

            range = {
                startDate: `${today.getFullYear()}-01-01`,
                endDate: `${today.getFullYear()}-12-31`
            };

        } else if (filterType === "custom") {

            if (!startDate || !endDate) {
                setError("Please select both start date and end date.");
                return;
            }

            if (startDate > endDate) {
                setError("Start date cannot be after end date.");
                return;
            }

            range = {
                startDate,
                endDate
            };
        }

        setAppliedRange(range);
        fetchReports(range);
    };

    // RESET FILTER
    const handleResetFilter = () => {

        setFilterType("all");
        setStartDate("");
        setEndDate("");

        setAppliedRange({});

        fetchReports({});
    };

    // FORMAT CURRENCY
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // FINANCIAL TOTALS
    const totalIncome = monthlyData.reduce(
        (total, item) => total + item.totalIncome,
        0
    );

    const totalExpense = monthlyData.reduce(
        (total, item) => total + item.totalExpense,
        0
    );

    const totalSavings = totalIncome - totalExpense;

    const COLORS = [
        "#2563EB",
        "#7C3AED",
        "#16A34A",
        "#F59E0B",
        "#EF4444",
        "#0891B2",
        "#DB2777"
    ];

    // SUMMARY CARDS
    const summaryCards = [
        {
            title: "Total Income",
            value: formatCurrency(totalIncome),
            icon: <TrendingUpIcon />,
            color: "#16A34A",
            background: "#DCFCE7"
        },
        {
            title: "Total Expenses",
            value: formatCurrency(totalExpense),
            icon: <TrendingDownIcon />,
            color: "#EF4444",
            background: "#FEE2E2"
        },
        {
            title: "Total Savings",
            value: formatCurrency(totalSavings),
            icon: <SavingsIcon />,
            color: "#2563EB",
            background: "#DBEAFE"
        }
    ];

    return (
        <DashboardLayout>

            <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>

                {/* PAGE HEADER */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}
                >

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 3,
                                backgroundColor: "#DBEAFE",
                                color: "#2563EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <AssessmentIcon sx={{ fontSize: 30 }} />
                        </Box>

                        <Box>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="#172033"
                            >
                                Admin Reports
                            </Typography>

                            <Typography color="text.secondary">
                                Overall financial analytics across all users.
                            </Typography>

                        </Box>

                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => fetchReports()}
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            px: 2.5,
                            py: 1.2
                        }}
                    >
                        Refresh Reports
                    </Button>

                </Box>

                {/* DATE FILTER SECTION */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #E5E7EB",
                        mb: 4
                    }}
                >

                    <CardContent sx={{ p: 3 }}>

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={3}
                        >
                            <FilterAltIcon color="primary" />

                            <Typography variant="h6" fontWeight={700}>
                                Filter Reports
                            </Typography>
                        </Stack>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(4, minmax(0, 1fr))"
                                },
                                gap: 2,
                                alignItems: "center"
                            }}
                        >

                            <TextField
                                select
                                fullWidth
                                label="Select Period"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <MenuItem value="all">All Time</MenuItem>
                                <MenuItem value="month">This Month</MenuItem>
                                <MenuItem value="lastMonth">Last Month</MenuItem>
                                <MenuItem value="year">This Year</MenuItem>
                                <MenuItem value="custom">Custom Date Range</MenuItem>
                            </TextField>

                            {filterType === "custom" && (
                                <>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />

                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="End Date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </>
                            )}

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    gridColumn: {
                                        xs: "1",
                                        sm: "1 / -1",
                                        lg: "auto"
                                    }
                                }}
                            >

                                <Button
                                    variant="contained"
                                    onClick={handleApplyFilter}
                                    disabled={loading}
                                    sx={{
                                        flex: 1,
                                        borderRadius: 2,
                                        py: 1.7
                                    }}
                                >
                                    Apply Filter
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleResetFilter}
                                    disabled={loading}
                                    sx={{
                                        flex: 1,
                                        borderRadius: 2,
                                        py: 1.7
                                    }}
                                >
                                    Reset
                                </Button>

                            </Stack>

                        </Box>

                    </CardContent>

                </Card>

                {/* LOADING AND ERROR */}
                {loading ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 300
                        }}
                    >
                        <CircularProgress />
                    </Box>

                ) : error ? (

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Button
                                color="inherit"
                                onClick={() => fetchReports()}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>

                ) : (

                    <>

                        {/* SUMMARY CARDS */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(3, minmax(0, 1fr))"
                                },
                                gap: 3,
                                mb: 4
                            }}
                        >

                            {summaryCards.map((item) => (

                                <Card
                                    key={item.title}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 4,
                                        border: "1px solid #E5E7EB",
                                        height: "100%",
                                        transition: "0.3s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
                                        }
                                    }}
                                >

                                    <CardContent sx={{ p: 3 }}>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 3
                                            }}
                                        >

                                            <Typography
                                                color="text.secondary"
                                                fontWeight={600}
                                            >
                                                {item.title}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 3,
                                                    backgroundColor: item.background,
                                                    color: item.color,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                {item.icon}
                                            </Box>

                                        </Box>

                                        <Typography
                                            variant="h4"
                                            fontWeight={700}
                                            sx={{
                                                color: item.color,
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {item.value}
                                        </Typography>

                                    </CardContent>

                                </Card>

                            ))}

                        </Box>

                        {/* CHARTS */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "minmax(0, 1fr)",
                                    lg: "minmax(0, 1.6fr) minmax(0, 1fr)"
                                },
                                gap: 3,
                                width: "100%"
                            }}
                        >

                            {/* MONTHLY BAR CHART */}
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: "1px solid #E5E7EB",
                                    minWidth: 0
                                }}
                            >

                                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        color="#172033"
                                        mb={1}
                                    >
                                        Monthly Income vs Expenses
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        mb={3}
                                    >
                                        Financial performance over time
                                    </Typography>

                                    {monthlyData.length === 0 ? (

                                        <Typography color="text.secondary">
                                            No monthly financial data available for this period.
                                        </Typography>

                                    ) : (

                                        <Box sx={{ width: "100%", height: 380 }}>

                                            <ResponsiveContainer width="100%" height="100%">

                                                <BarChart
                                                    data={monthlyData}
                                                    margin={{
                                                        top: 10,
                                                        right: 10,
                                                        left: 10,
                                                        bottom: 10
                                                    }}
                                                >

                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        vertical={false}
                                                    />

                                                    <XAxis
                                                        dataKey="monthName"
                                                        tick={{ fontSize: 12 }}
                                                    />

                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickFormatter={(value) =>
                                                            value >= 1000
                                                                ? `${value / 1000}k`
                                                                : value
                                                        }
                                                    />

                                                    <Tooltip
                                                        formatter={(value) =>
                                                            formatCurrency(value)
                                                        }
                                                    />

                                                    <Legend />

                                                    <Bar
                                                        dataKey="totalIncome"
                                                        name="Income"
                                                        fill="#16A34A"
                                                        radius={[6, 6, 0, 0]}
                                                        barSize={35}
                                                    />

                                                    <Bar
                                                        dataKey="totalExpense"
                                                        name="Expenses"
                                                        fill="#EF4444"
                                                        radius={[6, 6, 0, 0]}
                                                        barSize={35}
                                                    />

                                                </BarChart>

                                            </ResponsiveContainer>

                                        </Box>

                                    )}

                                </CardContent>

                            </Card>

                            {/* CATEGORY DOUGHNUT CHART */}
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: "1px solid #E5E7EB",
                                    minWidth: 0
                                }}
                            >

                                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        color="#172033"
                                        mb={1}
                                    >
                                        Expense by Category
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        mb={3}
                                    >
                                        Distribution of user expenses
                                    </Typography>

                                    {categoryData.length === 0 ? (

                                        <Typography color="text.secondary">
                                            No expense data available for this period.
                                        </Typography>

                                    ) : (

                                        <Box sx={{ width: "100%", height: 380 }}>

                                            <ResponsiveContainer width="100%" height="100%">

                                                <PieChart>

                                                    <Pie
                                                        data={categoryData}
                                                        dataKey="totalExpense"
                                                        nameKey="categoryName"
                                                        cx="50%"
                                                        cy="45%"
                                                        outerRadius="75%"
                                                        innerRadius="48%"
                                                        paddingAngle={3}
                                                    >

                                                        {categoryData.map((item, index) => (

                                                            <Cell
                                                                key={item.categoryId || index}
                                                                fill={COLORS[index % COLORS.length]}
                                                            />

                                                        ))}

                                                    </Pie>

                                                    <Tooltip
                                                        formatter={(value) =>
                                                            formatCurrency(value)
                                                        }
                                                    />

                                                    <Legend
                                                        verticalAlign="bottom"
                                                        height={45}
                                                        wrapperStyle={{
                                                            fontSize: 12
                                                        }}
                                                    />

                                                </PieChart>

                                            </ResponsiveContainer>

                                        </Box>

                                    )}

                                </CardContent>

                            </Card>

                        </Box>

                    </>

                )}

            </Box>

        </DashboardLayout>
    );
}

export default AdminReports;