const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// BASIC ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "SpendWise AI Backend is running 🚀"
    });
});


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);


// ==========================================
// GLOBAL ERROR HANDLER
// IMPORTANT: KEEP THIS AFTER ALL ROUTES
// ==========================================

app.use(errorMiddleware);


// ==========================================
// DATABASE
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log(
            "MongoDB connection failed:",
            error.message
        );
    });


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});