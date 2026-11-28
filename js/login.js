/**
 * Student Shelter — Login Script (js/login.js)
 * Handles form validation, tab switching, and password visibility.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  
  const signupName = document.getElementById("signup-name");
  const signupEmail = document.getElementById("signup-email");
  const signupPassword = document.getElementById("signup-password");
  const signupTerms = document.getElementById("signup-terms");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Helper: Show error (Bootstrap style)
  function showError(input, message) {
    input.classList.add("is-invalid");
    // Find the invalid-feedback div right after the input, or create one
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains("invalid-feedback")) {
      errorDiv = document.createElement("div");
      errorDiv.className = "invalid-feedback";
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    errorDiv.textContent = message;
  }

  // Helper: Clear error
  function clearError(input) {
    input.classList.remove("is-invalid");
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("invalid-feedback")) {
      errorDiv.textContent = "";
    }
  }

  // --- LOGIN FORM ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Email Validation
      const emailValue = loginEmail.value.trim();
      if (!emailValue) {
        showError(loginEmail, "Email is required.");
        isValid = false;
      } else if (!EMAIL_PATTERN.test(emailValue)) {
        showError(loginEmail, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(loginEmail);
      }

      // Password Validation
      const passwordValue = loginPassword.value;
      if (!passwordValue) {
        showError(loginPassword, "Password is required.");
        isValid = false;
      } else if (passwordValue.length < 6) {
        showError(loginPassword, "Password must be at least 6 characters.");
        isValid = false;
      } else {
        clearError(loginPassword);
      }

      // If valid, show success (For demo purposes)
      if (isValid) {
        alert("Login Successful! Welcome back to Student Shelter.");
        loginForm.reset();
        // Yahan aap user ko dashboard par redirect kar sakte hain
        // window.location.href = "../index.html";
      }
    });

    // Clear errors on typing
    loginEmail.addEventListener("input", () => clearError(loginEmail));
    loginPassword.addEventListener("input", () => clearError(loginPassword));
  }

  // --- SIGNUP FORM ---
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Name Validation
      if (!signupName.value.trim()) {
        showError(signupName, "Full name is required.");
        isValid = false;
      } else {
        clearError(signupName);
      }

      // Email Validation
      const emailValue = signupEmail.value.trim();
      if (!emailValue) {
        showError(signupEmail, "Email is required.");
        isValid = false;
      } else if (!EMAIL_PATTERN.test(emailValue)) {
        showError(signupEmail, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(signupEmail);
      }

      // Password Validation
      if (signupPassword.value.length < 6) {
        showError(signupPassword, "Password must be at least 6 characters.");
        isValid = false;
      } else {
        clearError(signupPassword);
      }

      // Terms Validation
      if (!signupTerms.checked) {
        showError(signupTerms, "You must agree to the terms.");
        isValid = false;
      } else {
        clearError(signupTerms);
      }

      // If valid, show success
      if (isValid) {
        alert("Account Created Successfully! Welcome to Student Shelter.");
        signupForm.reset();
      }
    });

    // Clear errors on typing
    signupName.addEventListener("input", () => clearError(signupName));
    signupEmail.addEventListener("input", () => clearError(signupEmail));
    signupPassword.addEventListener("input", () => clearError(signupPassword));
    signupTerms.addEventListener("change", () => clearError(signupTerms));
  }
});