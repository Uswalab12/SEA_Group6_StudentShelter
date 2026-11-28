document.addEventListener("DOMContentLoaded", () => {
  // Navbar, Dropdown & Dark Mode controls (matching pages/locations.html)
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navSearchBtn = document.getElementById("nav-search-btn");
  const darkModeBtn = document.getElementById("dark-mode-toggle");
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  // Auth tabs & panels
  const authTabsContainer = document.querySelector(".auth-tabs");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const panelLogin = document.getElementById("panel-login");
  const panelSignup = document.getElementById("panel-signup");
  const switchTabButtons = document.querySelectorAll("[data-switch-tab]");

  // Login form controls
  const loginForm = document.getElementById("login-form");
  const loginErrorSummary = document.getElementById("login-error-summary");
  const loginInfoBanner = document.getElementById("login-info-banner");
  const loginEmailInput = document.getElementById("login-email");
  const loginPasswordInput = document.getElementById("login-password");
  const rememberMeCheckbox = document.getElementById("remember-me");
  const forgotPasswordBtn = document.getElementById("forgot-password-btn");
  const errorLoginEmail = document.getElementById("error-login-email");
  const errorLoginPassword = document.getElementById("error-login-password");

  // Sign Up form controls
  const signupForm = document.getElementById("signup-form");
  const signupErrorSummary = document.getElementById("signup-error-summary");
  const signupNameInput = document.getElementById("signup-name");
  const signupEmailInput = document.getElementById("signup-email");
  const signupPhoneInput = document.getElementById("signup-phone");
  const signupCitySelect = document.getElementById("signup-city");
  const signupPasswordInput = document.getElementById("signup-password");
  const signupConfirmPasswordInput = document.getElementById("signup-confirm-password");
  const signupTermsCheckbox = document.getElementById("signup-terms");
  const errorSignupName = document.getElementById("error-signup-name");
  const errorSignupEmail = document.getElementById("error-signup-email");
  const errorSignupPhone = document.getElementById("error-signup-phone");
  const errorSignupCity = document.getElementById("error-signup-city");
  const errorSignupPassword = document.getElementById("error-signup-password");
  const errorSignupConfirmPassword = document.getElementById("error-signup-confirm-password");
  const errorSignupTerms = document.getElementById("error-signup-terms");

  // Confirmation elements
  const authConfirmation = document.getElementById("auth-confirmation");
  const confirmationBadge = document.getElementById("confirmation-badge");
  const confirmationTitle = document.getElementById("confirmation-title");
  const confirmationText = document.getElementById("confirmation-text");
  const confirmationSummary = document.getElementById("confirmation-summary");
  const logoutBtn = document.getElementById("logout-btn");

  const passwordToggleButtons = document.querySelectorAll(".password-toggle-btn");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^03\d{2}-\d{7}$/;

  /* ---------------- Navbar & Dark Mode Behaviour ---------------- */
  function closeAllDropdowns(exceptDropdown = null) {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== exceptDropdown) {
        dropdown.classList.remove("open");
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function closeMobileMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    closeAllDropdowns();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) closeAllDropdowns();
    });

    navMenu.querySelectorAll("a.nav-link, a.nav-dropdown-link, .nav-login-btn").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains("open");
      closeAllDropdowns(dropdown);
      dropdown.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });

  if (navSearchBtn) {
    navSearchBtn.addEventListener("click", () => {
      closeMobileMenu();
      const authSection = document.getElementById("auth-section");
      if (authSection) {
        authSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const activeInput = !panelSignup.hidden ? signupNameInput : loginEmailInput;
      if (activeInput && authConfirmation.hidden) {
        activeInput.focus({ preventScroll: true });
      }
    });
  }

  // Dark Mode button accessible state toggle (colors/theme unchanged, matching locations.js)
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      const isPressed = darkModeBtn.getAttribute("aria-pressed") === "true";
      darkModeBtn.setAttribute("aria-pressed", String(!isPressed));
    });
  }

  /* ---------------- Tab Switching ---------------- */
  function activateTab(tabName) {
    const isSignup = tabName === "signup";

    tabLogin.classList.toggle("active", !isSignup);
    tabLogin.setAttribute("aria-selected", String(!isSignup));

    tabSignup.classList.toggle("active", isSignup);
    tabSignup.setAttribute("aria-selected", String(isSignup));

    panelLogin.hidden = isSignup;
    panelSignup.hidden = !isSignup;

    authTabsContainer.hidden = false;
    authConfirmation.hidden = true;
  }

  tabLogin.addEventListener("click", () => activateTab("login"));
  tabSignup.addEventListener("click", () => activateTab("signup"));

  switchTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activateTab(btn.dataset.switchTab);
    });
  });

  /* ---------------- Password Visibility Toggles ---------------- */
  passwordToggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetInput = document.getElementById(btn.dataset.target);
      if (!targetInput) return;
      const isHidden = targetInput.type === "password";
      targetInput.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "Hide" : "Show";
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      btn.setAttribute("aria-pressed", String(isHidden));
    });
  });

  /* ---------------- Validation Helpers ---------------- */
  function showFieldError(inputEl, errorEl, message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
    if (inputEl) {
      inputEl.setAttribute("aria-invalid", "true");
    }
  }

  function clearFieldError(inputEl, errorEl) {
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
    if (inputEl) {
      inputEl.removeAttribute("aria-invalid");
    }
  }

  function clearLoginErrors() {
    loginErrorSummary.hidden = true;
    clearFieldError(loginEmailInput, errorLoginEmail);
    clearFieldError(loginPasswordInput, errorLoginPassword);
  }

  function clearSignupErrors() {
    signupErrorSummary.hidden = true;
    clearFieldError(signupNameInput, errorSignupName);
    clearFieldError(signupEmailInput, errorSignupEmail);
    clearFieldError(signupPhoneInput, errorSignupPhone);
    clearFieldError(signupCitySelect, errorSignupCity);
    clearFieldError(signupPasswordInput, errorSignupPassword);
    clearFieldError(signupConfirmPasswordInput, errorSignupConfirmPassword);
    clearFieldError(signupTermsCheckbox, errorSignupTerms);
  }

  function validateLoginForm() {
    clearLoginErrors();
    let hasErrors = false;
    let firstInvalid = null;

    const emailValue = loginEmailInput.value.trim();
    if (!emailValue) {
      showFieldError(loginEmailInput, errorLoginEmail, "Email address is required.");
      hasErrors = true;
      firstInvalid = firstInvalid || loginEmailInput;
    } else if (!EMAIL_PATTERN.test(emailValue)) {
      showFieldError(loginEmailInput, errorLoginEmail, "Please enter a valid email address.");
      hasErrors = true;
      firstInvalid = firstInvalid || loginEmailInput;
    }

    const passwordValue = loginPasswordInput.value;
    if (!passwordValue) {
      showFieldError(loginPasswordInput, errorLoginPassword, "Password is required.");
      hasErrors = true;
      firstInvalid = firstInvalid || loginPasswordInput;
    } else if (passwordValue.length < 6) {
      showFieldError(loginPasswordInput, errorLoginPassword, "Password must be at least 6 characters.");
      hasErrors = true;
      firstInvalid = firstInvalid || loginPasswordInput;
    }

    if (hasErrors) {
      loginErrorSummary.hidden = false;
      if (firstInvalid) firstInvalid.focus();
      return false;
    }

    return true;
  }

  function validateSignupForm() {
    clearSignupErrors();
    let hasErrors = false;
    let firstInvalid = null;

    if (!signupNameInput.value.trim()) {
      showFieldError(signupNameInput, errorSignupName, "Full Name is required.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupNameInput;
    }

    const emailValue = signupEmailInput.value.trim();
    if (!emailValue) {
      showFieldError(signupEmailInput, errorSignupEmail, "Email address is required.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupEmailInput;
    } else if (!EMAIL_PATTERN.test(emailValue)) {
      showFieldError(signupEmailInput, errorSignupEmail, "Please enter a valid email address.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupEmailInput;
    }

    const phoneValue = signupPhoneInput.value.trim();
    if (!phoneValue) {
      showFieldError(
        signupPhoneInput,
        errorSignupPhone,
        "Contact Number is required (format: 03XX-XXXXXXX)."
      );
      hasErrors = true;
      firstInvalid = firstInvalid || signupPhoneInput;
    } else if (!PHONE_PATTERN.test(phoneValue)) {
      showFieldError(
        signupPhoneInput,
        errorSignupPhone,
        "Invalid format. Please use 03XX-XXXXXXX (e.g., 0300-1234567)."
      );
      hasErrors = true;
      firstInvalid = firstInvalid || signupPhoneInput;
    }

    if (!signupCitySelect.value) {
      showFieldError(signupCitySelect, errorSignupCity, "Please select your preferred city.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupCitySelect;
    }

    const passwordValue = signupPasswordInput.value;
    if (!passwordValue) {
      showFieldError(signupPasswordInput, errorSignupPassword, "Password is required.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupPasswordInput;
    } else if (passwordValue.length < 6) {
      showFieldError(signupPasswordInput, errorSignupPassword, "Password must be at least 6 characters.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupPasswordInput;
    }

    const confirmPasswordValue = signupConfirmPasswordInput.value;
    if (!confirmPasswordValue) {
      showFieldError(signupConfirmPasswordInput, errorSignupConfirmPassword, "Please confirm your password.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupConfirmPasswordInput;
    } else if (confirmPasswordValue !== passwordValue) {
      showFieldError(signupConfirmPasswordInput, errorSignupConfirmPassword, "Passwords do not match.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupConfirmPasswordInput;
    }

    if (!signupTermsCheckbox.checked) {
      showFieldError(signupTermsCheckbox, errorSignupTerms, "You must agree to the terms to create an account.");
      hasErrors = true;
      firstInvalid = firstInvalid || signupTermsCheckbox;
    }

    if (hasErrors) {
      signupErrorSummary.hidden = false;
      if (firstInvalid) firstInvalid.focus();
      return false;
    }

    return true;
  }

  /* ---------------- Confirmation View ---------------- */
  function showConfirmation({ badge, title, text, items }) {
    confirmationBadge.textContent = badge;
    confirmationTitle.textContent = title;
    confirmationText.textContent = text;

    confirmationSummary.innerHTML = "";
    items.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "confirmation-item";

      const dt = document.createElement("dt");
      dt.textContent = label;

      const dd = document.createElement("dd");
      dd.textContent = value;

      item.appendChild(dt);
      item.appendChild(dd);
      confirmationSummary.appendChild(item);
    });

    authTabsContainer.hidden = true;
    panelLogin.hidden = true;
    panelSignup.hidden = true;
    authConfirmation.hidden = false;
  }

  /* ---------------- Event Listeners ---------------- */
  loginEmailInput.addEventListener("input", () => clearFieldError(loginEmailInput, errorLoginEmail));
  loginPasswordInput.addEventListener("input", () => clearFieldError(loginPasswordInput, errorLoginPassword));

  signupNameInput.addEventListener("input", () => clearFieldError(signupNameInput, errorSignupName));
  signupEmailInput.addEventListener("input", () => clearFieldError(signupEmailInput, errorSignupEmail));
  signupPhoneInput.addEventListener("input", () => clearFieldError(signupPhoneInput, errorSignupPhone));
  signupCitySelect.addEventListener("change", () => clearFieldError(signupCitySelect, errorSignupCity));
  signupPasswordInput.addEventListener("input", () => clearFieldError(signupPasswordInput, errorSignupPassword));
  signupConfirmPasswordInput.addEventListener("input", () =>
    clearFieldError(signupConfirmPasswordInput, errorSignupConfirmPassword)
  );
  signupTermsCheckbox.addEventListener("change", () => clearFieldError(signupTermsCheckbox, errorSignupTerms));

  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", () => {
      const enteredEmail = loginEmailInput.value.trim();
      loginInfoBanner.textContent = enteredEmail && EMAIL_PATTERN.test(enteredEmail)
        ? `Password reset instructions can be requested by contacting support@studentshelter.pk for ${enteredEmail}.`
        : "Enter your email address above or contact support@studentshelter.pk for password recovery assistance.";
      loginInfoBanner.hidden = false;
    });
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginInfoBanner.hidden = true;
    if (!validateLoginForm()) return;

    const email = loginEmailInput.value.trim();
    const rememberStatus = rememberMeCheckbox.checked ? "Enabled" : "Session only";

    showConfirmation({
      badge: "Signed In",
      title: "Welcome Back to Student Shelter!",
      text: "You are now signed in. You can proceed to book a verified student hostel or browse cities.",
      items: [
        ["Account Email", email],
        ["Remember Device", rememberStatus],
        ["Account Status", "Active Student Profile"],
        ["Portal Access", "Bookings & Saved Areas"]
      ]
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateSignupForm()) return;

    const fullName = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const phone = signupPhoneInput.value.trim();
    const city = signupCitySelect.value;

    showConfirmation({
      badge: "Account Created",
      title: `Welcome, ${fullName}!`,
      text: "Your Student Shelter account has been created successfully. You can now reserve a hostel room in your preferred city.",
      items: [
        ["Student Name", fullName],
        ["Email Address", email],
        ["Contact Number", phone],
        ["Preferred City", city]
      ]
    });
  });

  function resetPasswordVisibility() {
    passwordToggleButtons.forEach((btn) => {
      const targetInput = document.getElementById(btn.dataset.target);
      if (targetInput) {
        targetInput.type = "password";
      }
      btn.textContent = "Show";
      btn.setAttribute("aria-label", "Show password");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  logoutBtn.addEventListener("click", () => {
    loginForm.reset();
    signupForm.reset();
    resetPasswordVisibility();
    clearLoginErrors();
    clearSignupErrors();
    loginInfoBanner.hidden = true;
    activateTab("login");
  });

  // Support optional ?tab=signup query parameter
  const params = new URLSearchParams(window.location.search);
  if (params.get("tab") === "signup" || window.location.hash === "#signup") {
    activateTab("signup");
  }
});
