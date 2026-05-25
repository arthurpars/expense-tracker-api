const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");

// Read a JSON file from /data. If the file is missing, create it as an empty array.
const read = (filename) => {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, "[]");
  }
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
};

// Overwrite a JSON file in /data with the given data array.
const write = (filename, data) => {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

module.exports = { read, write };
