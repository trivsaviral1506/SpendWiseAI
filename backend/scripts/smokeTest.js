/**
 * End-to-end smoke test for the SpendWise AI backend.
 *
 * Exercises the full auth + transaction CRUD flow against a running server:
 *   register -> login -> /me -> create -> get -> update -> delete -> verify gone
 *
 * Usage (server must already be running on BASE_URL):
 *   node scripts/smokeTest.js
 *   BASE_URL=http://localhost:5000 node scripts/smokeTest.js
 *
 * Exits with code 0 if every step passes, 1 otherwise.
 * Uses a unique email per run so it can be re-run safely.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

let passed = 0;
let failed = 0;

function check(name, condition, detail) {
    if (condition) {
        passed++;
        console.log(`  ✓ ${name}`);
    } else {
        failed++;
        console.log(`  ✗ ${name}${detail ? `  -> ${detail}` : ""}`);
    }
    return condition;
}

async function api(method, path, { token, body } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        // non-JSON response (e.g. server crash) -> leave data null
    }
    return { status: res.status, data };
}

async function run() {
    console.log(`\nSpendWise AI smoke test -> ${BASE_URL}\n`);

    // Unique per run so re-runs don't collide on the unique email index.
    const stamp = Date.now();
    const testUser = {
        name: "Smoke Test",
        email: `smoke_${stamp}@test.com`,
        password: "123456"
    };

    // 0. Server is up
    try {
        const root = await api("GET", "/");
        check("server is reachable", root.status === 200, `status ${root.status}`);
    } catch (err) {
        check("server is reachable", false, err.message);
        console.log("\nIs the backend running? Start it with: npm run dev\n");
        return;
    }

    // 1. Register
    const reg = await api("POST", "/api/auth/register", { body: testUser });
    check("register returns 201", reg.status === 201, `status ${reg.status}`);

    // 2. Register duplicate is rejected
    const dup = await api("POST", "/api/auth/register", { body: testUser });
    check("duplicate register returns 400", dup.status === 400, `status ${dup.status}`);

    // 3. Login
    const login = await api("POST", "/api/auth/login", {
        body: { email: testUser.email, password: testUser.password }
    });
    check("login returns 200", login.status === 200, `status ${login.status}`);
    const token = login.data?.token;
    check("login returns a JWT", typeof token === "string" && token.length > 0);

    // 4. Wrong password is rejected
    const badLogin = await api("POST", "/api/auth/login", {
        body: { email: testUser.email, password: "wrongpassword" }
    });
    check("wrong password returns 401", badLogin.status === 401, `status ${badLogin.status}`);

    // 5. Protected route without token
    const noAuth = await api("GET", "/api/auth/me");
    check("/me without token returns 401", noAuth.status === 401, `status ${noAuth.status}`);

    // 6. Protected route with token
    const me = await api("GET", "/api/auth/me", { token });
    check("/me with token returns 200", me.status === 200, `status ${me.status}`);

    // 7. Create transaction
    const created = await api("POST", "/api/transactions", {
        token,
        body: {
            title: "Lunch",
            amount: 250,
            category: "Food",
            type: "expense",
            description: "Lunch with friends"
        }
    });
    check("create transaction returns 201", created.status === 201, `status ${created.status}`);
    const txId = created.data?.transaction?._id;
    check("created transaction has an id", !!txId);
    check(
        "created transaction is scoped to the user",
        !!created.data?.transaction?.user,
        "missing user field"
    );

    // 8. Create requires auth
    const createNoAuth = await api("POST", "/api/transactions", {
        body: { title: "Hack", amount: 1, category: "Other" }
    });
    check("create without token returns 401", createNoAuth.status === 401, `status ${createNoAuth.status}`);

    // 9. Get transactions
    const list = await api("GET", "/api/transactions", { token });
    check("get transactions returns 200", list.status === 200, `status ${list.status}`);
    check(
        "list contains the created transaction",
        Array.isArray(list.data?.transactions) &&
            list.data.transactions.some((t) => t._id === txId)
    );

    // 10. Update transaction
    const updated = await api("PUT", `/api/transactions/${txId}`, {
        token,
        body: { amount: 300, title: "Lunch (updated)" }
    });
    check("update transaction returns 200", updated.status === 200, `status ${updated.status}`);
    check(
        "update actually changed the amount",
        updated.data?.transaction?.amount === 300,
        `amount = ${updated.data?.transaction?.amount}`
    );

    // 11. Analytics: category summary (HashMap analyzer)
    const summary = await api("GET", "/api/analytics/category-summary", { token });
    check("category summary returns 200", summary.status === 200, `status ${summary.status}`);
    check(
        "summary totalExpense reflects the transaction",
        summary.data?.totalExpense === 300,
        `totalExpense = ${summary.data?.totalExpense}`
    );
    const foodRow = summary.data?.categorySummary?.find((c) => c.category === "Food");
    check("summary buckets the Food category", !!foodRow, "no Food row");
    check(
        "Food total is aggregated correctly",
        foodRow?.total === 300 && foodRow?.count === 1,
        `total = ${foodRow?.total}, count = ${foodRow?.count}`
    );
    const summaryNoAuth = await api("GET", "/api/analytics/category-summary");
    check("category summary without token returns 401", summaryNoAuth.status === 401, `status ${summaryNoAuth.status}`);

    // 12. Delete transaction
    const deleted = await api("DELETE", `/api/transactions/${txId}`, { token });
    check("delete transaction returns 200", deleted.status === 200, `status ${deleted.status}`);

    // 13. Deleting again returns 404 (it's gone)
    const deleteAgain = await api("DELETE", `/api/transactions/${txId}`, { token });
    check("re-deleting returns 404", deleteAgain.status === 404, `status ${deleteAgain.status}`);

    // Summary
    console.log(`\n${passed} passed, ${failed} failed\n`);
    if (failed > 0) process.exitCode = 1;
}

run().catch((err) => {
    console.error("\nSmoke test crashed:", err.message);
    process.exitCode = 1;
});
