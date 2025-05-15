document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const signupBtn = document.getElementById("signup-btn");
  const errorMessage = document.getElementById("error-message");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate inputs
      if (
        !firstNameInput.value ||
        !lastNameInput.value ||
        !emailInput.value ||
        !passwordInput.value
      ) {
        errorMessage.textContent = "Please fill in all fields";
        errorMessage.style.display = "block";
        return;
      }

      // Send data to the backend
      try {
        signupBtn.textContent = "Creating Account...";
        signupBtn.disabled = true;

        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert(`Signup successful! Your account number is ${result.accountNumber}`);
          window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
          errorMessage.textContent = result.message || "Signup failed";
          errorMessage.style.display = "block";
        }
      } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.display = "block";
      } finally {
        signupBtn.textContent = "Create Account";
        signupBtn.disabled = false;
      }
    });
  }
});
