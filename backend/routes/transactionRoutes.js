const express = require("express");

const router = express.Router();

const {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");
router.post(
    "/",
    authMiddleware,
    createTransaction
);

router.get(
    "/",
    authMiddleware,
    getTransactions
);
router.put(
    "/:id",
    authMiddleware,
    updateTransaction
);
router.delete(
    "/:id",
    authMiddleware,
    deleteTransaction
);
module.exports = router;