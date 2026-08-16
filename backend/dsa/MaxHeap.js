/**
 * MaxHeap — a max heap implemented from scratch.
 *
 * Why this exists:
 * SpendWise AI uses the heap to efficiently find the highest expenses.
 *
 * Properties:
 * - Parent is always greater than or equal to its children.
 * - Stored internally as an array.
 *
 * Complexity:
 * - insert: O(log n)
 * - extractMax: O(log n)
 * - peek: O(1)
 * - build from inserts: O(n log n)
 */

class MaxHeap {
    constructor() {
        this.heap = [];
    }

    // Return parent index
    _parent(index) {
        return Math.floor((index - 1) / 2);
    }

    // Return left child index
    _left(index) {
        return 2 * index + 1;
    }

    // Return right child index
    _right(index) {
        return 2 * index + 2;
    }

    // Swap two elements
    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [
            this.heap[j],
            this.heap[i]
        ];
    }

    // Move an element upward until heap property is restored
    _heapifyUp(index) {
        while (index > 0) {
            const parent = this._parent(index);

            if (this.heap[parent].amount >= this.heap[index].amount) {
                break;
            }

            this._swap(parent, index);
            index = parent;
        }
    }

    // Move an element downward until heap property is restored
    _heapifyDown(index) {
        while (true) {
            const left = this._left(index);
            const right = this._right(index);

            let largest = index;

            if (
                left < this.heap.length &&
                this.heap[left].amount > this.heap[largest].amount
            ) {
                largest = left;
            }

            if (
                right < this.heap.length &&
                this.heap[right].amount > this.heap[largest].amount
            ) {
                largest = right;
            }

            if (largest === index) {
                break;
            }

            this._swap(index, largest);
            index = largest;
        }
    }

    // Insert a new expense
    insert(expense) {
        this.heap.push(expense);

        this._heapifyUp(this.heap.length - 1);

        return this;
    }

    // Return highest expense without removing it
    peek() {
        if (this.heap.length === 0) {
            return undefined;
        }

        return this.heap[0];
    }

    // Remove and return highest expense
    extractMax() {
        if (this.heap.length === 0) {
            return undefined;
        }

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const max = this.heap[0];

        this.heap[0] = this.heap.pop();

        this._heapifyDown(0);

        return max;
    }

    // Current number of elements
    get size() {
        return this.heap.length;
    }

    // Check whether heap is empty
    isEmpty() {
        return this.heap.length === 0;
    }
}

module.exports = MaxHeap;