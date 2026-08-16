const Trie = require("./Trie");

let passed = 0;
let failed = 0;

function assert(name, condition) {
    if (condition) {
        passed++;
        console.log(`✓ ${name}`);
    } else {
        failed++;
        console.log(`✗ ${name}`);
    }
}

console.log("Running Trie tests...\n");

// ==========================================
// BASIC WORD TEST
// ==========================================

const trie = new Trie();

trie.insert("Lunch");
trie.insert("Laptop");
trie.insert("Laundry");

assert(
    "Lunch exists",
    trie.has("Lunch") === true
);

assert(
    "Laptop exists",
    trie.has("Laptop") === true
);

assert(
    "Dinner does not exist",
    trie.has("Dinner") === false
);


// ==========================================
// PREFIX TEST
// ==========================================

assert(
    "la prefix exists",
    trie.startsWith("la") === true
);

const laResults = trie.searchPrefix("la");

assert(
    "la finds 2 words",
    laResults.length === 2
);

assert(
    "Laptop found",
    laResults.includes("Laptop")
);

assert(
    "Laundry found",
    laResults.includes("Laundry")
);


// ==========================================
// CASE INSENSITIVE TEST
// ==========================================

assert(
    "search is case insensitive",
    trie.has("lunch") === true
);


// ==========================================
// UNKNOWN PREFIX TEST
// ==========================================

assert(
    "unknown prefix returns empty array",
    trie.searchPrefix("xyz").length === 0
);


// ==========================================
// TRANSACTION OBJECT TEST
// ==========================================

const transactionTrie = new Trie();

const lunch = {
    id: "1",
    title: "Lunch",
    amount: 450
};

const laptop = {
    id: "2",
    title: "Laptop",
    amount: 50000
};

// Insert transaction objects
transactionTrie.insert(lunch.title, lunch);
transactionTrie.insert(laptop.title, laptop);

// Use "l" because both Lunch and Laptop start with "l"
const transactionResults =
    transactionTrie.searchPrefix("l");

console.log("\nTransaction results:");
console.log(transactionResults);

assert(
    "Trie can store transaction objects",
    transactionResults.length === 2
);

assert(
    "Lunch transaction preserved",
    transactionResults.some(
        transaction => transaction.amount === 450
    )
);

assert(
    "Laptop transaction preserved",
    transactionResults.some(
        transaction => transaction.amount === 50000
    )
);


// ==========================================
// FINAL RESULT
// ==========================================

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
    process.exitCode = 1;
}