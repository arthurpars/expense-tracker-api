const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getAllExpenses,
  getAllUsers,
  deleteExpense,
} = require("../controllers/adminController");

// All admin routes require a valid JWT and the "admin" role.
router.use(authenticate, authorize("admin"));

router.get("/expenses", getAllExpenses);
router.get("/users", getAllUsers);
router.delete("/expenses/:id", deleteExpense);

module.exports = router;
