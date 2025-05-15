document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("login-btn");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate inputs
      if (!emailInput.value || !passwordInput.value) {
        errorMessage.textContent = "Please fill in all fields";
        errorMessage.style.display = "block";
        return;
      }

      // Send login request to backend
      try {
        loginBtn.textContent = "Logging In...";
        loginBtn.disabled = true;

        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Save user data to localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(result.user));

          // Redirect to dashboard
          window.location.href = "dashboard.html";
        } else {
          errorMessage.textContent = result.message || "Login failed";
          errorMessage.style.display = "block";
        }
      } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.display = "block";
      } finally {
        loginBtn.textContent = "Sign In";
        loginBtn.disabled = false;
      }
    });
  }
});
