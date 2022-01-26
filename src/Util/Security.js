const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Applies bcrypt hash with 10 salt rounds to keyValue - slow but secure
// Input : String!
// Return: String!
module.exports.ApplyHash_Long = async function (keyValue) {
  return await bcrypt.hash(keyValue, 10);
};

// Compare's keyValue to hashed bcrypt value
// Input : String! String!
// Return: Boolean!
module.exports.CompareHash_Long = async function (keyValue, hashedValue) {
  return await bcrypt.compare(keyValue, hashedValue);
};

// Applies sha256 hash to keyValue - not as secure as bcrypt, but faster
// Only use for values that already have high entrapy (ex: generated uuid)
// Input : String!
// Return: String!
module.exports.QuickHash = function (keyValue) {
  return crypto.createHash("sha256").update(keyValue).digest("hex");
};
