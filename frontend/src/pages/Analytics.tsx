import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// ==========================================
// TYPES
// ==========================================

interface CategorySummary {
    category: string;
    total: number;
    count: number;
}

interface IncomeSummary {
    category: string;
    total: number;
    count: number;
}

interface TopExpense {
    title: string;
    amount: number;
    category: string;
    date: string;
}

interface RecentActivity {
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string;
}

interface MonthlySummary {
    month: string;
    income: number;
    expenses: number;
    balance: number;
    savingsRate: number;
}
// ==========================================
// ANALYTICS
// ==========================================

function Analytics() {

    const [categorySummary, setCategorySummary] =
        useState<CategorySummary[]>([]);

    const [incomeSummary, setIncomeSummary] =
        useState<IncomeSummary[]>([]);

    const [topExpenses, setTopExpenses] =
        useState<TopExpense[]>([]);

    const [recentActivity, setRecentActivity] =
        useState<RecentActivity[]>([]);

    const [transactions, setTransactions] =
        useState<RecentActivity[]>([]);
        
        const [monthlySummary, setMonthlySummary] =
    useState<MonthlySummary[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD ANALYTICS DATA
    // ==========================================

    useEffect(() => {

        const loadAnalytics = async () => {

            try {

                const [
    categoryResponse,
    topExpenseResponse,
    recentResponse,
    transactionsResponse,
    monthlyResponse
] = await Promise.all([

    api.get(
        "/analytics/category-summary"
    ),

    api.get(
        "/analytics/top-expenses"
    ),

    api.get(
        "/analytics/recent-activity?limit=5"
    ),

    api.get(
        "/transactions"
    ),

    api.get(
        "/analytics/monthly"
    )

]);


                // Expense categories

                setCategorySummary(
                    categoryResponse.data
                        .categorySummary || []
                );


                // Income sources

                setIncomeSummary(
                    categoryResponse.data
                        .incomeSummary || []
                );


                // Top expenses

                setTopExpenses(
                    topExpenseResponse.data
                        .topExpenses ||
                    topExpenseResponse.data
                        .expenses ||
                    []
                );


                // Recent activity

                setRecentActivity(
                    recentResponse.data
                        .activities || []
                );


                // All transactions

                setTransactions(
                    transactionsResponse.data
                        .transactions || []
                );

setMonthlySummary(
    monthlyResponse.data.monthlySummary || []
);
            } catch (err: any) {

                console.error(
                    "ANALYTICS ERROR:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load analytics"
                );

            } finally {

                setLoading(false);

            }

        };


        loadAnalytics();

    }, []);


    // ==========================================
    // TOTAL SPENDING
    // ==========================================

    const totalSpending = useMemo(() => {

        return categorySummary.reduce(
            (sum, item) =>
                sum + Number(item.total),
            0
        );

    }, [categorySummary]);


    // ==========================================
    // TOTAL INCOME
    // ==========================================

    const totalIncome = useMemo(() => {

        return transactions
            .filter(
                (transaction) =>
                    transaction.type === "income"
            )
            .reduce(
                (sum, transaction) =>
                    sum + Number(transaction.amount),
                0
            );

    }, [transactions]);


    // ==========================================
    // TOTAL EXPENSES
    // ==========================================

    const totalExpenses = useMemo(() => {

        return transactions
            .filter(
                (transaction) =>
                    transaction.type === "expense"
            )
            .reduce(
                (sum, transaction) =>
                    sum + Number(transaction.amount),
                0
            );

    }, [transactions]);


    // ==========================================
    // BALANCE
    // ==========================================

    const balance =
        totalIncome - totalExpenses;


    // ==========================================
    // TOP CATEGORY
    // ==========================================

    const topCategory = useMemo(() => {

        if (categorySummary.length === 0) {
            return null;
        }

        return [...categorySummary].sort(
            (a, b) =>
                Number(b.total) -
                Number(a.total)
        )[0];

    }, [categorySummary]);


    // ==========================================
    // TOTAL TRANSACTIONS
    // ==========================================

    const totalTransactions = useMemo(() => {

        return transactions.length;

    }, [transactions]);


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatMoney = (amount: number) => {

        return `₹${Math.abs(amount).toLocaleString(
            "en-IN"
        )}`;

    };


    // ==========================================
    // CATEGORY PERCENTAGE
    // ==========================================

    const getPercentage = (amount: number) => {

        if (totalSpending === 0) {
            return 0;
        }

        return (
            (Number(amount) /
                totalSpending) *
            100
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="loading">
                Loading your analytics...
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="error-page">
                {error}
            </div>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="analytics-page">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="analytics-header">

                <div>

                    <h1>
                        Analytics
                    </h1>

                    <p>
                        Understand where your money
                        is going.
                    </p>

                </div>


                <Link
                    to="/transactions"
                    className="analytics-add-btn"
                >
                    + Add Transaction
                </Link>

            </div>


            {/* =====================================
                SUMMARY CARDS
            ===================================== */}

            <section className="analytics-summary">


                {/* TOTAL SPENDING */}

                <div className="analytics-stat-card">

                    <div className="analytics-stat-icon spending">
                        ₹
                    </div>

                    <div>

                        <span>
                            Total Spending
                        </span>

                        <strong>
                            {formatMoney(
                                totalSpending
                            )}
                        </strong>

                        <small>
                            Across all expense
                            categories
                        </small>

                    </div>

                </div>


                {/* TOP CATEGORY */}

                <div className="analytics-stat-card">

                    <div className="analytics-stat-icon category">
                        🏷
                    </div>

                    <div>

                        <span>
                            Top Category
                        </span>

                        <strong>
                            {topCategory
                                ? topCategory.category
                                : "No data"}
                        </strong>

                        <small>
                            {topCategory
                                ? formatMoney(
                                    topCategory.total
                                )
                                : "Start adding expenses"}
                        </small>

                    </div>

                </div>


                {/* TRANSACTIONS */}

                <div className="analytics-stat-card">

                    <div className="analytics-stat-icon count">
                        #
                    </div>

                    <div>

                        <span>
                            Transactions
                        </span>

                        <strong>
                            {totalTransactions}
                        </strong>

                        <small>
                            Across{" "}
                            {categorySummary.length}{" "}
                            {categorySummary.length === 1
                                ? "category"
                                : "categories"}
                        </small>

                    </div>

                </div>

            </section>


            {/* =====================================
                BALANCE SUMMARY
            ===================================== */}

            <section className="analytics-summary">


                {/* BALANCE */}

                <div className="analytics-stat-card">

                    <div className="analytics-stat-icon balance">
                        ₹
                    </div>

                    <div>

                        <span>
                            Current Balance
                        </span>

                        <strong>
                            {formatMoney(balance)}
                        </strong>

                        <small>
                            Income minus expenses
                        </small>

                    </div>

                </div>


                {/* INCOME */}

                <div className="analytics-stat-card">

                    <div className="analytics-stat-icon income">
                        ↑
                    </div>

                    <div>

                        <span>
                            Total Income
                        </span>

                        <strong className="income-text">
                            +{formatMoney(
                                totalIncome
                            )}
                        </strong>

                        <small>
                            Money received
                        </small>

                    </div>

                </div>


                {/* EXPENSES */}

                <div className="analytics-stat-card">

                    <div className="analytics-stat-icon expense">
                        ↓
                    </div>

                    <div>

                        <span>
                            Total Expenses
                        </span>

                        <strong className="expense-text">
                            -{formatMoney(
                                totalExpenses
                            )}
                        </strong>

                        <small>
                            Money spent
                        </small>

                    </div>

                </div>

            </section>
{/* =====================================
    MONTHLY FINANCIAL OVERVIEW
===================================== */}

<section className="monthly-overview">

    <div className="analytics-card-header">

        <div>

            <h2>
                Monthly Financial Overview
            </h2>

            <p>
                Track your income, expenses and savings over time.
            </p>

        </div>

    </div>


    {monthlySummary.length === 0 ? (

        <div className="analytics-empty">

            <div className="analytics-empty-icon">
                📅
            </div>

            <strong>
                No monthly data yet
            </strong>

            <span>
                Add some transactions to see your
                monthly financial performance.
            </span>

        </div>

    ) : (

        <div className="monthly-list">

            {monthlySummary
                .slice(0, 6)
                .map((month) => {

                    const [year, monthNumber] =
                        month.month.split("-");

                    const monthName =
                        new Date(
                            Number(year),
                            Number(monthNumber) - 1,
                            1
                        ).toLocaleDateString(
                            "en-IN",
                            {
                                month: "long",
                                year: "numeric"
                            }
                        );

                    return (

                        <div
                            className="monthly-card"
                            key={month.month}
                        >

                            {/* MONTH */}

                            <div className="monthly-card-header">

                                <strong>
                                    {monthName}
                                </strong>

                            </div>


                            {/* VALUES */}

                            <div className="monthly-stats">


                                {/* INCOME */}

                                <div className="monthly-stat">

                                    <span>
                                        Income
                                    </span>

                                    <strong className="income-text">
                                        +{formatMoney(
                                            month.income
                                        )}
                                    </strong>

                                </div>


                                {/* EXPENSES */}

                                <div className="monthly-stat">

                                    <span>
                                        Expenses
                                    </span>

                                    <strong className="expense-text">
                                        -{formatMoney(
                                            month.expenses
                                        )}
                                    </strong>

                                </div>


                                {/* BALANCE */}

                                <div className="monthly-stat">

                                    <span>
                                        Balance
                                    </span>

                                    <strong
                                        className={
                                            month.balance >= 0
                                                ? "income-text"
                                                : "expense-text"
                                        }
                                    >
                                        {month.balance >= 0
                                            ? "+"
                                            : "-"}

                                        {formatMoney(
                                            month.balance
                                        )}
                                    </strong>

                                </div>


                                {/* SAVINGS RATE */}

                                <div className="monthly-stat">

                                    <span>
                                        Savings Rate
                                    </span>

                                    <strong>
                                        {Number(
                                            month.savingsRate
                                        ).toFixed(1)}
                                        %
                                    </strong>

                                </div>

                            </div>


                            {/* SAVINGS PROGRESS */}

                            <div className="monthly-progress-container">

                                <div className="monthly-progress-label">

                                    <span>
                                        Savings
                                    </span>

                                    <span>
                                        {Number(
                                            month.savingsRate
                                        ).toFixed(1)}
                                        %
                                    </span>

                                </div>


                                <div className="monthly-progress">

                                    <div
                                        className="monthly-progress-fill"
                                        style={{
                                            width: `${Math.max(
                                                0,
                                                Math.min(
                                                    Number(
                                                        month.savingsRate
                                                    ),
                                                    100
                                                )
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    );

                })}

        </div>

    )}

</section>
{/* =====================================
    MONTHLY INCOME VS EXPENSES
===================================== */}

<section className="analytics-card monthly-chart-card">

    <div className="analytics-card-header">

        <div>

            <h2>
                Income vs Expenses
            </h2>

            <p>
                Compare your monthly income and spending.
            </p>

        </div>

    </div>


    {monthlySummary.length === 0 ? (

        <div className="analytics-empty">

            <div className="analytics-empty-icon">
                📈
            </div>

            <strong>
                No chart data yet
            </strong>

            <span>
                Add transactions to see your
                financial trends.
            </span>

        </div>

    ) : (

        <div className="monthly-chart">

            <ResponsiveContainer
                width="100%"
                height={340}
            >

                <BarChart
                    data={[...monthlySummary]
                        .reverse()
                        .slice(-6)
                        .map((item) => {

                            const [
                                year,
                                month
                            ] =
                                item.month.split("-");

                            return {
                                ...item,

                                monthLabel:
                                    new Date(
                                        Number(year),
                                        Number(month) - 1,
                                        1
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            month: "short"
                                        }
                                    )
                            };

                        })}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="monthLabel"
                        tick={{
                            fontSize: 13
                        }}
                    />

                    <YAxis
                        tick={{
                            fontSize: 12
                        }}
                        tickFormatter={(value) =>
                            `₹${Number(value).toLocaleString(
                                "en-IN"
                            )}`
                        }
                    />

                    <Tooltip
                        formatter={(value: number | undefined) =>
                            value === undefined
                                ? ""
                                : `₹${Number(value).toLocaleString(
                                    "en-IN"
                                )}`
                        }
                    />

                    <Bar
                        dataKey="income"
                        name="Income"
                        fill="#16a34a"
                        radius={[
                            6,
                            6,
                            0,
                            0
                        ]}
                    />

                    <Bar
                        dataKey="expenses"
                        name="Expenses"
                        fill="#ef4444"
                        radius={[
                            6,
                            6,
                            0,
                            0
                        ]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    )}

</section>

            {/* =====================================
                MAIN ANALYTICS
            ===================================== */}

            <section className="analytics-main-grid">


                {/* =================================
                    SPENDING BY CATEGORY
                ================================= */}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Spending by Category
                            </h2>

                            <p>
                                See how your expenses
                                are distributed.
                            </p>

                        </div>

                    </div>


                    {categorySummary.length === 0 ? (

                        <div className="analytics-empty">

                            <div className="analytics-empty-icon">
                                📊
                            </div>

                            <strong>
                                No spending data yet
                            </strong>

                            <span>
                                Add an expense to see
                                your spending breakdown.
                            </span>

                            <Link
                                to="/transactions"
                                className="analytics-small-btn"
                            >
                                Add Expense
                            </Link>

                        </div>

                    ) : (

                        <div className="category-analytics-list">

                            {[...categorySummary]
                                .sort(
                                    (a, b) =>
                                        Number(b.total) -
                                        Number(a.total)
                                )
                                .map((item) => {

                                    const percentage =
                                        getPercentage(
                                            item.total
                                        );

                                    return (

                                        <div
                                            className="category-analytics-item"
                                            key={item.category}
                                        >

                                            <div className="category-row">

                                                <div className="category-name">

                                                    <div className="category-dot">
                                                        {item.category
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {item.category}
                                                        </strong>

                                                        <span>
                                                            {item.count}{" "}
                                                            transaction
                                                            {item.count !== 1
                                                                ? "s"
                                                                : ""}
                                                        </span>

                                                    </div>

                                                </div>


                                                <div className="category-amount">

                                                    <strong>
                                                        {formatMoney(
                                                            item.total
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {percentage.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="analytics-progress">

                                                <div
                                                    className="analytics-progress-fill"
                                                    style={{
                                                        width: `${Math.min(
                                                            percentage,
                                                            100
                                                        )}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );

                                })}

                        </div>

                    )}

                </div>


                {/* =================================
                    INCOME SOURCES
                ================================= */}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Income Sources
                            </h2>

                            <p>
                                See where your income
                                is coming from.
                            </p>

                        </div>

                    </div>


                    {incomeSummary.length === 0 ? (

                        <div className="analytics-empty">

                            <div className="analytics-empty-icon">
                                💰
                            </div>

                            <strong>
                                No income data yet
                            </strong>

                            <span>
                                Add an income transaction
                                to see your income sources.
                            </span>

                            <Link
                                to="/transactions"
                                className="analytics-small-btn"
                            >
                                Add Income
                            </Link>

                        </div>

                    ) : (

                        <div className="category-analytics-list">

                            {incomeSummary.map(
                                (item) => (

                                    <div
                                        className="category-analytics-item"
                                        key={item.category}
                                    >

                                        <div className="category-row">

                                            <div className="category-name">

                                                <div className="category-dot">
                                                    {item.category
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {item.category}
                                                    </strong>

                                                    <span>
                                                        {item.count}{" "}
                                                        transaction
                                                        {item.count !== 1
                                                            ? "s"
                                                            : ""}
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="category-amount">

                                                <strong className="income-text">
                                                    +{formatMoney(
                                                        item.total
                                                    )}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================
                    TOP EXPENSES
                ================================= */}

                <div className="analytics-card">

                    <div className="analytics-card-header">

                        <div>

                            <h2>
                                Top Expenses
                            </h2>

                            <p>
                                Your largest individual
                                expenses.
                            </p>

                        </div>

                    </div>


                    {topExpenses.length === 0 ? (

                        <div className="analytics-empty">

                            <div className="analytics-empty-icon">
                                💸
                            </div>

                            <strong>
                                No expenses yet
                            </strong>

                            <span>
                                Your largest expenses
                                will appear here.
                            </span>

                        </div>

                    ) : (

                        <div className="top-expenses-list">

                            {topExpenses
                                .slice(0, 5)
                                .map(
                                    (
                                        expense,
                                        index
                                    ) => (

                                        <div
                                            className="top-expense"
                                            key={`${expense.title}-${index}`}
                                        >

                                            <div className="expense-rank">
                                                {index + 1}
                                            </div>


                                            <div className="expense-details">

                                                <strong>
                                                    {expense.title}
                                                </strong>

                                                <span>

                                                    {expense.category}

                                                    {" • "}

                                                    {new Date(
                                                        expense.date
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short"
                                                        }
                                                    )}

                                                </span>

                                            </div>


                                            <strong className="expense-text">

                                                -
                                                {formatMoney(
                                                    Number(
                                                        expense.amount
                                                    )
                                                )}

                                            </strong>

                                        </div>

                                    )
                                )}

                        </div>

                    )}

                </div>

            </section>


            {/* =====================================
                RECENT ACTIVITY
            ===================================== */}

            <section className="analytics-card recent-activity-card">

                <div className="analytics-card-header">

                    <div>

                        <h2>
                            Recent Activity
                        </h2>

                        <p>
                            Your latest income and expenses.
                        </p>

                    </div>


                    <Link
                        to="/transactions"
                        className="analytics-view-link"
                    >
                        View Transactions →
                    </Link>

                </div>


                {recentActivity.length === 0 ? (

                    <div className="analytics-empty">

                        <div className="analytics-empty-icon">
                            💳
                        </div>

                        <strong>
                            No recent activity
                        </strong>

                        <span>
                            Your latest transactions
                            will appear here.
                        </span>

                    </div>

                ) : (

                    <div className="recent-activity-list">

                        {recentActivity.map(
                            (
                                activity,
                                index
                            ) => (

                                <div
                                    className="recent-activity-item"
                                    key={`${activity.title}-${index}`}
                                >

                                    <div className="activity-left">

                                        <div
                                            className={
                                                activity.type ===
                                                "expense"
                                                    ? "activity-icon activity-expense"
                                                    : "activity-icon activity-income"
                                            }
                                        >

                                            {activity.type ===
                                            "expense"
                                                ? "↓"
                                                : "↑"}

                                        </div>


                                        <div>

                                            <strong>
                                                {activity.title}
                                            </strong>

                                            <span>

                                                {activity.category}

                                                {" • "}

                                                {new Date(
                                                    activity.date
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}

                                            </span>

                                        </div>

                                    </div>


                                    <strong
                                        className={
                                            activity.type ===
                                            "expense"
                                                ? "expense-text"
                                                : "income-text"
                                        }
                                    >

                                        {activity.type ===
                                        "expense"
                                            ? "-"
                                            : "+"}

                                        {formatMoney(
                                            Number(
                                                activity.amount
                                            )
                                        )}

                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );
}

export default Analytics;