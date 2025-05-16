const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve frontend files
const frontendPath = path.join(__dirname, '../');
app.use(express.static(frontendPath));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Paths to JSON files (acting as a database)
const usersFilePath = path.join(__dirname, 'users.json');
const transactionsFilePath = path.join(__dirname, 'transactions.json');
const verifiedUsersFilePath = path.join(__dirname, 'verified-users.json');

// Helper function to read JSON files
const readJSON = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper function to write JSON files
const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Helper function to generate a random 10-digit account number
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Ensure all users have account numbers on server startup
const users = readJSON(usersFilePath);
let updated = false;
users.forEach((user) => {
  if (!user.accountNumber) {
    user.accountNumber = generateAccountNumber();
    updated = true;
  }
});
if (updated) {
  writeJSON(usersFilePath, users);
  console.log('Account numbers assigned to users without one.');
}

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory

// API Routes

// 1. User Registration
app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const users = readJSON(usersFilePath);

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const newUser = {
    id: Date.now(),
    accountNumber: generateAccountNumber(),
    firstName,
    lastName,
    email,
    password,
    balance: 0,
    documents: {},
  };

  users.push(newUser);
  writeJSON(usersFilePath, users);

  res.json({ success: true, message: 'User registered successfully', accountNumber: newUser.accountNumber });
});

// 2. User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(usersFilePath);

  const user = users.find((user) => user.email === email && user.password === password);
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({ success: true, user });
});

// 3. Admin: View All Users
app.get('/api/admin/users', (req, res) => {
  const users = readJSON(usersFilePath);
  res.json({ success: true, users });
});

// 4. Admin: Fund or Debit User Account
app.post('/api/admin/fund', (req, res) => {
  const { accountNumber, amount } = req.body;
  const users = readJSON(usersFilePath);

  const user = users.find((user) => user.accountNumber === accountNumber);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.balance += amount;
  writeJSON(usersFilePath, users);

  res.json({ success: true, message: `User balance updated. New balance: ${user.balance}` });
});

// 5. Admin: Reset User Password
app.post('/api/admin/reset-password', (req, res) => {
  const { accountNumber, newPassword } = req.body;
  const users = readJSON(usersFilePath);

  const user = users.find((user) => user.accountNumber === accountNumber);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.password = newPassword;
  writeJSON(usersFilePath, users);

  res.json({ success: true, message: 'Password reset successfully' });
});

// 6. Transactions: Send Money
app.post('/api/transactions/send', (req, res) => {
  const { senderAccountNumber, recipientAccountNumber, amount, note } = req.body;
  const users = readJSON(usersFilePath);
  const transactions = readJSON(transactionsFilePath);

  const sender = users.find((user) => user.accountNumber === senderAccountNumber);
  const recipient = users.find((user) => user.accountNumber === recipientAccountNumber);

  if (!sender || !recipient) {
    return res.status(404).json({ success: false, message: 'Sender or recipient not found' });
  }

  if (sender.balance < amount) {
    return res.status(400).json({ success: false, message: 'Insufficient balance' });
  }

  sender.balance -= amount;
  recipient.balance += amount;

  const transaction = {
    id: Date.now(),
    senderAccountNumber,
    recipientAccountNumber,
    amount,
    note,
    date: new Date(),
  };

  transactions.push(transaction);
  writeJSON(usersFilePath, users);
  writeJSON(transactionsFilePath, transactions);

  res.json({ success: true, message: 'Transaction successful', transaction });
});

// 7. Transactions: View Transaction History
app.get('/api/transactions', (req, res) => {
  const { accountNumber } = req.query;
  const transactions = readJSON(transactionsFilePath);

  const userTransactions = transactions.filter(
    (t) => t.senderAccountNumber === accountNumber || t.recipientAccountNumber === accountNumber
  );

  res.json({ success: true, transactions: userTransactions });
});

// Endpoint to fetch users
app.get('/users', (req, res) => {
  try {
    const users = readJSON(usersFilePath);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error reading users.json:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Endpoint to fetch user balance
app.get('/api/user/balance', (req, res) => {
  const { accountNumber } = req.query;
  const users = readJSON(usersFilePath);

  const user = users.find((user) => user.accountNumber === accountNumber);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, balance: user.balance });
});

// Verification endpoint
app.post('/verification', upload.fields([{ name: 'id_front' }, { name: 'id_back' }]), (req, res) => {
  try {
    const { user_id, name, email, phone } = req.body;
    const idFront = req.files['id_front']?.[0];
    const idBack = req.files['id_back']?.[0];

    if (!user_id || !name || !email || !phone || !idFront || !idBack) {
      return res.status(400).json({ success: false, message: 'All fields are required, including ID uploads.' });
    }

    const verifiedUsers = fs.existsSync(verifiedUsersFilePath)
      ? JSON.parse(fs.readFileSync(verifiedUsersFilePath, 'utf8'))
      : [];

    const verificationData = {
      user_id,
      name,
      email,
      phone,
      id_front_path: idFront.path,
      id_back_path: idBack.path,
      submitted_at: new Date(),
    };

    verifiedUsers.push(verificationData);
    fs.writeFileSync(verifiedUsersFilePath, JSON.stringify(verifiedUsers, null, 2));

    console.log('Verification data saved:', verificationData);

    res.json({ success: true, message: 'Verification submitted successfully!' });
  } catch (error) {
    console.error('Error processing verification:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing the verification.' });
  }
});

// Endpoint to fetch verified users
app.get('/verified-users', (req, res) => {
  try {
    const verifiedUsers = fs.existsSync(verifiedUsersFilePath)
      ? JSON.parse(fs.readFileSync(verifiedUsersFilePath, 'utf8'))
      : [];
    res.json(verifiedUsers);
  } catch (error) {
    console.error('Error reading verified-users.json:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch verified users.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
