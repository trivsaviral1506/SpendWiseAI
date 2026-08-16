const Trie = require("./Trie");

/**
 * Search transactions using a Trie.
 *
 * The transaction title and category are indexed.
 *
 * Example:
 *
 * searchTransactions(transactions, "la")
 *
 * can find:
 *   Lunch
 *   Laptop
 *   Laundry
 *
 * @param {Array} transactions
 * @param {string} query
 * @returns {Array}
 */

function searchTransactions(transactions = [], query = "") {
    const normalizedQuery = String(query).toLowerCase().trim();

    if (!normalizedQuery) {
        return [];
    }

    const trie = new Trie();

    // Store transactions in the Trie using title.
    for (const transaction of transactions) {
        if (transaction.title) {
            trie.insert(transaction.title, transaction);
        }
    }

    return trie.searchPrefix(normalizedQuery);
}

module.exports = searchTransactions;