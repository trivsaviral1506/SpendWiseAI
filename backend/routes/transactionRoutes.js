const express = require("express");

const router = express.Router();

const {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");
const validateTransaction = require("../middleware/transactionValidation");

// CREATE
router.post(
    "/",
    authMiddleware,
    validateTransaction,
    createTransaction
);

// GET ALL
router.get(
    "/",
    authMiddleware,
    getTransactions
);

// UPDATE
router.put(
    "/:id",
    authMiddleware,
    validateTransaction,
    updateTransaction
);

// DELETE
router.delete(
    "/:id",
    authMiddleware,
    deleteTransaction
);

module.exports = router;