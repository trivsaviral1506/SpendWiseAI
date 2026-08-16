class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
        this.values = [];
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, value = word) {
        const normalizedWord = String(word).toLowerCase().trim();

        if (!normalizedWord) {
            return;
        }

        let current = this.root;

        for (const char of normalizedWord) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }

            current = current.children[char];
        }

        current.isEnd = true;
        current.values.push(value);
    }

    _findNode(prefix) {
        const normalizedPrefix = String(prefix).toLowerCase().trim();

        let current = this.root;

        for (const char of normalizedPrefix) {
            if (!current.children[char]) {
                return null;
            }

            current = current.children[char];
        }

        return current;
    }

    has(word) {
        const node = this._findNode(word);

        return node !== null && node.isEnd;
    }

    startsWith(prefix) {
        return this._findNode(prefix) !== null;
    }

    searchPrefix(prefix) {
        const node = this._findNode(prefix);

        if (!node) {
            return [];
        }

        const results = [];

        this._collect(node, results);

        return results;
    }

    _collect(node, results) {
        if (node.isEnd) {
            for (const value of node.values) {
                results.push(value);
            }
        }

        for (const char in node.children) {
            this._collect(node.children[char], results);
        }
    }
}

module.exports = Trie;