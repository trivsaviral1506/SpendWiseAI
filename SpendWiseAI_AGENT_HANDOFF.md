# SpendWise AI — Agentic Coding Handoff

## Project
- Name: SpendWise AI
- Type: MERN-style expense management app with real DSA features and planned AI insights
- Local root: `C:\Users\hp\SpendWiseAI`
- Backend: `C:\Users\hp\SpendWiseAI\backend`
- Frontend: `C:\Users\hp\SpendWiseAI\frontend`
- OS: Windows
- Editor: VS Code
- Backend port: `5000`
- Database: MongoDB, currently verified through MongoDB Compass
- GitHub repo has already been created and pushed; do NOT recreate it.

## User goal
Build a strong portfolio/resume project combining:
1. MERN/full-stack development
2. JWT authentication
3. Expense/income transaction management
4. Analytics/dashboard
5. Actual DSA implementations used by visible features
6. AI-powered spending insights
7. Clean React UI
8. Interview-explainable architecture

Important: DSA must be genuinely implemented and used. Do not claim a DSA feature exists until it is actually in the code.

## Current stack

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- nodemon
- CommonJS (`require`) style

### Frontend
- React
- TypeScript
- Vite

### Tools
- VS Code
- PowerShell
- MongoDB Compass
- Postman
- Git/GitHub

## Current backend structure

```text
backend/
├── controllers/
│   ├── authController.js
│   └── transactionController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Transaction.js
├── routes/
│   ├── authRoutes.js
│   └── transactionRoutes.js
├── dsa/                 # planned DSA implementations
├── .env
├── package.json
├── package-lock.json
└── server.js
```

Frontend is still largely based on the Vite React starter and has not yet been turned into the final SpendWise UI.

## How to run backend

From the backend directory:

```powershell
cd C:\Users\hp\SpendWiseAI\backend
npm run dev
```

Expected:

```text
Server running on http://localhost:5000
MongoDB connected successfully
```

Keep this terminal running while using Postman.

Common previous issue:
- Running `npm run dev` from `C:\Users\hp\SpendWiseAI` caused ENOENT because the backend `package.json` is inside `backend`.
- `ECONNREFUSED 127.0.0.1:5000` meant the backend was not running.

## Environment/security

The backend uses `.env` for secrets such as:
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`

Never expose or commit `.env`.
Never put secrets in the React frontend.
Never commit `node_modules`.

## MongoDB state

Database:

```text
SpendWiseAI
```

Collections currently verified:

```text
users
transactions
```

Test user:
- name: `Aviral`
- email: `aviral@test.com`
- password was tested successfully but is stored hashed with bcrypt.

Test transaction:
```text
title: Lunch
amount: 250
category: Food
type: expense
description: Lunch with friends
```

The transaction is linked to the authenticated user's ObjectId.

Mongoose automatically created the collections when the first documents were inserted.

# Authentication — COMPLETE

## Register
Endpoint:

```http
POST http://localhost:5000/api/auth/register
```

Example:

```json
{
  "name": "Aviral",
  "email": "aviral@test.com",
  "password": "123456"
}
```

Successfully tested with HTTP 201 and verified in Compass.

## Login
Endpoint:

```http
POST http://localhost:5000/api/auth/login
```

Example:

```json
{
  "email": "aviral@test.com",
  "password": "123456"
}
```

Successfully tested with HTTP 200 and a JWT response.

JWT is generated conceptually as:

```javascript
jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);
```

Do not expose real JWTs in documentation.

## JWT middleware
File:

```text
backend/middleware/authMiddleware.js
```

Behavior:
- Reads `Authorization`
- Requires `Bearer <token>`
- Verifies token using `process.env.JWT_SECRET`
- Stores decoded payload in `req.user`
- Rejects missing/invalid/expired tokens

Missing token response:

```json
{
  "message": "Access denied. No token provided."
}
```

## Protected `/me`
Endpoint:

```http
GET http://localhost:5000/api/auth/me
```

Successfully tested:
- without token → 401
- with valid Bearer token → 200

# Transaction system

## Transaction model — COMPLETE

File:

```text
backend/models/Transaction.js
```

Fields:
- `user`: ObjectId ref User, required
- `title`: String, required
- `amount`: Number, required, min 0
- `category`: String, required
- `type`: `income` or `expense`, default `expense`
- `description`: String
- `date`: Date, default Date.now
- timestamps enabled

Categories currently:
```text
Food
Transport
Shopping
Entertainment
Bills
Health
Education
Other
```

## Create transaction — COMPLETE

Endpoint:

```http
POST /api/transactions
```

Requires Bearer JWT.

Example:

```json
{
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "type": "expense",
  "description": "Lunch with friends"
}
```

The controller must use:

```javascript
user: req.user.userId
```

Do not trust a client-provided `user` field.

Successfully tested with HTTP 201 and verified in Compass.

## Get transactions — COMPLETE

Endpoint:

```http
GET /api/transactions
```

Requires Bearer JWT.

Expected query logic:

```javascript
Transaction.find({
    user: req.user.userId
}).sort({ date: -1 });
```

This ensures users only retrieve their own transactions.

Successfully tested.

## Update transaction — IMPLEMENTED / VERIFY

Intended controller:

```javascript
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction updated successfully",
            transaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update transaction",
            error: error.message
        });
    }
};
```

Route:

```http
PUT /api/transactions/:id
```

Must be protected.

Verify with Postman before marking it complete.

## Delete transaction — IMPLEMENTED / VERIFY

Intended controller:

```javascript
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete transaction",
            error: error.message
        });
    }
};
```

Route:

```http
DELETE /api/transactions/:id
```

Must be protected.

Verify with Postman before marking complete.

For safe testing, create a second transaction such as:

```json
{
  "title": "Bus",
  "amount": 50,
  "category": "Transport",
  "type": "expense",
  "description": "Bus fare"
}
```

Then delete Bus and keep Lunch.

# Current API map

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/transactions
GET    /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

All transaction routes should use JWT authentication.

# Postman notes

For protected routes:
```text
Authorization
→ Type: Bearer Token
→ paste only the JWT
```

Do not type `Bearer` manually into the token box.

For JSON:
```text
Body → raw → JSON
```

Previous Postman issue:
- URLs were accidentally duplicated/newline-separated.
- `%0A` in an error indicates a newline in the URL.
- If a request gets messy, create a fresh request with the `+` button.

# DSA requirement — VERY IMPORTANT

The project is supposed to demonstrate real DSA, not just list algorithms.

Planned DSA directory:

```text
backend/dsa/
├── hashMapAnalyzer.js
├── maxHeap.js
├── stack.js
├── queue.js
└── trie.js
```

These are planned features, NOT all currently implemented.

## 1. HashMap — category analytics

Use a real Map/HashMap to aggregate spending:

```text
Food → ₹8500
Transport → ₹2300
Shopping → ₹4200
Bills → ₹6000
```

Possible endpoint:

```http
GET /api/analytics/category-summary
```

Expected core complexity: O(n) for n transactions.

## 2. Max Heap — top expenses

Use a genuine custom Max Heap / Priority Queue to retrieve highest expenses.

Possible endpoint:

```http
GET /api/analytics/top-expenses?k=5
```

Do not simply use `sort()` and call it a heap.

## 3. Stack — undo delete

Real feature:

```text
Delete transaction
→ push deleted transaction to Stack
→ user clicks Undo
→ pop transaction
→ restore transaction
```

The stack must actually participate in the implementation.

## 4. Queue — recent activity

Use a real queue for recent transaction processing/history.

Example:
```text
Lunch
Bus
Netflix
Rent
```

Could maintain a bounded recent-activity queue.

## 5. Trie — transaction search/autocomplete

Use a real Trie for prefix search.

Example:
```text
query: "fo"
→ Food
→ Food Delivery
→ Food Court
```

Possible endpoint:

```http
GET /api/transactions/search?q=fo
```

Do not implement MongoDB regex and claim it is a Trie.

# Analytics plan

Dashboard should eventually show:
- Total income
- Total expenses
- Balance
- Monthly spending
- Top category
- Highest expense
- Recent transactions
- Category breakdown
- Income vs expense
- Monthly trends

Frontend can display charts.

# AI plan

AI comes after the core application and DSA.

Potential real insights:
- “Your food spending increased by 32% this month.”
- “Food is your highest spending category.”
- “At your current rate, you may exceed your monthly budget.”
- “Weekend spending is higher than weekday spending.”

AI must use actual user transaction/analytics data.
Do not fake AI output.

# Frontend plan

Frontend is currently mostly Vite starter.

Target pages:
```text
Login
Register
Dashboard
Transactions
Analytics
Profile / Logout
```

Suggested structure:

```text
frontend/src/
├── components/
├── pages/
├── services/
├── hooks/
├── context/
├── types/
├── utils/
├── App.tsx
└── ...
```

Recommended architecture:

```text
React
  ↓
AuthContext
  ↓
API service / Axios
  ↓
Express API
  ↓
MongoDB
```

Do not over-engineer the frontend before backend features are stable.

# Security rules

- Never commit `.env`.
- Never expose JWT secret.
- Never put secret API keys in frontend code.
- Always scope transaction queries/updates/deletes by authenticated user.
- Never trust client-supplied user IDs.
- Validate transaction fields.
- Return appropriate HTTP status codes.
- Avoid leaking stack traces in production.

# Git/GitHub

The repository already exists and has been pushed.

Branch:
```text
main
```

Normal workflow:

```powershell
git status
git add .
git commit -m "Meaningful change"
git push
```

Do not recreate the repository.

# Immediate development order

1. Verify Update transaction.
2. Verify Delete transaction.
3. Finish/clean transaction CRUD and validation.
4. Implement DSA HashMap category analyzer.
5. Implement Max Heap top-expense feature.
6. Implement Stack undo delete.
7. Implement Queue recent activity.
8. Implement Trie transaction search.
9. Build analytics APIs.
10. Replace Vite starter with React authentication UI.
11. Build dashboard.
12. Build transaction UI.
13. Build analytics charts.
14. Connect DSA features to UI.
15. Add AI spending insights.
16. Improve UI/UX.
17. Update README with architecture, DSA, screenshots, API list and setup.
18. Test full application.
19. Deploy.
20. Push final version to GitHub.

# Coding-agent rules

When taking over:
1. Inspect existing files before modifying anything.
2. Preserve working authentication.
3. Preserve CommonJS backend style.
4. Do not create duplicate models, routes or auth systems.
5. Make small, testable changes.
6. Run/test relevant endpoints after backend changes.
7. Keep DSA implementations genuine and connected to real features.
8. Avoid unnecessary dependencies.
9. Keep code readable and interview-friendly.
10. Do not silently rewrite the entire project.
11. If something in the actual repository differs from this handoff, inspect the repository and treat the repository's current code as the source of truth.
12. Never claim a feature is complete without verifying it.

# Interview-ready eventual explanation

Once all planned features are truly implemented:

“SpendWise AI is a MERN-based personal finance management application. I implemented JWT-based authentication with bcrypt password hashing and MongoDB-backed transaction CRUD. To demonstrate DSA in a real application, I integrated a HashMap for category-wise expense aggregation, a Max Heap for top expenses, a Stack for undoing deleted transactions, a Queue for recent activity processing, and a Trie for prefix-based transaction search. The application also provides analytics and AI-generated spending insights.”

Do not use that statement as a factual claim until all listed DSA features are actually implemented.

# Current milestone

```text
Backend server              ✅
MongoDB                     ✅
Registration                ✅
Login                       ✅
JWT generation              ✅
JWT middleware              ✅
Protected route             ✅
Transaction model           ✅
Create transaction          ✅
Get transactions            ✅
Update transaction          🔶 verify
Delete transaction          🔶 verify
DSA                         ⏳ not yet implemented
Analytics                   ⏳
React UI                    ⏳ mostly Vite starter
AI                          ⏳
Deployment                  ⏳
```

## Start point for the coding agent

Do NOT start over.

First inspect:
```text
backend/server.js
backend/controllers/authController.js
backend/controllers/transactionController.js
backend/models/User.js
backend/models/Transaction.js
backend/middleware/authMiddleware.js
backend/routes/authRoutes.js
backend/routes/transactionRoutes.js
frontend/src/
backend/package.json
frontend/package.json
.gitignore
README.md
```

Then verify UPDATE and DELETE.

After CRUD is confirmed, begin the DSA layer with the HashMap category analyzer.

The goal is to turn the existing working backend foundation into a complete, polished MERN + DSA + AI portfolio project.
