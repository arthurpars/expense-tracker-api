const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// All expense routes require a valid JWT.
router.use(authenticate);

router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
