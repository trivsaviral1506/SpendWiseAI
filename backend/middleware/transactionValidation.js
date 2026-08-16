// ==========================================
// TRANSACTION VALIDATION MIDDLEWARE
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
// VALIDATE TRANSACTION
// ==========================================

const validateTransaction = (req, res, next) => {

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
            date
        } = req.body;


        // ======================================
        // REQUIRED FIELDS
        // ======================================

        if (!title || !category) {

            return res.status(400).json({
                success: false,
                message:
                    "Title and category are required"
            });

        }


        if (amount === undefined || amount === null) {

            return res.status(400).json({
                success: false,
                message:
                    "Amount is required"
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

        const allowedCategories =
            transactionType === "income"
                ? incomeCategories
                : expenseCategories;


        const normalizedCategory =
            allowedCategories.find(
                (item) =>
                    item.toLowerCase() ===
                    category
                        .trim()
                        .toLowerCase()
            );


        if (!normalizedCategory) {

            return res.status(400).json({
                success: false,
                message:
                    `Invalid category for ${transactionType} transaction`
            });

        }


        // ======================================
        // FUTURE DATE
        // ======================================

        if (date) {

            const transactionDate =
                new Date(date);


            if (
                Number.isNaN(
                    transactionDate.getTime()
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid transaction date"
                });

            }


            const today = new Date();

            today.setHours(
                23,
                59,
                59,
                999
            );


            if (
                transactionDate > today
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Future dates are not allowed"
                });

            }

        }


        // ======================================
        // EVERYTHING IS VALID
        // ======================================

        next();


    } catch (error) {

        console.error(
            "TRANSACTION VALIDATION ERROR:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                "Invalid transaction data"
        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports =
    validateTransaction;