/**
 * Queue — a queue implemented from scratch.
 *
 * SpendWise AI use case:
 * Maintain a recent transaction/activity stream.
 *
 * Queue follows FIFO:
 * First In, First Out.
 *
 * Complexity:
 * enqueue -> O(1)
 * dequeue -> O(1)
 * peek    -> O(1)
 */

class Queue {
    constructor(maxSize = 10) {
        this.items = [];
        this.maxSize = maxSize;
    }

    // Add item to the back of the queue
    enqueue(item) {
        this.items.push(item);

        // Keep only the most recent maxSize items
        if (this.items.length > this.maxSize) {
            this.dequeue();
        }

        return this;
    }

    // Remove and return the oldest item
    dequeue() {
        if (this.items.length === 0) {
            return undefined;
        }

        return this.items.shift();
    }

    // Return the oldest item without removing it
    peek() {
        if (this.items.length === 0) {
            return undefined;
        }

        return this.items[0];
    }

    get size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    // Return a copy so callers cannot directly modify the queue
    toArray() {
        return [...this.items];
    }

    clear() {
        this.items = [];
    }
}

module.exports = Queue;