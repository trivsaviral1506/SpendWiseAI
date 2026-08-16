/**
 * Stack — a stack implemented from scratch.
 *
 * SpendWise AI use case:
 * Store recently deleted transactions so they can be restored
 * using an Undo operation.
 *
 * Stack follows LIFO:
 * Last In, First Out.
 *
 * Complexity:
 * push    -> O(1)
 * pop     -> O(1)
 * peek    -> O(1)
 */

class Stack {
    constructor() {
        this.items = [];
    }

    // Add an item to the top of the stack
    push(item) {
        this.items.push(item);
        return this;
    }

    // Remove and return the top item
    pop() {
        if (this.items.length === 0) {
            return undefined;
        }

        return this.items.pop();
    }

    // Return the top item without removing it
    peek() {
        if (this.items.length === 0) {
            return undefined;
        }

        return this.items[this.items.length - 1];
    }

    // Number of items
    get size() {
        return this.items.length;
    }

    // Check whether stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Remove everything
    clear() {
        this.items = [];
    }
}

module.exports = Stack;