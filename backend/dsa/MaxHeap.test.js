/**
 * Unit tests for the from-scratch MaxHeap.
 *
 * Run:
 * node dsa/MaxHeap.test.js
 */

const MaxHeap = require("./MaxHeap");

let passed = 0;
let failed = 0;

function assert(name, condition) {
    if (condition) {
        passed++;
        console.log(`  ✓ ${name}`);
    } else {
        failed++;
        console.log(`  ✗ ${name}`);
    }
}

console.log("Running MaxHeap tests...\n");

// ------------------------------------
// Basic insert + peek
// ------------------------------------

const heap = new MaxHeap();

heap.insert({
    title: "Food",
    amount: 200
});

heap.insert({
    title: "Rent",
    amount: 15000
});

heap.insert({
    title: "Travel",
    amount: 5000
});

assert(
    "peek returns highest expense",
    heap.peek().amount === 15000
);

assert(
    "size tracks number of elements",
    heap.size === 3
);

// ------------------------------------
// Extract maximum
// ------------------------------------

const max = heap.extractMax();

assert(
    "extractMax returns highest expense",
    max.title === "Rent" && max.amount === 15000
);

assert(
    "next maximum is correct",
    heap.peek().amount === 5000
);

assert(
    "size decreases after extractMax",
    heap.size === 2
);

// ------------------------------------
// Multiple extractions
// ------------------------------------

const ordered = [];

while (!heap.isEmpty()) {
    ordered.push(heap.extractMax().amount);
}

assert(
    "extractMax returns values in descending order",
    JSON.stringify(ordered) === JSON.stringify([5000, 200])
);

// ------------------------------------
// Empty heap
// ------------------------------------

const emptyHeap = new MaxHeap();

assert(
    "peek on empty heap returns undefined",
    emptyHeap.peek() === undefined
);

assert(
    "extractMax on empty heap returns undefined",
    emptyHeap.extractMax() === undefined
);

assert(
    "empty heap reports size 0",
    emptyHeap.size === 0
);

// ------------------------------------
// Larger test
// ------------------------------------

const largeHeap = new MaxHeap();

const expenses = [
    250,
    1000,
    50,
    5000,
    700,
    15000,
    300,
    2000,
    9000,
    100
];

expenses.forEach((amount, index) => {
    largeHeap.insert({
        title: `Expense ${index}`,
        amount
    });
});

const sorted = [];

while (!largeHeap.isEmpty()) {
    sorted.push(largeHeap.extractMax().amount);
}

const expected = [...expenses].sort((a, b) => b - a);

assert(
    "large heap returns all values in descending order",
    JSON.stringify(sorted) === JSON.stringify(expected)
);

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
    process.exitCode = 1;
}