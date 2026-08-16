const Transaction = require("../models/Transaction");

// ==========================================
// CATEGORY LISTS
// ==========================================

const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Other"
];

const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Bonus",
    "Gift",
    "Refund",
    "Other"
];


// ==========================================
// GET ALLOWED CATEGORIES
// ==========================================

const getAllowedCategories = (type) => {
    return type === "income"
        ? incomeCategories
        : expenseCategories;
};


// ==========================================
// NORMALIZE CATEGORY
// ==========================================

const normalizeCategory = (category, type) => {

    if (!category) {
        return null;
    }

    const allowedCategories =
        getAllowedCategories(type);

    return allowedCategories.find(
        (item) =>
            item.toLowerCase() ===
            category.trim().toLowerCase()
    ) || null;
};


// ==========================================
// CHECK FUTURE DATE
// ==========================================

const isFutureDate = (date) => {

    const transactionDate = new Date(date);

    const today = new Date();

    today.setHours(
        23,
        59,
        59,
        999
    );

    return transactionDate > today;
};


// ==========================================
// CREATE TRANSACTION
// ==========================================

const createTransaction = async (req, res) => {

    try {

        // Check request body
        if (!req.body) {

            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });

        }


        const {
            title,
            amount,
            category,
            type,
            description,
            date
        } = req.body;


        // ======================================
        // VALIDATE REQUIRED FIELDS
        // ======================================

        if (
            !title ||
            amount === undefined ||
            !category
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, amount and category are required"
            });

        }


        // ======================================
        // VALIDATE TYPE
        // ======================================

        const transactionType =
            type || "expense";


        if (
            transactionType !== "income" &&
            transactionType !== "expense"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Transaction type must be income or expense"
            });

        }


        // ======================================
        // VALIDATE AMOUNT
        // ======================================

        const numericAmount =
            Number(amount);


        if (
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Amount must be greater than 0"
            });

        }


        // ======================================
        // NORMALIZE CATEGORY
        // ======================================

        const normalizedCategory =
            normalizeCategory(
                category,
                transactionType
            );


        if (!normalizedCategory) {

            return res.status(400).json({
                success: false,
                message:
                    `Invalid category for ${transactionType} transaction`
            });

        }


        // ======================================
        // DATE
        // ======================================

        const transactionDate =
            date || new Date();


        if (isFutureDate(transactionDate)) {

            return res.status(400).json({
                success: false,
                message:
                    "Future dates are not allowed"
            });

        }


        // ======================================
        // CREATE TRANSACTION
        // ======================================

        const transaction =
            await Transaction.create({

                user: req.user.userId,

                title: title.trim(),

                amount: numericAmount,

                category:
                    normalizedCategory,

                type:
                    transactionType,

                description:
                    description
                        ? description.trim()
                        : "",

                date:
                    transactionDate

            });


        return res.status(201).json({

            success: true,

            message:
                "Transaction created successfully",

            transaction

        });


    } catch (error) {

        console.error(
            "CREATE TRANSACTION ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create transaction"

        });

    }

};


// ==========================================
// GET TRANSACTIONS
// ==========================================

const getTransactions = async (req, res) => {

    try {

        const {
            type,
            category
        } = req.query;


        // ======================================
        // BASE FILTER
        // ======================================

        const filter = {
            user: req.user.userId
        };


        // ======================================
        // TYPE FILTER
        // ======================================

        if (type) {

            if (
                type !== "income" &&
                type !== "expense"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid transaction type"
                });

            }

            filter.type = type;

        }


        // ======================================
        // CATEGORY FILTER
        // ======================================

        if (category) {

            const categoryType =
                type || "expense";


            const normalizedCategory =
                normalizeCategory(
                    category,
                    categoryType
                );


            if (normalizedCategory) {

                filter.category =
                    normalizedCategory;

            }

        }


        // ======================================
        // GET TRANSACTIONS
        // ======================================

        const transactions =
            await Transaction
                .find(filter)
                .sort({
                    date: -1
                });


        return res.status(200).json({

            success: true,

            transactions

        });


    } catch (error) {

        console.error(
            "GET TRANSACTIONS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to load transactions"

        });

    }

};


// ==========================================
// UPDATE TRANSACTION
// ==========================================

const updateTransaction = async (
    req,
    res
) => {

    try {

        const {
            title,
            amount,
            category,
            type,
            description,
            date
        } = req.body;


        // ======================================
        // VALIDATE REQUIRED FIELDS
        // ======================================

        if (
            !title ||
            amount === undefined ||
            !category
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, amount and category are required"
            });

        }


        // ======================================
        // TYPE
        // ======================================

        const transactionType =
            type || "expense";


        if (
            transactionType !== "income" &&
            transactionType !== "expense"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Transaction type must be income or expense"
            });

        }


        // ======================================
        // AMOUNT
        // ======================================

        const numericAmount =
            Number(amount);


        if (
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Amount must be greater than 0"
            });

        }


        // ======================================
        // CATEGORY
        // ======================================

        const normalizedCategory =
            normalizeCategory(
                category,
                transactionType
            );


        if (!normalizedCategory) {

            return res.status(400).json({
                success: false,
                message:
                    `Invalid category for ${transactionType} transaction`
            });

        }


        // ======================================
        // DATE
        // ======================================

        const transactionDate =
            date || new Date();


        if (isFutureDate(transactionDate)) {

            return res.status(400).json({
                success: false,
                message:
                    "Future dates are not allowed"
            });

        }


        // ======================================
        // UPDATE
        // ======================================

        const transaction =
            await Transaction.findOneAndUpdate(

                {
                    _id: req.params.id,

                    user: req.user.userId
                },

                {

                    title:
                        title.trim(),

                    amount:
                        numericAmount,

                    category:
                        normalizedCategory,

                    type:
                        transactionType,

                    description:
                        description
                            ? description.trim()
                            : "",

                    date:
                        transactionDate

                },

                {
                    new: true,

                    runValidators: true
                }

            );


        // ======================================
        // NOT FOUND
        // ======================================

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message:
                    "Transaction not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Transaction updated successfully",

            transaction

        });


    } catch (error) {

        console.error(
            "UPDATE TRANSACTION ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update transaction"

        });

    }

};


// ==========================================
// DELETE TRANSACTION
// ==========================================

const deleteTransaction = async (
    req,
    res
) => {

    try {

        const transaction =
            await Transaction.findOneAndDelete({

                _id:
                    req.params.id,

                user:
                    req.user.userId

            });


        // ======================================
        // NOT FOUND
        // ======================================

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message:
                    "Transaction not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Transaction deleted successfully",

            transaction

        });


    } catch (error) {

        console.error(
            "DELETE TRANSACTION ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete transaction"

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    createTransaction,

    getTransactions,

    updateTransaction,

    deleteTransaction

};