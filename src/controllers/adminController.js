const { read, write } = require("../utils/fileStore");

// Return every expense in the system across all users.
const getAllExpenses = (req, res) => {
  res.json(read("expenses.json"));
};

// Return all registered users — passwords are stripped before sending.
const getAllUsers = (req, res) => {
  const users = read("users.json");
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.json(safeUsers);
};

// Allow an admin to delete any expense regardless of who owns it.
const deleteExpense = (req, res) => {
  const expenses = read("expenses.json");
  const target = expenses.find((e) => e.id === req.params.id);

  if (!target) {
    return res.status(404).json({ message: "Expense not found" });
  }

  write(
    "expenses.json",
    expenses.filter((e) => e.id !== req.params.id),
  );
  res.json({ message: "Expense deleted by admin" });
};

module.exports = { getAllExpenses, getAllUsers, deleteExpense };
