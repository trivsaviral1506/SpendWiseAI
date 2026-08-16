/**
 * Monthly financial analytics.
 *
 * Groups transactions month-by-month and calculates:
 *
 * - Total income
 * - Total expenses
 * - Balance
 * - Savings rate
 *
 * Time Complexity: O(n)
 */

function analyzeMonthly(transactions = []) {

    const monthlyMap = new Map();


    for (const tx of transactions) {

        if (!tx.date) {
            continue;
        }


        const date = new Date(tx.date);


        if (Number.isNaN(date.getTime())) {
            continue;
        }


        // Example:
        // 2026-08
        const monthKey =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;


        // Create month if it doesn't exist
        if (!monthlyMap.has(monthKey)) {

            monthlyMap.set(monthKey, {

                month: monthKey,

                income: 0,

                expenses: 0,

                balance: 0,

                savingsRate: 0

            });

        }


        const month =
            monthlyMap.get(monthKey);


        const amount =
            Number(tx.amount) || 0;


        if (tx.type === "income") {

            month.income += amount;

        } else {

            month.expenses += amount;

        }


        month.balance =
            month.income -
            month.expenses;


        // Savings rate:
        //
        // income = 0
        // => 0%
        //
        // otherwise:
        // (income - expenses) / income * 100

        if (month.income > 0) {

            month.savingsRate =
                (
                    (month.income -
                        month.expenses) /
                    month.income
                ) * 100;

        } else {

            month.savingsRate = 0;

        }

    }


    // Convert Map → Array
    const monthlySummary =
        Array.from(
            monthlyMap.values()
        );


    // Newest month first
    monthlySummary.sort(
        (a, b) =>
            b.month.localeCompare(a.month)
    );


    return monthlySummary;
}


module.exports =
    analyzeMonthly;