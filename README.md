# Expense Tracker API

---

## 📌 Routes & Example Usage

---

### 1 - setMonthlyExpense
- **Method:** `POST`
- **URL:** `/setMonthlyExpense`
- **Description:** Creates a new monthly expense entry in the database.
- **Send JSON in Body:**

```json
{
  "month": "January",
  "income": 20500,
  "expenseCategories": [
    { "category": "rent", "amount": 10000 },
    { "category": "groceries", "amount": 2500 },
    { "category": "uttarayan", "amount": 2000 }
  ]
}
```

---

### 2 - summary
- **Method:** `GET`
- **URL:** `/summary`
- **Description:** Returns total income, total expenses, and remaining balance.
- **Optional:** Send `month` in query to get month-specific summary.

```bash
GET /summary?month=january
```

---


### 3.1 updateIncome
- **Method:** `PATCH`
- **URL:** `/updateIncome`
- **Send JSON in Body:**

```json
{
  "month": "january",
  "income": 25000
}
```
- **Description:** Updates income value for a specific month.

---

### 3.2 updateCategoriesAmount
- **Method:** `PATCH`
- **URL:** `/updateCategoriesAmount`
- **Send JSON in Body:**

```json
{
  "month": "january",
  "category": "rent",
  "amount": 12000
}
```
- **Description:** Updates the `amount` of a specific category.

---

###  deleteCategory
- **Method:** `DELETE`
- **URL:** `/deleteCategory`
- **Send JSON in Body:**

```json
{
  "month": "january",
  "category": "rent"
}
```
- **Description:** Deletes a specific category from the given month.

---


### 📤 exportSummary
- **Method:** `POST`
- **URL:** `/exportSummary`
- **Send JSON in Body (optional):**

```json
{
  "month": "january"
}
```
- **Description:** Exports the summary (total income, expenses, and balance) as `.json` file.

---

## 🧾 Router List

```js
router.post("/setMonthlyExpense", expenseController.setExpenses);
router.get("/summary", expenseController.summary);
router.delete("/deleteCategory", expenseController.deleteExpenseCategory);
router.patch("/updateIncome", expenseController.updateIncome);
router.patch("/updateCategoriesAmount", expenseController.updateCategory);
router.post("/exportSummary", expenseController.exportSummary);
```

---