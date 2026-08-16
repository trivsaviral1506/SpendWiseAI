import { useEffect, useState } from "react";
import api from "../services/api";

interface Transaction {
    _id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    description?: string;
    date: string;
}

function Transactions() {

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState<string | null>(null);


    // ==========================================
    // FORM FIELDS
    // ==========================================

    const [title, setTitle] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [type, setType] =
        useState<"income" | "expense">("expense");

    const [description, setDescription] =
        useState("");

    const [date, setDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );


    // ==========================================
    // SEARCH & FILTERS
    // ==========================================

    const [search, setSearch] =
        useState("");

    const [filterType, setFilterType] =
        useState("");

    const [filterCategory, setFilterCategory] =
        useState("");


    // ==========================================
    // EXPENSE CATEGORIES
    // ==========================================

    const expenseCategories = [
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Bills",
        "Health",
        "Education",
        "Other",
    ];


    // ==========================================
    // INCOME CATEGORIES
    // ==========================================

    const incomeCategories = [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Bonus",
        "Gift",
        "Refund",
        "Other",
    ];


    // ==========================================
    // FORM CATEGORIES
    // ==========================================

    const categories =
        type === "income"
            ? incomeCategories
            : expenseCategories;


    // ==========================================
    // ALL CATEGORIES FOR FILTER
    // ==========================================

    const allCategories = [
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Bills",
        "Health",
        "Education",
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Bonus",
        "Gift",
        "Refund",
        "Other",
    ];


    // ==========================================
    // LOAD TRANSACTIONS
    // ==========================================

    const loadTransactions = async () => {

        try {

            setError("");

            const params =
                new URLSearchParams();


            if (filterType) {

                params.append(
                    "type",
                    filterType
                );

            }


            if (filterCategory) {

                params.append(
                    "category",
                    filterCategory
                );

            }


            const url =
                params.toString()
                    ? `/transactions?${params.toString()}`
                    : "/transactions";


            const response =
                await api.get(url);


            const loadedTransactions =
                response.data.transactions || [];


            // Newest first
            loadedTransactions.sort(
                (
                    a: Transaction,
                    b: Transaction
                ) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
            );


            setTransactions(
                loadedTransactions
            );

        } catch (err: any) {

            setError(
                err.response?.data?.message ||
                "Failed to load transactions"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD WHEN FILTER CHANGES
    // ==========================================

    useEffect(() => {

        loadTransactions();

    }, [filterType, filterCategory]);


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setTitle("");

        setAmount("");

        setCategory("");

        setType("expense");

        setDescription("");

        setDate(
            new Date()
                .toISOString()
                .split("T")[0]
        );

        setEditingId(null);

        setShowForm(false);

    };


    // ==========================================
    // SAVE / UPDATE TRANSACTION
    // ==========================================

    const saveTransaction = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setError("");


            // ======================================
            // BASIC VALIDATION
            // ======================================

            if (!title.trim()) {

                setError(
                    "Transaction title is required."
                );

                return;

            }


            if (
                !amount ||
                Number(amount) <= 0
            ) {

                setError(
                    "Amount must be greater than 0."
                );

                return;

            }


            if (!category) {

                setError(
                    "Please select a category."
                );

                return;

            }


            if (!date) {

                setError(
                    "Please select a date."
                );

                return;

            }


            // ======================================
            // FUTURE DATE VALIDATION
            // ======================================

            const selectedDate =
                new Date(date);

            const today =
                new Date();

            today.setHours(
                23,
                59,
                59,
                999
            );


            if (
                selectedDate > today
            ) {

                setError(
                    "Future dates are not allowed."
                );

                return;

            }


            // ======================================
            // DATA
            // ======================================

            const data = {

                title:
                    title.trim(),

                amount:
                    Number(amount),

                category,

                type,

                description:
                    description.trim(),

                date

            };


            // ======================================
            // UPDATE
            // ======================================

            if (editingId) {

                await api.put(
                    `/transactions/${editingId}`,
                    data
                );

            }


            // ======================================
            // CREATE
            // ======================================

            else {

                await api.post(
                    "/transactions",
                    data
                );

            }


            // ======================================
            // RESET
            // ======================================

            resetForm();


            // ======================================
            // RELOAD
            // ======================================

            await loadTransactions();


        } catch (err: any) {

            console.error(
                "TRANSACTION ERROR:",
                err.response?.data || err
            );


            setError(
                err.response?.data?.message ||
                "Failed to save transaction"
            );

        }

    };


    // ==========================================
    // START EDIT
    // ==========================================

    const startEdit = (
        transaction: Transaction
    ) => {

        setEditingId(
            transaction._id
        );

        setTitle(
            transaction.title
        );

        setAmount(
            String(transaction.amount)
        );

        setCategory(
            transaction.category
        );

        setType(
            transaction.type
        );

        setDescription(
            transaction.description || ""
        );

        setDate(
            new Date(transaction.date)
                .toISOString()
                .split("T")[0]
        );

        setShowForm(true);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // DELETE TRANSACTION
    // ==========================================

    const deleteTransaction = async (
        id: string
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this transaction?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");

            await api.delete(
                `/transactions/${id}`
            );

            await loadTransactions();

        } catch (err: any) {

            setError(
                err.response?.data?.message ||
                "Failed to delete transaction"
            );

        }

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredTransactions =
        transactions.filter(
            (transaction) => {

                const query =
                    search
                        .toLowerCase()
                        .trim();


                if (!query) {

                    return true;

                }


                return (

                    transaction.title
                        .toLowerCase()
                        .includes(query)

                    ||

                    transaction.category
                        .toLowerCase()
                        .includes(query)

                    ||

                    transaction.description
                        ?.toLowerCase()
                        .includes(query)

                );

            }
        );


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="loading">
                Loading transactions...
            </div>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="transactions-page">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="transactions-header">

                <div>

                    <h1>
                        Transactions
                    </h1>

                    <p>
                        Manage your income and expenses.
                    </p>

                </div>


                <div className="transaction-actions">

                    <button
                        onClick={() => {

                            if (showForm) {

                                resetForm();

                            } else {

                                setShowForm(true);

                            }

                        }}
                    >
                        {showForm
                            ? "Close"
                            : "+ Add Transaction"}
                    </button>

                </div>

            </div>


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* =====================================
                ADD / EDIT FORM
            ===================================== */}

            {showForm && (

                <form
                    className="transaction-form"
                    onSubmit={saveTransaction}
                >

                    <h2>
                        {editingId
                            ? "Edit Transaction"
                            : "Add Transaction"}
                    </h2>


                    {/* TITLE */}

                    <input
                        type="text"
                        placeholder="Transaction title"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        required
                    />


                    {/* AMOUNT */}

                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(
                                e.target.value
                            )
                        }
                        min="0.01"
                        step="0.01"
                        required
                    />


                    {/* TYPE */}

                    <select
                        value={type}
                        onChange={(e) => {

                            const newType =
                                e.target.value as
                                | "income"
                                | "expense";

                            setType(newType);

                            // Clear category when
                            // transaction type changes
                            setCategory("");

                        }}
                        required
                    >

                        <option value="expense">
                            Expense
                        </option>

                        <option value="income">
                            Income
                        </option>

                    </select>


                    {/* CATEGORY */}

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select Category
                        </option>

                        {categories.map(
                            (item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>

                            )
                        )}

                    </select>


                    {/* DATE */}

                    <input
                        type="date"
                        value={date}
                        max={
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        onChange={(e) =>
                            setDate(
                                e.target.value
                            )
                        }
                        required
                    />


                    {/* DESCRIPTION */}

                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />


                    {/* BUTTONS */}

                    <div>

                        <button
                            type="submit"
                        >
                            {editingId
                                ? "Update Transaction"
                                : "Save Transaction"}
                        </button>


                        {editingId && (

                            <button
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            )}


            {/* =====================================
                SEARCH + FILTERS
            ===================================== */}

            <div className="transaction-filters">


                {/* SEARCH */}

                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />


                {/* TYPE FILTER */}

                <select
                    value={filterType}
                    onChange={(e) =>
                        setFilterType(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Types
                    </option>

                    <option value="expense">
                        Expenses
                    </option>

                    <option value="income">
                        Income
                    </option>

                </select>


                {/* CATEGORY FILTER */}

                <select
                    value={filterCategory}
                    onChange={(e) =>
                        setFilterCategory(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Categories
                    </option>

                    {allCategories.map(
                        (item) => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>

                        )
                    )}

                </select>


                {/* CLEAR FILTERS */}

                {(search ||
                    filterType ||
                    filterCategory) && (

                    <button
                        type="button"
                        onClick={() => {

                            setSearch("");

                            setFilterType("");

                            setFilterCategory("");

                        }}
                    >
                        Clear
                    </button>

                )}

            </div>


            {/* =====================================
                TRANSACTION LIST
            ===================================== */}

            <div className="transactions-list">

                {filteredTransactions.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            💳
                        </div>

                        <strong>
                            No transactions found
                        </strong>

                        <span>
                            Add a transaction to start
                            tracking your finances.
                        </span>

                    </div>

                ) : (

                    filteredTransactions.map(
                        (transaction) => (

                            <div
                                className="transaction-card"
                                key={transaction._id}
                            >

                                {/* LEFT */}

                                <div>

                                    <h3>
                                        {transaction.title}
                                    </h3>

                                    <p>

                                        {transaction.category}

                                        {" • "}

                                        {transaction.type ===
                                        "expense"
                                            ? "Expense"
                                            : "Income"}

                                    </p>


                                    {transaction.description && (

                                        <small>
                                            {
                                                transaction.description
                                            }
                                        </small>

                                    )}

                                </div>


                                {/* RIGHT */}

                                <div className="transaction-right">

                                    <strong
                                        className={
                                            transaction.type ===
                                            "expense"
                                                ? "expense-text"
                                                : "income-text"
                                        }
                                    >

                                        {transaction.type ===
                                        "expense"
                                            ? "-"
                                            : "+"}

                                        ₹

                                        {Number(
                                            transaction.amount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </strong>


                                    <span>

                                        {new Date(
                                            transaction.date
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}

                                    </span>


                                    {/* EDIT */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            startEdit(
                                                transaction
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    {/* DELETE */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteTransaction(
                                                transaction._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

        </div>

    );

}

export default Transactions;