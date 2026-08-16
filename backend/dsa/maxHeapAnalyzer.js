/**
 * Top-expense analytics powered by a from-scratch MaxHeap.
 *
 * Finds the K highest expenses for a user.
 *
 * Complexity:
 * - Insert n expenses into heap: O(n log n)
 * - Extract top k expenses: O(k log n)
 *
 * Overall: O(n log n)
 */

const MaxHeap = require("./MaxHeap");

/**
 * @param {Array} transactions
 * @param {number} k
 * @returns {Array}
 */
function getTopExpenses(transactions = [], k = 5) {
    const heap = new MaxHeap();

    // Only expenses should be considered.
    for (const tx of transactions) {
        if (tx.type !== "expense") {
            continue;
        }

        const amount = Number(tx.amount) || 0;

        heap.insert({
            id: tx._id,
            title: tx.title,
            amount,
            category: tx.category,
            date: tx.date || tx.createdAt
        });
    }

    const result = [];

    const limit = Math.min(k, heap.size);

    for (let i = 0; i < limit; i++) {
        result.push(heap.extractMax());
    }

    return result;
}

module.exports = getTopExpenses;