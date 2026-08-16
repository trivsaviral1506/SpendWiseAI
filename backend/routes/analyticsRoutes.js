const express = require("express");

const router = express.Router();

const {
    getCategorySummary,
    getMonthlyAnalytics,
    getTopExpensesAnalytics,
    getRecentActivityAnalytics
} = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
    "/category-summary",
    authMiddleware,
    getCategorySummary
);
router.get(
    "/monthly",
    authMiddleware,
    getMonthlyAnalytics
);
router.get(
    "/top-expenses",
    authMiddleware,
    getTopExpensesAnalytics
);

router.get(
    "/recent-activity",
    authMiddleware,
    getRecentActivityAnalytics
);

module.exports = router;