document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    window.location.href = "login.html";
    return;
  }

  // Get user data from localStorage
  const userString = localStorage.getItem("loggedInUser");
  let user = null;

  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error("Error parsing user data:", e);
      return;
    }
  }

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Function to load transactions
  function loadTransactions(filter = "all") {
    const transactionsList = document.getElementById("transactions-list");
    const noTransactionsElement = document.getElementById("no-transactions");

    if (!transactionsList || !noTransactionsElement) return;

    // Fetch transactions from the API
    fetch("/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.transactions) {
          // Filter transactions for the current user
          let userTransactions = data.transactions.filter(
            (t) =>
              t.senderAccountNumber === user.account_number ||
              t.recipientAccountNumber === user.account_number
          );

          // Apply filter
          if (filter === "credit") {
            userTransactions = userTransactions.filter(
              (t) => t.recipientAccountNumber === user.account_number
            );
          } else if (filter === "debit") {
            userTransactions = userTransactions.filter(
              (t) => t.senderAccountNumber === user.account_number
            );
          }

          // Sort transactions by date (newest first)
          userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

          if (userTransactions.length > 0) {
            noTransactionsElement.style.display = "none";
            transactionsList.innerHTML = ""; // Clear existing transactions

            // Add transactions to the list
            userTransactions.forEach((transaction) => {
              const isCredit =
                transaction.recipientAccountNumber === user.account_number;
              const transactionItem = document.createElement("div");
              transactionItem.className = `transaction-item ${
                isCredit ? "credit" : "debit"
              }`;

              const formattedDate = new Date(
                transaction.date
              ).toLocaleDateString();
              const formattedAmount =
                "₱" +
                transaction.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

              transactionItem.innerHTML = `
                <div class="transaction-content">
                  <div class="transaction-icon ${
                    isCredit ? "credit" : "debit"
                  }">
                    <i class="fas ${
                      isCredit ? "fa-arrow-down" : "fa-arrow-up"
                    }"></i>
                  </div>
                  <div class="transaction-details">
                    <div class="transaction-title">${
                      isCredit
                        ? "Received from"
                        : "Sent to"
                    } ${
                isCredit
                  ? transaction.senderName || "Unknown"
                  : transaction.recipientName || "Unknown"
              }</div>
                    <div class="transaction-date">${formattedDate}</div>
                  </div>
                  <div class="transaction-amount ${
                    isCredit ? "credit" : "debit"
                  }">
                    ${isCredit ? "+" : "-"}${formattedAmount}
                  </div>
                </div>
              `;

              transactionsList.appendChild(transactionItem);
            });
          } else {
            noTransactionsElement.style.display = "block";
          }
        } else {
          noTransactionsElement.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        noTransactionsElement.style.display = "block";
      });
  }

  // Handle filter change
  const transactionFilter = document.getElementById("transaction-filter");
  if (transactionFilter) {
    transactionFilter.addEventListener("change", () => {
      loadTransactions(transactionFilter.value);
    });
  }

  // Load transactions on page load
  loadTransactions();

  // Handle profile button click
  const profileBtn = document.getElementById("profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }

  // Handle bottom navigation
  const navHome = document.getElementById("nav-home");
  if (navHome) {
    navHome.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});