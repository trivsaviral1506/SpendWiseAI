const Queue = require("./Queue");

/**
 * Build a recent-activity list using the custom Queue.
 *
 * The queue keeps the oldest activity at the front and
 * the newest activity at the back.
 *
 * @param {Array} transactions
 * @param {number} limit
 * @returns {Array}
 */
function getRecentActivity(transactions = [], limit = 10) {
    const queue = new Queue(limit);

    // Transactions are expected to be newest-first from MongoDB.
    // Add them in reverse order so the queue represents
    // chronological activity correctly.
    const orderedTransactions = [...transactions].reverse();

    for (const tx of orderedTransactions) {
        queue.enqueue({
            id: tx._id,
            title: tx.title,
            amount: Number(tx.amount) || 0,
            category: tx.category,
            type: tx.type,
            date: tx.date || tx.createdAt
        });
    }

    // Return newest activities first for the API response.
    return queue.toArray().reverse();
}

module.exports = getRecentActivity;