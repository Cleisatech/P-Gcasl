document.addEventListener("DOMContentLoaded", () => {
  // Redirect to login if not logged in as admin
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!isLoggedIn || loggedInUser !== "admin") {
    window.location.href = "admin-login.html";
    return;
  }

  const userDropdown = document.getElementById("user-dropdown");
  const fundUserForm = document.getElementById("fund-user-form");
  const verifiedUserDropdown = document.getElementById("verified-user-dropdown");
  const verifiedUserDetails = document.getElementById("verified-user-details");
  const verifiedName = document.getElementById("verified-name");
  const verifiedEmail = document.getElementById("verified-email");
  const verifiedPhone = document.getElementById("verified-phone");
  const verifiedIdFront = document.getElementById("verified-id-front");
  const verifiedIdBack = document.getElementById("verified-id-back");
  const logoutBtn = document.getElementById("logout-btn");

  // Fetch all users and populate the dropdown
  async function fetchUsers() {
    try {
      const response = await fetch("http://localhost:3000/api/admin/users"); // Correct API endpoint
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      const users = data.users;

      if (!Array.isArray(users) || users.length === 0) {
        console.warn("No users found.");
        userDropdown.innerHTML = '<option value="" disabled selected>No users available</option>';
        return;
      }

      userDropdown.innerHTML = '<option value="" disabled selected>Select a user</option>'; // Reset dropdown
      users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.accountNumber; // Use account number as the value
        option.textContent = `${user.firstName} ${user.lastName} (Account #: ${user.accountNumber})`;
        userDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      userDropdown.innerHTML = '<option value="" disabled selected>Error loading users</option>';
    }
  }

  // Fund a user
  fundUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const accountNumber = userDropdown.value; // Use accountNumber instead of userId
    const amount = parseFloat(document.getElementById("amount").value);

    if (!accountNumber || isNaN(amount) || amount <= 0) {
      alert("Please select a valid user and enter a valid amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/admin/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, amount }), // Send accountNumber and amount
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Show success message
        refreshUserBalance(accountNumber); // Refresh the user's balance
      } else {
        alert(result.message || "Failed to add funds."); // Show error message from backend
      }
    } catch (error) {
      console.error("Error funding user:", error);
      alert("An error occurred. Please try again.");
    }
  });

  // Fetch verified users and populate the dropdown
  async function fetchVerifiedUsers() {
    try {
      const response = await fetch("http://localhost:3000/verified-users"); // Fetch verified users
      if (!response.ok) {
        throw new Error(`Failed to fetch verified users: ${response.statusText}`);
      }

      const verifiedUsers = await response.json();

      verifiedUserDropdown.innerHTML = '<option value="" disabled selected>Select a verified user</option>'; // Reset dropdown
      verifiedUsers.forEach((user, index) => {
        const option = document.createElement("option");
        option.value = index; // Use index as the value
        option.textContent = user.name;
        verifiedUserDropdown.appendChild(option);
      });

      // Handle verified user selection
      verifiedUserDropdown.addEventListener("change", () => {
        const selectedIndex = verifiedUserDropdown.value;
        if (selectedIndex !== "") {
          const selectedUser = verifiedUsers[selectedIndex];
          verifiedName.textContent = selectedUser.name;
          verifiedEmail.textContent = selectedUser.email;
          verifiedPhone.textContent = selectedUser.phone;
          verifiedIdFront.href = `/${selectedUser.id_front_path}`;
          verifiedIdBack.href = `/${selectedUser.id_back_path}`;
          verifiedUserDetails.style.display = "block";
        } else {
          verifiedUserDetails.style.display = "none";
        }
      });
    } catch (error) {
      console.error("Error fetching verified users:", error);
    }
  }

  // Logout functionality
  logoutBtn.addEventListener("click", () => {
    // Clear localStorage or session data
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");

    // Redirect to the admin login page
    window.location.href = "admin-login.html";
  });

  // Initial fetch of users and verified users
  fetchUsers();
  fetchVerifiedUsers();
});

// Refresh user balance
async function refreshUserBalance(accountNumber) {
  try {
    const response = await fetch(`http://localhost:3000/api/user/balance?accountNumber=${accountNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch balance: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched updated balance for ${accountNumber}: ${data.balance}`); // Log the fetched balance
    alert(`Updated balance: ${data.balance}`); // Display the updated balance
  } catch (error) {
    console.error("Error fetching user balance:", error);
  }
}