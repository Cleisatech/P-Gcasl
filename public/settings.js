
document.addEventListener("DOMContentLoaded", () => {
  // Handle back button click
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }

  // Handle verification button click
  const verificationBtn = document.getElementById("verification-btn");
  if (verificationBtn) {
    verificationBtn.addEventListener("click", () => {
      window.location.href = "verification.html";
    });
  }

  // Handle "Coming Soon" modal for Change Password and Notifications
  const changePasswordBtn = document.getElementById("change-password-btn");
  const notificationsBtn = document.getElementById("notifications-btn");
  const comingSoonModal = document.getElementById("coming-soon-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.add("active");
      }
    });
  }

  if (notificationsBtn) {
    notificationsBtn.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.add("active");
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.remove("active");
      }
    });
  }
});
