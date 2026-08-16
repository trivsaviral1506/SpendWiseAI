const Transaction = require("../models/Transaction");

const analyzeByCategory = require("../dsa/hashMapAnalyzer");
const analyzeIncomeByCategory = require("../dsa/incomeAnalyzer");
const getTopExpenses = require("../dsa/maxHeapAnalyzer");
const getRecentActivity = require("../dsa/recentActivity");
const analyzeMonthly = require("../dsa/monthlyAnalyzer");

// ==========================================
// CATEGORY SUMMARY
// ==========================================

const getCategorySummary = async (req, res) => {
    try {

        const transactions = await Transaction.find({
            user: req.user.userId
        }).lean();


        // Expense analytics
        const expenseSummary =
            analyzeByCategory(transactions);


        // Income analytics
        const incomeSummary =
            analyzeIncomeByCategory(transactions);


        return res.status(200).json({

            success: true,

            // Overall totals
            totalIncome:
                expenseSummary.totalIncome,

            totalExpense:
                expenseSummary.totalExpense,

            balance:
                expenseSummary.balance,

            // Expense categories
            categorySummary:
                expenseSummary.categorySummary,

            // Income categories
            incomeSummary:
                incomeSummary.incomeSummary

        });

    } catch (error) {

        console.error(
            "CATEGORY ANALYTICS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to build category summary",

            error:
                error.message

        });

    }
};// ==========================================
// MONTHLY ANALYTICS
// ==========================================

const getMonthlyAnalytics = async (req, res) => {
    try {

        const transactions =
            await Transaction.find({
                user: req.user.userId
            }).lean();


        const monthlySummary =
            analyzeMonthly(transactions);


        return res.status(200).json({

            success: true,

            monthlySummary

        });

    } catch (error) {

        console.error(
            "MONTHLY ANALYTICS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to generate monthly analytics",

            error:
                error.message

        });

    }
};


// ==========================================
// TOP EXPENSES
// ==========================================

const getTopExpensesAnalytics = async (
    req,
    res
) => {

    try {

        const transactions =
            await Transaction.find({
                user: req.user.userId
            }).lean();


        const k =
            Number(req.query.k) || 5;


        if (k <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "k must be greater than 0"

            });

        }


        const topExpenses =
            getTopExpenses(
                transactions,
                k
            );


        return res.status(200).json({

            success: true,

            count:
                topExpenses.length,

            topExpenses

        });

    } catch (error) {

        console.error(
            "TOP EXPENSES ANALYTICS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to generate top expenses",

            error:
                error.message

        });

    }

};


// ==========================================
// RECENT ACTIVITY
// ==========================================

const getRecentActivityAnalytics = async (
    req,
    res
) => {

    try {

        const transactions =
            await Transaction.find({
                user: req.user.userId
            })
                .sort({
                    date: -1
                })
                .lean();


        const limit =
            Number(req.query.limit) || 10;


        if (limit <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "limit must be greater than 0"

            });

        }


        const activities =
            getRecentActivity(
                transactions,
                limit
            );


        return res.status(200).json({

            success: true,

            count:
                activities.length,

            activities

        });

    } catch (error) {

        console.error(
            "RECENT ACTIVITY ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch recent activity",

            error:
                error.message

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getCategorySummary,

    getMonthlyAnalytics,

    getTopExpensesAnalytics,

    getRecentActivityAnalytics

};