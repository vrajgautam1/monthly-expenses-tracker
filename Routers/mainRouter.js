const express = require("express");
const router = express.Router();
const expenseController = require("../Controllers/expneseController")

router.post("/setMonthlyExpense", expenseController.setExpenses)
router.get("/summary", expenseController.summary)
router.delete("/deleteCategory", expenseController.deleteExpenseCategory)
router.patch("/updateIncome", expenseController.updateIncome)
router.patch("/updateCategoriesAmount", expenseController.updateCategory)
router.post("/exportSummary", expenseController.exportSummary);


module.exports = router