document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isLoggedIn || !user) {
    // Redirect to login page if not logged in
    window.location.href = "login.html";
    return;
  }

  // Display user information on the dashboard
  const userNameElement = document.getElementById("user-name");
  const accountNumberElement = document.getElementById("account-number");
  const balanceElement = document.getElementById("checking-balance");

  if (userNameElement) userNameElement.textContent = user.firstName; // Display user's first name
  if (accountNumberElement) accountNumberElement.textContent = user.accountNumber; // Display account number
  if (balanceElement) balanceElement.textContent = user.balance.toFixed(2); // Display balance

  // Handle profile button click to open the side menu
  const profileBtn = document.getElementById("profile-btn");
  const sideMenu = document.getElementById("side-menu");
  const overlay = document.getElementById("overlay");

  if (profileBtn && sideMenu && overlay) {
    profileBtn.addEventListener("click", () => {
      sideMenu.classList.add("active");
      overlay.classList.add("active");
    });

    overlay.addEventListener("click", () => {
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Handle logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      alert("You have been logged out.");
      window.location.href = "login.html";
    });
  }

  // Handle navigation to "Send Money" page
  const sendMoneyFeature = document.getElementById("send-money-feature");
  if (sendMoneyFeature) {
    sendMoneyFeature.addEventListener("click", () => {
      window.location.href = "send-money.html";
    });
  }

  // Handle navigation to "Transactions" page
  const transactionsFeature = document.getElementById("transactions-feature");
  if (transactionsFeature) {
    transactionsFeature.addEventListener("click", () => {
      window.location.href = "transactions.html";
    });
  }

  // Handle "Coming Soon" modal for other features
  const comingSoonModal = document.getElementById("coming-soon-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");

  const otherFeatures = document.querySelectorAll(
    ".menu-item:not(#send-money-feature):not(#transactions-feature)"
  );

  otherFeatures.forEach((feature) => {
    feature.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.add("active");
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.remove("active");
      }
    });
  }

  // Load recent transactions
  loadRecentTransactions();
});

// Function to load recent transactions
function loadRecentTransactions() {
  const transactionsList = document.getElementById("recent-transactions-list");
  const noTransactionsElement = document.getElementById("no-recent-transactions");

  if (!transactionsList || !noTransactionsElement) return;

  // Simulate fetching transactions (replace with API call if needed)
  const transactions = []; // Empty array for a new user

  if (transactions.length > 0) {
    noTransactionsElement.style.display = "none";
    transactionsList.innerHTML = ""; // Clear existing transactions

    transactions.forEach((transaction) => {
      const transactionItem = document.createElement("div");
      transactionItem.className = `transaction-item ${transaction.type}`;
      transactionItem.innerHTML = `
        <div class="transaction-content">
          <div class="transaction-details">
            <div class="transaction-title">${transaction.description}</div>
            <div class="transaction-date">${transaction.date}</div>
          </div>
          <div class="transaction-amount ${transaction.type}">
            ${transaction.type === "credit" ? "+" : "-"}₱${transaction.amount.toFixed(2)}
          </div>
        </div>
      `;
      transactionsList.appendChild(transactionItem);
    });
  } else {
    noTransactionsElement.style.display = "block";
  }
}
