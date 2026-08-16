const Stack = require("./Stack");

const undoStack = new Stack();

function saveDeletedTransaction(transaction) {
    undoStack.push(transaction);
}

function getLastDeletedTransaction() {
    return undoStack.peek();
}

function popDeletedTransaction() {
    return undoStack.pop();
}

function hasUndo() {
    return !undoStack.isEmpty();
}

module.exports = {
    saveDeletedTransaction,
    getLastDeletedTransaction,
    popDeletedTransaction,
    hasUndo
};