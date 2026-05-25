const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const { read, write } = require("../utils/fileStore");

// Register a new user with a hashed password and default role of "user".
const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const users = read("users.json");

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: randomUUID(),
    email,
    password: hashedPassword,
    role: "user",
  };

  users.push(newUser);
  write("users.json", users);

  res
    .status(201)
    .json({ message: "Account created successfully", userId: newUser.id });
};

// Verify credentials and return a signed JWT containing id, email, and role.
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const users = read("users.json");
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Encode id, email, and role so middleware can verify privileges without re-reading the file.
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.json({ token });
};

module.exports = { signup, login };
