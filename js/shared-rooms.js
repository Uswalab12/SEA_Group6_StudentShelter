/**
 * Student Shelter — Shared Rooms Script (js/shared-rooms.js)
 * Author: Mohammad Saood Khan (26i-3018)
 *
 * Features handled by this file:
 * 1. Sample shared room listings using project hostel names.
 * 2. Automatic per-student rent calculation (totalRoomRent / occupants).
 * 3. Budget and occupancy filtering + rent sorting with input validation.
 * 4. "Show More Room Options" incremental reveal.
 * 5. Wishlist save/remove persisted in localStorage.
 * 6. Monthly cost calculator for 1, 3, 6, or 12 months.
 * 7. Recently viewed rooms tracking persisted in localStorage.
 */

// =========================================================
// 1. Configuration Constants
// =========================================================
const WISHLIST_STORAGE_KEY = "studentShelterWishlist";
const RECENT_STORAGE_KEY = "studentShelterRecentlyViewed";
const INITIAL_VISIBLE_COUNT = 3;
const LOAD_MORE_STEP = 3;
const MAX_RECENT_ITEMS = 4;

// Track how many room cards are currently shown on screen
let visibleRoomCount = INITIAL_VISIBLE_COUNT;

// =========================================================
// 2. Sample Shared Room Data (Demonstration Listings)
// =========================================================
// Note: We store totalRoomRent and occupants here, and calculate
// rentPerStudent automatically below so the math always stays accurate.
const rawSharedRooms = [
  {
    id: "green-valley-scholars",
    hostelName: "Green Valley Scholars Hostel",
    cityArea: "Islamabad • Sector H-12",
    roomType: "Double Sharing",
    occupants: 2,
    totalRoomRent: 28000,
    facilities: ["High-Speed WiFi", "Backup Power", "Study Desks", "Daily Mess"],
    availability: "2 Beds Left",
    visualTheme: "room-visual-emerald"
  },
  {
    id: "crescent-girls-residency",
    hostelName: "Crescent Girls Residency",
    cityArea: "Lahore • Johar Town",
    roomType: "Double Sharing",
    occupants: 2,
    totalRoomRent: 32000,
    facilities: ["High-Speed WiFi", "CCTV Security", "Attached Bath", "Laundry"],
    availability: "Available",
    visualTheme: "room-visual-forest"
  },
  {
    id: "campus-edge-suites",
    hostelName: "Campus Edge Student Suites",
    cityArea: "Karachi • Gulshan-e-Iqbal",
    roomType: "Triple Sharing",
    occupants: 3,
    totalRoomRent: 36000,
    facilities: ["High-Speed WiFi", "Generator Backup", "Cooling Fan & AC", "RO Water"],
    availability: "3 Beds Left",
    visualTheme: "room-visual-sage"
  },
  {
    id: "margalla-pines-home",
    hostelName: "Margalla Pines Student Home",
    cityArea: "Rawalpindi • Scheme III",
    roomType: "Triple Sharing",
    occupants: 3,
    totalRoomRent: 30000,
    facilities: ["WiFi", "Study Lounge", "Mess Included", "Bike Parking"],
    availability: "Available",
    visualTheme: "room-visual-teal"
  },
  {
    id: "khyber-scholars-residence",
    hostelName: "Khyber Scholars Residence",
    cityArea: "Peshawar • University Town",
    roomType: "Quad Sharing",
    occupants: 4,
    totalRoomRent: 32000,
    facilities: ["WiFi", "24/7 Security", "Prayer Area", "Solar Backup"],
    availability: "4 Beds Left",
    visualTheme: "room-visual-moss"
  },
  {
    id: "capital-pearl-girls",
    hostelName: "Capital Pearl Girls Hostel",
    cityArea: "Islamabad • Sector G-10",
    roomType: "Triple Sharing",
    occupants: 3,
    totalRoomRent: 39000,
    facilities: ["High-Speed WiFi", "Warden On-Site", "Biometric Entry", "Dining Hall"],
    availability: "1 Bed Left",
    visualTheme: "room-visual-emerald"
  },
  {
    id: "model-town-study",
    hostelName: "Model Town Study Residency",
    cityArea: "Lahore • Model Town",
    roomType: "Quad Sharing",
    occupants: 4,
    totalRoomRent: 38000,
    facilities: ["WiFi", "Quiet Study Room", "Laundry", "UPS Backup"],
    availability: "Limited Slots",
    visualTheme: "room-visual-forest"
  },
  {
    id: "clifton-horizon-lodge",
    hostelName: "Clifton Horizon Girls Lodge",
    cityArea: "Karachi • Clifton Block 5",
    roomType: "Double Sharing",
    occupants: 2,
    totalRoomRent: 35000,
    facilities: ["High-Speed WiFi", "CCTV & Guard", "Lockable Wardrobes", "RO Water"],
    availability: "Waitlist",
    visualTheme: "room-visual-sage"
  }
];

// =========================================================
// 3. Helper Functions: Calculations & Safe Data Formatting
// =========================================================

/**
 * Calculates monthly rent per student from total room rent and occupant count.
 * Formula: rentPerStudent = totalRoomRent / occupants
 */
function calculateRentPerStudent(totalRoomRent, occupants) {
  if (typeof totalRoomRent !== "number" || typeof occupants !== "number" || occupants <= 0) {
    return 0;
  }
  return Math.round(totalRoomRent / occupants);
}

/**
 * Formats a numeric PKR amount with commas (example: 14000 -> "PKR 14,000").
 */
function formatPKR(amount) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "PKR 0";
  }
  return "PKR " + amount.toLocaleString();
}

/**
 * Prepares clean room objects with safe fallback defaults for any missing values
 * and computes rentPerStudent dynamically.
 */
function prepareSharedRooms(roomList) {
  const prepared = [];

  for (let i = 0; i < roomList.length; i++) {
    const item = roomList[i] || {};
    const occupants = Number(item.occupants) > 0 ? Number(item.occupants) : 2;
    const totalRoomRent = Number(item.totalRoomRent) > 0 ? Number(item.totalRoomRent) : 0;
    const rentPerStudent = calculateRentPerStudent(totalRoomRent, occupants);

    prepared.push({
      id: item.id || "room-" + (i + 1),
      hostelName: item.hostelName || "Student Hostel",
      cityArea: item.cityArea || "Location Not Specified",
      roomType: item.roomType || occupants + "-Student Sharing",
      occupants: occupants,
      totalRoomRent: totalRoomRent,
      rentPerStudent: rentPerStudent,
      facilities: Array.isArray(item.facilities) && item.facilities.length > 0
        ? item.facilities
        : ["Standard Student Amenities"],
      availability: item.availability || "Check Availability",
      visualTheme: item.visualTheme || "room-visual-emerald"
    });
  }

  return prepared;
}

const sharedRooms = prepareSharedRooms(rawSharedRooms);

// =========================================================
// 4. Safe localStorage Helpers (Wishlist & Recently Viewed)
// =========================================================

/**
 * Displays a non-blocking warning message if localStorage fails or has corrupted data.
 */
function showStorageNotice(message) {
  const noticeBox = document.getElementById("storageNotice");
  if (!noticeBox) return;
  noticeBox.textContent = message;
  noticeBox.classList.remove("d-none");
}

/**
 * Reads an array of hostel IDs from localStorage safely.
 * Returns an empty array if localStorage is unavailable or data is malformed.
 */
function readIdsFromStorage(storageKey) {
  try {
    const rawValue = localStorage.getItem(storageKey);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      // Saved data was not an array (malformed), so safely reset it
      localStorage.removeItem(storageKey);
      showStorageNotice("Saved browser data had an unexpected format and was safely reset.");
      return [];
    }

    // Keep only valid string IDs
    const cleanIds = [];
    for (let i = 0; i < parsed.length; i++) {
      if (typeof parsed[i] === "string" && parsed[i].trim() !== "") {
        cleanIds.push(parsed[i]);
      }
    }
    return cleanIds;
  } catch (error) {
    showStorageNotice("Browser storage is unavailable or corrupted. Wishlist and history will work temporarily.");
    return [];
  }
}

/**
 * Saves an array of hostel IDs to localStorage safely.
 */
function writeIdsToStorage(storageKey, idsArray) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(idsArray));
    return true;
  } catch (error) {
    showStorageNotice("Could not save changes to browser storage (localStorage may be disabled or full).");
    return false;
  }
}

/**
 * Finds a single room object by its ID. Returns null if not found.
 */
function findRoomById(roomId) {
  for (let i = 0; i < sharedRooms.length; i++) {
    if (sharedRooms[i].id === roomId) {
      return sharedRooms[i];
    }
  }
  return null;
}

// =========================================================
// 5. Filtering, Validation & Sorting
// =========================================================

function showFilterError(message) {
  const errorBox = document.getElementById("filterErrorBox");
  if (!errorBox) return;
  errorBox.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>${message}`;
  errorBox.classList.remove("d-none");
}

function hideFilterError() {
  const errorBox = document.getElementById("filterErrorBox");
  if (!errorBox) return;
  errorBox.textContent = "";
  errorBox.classList.add("d-none");
}

/**
 * Reads and validates the filter inputs.
 * Returns { isValid: true, ... } or { isValid: false, errorMessage: "..." }.
 */
function getValidatedFilters() {
  const minInput = document.getElementById("minBudget");
  const maxInput = document.getElementById("maxBudget");
  const occupantsSelect = document.getElementById("occupantsFilter");
  const sortSelect = document.getElementById("sortOrder");

  // Check if browser marked number inputs as invalid text (e.g., "abc")
  if ((minInput && minInput.validity && minInput.validity.badInput) ||
      (maxInput && maxInput.validity && maxInput.validity.badInput)) {
    return {
      isValid: false,
      errorMessage: "Please enter valid numeric values for minimum and maximum budget."
    };
  }

  const minRaw = minInput ? minInput.value.trim() : "";
  const maxRaw = maxInput ? maxInput.value.trim() : "";

  let minBudget = null;
  let maxBudget = null;

  if (minRaw !== "") {
    minBudget = Number(minRaw);
    if (!Number.isFinite(minBudget) || minBudget < 0) {
      return {
        isValid: false,
        errorMessage: "Minimum budget must be 0 or a positive number."
      };
    }
  }

  if (maxRaw !== "") {
    maxBudget = Number(maxRaw);
    if (!Number.isFinite(maxBudget) || maxBudget < 0) {
      return {
        isValid: false,
        errorMessage: "Maximum budget must be 0 or a positive number."
      };
    }
  }

  // Handle reversed budget range gracefully
  if (minBudget !== null && maxBudget !== null && minBudget > maxBudget) {
    return {
      isValid: false,
      errorMessage: "Minimum budget cannot be higher than maximum budget. Please adjust your budget range."
    };
  }

  const occupantsValue = occupantsSelect ? occupantsSelect.value : "any";
  const sortValue = sortSelect ? sortSelect.value : "lowest";

  return {
    isValid: true,
    minBudget: minBudget,
    maxBudget: maxBudget,
    occupants: occupantsValue,
    sortOrder: sortValue
  };
}

/**
 * Filters the sharedRooms list and sorts by per-student monthly rent.
 */
function filterAndSortRooms(filters) {
  const matchingRooms = [];

  for (let i = 0; i < sharedRooms.length; i++) {
    const room = sharedRooms[i];

    // 1. Check minimum per-student budget
    if (filters.minBudget !== null && room.rentPerStudent < filters.minBudget) {
      continue;
    }

    // 2. Check maximum per-student budget
    if (filters.maxBudget !== null && room.rentPerStudent > filters.maxBudget) {
      continue;
    }

    // 3. Check occupants count (2, 3, 4, or "any")
    if (filters.occupants !== "any" && room.occupants !== Number(filters.occupants)) {
      continue;
    }

    matchingRooms.push(room);
  }

  // Sort by rentPerStudent (lowest to highest, or highest to lowest)
  matchingRooms.sort(function (roomA, roomB) {
    if (filters.sortOrder === "highest") {
      return roomB.rentPerStudent - roomA.rentPerStudent;
    }
    return roomA.rentPerStudent - roomB.rentPerStudent;
  });

  return matchingRooms;
}

// =========================================================
// 6. Rendering Room Cards & Show More Controls
// =========================================================

/**
 * Updates the wishlist counter pill at the top of the grid.
 */
function updateWishlistCounter(wishlistIds) {
  const counterEl = document.getElementById("wishlistCounter");
  if (!counterEl) return;

  // Count only IDs that actually match our known shared rooms
  let validCount = 0;
  for (let i = 0; i < wishlistIds.length; i++) {
    if (findRoomById(wishlistIds[i])) {
      validCount++;
    }
  }

  counterEl.innerHTML = `<i class="bi bi-heart-fill me-1" aria-hidden="true"></i>Saved to Wishlist: ${validCount}`;
}

/**
 * Creates HTML for one shared room card.
 */
function createRoomCardHtml(room, isSaved) {
  // Build facility badge chips
  let facilitiesHtml = "";
  for (let i = 0; i < room.facilities.length; i++) {
    facilitiesHtml += `<span class="facility-chip">${room.facilities[i]}</span>`;
  }

  const isLimited =
    room.availability.toLowerCase().includes("left") ||
    room.availability.toLowerCase().includes("limited") ||
    room.availability.toLowerCase().includes("waitlist");

  const availabilityClass = isLimited ? "availability-badge is-limited" : "availability-badge";
  const heartIconClass = isSaved ? "bi-heart-fill" : "bi-heart";
  const wishlistText = isSaved ? "Saved" : "Wishlist";
  const wishlistBtnClass = isSaved ? "btn btn-wishlist btn-sm rounded-pill px-3 is-saved" : "btn btn-wishlist btn-sm rounded-pill px-3";

  return `
    <div class="col-md-6 col-lg-4">
      <article class="ss-card h-100 d-flex flex-column">
        <!-- CSS-built visual placeholder (no external image file needed) -->
        <div class="room-visual-box ${room.visualTheme}">
          <div class="room-visual-top d-flex justify-content-between align-items-center gap-2">
            <span class="room-visual-pill">${room.roomType}</span>
            <span class="room-visual-pill">
              <i class="bi bi-people-fill me-1" aria-hidden="true"></i>${room.occupants} Students
            </span>
          </div>
          <div class="room-visual-bottom d-flex align-items-center gap-3">
            <div class="room-visual-icon" aria-hidden="true">
              <i class="bi bi-door-open-fill"></i>
            </div>
            <div>
              <p class="small mb-0 opacity-75">Shared Room</p>
              <p class="fw-semibold mb-0">${room.cityArea}</p>
            </div>
          </div>
        </div>

        <div class="p-4 d-flex flex-column flex-grow-1">
          <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
            <span class="hostel-type-badge">${room.roomType}</span>
            <span class="${availabilityClass}">${room.availability}</span>
          </div>

          <h3 class="h5 fw-bold mb-1">${room.hostelName}</h3>
          <p class="small text-secondary mb-3">
            <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${room.cityArea}
            &bull; ${room.occupants} occupants per room
          </p>

          <!-- Pricing Box: Total room rent + calculated per-student rent -->
          <div class="room-price-box mb-3">
            <div class="d-flex justify-content-between align-items-baseline">
              <span class="small fw-semibold text-secondary">Per Student:</span>
              <span class="hostel-price">${formatPKR(room.rentPerStudent)} <small class="fw-normal text-secondary">/ month</small></span>
            </div>
            <div class="d-flex justify-content-between align-items-baseline mt-1">
              <span class="small text-secondary">Total Room Rent:</span>
              <span class="small fw-semibold">${formatPKR(room.totalRoomRent)} / month</span>
            </div>
          </div>

          <!-- Facilities -->
          <div class="mb-3">
            <p class="small fw-semibold mb-2">Facilities:</p>
            <div class="d-flex flex-wrap gap-1">
              ${facilitiesHtml}
            </div>
          </div>

          <!-- Card Action Buttons -->
          <div class="mt-auto pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2">
            <a
              href="hostel-details.html?id=${encodeURIComponent(room.id)}"
              class="btn btn-dark-green btn-sm rounded-pill px-3 view-details-link"
              data-room-id="${room.id}"
            >
              View Details <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
            </a>
            <button
              type="button"
              class="${wishlistBtnClass} wishlist-toggle-btn"
              data-room-id="${room.id}"
              aria-pressed="${isSaved ? "true" : "false"}"
              aria-label="${isSaved ? "Remove " + room.hostelName + " from wishlist" : "Save " + room.hostelName + " to wishlist"}"
            >
              <i class="bi ${heartIconClass} me-1" aria-hidden="true"></i>${wishlistText}
            </button>
          </div>
        </div>
      </article>
    </div>
  `;
}

/**
 * Renders the shared room grid, empty state, and Show More button state.
 */
function renderRooms() {
  const grid = document.getElementById("sharedRoomsGrid");
  const resultsCount = document.getElementById("resultsCount");
  const showMoreBtn = document.getElementById("showMoreBtn");
  const showMoreStatus = document.getElementById("showMoreStatus");
  if (!grid) return;

  const filters = getValidatedFilters();
  const wishlistIds = readIdsFromStorage(WISHLIST_STORAGE_KEY);
  updateWishlistCounter(wishlistIds);

  if (!filters.isValid) {
    showFilterError(filters.errorMessage);
    if (resultsCount) {
      resultsCount.textContent = "Please fix the filter values above to view matching rooms.";
    }
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card" role="status">
          <div class="empty-state-icon">
            <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
          </div>
          <h3 class="h5 fw-bold mb-2">Invalid Filter Range</h3>
          <p class="text-secondary small mb-3">${filters.errorMessage}</p>
          <button type="button" id="emptyResetBtn" class="btn btn-dark-green rounded-pill px-4">
            Reset Filters
          </button>
        </div>
      </div>
    `;
    if (showMoreBtn) showMoreBtn.classList.add("d-none");
    if (showMoreStatus) showMoreStatus.textContent = "";

    const emptyResetBtn = document.getElementById("emptyResetBtn");
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener("click", resetAllFilters);
    }
    return;
  }

  hideFilterError();

  const matchingRooms = filterAndSortRooms(filters);
  const totalMatches = matchingRooms.length;

  // Empty results state
  if (totalMatches === 0) {
    if (resultsCount) {
      resultsCount.textContent = "Showing 0 shared rooms";
    }
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card" role="status" aria-live="polite">
          <div class="empty-state-icon">
            <i class="bi bi-search" aria-hidden="true"></i>
          </div>
          <h3 class="h5 fw-bold mb-2">No shared rooms match your filters.</h3>
          <p class="text-secondary small mb-3">
            Try increasing your maximum budget or selecting "Any" for students per room.
          </p>
          <button type="button" id="emptyResetBtn" class="btn btn-dark-green rounded-pill px-4">
            Reset Filters
          </button>
        </div>
      </div>
    `;
    if (showMoreBtn) showMoreBtn.classList.add("d-none");
    if (showMoreStatus) showMoreStatus.textContent = "";

    const emptyResetBtn = document.getElementById("emptyResetBtn");
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener("click", resetAllFilters);
    }
    return;
  }

  // Slice matching rooms according to visibleRoomCount
  const countToShow = Math.min(visibleRoomCount, totalMatches);
  let cardsHtml = "";

  for (let i = 0; i < countToShow; i++) {
    const room = matchingRooms[i];
    const isSaved = wishlistIds.indexOf(room.id) !== -1;
    cardsHtml += createRoomCardHtml(room, isSaved);
  }

  grid.innerHTML = cardsHtml;

  if (resultsCount) {
    resultsCount.textContent = `Showing ${countToShow} of ${totalMatches} shared room${totalMatches === 1 ? "" : "s"}`;
  }

  // Update Show More button visibility and status message
  if (showMoreBtn && showMoreStatus) {
    if (countToShow < totalMatches) {
      const remaining = totalMatches - countToShow;
      showMoreBtn.classList.remove("d-none");
      showMoreBtn.disabled = false;
      showMoreStatus.textContent = `${remaining} more room option${remaining === 1 ? "" : "s"} available.`;
    } else {
      showMoreBtn.classList.add("d-none");
      showMoreStatus.textContent = "No more room options to show.";
    }
  }
}

/**
 * Resets all filter inputs to defaults and re-renders the grid.
 */
function resetAllFilters() {
  const minInput = document.getElementById("minBudget");
  const maxInput = document.getElementById("maxBudget");
  const occupantsSelect = document.getElementById("occupantsFilter");
  const sortSelect = document.getElementById("sortOrder");

  if (minInput) minInput.value = "";
  if (maxInput) maxInput.value = "";
  if (occupantsSelect) occupantsSelect.value = "any";
  if (sortSelect) sortSelect.value = "lowest";

  visibleRoomCount = INITIAL_VISIBLE_COUNT;
  hideFilterError();
  renderRooms();
}

// =========================================================
// 7. Wishlist Toggle Logic
// =========================================================

/**
 * Adds or removes a room ID from the saved wishlist in localStorage.
 */
function toggleWishlist(roomId) {
  if (!roomId) return;

  const wishlistIds = readIdsFromStorage(WISHLIST_STORAGE_KEY);
  const existingIndex = wishlistIds.indexOf(roomId);

  if (existingIndex === -1) {
    wishlistIds.push(roomId);
  } else {
    wishlistIds.splice(existingIndex, 1);
  }

  writeIdsToStorage(WISHLIST_STORAGE_KEY, wishlistIds);
  renderRooms();
}

// =========================================================
// 8. Monthly Cost Calculator
// =========================================================

/**
 * Populates the calculator's room dropdown from sharedRooms.
 */
function populateCalculatorRooms() {
  const roomSelect = document.getElementById("calcRoomSelect");
  if (!roomSelect) return;

  roomSelect.innerHTML = "";

  for (let i = 0; i < sharedRooms.length; i++) {
    const room = sharedRooms[i];
    const option = document.createElement("option");
    option.value = room.id;
    option.textContent = `${room.hostelName} — ${room.roomType} (${formatPKR(room.rentPerStudent)}/mo)`;
    roomSelect.appendChild(option);
  }
}

/**
 * Calculates total stay cost:
 * totalCost = selectedRoom.rentPerStudent * selectedMonths
 */
function updateCostCalculator() {
  const roomSelect = document.getElementById("calcRoomSelect");
  const durationSelect = document.getElementById("calcDurationSelect");
  const totalOutput = document.getElementById("calcTotalOutput");
  const breakdownOutput = document.getElementById("calcBreakdownOutput");

  if (!roomSelect || !durationSelect || !totalOutput || !breakdownOutput) return;

  const selectedRoom = findRoomById(roomSelect.value);
  const months = Number(durationSelect.value);

  if (!selectedRoom || !Number.isFinite(months) || months <= 0) {
    totalOutput.textContent = "PKR 0";
    breakdownOutput.textContent = "Unable to calculate cost for the selected option.";
    return;
  }

  const totalCost = selectedRoom.rentPerStudent * months;
  const monthLabel = months === 1 ? "1 month" : months + " months";

  totalOutput.textContent = formatPKR(totalCost);
  breakdownOutput.textContent =
    `${formatPKR(selectedRoom.rentPerStudent)} per student × ${monthLabel} = ${formatPKR(totalCost)}`;
}

// =========================================================
// 9. Recently Viewed Rooms Tracking
// =========================================================

/**
 * Saves a room ID to the front of the recently viewed list in localStorage.
 */
function saveRecentlyViewed(roomId) {
  if (!roomId || !findRoomById(roomId)) return;

  const recentIds = readIdsFromStorage(RECENT_STORAGE_KEY);
  const updatedIds = [roomId];

  // Keep existing IDs (excluding duplicate of current ID) up to MAX_RECENT_ITEMS
  for (let i = 0; i < recentIds.length; i++) {
    if (recentIds[i] !== roomId && updatedIds.length < MAX_RECENT_ITEMS) {
      updatedIds.push(recentIds[i]);
    }
  }

  writeIdsToStorage(RECENT_STORAGE_KEY, updatedIds);
}

/**
 * Renders the Recently Viewed section from localStorage safely.
 */
function renderRecentlyViewed() {
  const container = document.getElementById("recentlyViewedContainer");
  const clearBtn = document.getElementById("clearRecentBtn");
  if (!container) return;

  const recentIds = readIdsFromStorage(RECENT_STORAGE_KEY);
  const validRooms = [];

  for (let i = 0; i < recentIds.length; i++) {
    const room = findRoomById(recentIds[i]);
    if (room) {
      validRooms.push(room);
    }
  }

  if (validRooms.length === 0) {
    if (clearBtn) clearBtn.classList.add("d-none");
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card py-4" role="status">
          <p class="fw-semibold mb-1">No recently viewed rooms yet.</p>
          <p class="small text-secondary mb-0">
            Click <strong>View Details</strong> on any shared room card above to save it to your recent list.
          </p>
        </div>
      </div>
    `;
    return;
  }

  if (clearBtn) clearBtn.classList.remove("d-none");

  let recentHtml = "";
  for (let i = 0; i < validRooms.length; i++) {
    const room = validRooms[i];
    recentHtml += `
      <div class="col-sm-6 col-lg-3">
        <article class="recent-room-card d-flex flex-column">
          <span class="hostel-type-badge align-self-start mb-2">${room.roomType}</span>
          <h3 class="h6 fw-bold mb-1">${room.hostelName}</h3>
          <p class="small text-secondary mb-2">
            <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${room.cityArea}
          </p>
          <p class="fw-bold mb-3" style="color: var(--ss-dark-green);">
            ${formatPKR(room.rentPerStudent)} <span class="small fw-normal text-secondary">/ student</span>
          </p>
          <a
            href="hostel-details.html?id=${encodeURIComponent(room.id)}"
            class="btn btn-outline-ss btn-sm rounded-pill mt-auto align-self-start view-details-link"
            data-room-id="${room.id}"
          >
            Open Details
          </a>
        </article>
      </div>
    `;
  }

  container.innerHTML = recentHtml;
}

/**
 * Clears the recently viewed history from localStorage.
 */
function clearRecentlyViewed() {
  try {
    localStorage.removeItem(RECENT_STORAGE_KEY);
  } catch (error) {
    showStorageNotice("Could not clear browser storage.");
  }
  renderRecentlyViewed();
}

// =========================================================
// 10. Event Listeners & Page Initialization
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("filterForm");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const showMoreBtn = document.getElementById("showMoreBtn");
  const sharedRoomsGrid = document.getElementById("sharedRoomsGrid");
  const recentlyViewedContainer = document.getElementById("recentlyViewedContainer");
  const clearRecentBtn = document.getElementById("clearRecentBtn");
  const calcRoomSelect = document.getElementById("calcRoomSelect");
  const calcDurationSelect = document.getElementById("calcDurationSelect");
  const sortOrder = document.getElementById("sortOrder");

  // Filter form submit (Apply Filters button or pressing Enter)
  if (filterForm) {
    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      visibleRoomCount = INITIAL_VISIBLE_COUNT;
      renderRooms();
    });
  }

  // Re-sort immediately if user changes sort order
  if (sortOrder) {
    sortOrder.addEventListener("change", function () {
      renderRooms();
    });
  }

  // Reset button
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetAllFilters);
  }

  // Show More button
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", function () {
      visibleRoomCount += LOAD_MORE_STEP;
      renderRooms();
    });
  }

  // Handle Wishlist and View Details clicks inside the room grid
  if (sharedRoomsGrid) {
    sharedRoomsGrid.addEventListener("click", function (event) {
      const wishlistBtn = event.target.closest(".wishlist-toggle-btn");
      if (wishlistBtn) {
        const roomId = wishlistBtn.getAttribute("data-room-id");
        toggleWishlist(roomId);
        return;
      }

      const detailsLink = event.target.closest(".view-details-link");
      if (detailsLink) {
        const roomId = detailsLink.getAttribute("data-room-id");
        saveRecentlyViewed(roomId);
      }
    });
  }

  // Handle View Details clicks inside the Recently Viewed section
  if (recentlyViewedContainer) {
    recentlyViewedContainer.addEventListener("click", function (event) {
      const detailsLink = event.target.closest(".view-details-link");
      if (detailsLink) {
        const roomId = detailsLink.getAttribute("data-room-id");
        saveRecentlyViewed(roomId);
      }
    });
  }

  if (clearRecentBtn) {
    clearRecentBtn.addEventListener("click", clearRecentlyViewed);
  }

  // Cost calculator updates
  if (calcRoomSelect) {
    calcRoomSelect.addEventListener("change", updateCostCalculator);
  }
  if (calcDurationSelect) {
    calcDurationSelect.addEventListener("change", updateCostCalculator);
  }

  // Initial page render
  populateCalculatorRooms();
  updateCostCalculator();
  renderRooms();
  renderRecentlyViewed();
});
