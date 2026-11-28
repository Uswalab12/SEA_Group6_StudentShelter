// Hostel data loaded dynamically into the Select Hostel dropdown on pages/book-hostel.html
const hostels = [
  {
    id: "scholar-haven-isb",
    name: "Scholar Haven Residency",
    city: "Islamabad",
    rent: 16000
  },
  {
    id: "margalla-view-isb",
    name: "Margalla View Student Hostel",
    city: "Islamabad",
    rent: 17500
  },
  {
    id: "twin-city-rwp",
    name: "Twin City Scholars Lodge",
    city: "Rawalpindi",
    rent: 13500
  },
  {
    id: "crescent-rwp",
    name: "Crescent Student Residency",
    city: "Rawalpindi",
    rent: 14500
  },
  {
    id: "johar-suites-lhr",
    name: "Johar Campus Suites",
    city: "Lahore",
    rent: 14500
  },
  {
    id: "gulberg-heritage-lhr",
    name: "Gulberg Heritage Hostel",
    city: "Lahore",
    rent: 16500
  },
  {
    id: "university-road-khi",
    name: "University Road Scholars Inn",
    city: "Karachi",
    rent: 15000
  },
  {
    id: "pechs-student-khi",
    name: "PECHS Student Residency",
    city: "Karachi",
    rent: 16500
  }
];

function getTodayISO() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().split("T")[0];
}

function formatRentPKR(amount) {
  return `PKR ${amount.toLocaleString("en-PK")}/month`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Navbar, Dropdown & Dark Mode controls (matching pages/locations.html)
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navSearchBtn = document.getElementById("nav-search-btn");
  const darkModeBtn = document.getElementById("dark-mode-toggle");
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  // Booking form controls
  const bookingForm = document.getElementById("booking-form");
  const errorSummary = document.getElementById("form-error-summary");
  const studentNameInput = document.getElementById("student-name");
  const hostelSelect = document.getElementById("hostel-select");
  const contactNumberInput = document.getElementById("contact-number");
  const roomTypeRadios = document.querySelectorAll('input[name="roomType"]');
  const roomTypeGroup = document.querySelector(".room-type-group");
  const checkinDateInput = document.getElementById("checkin-date");
  const stayDurationSelect = document.getElementById("stay-duration");

  // Error message elements
  const errorStudentName = document.getElementById("error-student-name");
  const errorHostel = document.getElementById("error-hostel");
  const errorContactNumber = document.getElementById("error-contact-number");
  const errorRoomType = document.getElementById("error-room-type");
  const errorCheckinDate = document.getElementById("error-checkin-date");
  const errorStayDuration = document.getElementById("error-stay-duration");

  // Confirmation elements
  const confirmationBox = document.getElementById("booking-confirmation");
  const confirmationSummary = document.getElementById("confirmation-summary");
  const newBookingBtn = document.getElementById("new-booking-btn");

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

  if (navSearchBtn && hostelSelect) {
    navSearchBtn.addEventListener("click", () => {
      closeMobileMenu();
      const bookingSection = document.getElementById("booking-section");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      hostelSelect.focus({ preventScroll: true });
    });
  }

  // Dark Mode button accessible state toggle (colors/theme unchanged, matching locations.js)
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      const isPressed = darkModeBtn.getAttribute("aria-pressed") === "true";
      darkModeBtn.setAttribute("aria-pressed", String(!isPressed));
    });
  }

  /* ---------------- Populate Form Controls ---------------- */
  function populateHostelDropdown() {
    hostels.forEach((hostel) => {
      const option = document.createElement("option");
      option.value = hostel.id;
      option.textContent = `${hostel.name} (${hostel.city}) — ${formatRentPKR(hostel.rent)}`;
      hostelSelect.appendChild(option);
    });
  }

  function configureDatePicker() {
    // Disallow past dates in the native date picker while keeping State 1 empty
    checkinDateInput.min = getTodayISO();
  }

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

  function clearAllErrors() {
    errorSummary.hidden = true;
    clearFieldError(studentNameInput, errorStudentName);
    clearFieldError(hostelSelect, errorHostel);
    clearFieldError(contactNumberInput, errorContactNumber);
    clearFieldError(null, errorRoomType);
    if (roomTypeGroup) roomTypeGroup.classList.remove("invalid");
    clearFieldError(checkinDateInput, errorCheckinDate);
    clearFieldError(stayDurationSelect, errorStayDuration);
  }

  function getSelectedRoomType() {
    const checked = Array.from(roomTypeRadios).find((radio) => radio.checked);
    return checked ? checked.value : "";
  }

  function validateBookingForm() {
    clearAllErrors();
    let hasErrors = false;
    let firstInvalidElement = null;

    // 1. Student Name
    if (!studentNameInput.value.trim()) {
      showFieldError(studentNameInput, errorStudentName, "Student Name is required.");
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || studentNameInput;
    }

    // 2. Select Hostel
    if (!hostelSelect.value) {
      showFieldError(hostelSelect, errorHostel, "Please select a hostel from the list.");
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || hostelSelect;
    }

    // 3. Contact Number (03XX-XXXXXXX)
    const contactValue = contactNumberInput.value.trim();
    const contactPattern = /^03\d{2}-\d{7}$/;
    if (!contactValue) {
      showFieldError(
        contactNumberInput,
        errorContactNumber,
        "Contact Number is required. Please use the format 03XX-XXXXXXX (e.g., 0300-1234567)."
      );
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || contactNumberInput;
    } else if (!contactPattern.test(contactValue)) {
      showFieldError(
        contactNumberInput,
        errorContactNumber,
        "Invalid Contact Number. Please enter it in the format 03XX-XXXXXXX (for example, 0300-1234567)."
      );
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || contactNumberInput;
    }

    // 4. Room Type (Single or Shared)
    const selectedRoom = getSelectedRoomType();
    if (!selectedRoom) {
      showFieldError(null, errorRoomType, "Please select a Room Type (Single or Shared).");
      if (roomTypeGroup) roomTypeGroup.classList.add("invalid");
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || roomTypeRadios[0];
    }

    // 5. Check-in Date (required, no past dates)
    const checkinValue = checkinDateInput.value;
    const todayISO = getTodayISO();
    if (!checkinValue) {
      showFieldError(checkinDateInput, errorCheckinDate, "Check-in Date is required.");
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || checkinDateInput;
    } else if (checkinValue < todayISO) {
      showFieldError(
        checkinDateInput,
        errorCheckinDate,
        "Check-in Date cannot be in the past. Please choose today or a future date."
      );
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || checkinDateInput;
    }

    // 6. Stay Duration
    if (!stayDurationSelect.value) {
      showFieldError(stayDurationSelect, errorStayDuration, "Please select a Stay Duration.");
      hasErrors = true;
      firstInvalidElement = firstInvalidElement || stayDurationSelect;
    }

    if (hasErrors) {
      errorSummary.textContent = "Please fill all required fields";
      errorSummary.hidden = false;
      if (firstInvalidElement) {
        firstInvalidElement.focus();
      }
      return false;
    }

    return true;
  }

  function showBookingConfirmation() {
    const selectedHostel = hostels.find((h) => h.id === hostelSelect.value);
    const hostelLabel = selectedHostel
      ? `${selectedHostel.name} (${selectedHostel.city}) — ${formatRentPKR(selectedHostel.rent)}`
      : hostelSelect.value;

    const summaryItems = [
      ["Student Name", studentNameInput.value.trim()],
      ["Selected Hostel", hostelLabel],
      ["Contact Number", contactNumberInput.value.trim()],
      ["Room Type", getSelectedRoomType()],
      ["Check-in Date", checkinDateInput.value],
      ["Stay Duration", stayDurationSelect.value]
    ];

    confirmationSummary.innerHTML = "";
    summaryItems.forEach(([label, value]) => {
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

    bookingForm.hidden = true;
    confirmationBox.hidden = false;
  }

  function resetToEmptyForm() {
    bookingForm.reset();
    clearAllErrors();
    configureDatePicker();
    bookingForm.hidden = false;
    confirmationBox.hidden = true;
  }

  /* ---------------- Event Listeners ---------------- */
  studentNameInput.addEventListener("input", () => {
    clearFieldError(studentNameInput, errorStudentName);
  });

  hostelSelect.addEventListener("change", () => {
    clearFieldError(hostelSelect, errorHostel);
  });

  contactNumberInput.addEventListener("input", () => {
    clearFieldError(contactNumberInput, errorContactNumber);
  });

  roomTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      clearFieldError(null, errorRoomType);
      if (roomTypeGroup) roomTypeGroup.classList.remove("invalid");
    });
  });

  checkinDateInput.addEventListener("change", () => {
    clearFieldError(checkinDateInput, errorCheckinDate);
  });

  stayDurationSelect.addEventListener("change", () => {
    clearFieldError(stayDurationSelect, errorStayDuration);
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateBookingForm()) {
      showBookingConfirmation();
    }
  });

  if (newBookingBtn) {
    newBookingBtn.addEventListener("click", resetToEmptyForm);
  }

  /* ---------------- Initialize Empty Form (State 1) ---------------- */
  populateHostelDropdown();
  configureDatePicker();
});
