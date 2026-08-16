/**
 * Income analytics powered by the custom HashMap.
 *
 * Groups only income transactions by category.
 * Example:
 *
 * Salary     -> ₹30,000
 * Freelance  -> ₹5,000
 * Bonus      -> ₹2,000
 */

const HashMap = require("./HashMap");

function analyzeIncomeByCategory(transactions = []) {
    const incomeMap = new HashMap();

    let totalIncome = 0;

    for (const tx of transactions) {

        // Ignore expenses
        if (tx.type !== "income") {
            continue;
        }

        const amount = Number(tx.amount) || 0;

        totalIncome += amount;

        const existing =
            incomeMap.get(tx.category);

        if (existing) {

            existing.total += amount;

            existing.count += 1;

        } else {

            incomeMap.set(tx.category, {

                category: tx.category,

                total: amount,

                count: 1

            });

        }
    }

    // Sort highest income source first
    const incomeSummary =
        incomeMap
            .values()
            .sort(
                (a, b) =>
                    b.total - a.total
            );

    return {
        totalIncome,
        incomeSummary
    };
}

module.exports =
    analyzeIncomeByCategory;