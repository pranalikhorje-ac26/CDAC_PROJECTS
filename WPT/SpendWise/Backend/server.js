const express = require("express"); // load the installed express packges
const cors = require("cors");//cross origin resourse sharing
const dotenv = require("dotenv");

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middlewares/authMiddleware");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const savingsGoalRoutes = require("./routes/savingsGoalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");



dotenv.config(); // load env variables

const app = express(); //call express to create application

//registers Middlewares
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Category Routes
app.use("/api/categories", categoryRoutes);

//transaction routes
app.use("/api/transactions", transactionRoutes);

//budget routes
app.use("/api/budgets",budgetRoutes);

//saving routes
app.use("/api/savings-goals", savingsGoalRoutes);

//dashboard routes
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/contact", contactRoutes);



app.use("/api/admin",adminRoutes);


// Home API
app.get("/", (req, res) => {
res.status(200).send("Welcome to SpendWise API!");
});

// Health Check API
app.get("/api/health", (req, res) => {
res.status(200).json({
success: true,
message: "SpendWise Backend is running successfully!"
});
});

// Protected Test API
app.get("/api/protected", verifyToken, (req, res) => {
res.status(200).json({
success: true,
message: "You accessed a protected API successfully!",
user: req.user
});
});

// Start Server
const startServer = async () => {
try {
await connectDB();


    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`SpendWise Server running on port ${PORT}`);
        console.log(`Server URL: http://localhost:${PORT}`);
    });

} catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
}


};

startServer();
