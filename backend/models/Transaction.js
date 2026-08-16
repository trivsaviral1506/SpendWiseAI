const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

       category: {
    type: String,
    required: true,
    enum: [
        // Expense categories
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Bills",
        "Health",
        "Education",

        // Income categories
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Bonus",
        "Gift",
        "Refund",

        // Common
        "Other"
    ]
},
        type: {
            type: String,
            enum: ["income", "expense"],
            default: "expense"
        },

        description: {
            type: String,
            trim: true
        },

        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);