const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            type,
            description,
            date
        } = req.body;

        const transaction = await Transaction.create({
            user: req.user.userId,
            title,
            amount,
            category,
            type,
            description,
            date
        });

        res.status(201).json({
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create transaction",
            error: error.message
        });
    }
};
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            user: req.user.userId
        }).sort({ date: -1 });

        res.status(200).json({
            count: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
};
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction updated successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update transaction",
            error: error.message
        });
    }
};
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete transaction",
            error: error.message
        });
    }
};
module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};