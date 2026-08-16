/**
 * Standalone unit test for the from-scratch HashMap.
 * No server or database needed:  node dsa/HashMap.test.js
 *
 * Verifies basic get/set, updates, collision handling (via a tiny capacity that
 * forces chaining), and automatic resizing under load.
 */
const HashMap = require("./HashMap");

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

// Basic set/get
const map = new HashMap();
map.set("Food", 100);
map.set("Transport", 50);
assert("get returns stored value", map.get("Food") === 100);
assert("get returns second value", map.get("Transport") === 50);
assert("has is true for present key", map.has("Food") === true);
assert("has is false for absent key", map.has("Bills") === false);
assert("get returns undefined for absent key", map.get("Nope") === undefined);
assert("size tracks entry count", map.size === 2);

// Updating an existing key must not grow size
map.set("Food", 999);
assert("updating a key overwrites value", map.get("Food") === 999);
assert("updating a key does not change size", map.size === 2);

// Force collisions with a deliberately tiny table (capacity 2)
const tiny = new HashMap(2, 100); // huge load factor so it won't resize away collisions
const keys = ["a", "b", "c", "d", "e", "f"];
keys.forEach((k, i) => tiny.set(k, i));
assert("all keys retrievable despite collisions", keys.every((k, i) => tiny.get(k) === i));
assert("size correct under heavy chaining", tiny.size === keys.length);

// Resizing: insert enough keys to trigger multiple doublings, verify integrity
const big = new HashMap(4, 0.75);
for (let i = 0; i < 100; i++) {
    big.set(`key${i}`, i * 2);
}
let allGood = true;
for (let i = 0; i < 100; i++) {
    if (big.get(`key${i}`) !== i * 2) allGood = false;
}
assert("all 100 entries survive resizing", allGood);
assert("size correct after resizing", big.size === 100);
assert("entries() returns every pair", big.entries().length === 100);

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exitCode = 1;
