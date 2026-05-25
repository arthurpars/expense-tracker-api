const { randomUUID } = require("crypto");
const { read, write } = require("../utils/fileStore");

const VALID_CATEGORIES = [
  "Groceries",
  "Leisure",
  "Electronics",
  "Utilities",
  "Clothing",
  "Health",
  "Others",
];

// Returns a Date set to N days before today.
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// Narrows an expense list based on the ?filter query parameter.
const applyDateFilter = (expenses, query) => {
  const { filter, start_date, end_date } = query;

  if (!filter) return expenses;

  let from;
  let to = new Date();

  if (filter === "past_week") from = daysAgo(7);
  else if (filter === "past_month") from = daysAgo(30);
  else if (filter === "last_3_months") from = daysAgo(90);
  else if (filter === "custom") {
    if (!start_date || !end_date) {
      return expenses;
    }
    from = new Date(start_date);
    to = new Date(end_date);
  } else {
    return expenses;
  }

  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= from && d <= to;
  });
};

// Return only the expenses that belong to the logged-in user, with optional date filtering.
const getExpenses = (req, res) => {
  const expenses = read("expenses.json");
  const mine = expenses.filter((e) => e.userId === req.user.id);
  res.json(applyDateFilter(mine, req.query));
};

// Create a new expense and attach the userId from the JWT — never from the request body.
const createExpense = (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category || !date) {
    return res
      .status(400)
      .json({ message: "title, amount, category, and date are required" });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Invalid category. Allowed values: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  const expenses = read("expenses.json");

  const expense = {
    id: randomUUID(),
    userId: req.user.id,
    title,
    amount,
    category,
    date,
  };

  expenses.push(expense);
  write("expenses.json", expenses);
  res.status(201).json(expense);
};

// Update an expense — reject with 403 if the expense belongs to a different user.
const updateExpense = (req, res) => {
  const expenses = read("expenses.json");
  const index = expenses.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (expenses[index].userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You do not have permission to edit this expense" });
  }

  const { title, amount, category, date } = req.body;

  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Invalid category. Allowed values: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  // Merge only the provided fields; preserve id and userId.
  expenses[index] = { ...expenses[index], title, amount, category, date };
  write("expenses.json", expenses);
  res.json(expenses[index]);
};

// Delete an expense — reject with 403 if the expense belongs to a different user.
const deleteExpense = (req, res) => {
  const expenses = read("expenses.json");
  const target = expenses.find((e) => e.id === req.params.id);

  if (!target) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (target.userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this expense" });
  }

  write(
    "expenses.json",
    expenses.filter((e) => e.id !== req.params.id),
  );
  res.json({ message: "Expense deleted successfully" });
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
