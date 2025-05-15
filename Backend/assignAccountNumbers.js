const fs = require('fs');
const path = require('path');

// Path to users.json
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to generate a random 10-digit account number
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Read users.json
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

// Assign account numbers to users without one
let updated = false;
users.forEach((user) => {
  if (!user.accountNumber) {
    user.accountNumber = generateAccountNumber();
    updated = true;
  }
});

// Write back to users.json if any updates were made
if (updated) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  console.log('Account numbers assigned to users without one.');
} else {
  console.log('All users already have account numbers.');
}
