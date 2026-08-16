/**
 * HashMap — a genuine hash map implemented from scratch.
 *
 * Why this exists:
 *   The analytics layer aggregates a user's transactions by category. Rather
 *   than leaning on JavaScript's built-in Map, we implement the data structure
 *   ourselves so the DSA is real and interview-explainable.
 *
 * How it works:
 *   - _hash(key): a polynomial rolling hash over the key's characters, mapped
 *     into the bucket array.
 *   - buckets: an array where each slot holds a list of { key, value } entries
 *     (separate chaining) so colliding keys coexist.
 *   - resizing: when the load factor (size / capacity) exceeds the threshold,
 *     the table doubles and all entries are rehashed, keeping operations
 *     O(1) on average.
 *
 * Complexity: get / set / has are O(1) average case, O(n) worst case if every
 * key collides into one bucket.
 */
class HashMap {
    constructor(initialCapacity = 16, loadFactor = 0.75) {
        this._capacity = initialCapacity;
        this._loadFactor = loadFactor;
        this._size = 0;
        this._buckets = new Array(this._capacity);
    }

    // Polynomial rolling hash -> non-negative bucket index.
    _hash(key) {
        const str = String(key);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            // hash * 31 + charCode, kept inside 32-bit signed range with | 0
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        return (hash & 0x7fffffff) % this._capacity;
    }

    set(key, value) {
        const index = this._hash(key);
        if (!this._buckets[index]) {
            this._buckets[index] = [];
        }

        const bucket = this._buckets[index];
        for (const entry of bucket) {
            if (entry.key === key) {
                entry.value = value; // key already present -> update
                return this;
            }
        }

        bucket.push({ key, value });
        this._size++;

        if (this._size / this._capacity > this._loadFactor) {
            this._resize();
        }
        return this;
    }

    get(key) {
        const bucket = this._buckets[this._hash(key)];
        if (!bucket) return undefined;
        for (const entry of bucket) {
            if (entry.key === key) return entry.value;
        }
        return undefined;
    }

    has(key) {
        const bucket = this._buckets[this._hash(key)];
        if (!bucket) return false;
        for (const entry of bucket) {
            if (entry.key === key) return true;
        }
        return false;
    }

    // Double the capacity and rehash every existing entry.
    _resize() {
        const oldBuckets = this._buckets;
        this._capacity *= 2;
        this._buckets = new Array(this._capacity);
        this._size = 0;

        for (const bucket of oldBuckets) {
            if (!bucket) continue;
            for (const entry of bucket) {
                this.set(entry.key, entry.value);
            }
        }
    }

    get size() {
        return this._size;
    }

    entries() {
        const result = [];
        for (const bucket of this._buckets) {
            if (!bucket) continue;
            for (const entry of bucket) {
                result.push([entry.key, entry.value]);
            }
        }
        return result;
    }

    keys() {
        return this.entries().map(([key]) => key);
    }

    values() {
        return this.entries().map(([, value]) => value);
    }
}

module.exports = HashMap;
