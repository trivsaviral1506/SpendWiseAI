/**
 * Unit tests for the from-scratch Queue.
 *
 * Run:
 * node dsa/Queue.test.js
 */

const Queue = require("./Queue");

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

console.log("Running Queue tests...\n");

const queue = new Queue();

// Empty queue
assert(
    "new queue is empty",
    queue.isEmpty() === true
);

assert(
    "empty queue has size 0",
    queue.size === 0
);

assert(
    "peek on empty queue returns undefined",
    queue.peek() === undefined
);

assert(
    "dequeue on empty queue returns undefined",
    queue.dequeue() === undefined
);

// Enqueue
queue.enqueue("Lunch");

assert(
    "enqueue adds item",
    queue.peek() === "Lunch"
);

assert(
    "size increases after enqueue",
    queue.size === 1
);

// FIFO
queue.enqueue("Shoes");
queue.enqueue("Travel");

assert(
    "peek returns oldest item",
    queue.peek() === "Lunch"
);

assert(
    "dequeue follows FIFO order",
    queue.dequeue() === "Lunch"
);

assert(
    "next dequeue returns next oldest item",
    queue.dequeue() === "Shoes"
);

assert(
    "last item remains",
    queue.peek() === "Travel"
);

// Size
assert(
    "size is correct after dequeues",
    queue.size === 1
);

// Max size
const limitedQueue = new Queue(3);

limitedQueue.enqueue("A");
limitedQueue.enqueue("B");
limitedQueue.enqueue("C");
limitedQueue.enqueue("D");

const values = limitedQueue.toArray();

assert(
    "queue respects maximum size",
    limitedQueue.size === 3
);

assert(
    "oldest item is removed when capacity is exceeded",
    JSON.stringify(values) === JSON.stringify(["B", "C", "D"])
);

// Transaction objects
const transactionQueue = new Queue(3);

transactionQueue.enqueue({
    title: "Lunch",
    amount: 450
});

transactionQueue.enqueue({
    title: "Travel",
    amount: 5000
});

const firstTransaction = transactionQueue.dequeue();

assert(
    "queue stores transaction objects",
    firstTransaction.title === "Lunch"
);

assert(
    "queue returns transaction amount correctly",
    firstTransaction.amount === 450
);

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
    process.exitCode = 1;
}