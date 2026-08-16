/**
 * Category analytics powered by a from-scratch HashMap.
 *
 * analyzeByCategory walks every transaction exactly once (O(n)) and uses the
 * HashMap for O(1) average-case accumulation per category. Income is tracked
 * separately from expenses, since "category spending" describes money going
 * out, not coming in.
 */
const HashMap = require("./HashMap");

/**
 * @param {Array<{ amount: number, type: string, category: string }>} transactions
 * @returns {{
 *   totalIncome: number,
 *   totalExpense: number,
 *   balance: number,
 *   categorySummary: Array<{ category: string, total: number, count: number }>
 * }}
 */
function analyzeByCategory(transactions = []) {
    const categoryMap = new HashMap();
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transactions) {
        const amount = Number(tx.amount) || 0;

        if (tx.type === "income") {
            totalIncome += amount;
            continue; // income is not bucketed into spending categories
        }

        totalExpense += amount;

        const existing = categoryMap.get(tx.category);
        if (existing) {
            existing.total += amount;
            existing.count += 1;
        } else {
            categoryMap.set(tx.category, {
                category: tx.category,
                total: amount,
                count: 1
            });
        }
    }

    // Sorting is presentation only — the O(n) aggregation above is the DSA.
    const categorySummary = categoryMap
        .values()
        .sort((a, b) => b.total - a.total);

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categorySummary
    };
}

module.exports = analyzeByCategory;
