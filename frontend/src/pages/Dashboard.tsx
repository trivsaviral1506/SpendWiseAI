import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import StatCard from "../components/StatCard";
import AIInsights from "../components/AIInsights";

interface Transaction {
    _id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    description?: string;
    date: string;
}

interface CategorySummary {
    category: string;
    total: number;
    count: number;
}

function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [transactionsResponse, categoryResponse] =
                    await Promise.all([
                        api.get("/transactions"),
                        api.get("/analytics/category-summary"),
                    ]);

                setTransactions(
                    transactionsResponse.data.transactions || []
                );

                setCategorySummary(
                    categoryResponse.data.categorySummary || []
                );
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                Loading your financial dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-page">
                {error}
            </div>
        );
    }

    // =========================
    // FINANCIAL CALCULATIONS
    // =========================

    const totalIncome = transactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const totalExpense = transactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const balance = totalIncome - totalExpense;

    // =========================
    // FORMAT MONEY
    // =========================

    const formatMoney = (amount: number) => {
        const absoluteAmount = Math.abs(amount).toLocaleString("en-IN");

        if (amount < 0) {
            return `-₹${absoluteAmount}`;
        }

        return `₹${absoluteAmount}`;
    };

    // =========================
    // RECENT TRANSACTIONS
    // =========================

    const recentTransactions = [...transactions]
        .sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        )
        .slice(0, 5);

    return (
        <div className="dashboard">

            {/* PAGE HEADER */}

            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Here's your financial overview.
                    </p>
                </div>

                <Link
                    to="/transactions"
                    className="primary-action"
                >
                    + Add Transaction
                </Link>
            </div>


            {/* STAT CARDS */}

            <section className="stats-grid">

                <StatCard
                    title="Total Balance"
                    value={formatMoney(balance)}
                    type="balance"
                />

                <StatCard
                    title="Total Income"
                    value={formatMoney(totalIncome)}
                    type="income"
                />

                <StatCard
                    title="Total Expenses"
                    value={formatMoney(totalExpense)}
                    type="expense"
                />

                <StatCard
                    title="Transactions"
                    value={transactions.length.toString()}
                    type="transactions"
                />

            </section>


            {/* AI INSIGHTS */}

            <AIInsights
                categorySummary={categorySummary}
            />


            {/* DASHBOARD CONTENT */}

            <section className="dashboard-grid">

                {/* SPENDING BY CATEGORY */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>Spending by Category</h2>

                            <p>
                                Where your money is going
                            </p>
                        </div>

                        <Link
                            to="/analytics"
                            className="view-link"
                        >
                            View Analytics →
                        </Link>

                    </div>


                    {categorySummary.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📊
                            </div>

                            <strong>
                                No spending data yet
                            </strong>

                            <span>
                                Add an expense to see your spending breakdown.
                            </span>

                        </div>

                    ) : (

                        <div className="category-list">

                            {categorySummary
                                .slice(0, 5)
                                .map((item) => (

                                    <div
                                        className="category-item"
                                        key={item.category}
                                    >

                                        <div>
                                            <strong>
                                                {item.category}
                                            </strong>

                                            <span>
                                                {item.count} transaction
                                                {item.count !== 1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        </div>

                                        <strong>
                                            {formatMoney(item.total)}
                                        </strong>

                                    </div>

                                ))}

                        </div>

                    )}

                </div>


                {/* RECENT TRANSACTIONS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>Recent Transactions</h2>

                            <p>
                                Your latest financial activity
                            </p>
                        </div>

                        <Link
                            to="/transactions"
                            className="view-link"
                        >
                            View All →
                        </Link>

                    </div>


                    {recentTransactions.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                💳
                            </div>

                            <strong>
                                No transactions yet
                            </strong>

                            <span>
                                Start tracking your income and expenses.
                            </span>

                            <Link
                                to="/transactions"
                                className="small-action"
                            >
                                Add Transaction
                            </Link>

                        </div>

                    ) : (

                        <div className="transaction-list">

                            {recentTransactions.map(
                                (transaction) => (

                                    <div
                                        className="transaction-item"
                                        key={transaction._id}
                                    >

                                        <div className="transaction-left">

                                            <div
                                                className={
                                                    transaction.type ===
                                                    "expense"
                                                        ? "transaction-icon expense-icon"
                                                        : "transaction-icon income-icon"
                                                }
                                            >
                                                {transaction.type ===
                                                "expense"
                                                    ? "↓"
                                                    : "↑"}
                                            </div>

                                            <div>

                                                <strong>
                                                    {transaction.title}
                                                </strong>

                                                <span>
                                                    {transaction.category}
                                                    {" • "}
                                                    {new Date(
                                                        transaction.date
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>

                                            </div>

                                        </div>


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
                                            ).toLocaleString("en-IN")}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>

        </div>
    );
}

export default Dashboard;