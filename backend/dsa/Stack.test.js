/**
 * Unit tests for the from-scratch Stack.
 *
 * Run:
 * node dsa/Stack.test.js
 */

const Stack = require("./Stack");

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

console.log("Running Stack tests...\n");

const stack = new Stack();

// Empty stack
assert(
    "new stack is empty",
    stack.isEmpty() === true
);

assert(
    "empty stack has size 0",
    stack.size === 0
);

assert(
    "peek on empty stack returns undefined",
    stack.peek() === undefined
);

assert(
    "pop on empty stack returns undefined",
    stack.pop() === undefined
);

// Push
stack.push("Lunch");

assert(
    "push adds item",
    stack.peek() === "Lunch"
);

assert(
    "size increases after push",
    stack.size === 1
);

// Multiple items
stack.push("Shoes");
stack.push("Travel");

assert(
    "peek returns most recently pushed item",
    stack.peek() === "Travel"
);

assert(
    "size is correct after multiple pushes",
    stack.size === 3
);

// LIFO
assert(
    "pop follows LIFO order",
    stack.pop() === "Travel"
);

assert(
    "next pop returns previous item",
    stack.pop() === "Shoes"
);

assert(
    "final pop returns first item",
    stack.pop() === "Lunch"
);

assert(
    "stack is empty after all pops",
    stack.isEmpty() === true
);

// Transaction objects
const transactionStack = new Stack();

const transaction = {
    id: "123",
    title: "Laptop",
    amount: 50000
};

transactionStack.push(transaction);

assert(
    "stack can store transaction objects",
    transactionStack.peek().title === "Laptop"
);

const deletedTransaction = transactionStack.pop();

assert(
    "pop returns complete transaction",
    deletedTransaction.amount === 50000
);

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
    process.exitCode = 1;
}