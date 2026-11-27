/**
 * Student Shelter — Hostel Details Script (js/hostel-details.js)
 * Author: Mohammad Saood Khan (26i-3018)
 *
 * Purpose:
 * 1. Reads ?id=HOSTEL_ID from the URL (sent by pages/shared-rooms.html).
 * 2. Mirrors the exact 8 sample hostel records from Page 7 so IDs, names,
 *    locations, sharing types, occupants, and rents stay aligned.
 * 3. Marks unprovided factual info (street address, contact number, ratings,
 *    security deposit, verification status) honestly as unavailable/demo.
 * 4. Syncs Wishlist and Recently Viewed with Page 7 via localStorage.
 */

// =========================================================
// 1. Storage Keys (Exact match with js/shared-rooms.js)
// =========================================================
const WISHLIST_STORAGE_KEY = "studentShelterWishlist";
const RECENT_STORAGE_KEY = "studentShelterRecentlyViewed";
const MAX_RECENT_ITEMS = 4;

// =========================================================
// 2. Sample Hostel Data (Mirrors Page 7 IDs & Fields)
// =========================================================
const rawHostels = [
  {
    id: "green-valley-scholars",
    hostelName: "Green Valley Scholars Hostel",
    category: "Boys Hostel",
    cityArea: "Islamabad • Sector H-12",
    roomType: "Double Sharing",
    occupants: 2,
    totalRoomRent: 28000,
    facilities: ["High-Speed WiFi", "Backup Power", "Study Desks", "Daily Mess"],
    availability: "2 Beds Left",
    visualTheme: "room-visual-emerald",
    sampleSummary:
      "Sample student residence listing located in Sector H-12, Islamabad, offering double-sharing accommodation with study desks and daily mess."
  },
  {
    id: "crescent-girls-residency",
    hostelName: "Crescent Girls Residency",
    category: "Girls Hostel",
    cityArea: "Lahore • Johar Town",
    roomType: "Double Sharing",
    occupants: 2,
    totalRoomRent: 32000,
    facilities: ["High-Speed WiFi", "CCTV Security", "Attached Bath", "Laundry"],
    availability: "Available",
    visualTheme: "room-visual-forest",
    sampleSummary:
      "Sample girls hostel listing in Johar Town, Lahore, featuring double-sharing rooms with attached bath, laundry, and CCTV security."
  },
  {
    id: "campus-edge-suites",
    hostelName: "Campus Edge Student Suites",
    category: "Student Residence (Shared Room)",
    cityArea: "Karachi • Gulshan-e-Iqbal",
    roomType: "Triple Sharing",
    occupants: 3,
    totalRoomRent: 36000,
    facilities: ["High-Speed WiFi", "Generator Backup", "Cooling Fan & AC", "RO Water"],
    availability: "3 Beds Left",
    visualTheme: "room-visual-sage",
    sampleSummary:
      "Sample shared student residence in Gulshan-e-Iqbal, Karachi, offering triple-sharing rooms with backup power and RO water."
  },
  {
    id: "margalla-pines-home",
    hostelName: "Margalla Pines Student Home",
    category: "Boys Hostel",
    cityArea: "Rawalpindi • Scheme III",
    roomType: "Triple Sharing",
    occupants: 3,
    totalRoomRent: 30000,
    facilities: ["WiFi", "Study Lounge", "Mess Included", "Bike Parking"],
    availability: "Available",
    visualTheme: "room-visual-teal",
    sampleSummary:
      "Sample boys hostel listing in Scheme III, Rawalpindi, featuring triple-sharing accommodation, a study lounge, and mess included."
  },
  {
    id: "khyber-scholars-residence",
    hostelName: "Khyber Scholars Residence",
    category: "Boys Hostel",
    cityArea: "Peshawar • University Town",
    roomType: "Quad Sharing",
    occupants: 4,
    totalRoomRent: 32000,
    facilities: ["WiFi", "24/7 Security", "Prayer Area", "Solar Backup"],
    availability: "4 Beds Left",
    visualTheme: "room-visual-moss",
    sampleSummary:
      "Sample budget-friendly boys hostel in University Town, Peshawar, offering quad-sharing rooms with solar backup and 24/7 security."
  },
  {
    id: "capital-pearl-girls",
    hostelName: "Capital Pearl Girls Hostel",
    category: "Girls Hostel",
    cityArea: "Islamabad • Sector G-10",
    roomType: "Triple Sharing",
    occupants: 3,
    totalRoomRent: 39000,
    facilities: ["High-Speed WiFi", "Warden On-Site", "Biometric Entry", "Dining Hall"],
    availability: "1 Bed Left",
    visualTheme: "room-visual-emerald",
    sampleSummary:
      "Sample girls hostel listing in Sector G-10, Islamabad, offering triple-sharing rooms with on-site warden and biometric entry."
  },
  {
    id: "model-town-study",
    hostelName: "Model Town Study Residency",
    category: "Boys Hostel",
    cityArea: "Lahore • Model Town",
    roomType: "Quad Sharing",
    occupants: 4,
    totalRoomRent: 38000,
    facilities: ["WiFi", "Quiet Study Room", "Laundry", "UPS Backup"],
    availability: "Limited Slots",
    visualTheme: "room-visual-forest",
    sampleSummary:
      "Sample boys hostel listing in Model Town, Lahore, featuring quad-sharing rooms, a quiet study room, and UPS power backup."
  },
  {
    id: "clifton-horizon-lodge",
    hostelName: "Clifton Horizon Girls Lodge",
    category: "Girls Hostel",
    cityArea: "Karachi • Clifton Block 5",
    roomType: "Double Sharing",
    occupants: 2,
    totalRoomRent: 35000,
    facilities: ["High-Speed WiFi", "CCTV & Guard", "Lockable Wardrobes", "RO Water"],
    availability: "Waitlist",
    visualTheme: "room-visual-sage",
    sampleSummary:
      "Sample girls hostel listing in Clifton Block 5, Karachi, offering double-sharing rooms with CCTV guard coverage and lockable wardrobes."
  }
];

// Active state variables
let activeHostel = null;
let activeSlideIndex = 0;

// =========================================================
// 3. Calculation & Data Preparation Helpers
// =========================================================

/**
 * Calculates monthly rent per student:
 * rentPerStudent = totalRoomRent / occupants
 */
function calculateRentPerStudent(totalRoomRent, occupants) {
  if (typeof totalRoomRent !== "number" || typeof occupants !== "number" || occupants <= 0) {
    return 0;
  }
  return Math.round(totalRoomRent / occupants);
}

/**
 * Formats a number as Pakistani Rupees (example: 14000 -> "PKR 14,000").
 */
function formatPKR(amount) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "PKR 0";
  }
  return "PKR " + amount.toLocaleString();
}

/**
 * Prepares clean hostel objects with calculated per-student rent and fallbacks.
 */
function prepareHostels(list) {
  const prepared = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i] || {};
    const occupants = Number(item.occupants) > 0 ? Number(item.occupants) : 2;
    const totalRoomRent = Number(item.totalRoomRent) > 0 ? Number(item.totalRoomRent) : 0;

    prepared.push({
      id: item.id || "hostel-" + (i + 1),
      hostelName: item.hostelName || "Student Hostel",
      category: item.category || "Student Hostel",
      cityArea: item.cityArea || "Location unavailable",
      roomType: item.roomType || occupants + "-Student Sharing",
      occupants: occupants,
      totalRoomRent: totalRoomRent,
      rentPerStudent: calculateRentPerStudent(totalRoomRent, occupants),
      facilities: Array.isArray(item.facilities) && item.facilities.length > 0
        ? item.facilities
        : ["Not specified in sample data"],
      availability: item.availability || "Availability unknown",
      visualTheme: item.visualTheme || "room-visual-emerald",
      sampleSummary: item.sampleSummary || "Sample hostel listing for Student Shelter."
    });
  }

  return prepared;
}

const hostelsData = prepareHostels(rawHostels);

function findHostelById(hostelId) {
  if (!hostelId) return null;

  for (let i = 0; i < hostelsData.length; i++) {
    if (hostelsData[i].id === hostelId) {
      return hostelsData[i];
    }
  }
  return null;
}

// =========================================================
// 4. Safe localStorage Helpers (Synced with Page 7)
// =========================================================

function showStorageNotice(message) {
  const box = document.getElementById("storageNotice");
  if (!box) return;
  box.textContent = message;
  box.classList.remove("d-none");
}

function readIdsFromStorage(storageKey) {
  try {
    const rawValue = localStorage.getItem(storageKey);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(storageKey);
      showStorageNotice("Saved browser data had an unexpected format and was safely reset.");
      return [];
    }

    const cleanIds = [];
    for (let i = 0; i < parsed.length; i++) {
      if (typeof parsed[i] === "string" && parsed[i].trim() !== "") {
        cleanIds.push(parsed[i]);
      }
    }
    return cleanIds;
  } catch (error) {
    showStorageNotice("Browser storage is unavailable or corrupted. Wishlist and history cannot be persisted.");
    return [];
  }
}

function writeIdsToStorage(storageKey, idsArray) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(idsArray));
    return true;
  } catch (error) {
    showStorageNotice("Could not save changes to browser storage (localStorage may be disabled or full).");
    return false;
  }
}

// =========================================================
// 5. Visual Gallery Renderer
// =========================================================

function renderGallerySlide(hostel, slideIndex) {
  const stage = document.getElementById("galleryMainStage");
  const slideTag = document.getElementById("gallerySlideTag");
  const roomTag = document.getElementById("galleryRoomTag");
  const mainIcon = document.getElementById("galleryMainIcon");
  const slideHeading = document.getElementById("gallerySlideHeading");
  const slideCaption = document.getElementById("gallerySlideCaption");
  const stageFooter = document.getElementById("galleryHostelFooter");

  if (!stage || !hostel) return;

  activeSlideIndex = slideIndex;

  // Apply this hostel's CSS gradient theme
  stage.className = "gallery-main-stage mb-3 " + hostel.visualTheme;

  const slides = [
    {
      tag: "Room Layout Preview",
      icon: "bi-door-open-fill",
      heading: `${hostel.roomType} (${hostel.occupants} Students)`,
      caption: `Per student: ${formatPKR(hostel.rentPerStudent)}/mo • Total room rent: ${formatPKR(hostel.totalRoomRent)}/mo`
    },
    {
      tag: "Location & Category",
      icon: "bi-houses-fill",
      heading: hostel.hostelName,
      caption: `${hostel.category} located in ${hostel.cityArea}`
    },
    {
      tag: "Included Facilities",
      icon: "bi-wifi",
      heading: "Listed Room Amenities",
      caption: hostel.facilities.join(" • ")
    }
  ];

  const currentSlide = slides[slideIndex] || slides[0];

  if (slideTag) slideTag.textContent = currentSlide.tag;
  if (roomTag) roomTag.textContent = hostel.roomType;
  if (mainIcon) mainIcon.className = "bi " + currentSlide.icon;
  if (slideHeading) slideHeading.textContent = currentSlide.heading;
  if (slideCaption) slideCaption.textContent = currentSlide.caption;
  if (stageFooter) stageFooter.textContent = hostel.cityArea;

  // Update active state on thumbnail buttons
  const thumbButtons = document.querySelectorAll(".gallery-thumb-btn");
  for (let i = 0; i < thumbButtons.length; i++) {
    const btn = thumbButtons[i];
    const isCurrent = Number(btn.getAttribute("data-slide-index")) === slideIndex;
    btn.classList.toggle("active", isCurrent);
    btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");
  }
}

// =========================================================
// 6. Render Hostel Details Page
// =========================================================

function updateWishlistUI(hostel) {
  const wishlistIds = readIdsFromStorage(WISHLIST_STORAGE_KEY);
  const statusBadge = document.getElementById("wishlistStatusBadge");
  const toggleBtn = document.getElementById("wishlistToggleBtn");

  // Count only valid hostel IDs
  let validCount = 0;
  for (let i = 0; i < wishlistIds.length; i++) {
    if (findHostelById(wishlistIds[i])) {
      validCount++;
    }
  }

  if (statusBadge) {
    statusBadge.innerHTML = `<i class="bi bi-heart-fill me-1" aria-hidden="true"></i>Saved: ${validCount}`;
  }

  if (!toggleBtn || !hostel) return;

  const isSaved = wishlistIds.indexOf(hostel.id) !== -1;
  toggleBtn.classList.toggle("is-saved", isSaved);
  toggleBtn.setAttribute("aria-pressed", isSaved ? "true" : "false");
  toggleBtn.innerHTML = isSaved
    ? `<i class="bi bi-heart-fill me-1" aria-hidden="true"></i>Saved in Wishlist`
    : `<i class="bi bi-heart me-1" aria-hidden="true"></i>Save to Wishlist`;
}

function updateRentEstimator() {
  const durationSelect = document.getElementById("estimatorDuration");
  const rateDisplay = document.getElementById("estimatorRateDisplay");
  const totalOutput = document.getElementById("estimatorTotalOutput");
  const breakdownOutput = document.getElementById("estimatorBreakdownOutput");

  if (!activeHostel || !durationSelect || !totalOutput || !breakdownOutput) return;

  const months = Number(durationSelect.value);
  if (!Number.isFinite(months) || months <= 0) {
    totalOutput.textContent = "PKR 0";
    breakdownOutput.textContent = "Please choose a valid stay duration.";
    return;
  }

  const totalRent = activeHostel.rentPerStudent * months;
  const monthLabel = months === 1 ? "1 month" : months + " months";

  if (rateDisplay) {
    rateDisplay.value = `${formatPKR(activeHostel.rentPerStudent)} / month`;
  }
  totalOutput.textContent = formatPKR(totalRent);
  breakdownOutput.textContent =
    `${formatPKR(activeHostel.rentPerStudent)} per student × ${monthLabel} = ${formatPKR(totalRent)}`;
}

function renderHostelDetails(hostel) {
  activeHostel = hostel;

  const notFoundSection = document.getElementById("notFoundSection");
  const detailsContent = document.getElementById("detailsContent");
  if (notFoundSection) notFoundSection.classList.add("d-none");
  if (detailsContent) detailsContent.classList.remove("d-none");

  // Update browser tab title and selector
  document.title = `${hostel.hostelName} — Student Shelter`;
  const selector = document.getElementById("hostelSelector");
  if (selector) {
    selector.value = hostel.id;
  }

  // Hero & Breadcrumb
  const breadcrumb = document.getElementById("breadcrumbHostelName");
  const categoryBadge = document.getElementById("heroCategoryBadge");
  const availabilityBadge = document.getElementById("heroAvailabilityBadge");
  const heroTitle = document.getElementById("heroHostelTitle");
  const heroLocation = document.getElementById("heroLocationText");

  if (breadcrumb) breadcrumb.textContent = hostel.hostelName;
  if (categoryBadge) categoryBadge.textContent = hostel.category;
  if (heroTitle) heroTitle.textContent = hostel.hostelName;
  if (heroLocation) {
    heroLocation.innerHTML = `<i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${hostel.cityArea}`;
  }

  if (availabilityBadge) {
    const isLimited =
      hostel.availability.toLowerCase().includes("left") ||
      hostel.availability.toLowerCase().includes("limited") ||
      hostel.availability.toLowerCase().includes("waitlist");
    availabilityBadge.className = isLimited
      ? "availability-badge is-limited"
      : "availability-badge";
    availabilityBadge.textContent = hostel.availability + " (Demo)";
  }

  // Visual Gallery (reset to first view when switching hostels)
  renderGallerySlide(hostel, 0);

  // Summary Sidebar
  const summaryBadge = document.getElementById("summaryRoomTypeBadge");
  const summaryPerStudent = document.getElementById("summaryPerStudentRent");
  const summaryTotal = document.getElementById("summaryTotalRoomRent");
  const summaryOccupants = document.getElementById("summaryOccupants");
  const summaryFactsList = document.getElementById("summaryFactsList");
  const bookLink = document.getElementById("bookHostelLink");

  if (summaryBadge) summaryBadge.textContent = hostel.roomType;
  if (summaryPerStudent) summaryPerStudent.textContent = formatPKR(hostel.rentPerStudent);
  if (summaryTotal) summaryTotal.textContent = `${formatPKR(hostel.totalRoomRent)} / month`;
  if (summaryOccupants) summaryOccupants.textContent = `${hostel.occupants} students`;

  if (summaryFactsList) {
    summaryFactsList.innerHTML = `
      <li><i class="bi bi-building me-2" style="color: var(--ss-dark-green);" aria-hidden="true"></i><strong>Category:</strong> ${hostel.category}</li>
      <li><i class="bi bi-geo-alt-fill me-2" style="color: var(--ss-dark-green);" aria-hidden="true"></i><strong>Area:</strong> ${hostel.cityArea}</li>
      <li><i class="bi bi-card-checklist me-2" style="color: var(--ss-dark-green);" aria-hidden="true"></i><strong>Listing ID:</strong> <code>${hostel.id}</code></li>
    `;
  }

  if (bookLink) {
    bookLink.href = `book-hostel.html?id=${encodeURIComponent(hostel.id)}`;
  }

  // Overview & Honest Missing-Info Transparency
  const overviewHeading = document.getElementById("overviewHeading");
  const overviewDescription = document.getElementById("overviewDescription");
  const transparencyGrid = document.getElementById("transparencyGrid");

  if (overviewHeading) overviewHeading.textContent = `About ${hostel.hostelName}`;
  if (overviewDescription) overviewDescription.textContent = hostel.sampleSummary;

  if (transparencyGrid) {
    transparencyGrid.innerHTML = `
      <div class="col-sm-6">
        <div class="info-fact-tile h-100">
          <p class="small fw-semibold mb-1">Exact Street Address</p>
          <p class="small text-secondary mb-0">Unavailable in sample data (${hostel.cityArea} only)</p>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="info-fact-tile h-100">
          <p class="small fw-semibold mb-1">Verification &amp; Ratings</p>
          <p class="small text-secondary mb-0">Unavailable (sample listing; no live reviews yet)</p>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="info-fact-tile h-100">
          <p class="small fw-semibold mb-1">Warden Contact Number</p>
          <p class="small text-secondary mb-0">Not provided in sample listing</p>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="info-fact-tile h-100">
          <p class="small fw-semibold mb-1">Security Deposit</p>
          <p class="small text-secondary mb-0">Not listed (confirm with hostel management)</p>
        </div>
      </div>
    `;
  }

  // Room & Fee Breakdown Box
  const roomOptionBox = document.getElementById("roomOptionBox");
  if (roomOptionBox) {
    roomOptionBox.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold">${hostel.roomType}</span>
        <span class="hostel-type-badge">${hostel.occupants} Students / Room</span>
      </div>
      <p class="small text-secondary mb-2">
        Monthly room rent of <strong>${formatPKR(hostel.totalRoomRent)}</strong> divided equally among <strong>${hostel.occupants}</strong> occupants:
      </p>
      <p class="h5 fw-bold mb-0" style="color: var(--ss-dark-green);">
        ${formatPKR(hostel.rentPerStudent)} <span class="small fw-normal text-secondary">per student / month</span>
      </p>
    `;
  }

  // Amenities Grid
  const amenitiesGrid = document.getElementById("amenitiesGrid");
  if (amenitiesGrid) {
    let html = "";
    for (let i = 0; i < hostel.facilities.length; i++) {
      html += `
        <div class="col-sm-6">
          <div class="amenity-tile d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill flex-shrink-0" style="color: var(--ss-dark-green);" aria-hidden="true"></i>
            <span class="small fw-semibold">${hostel.facilities[i]}</span>
          </div>
        </div>
      `;
    }
    amenitiesGrid.innerHTML = html;
  }

  updateWishlistUI(hostel);
  updateRentEstimator();
}

function showNotFoundState(requestedId) {
  activeHostel = null;
  document.title = "Hostel Not Found — Student Shelter";

  const notFoundSection = document.getElementById("notFoundSection");
  const notFoundMessage = document.getElementById("notFoundMessage");
  const detailsContent = document.getElementById("detailsContent");

  if (detailsContent) detailsContent.classList.add("d-none");
  if (notFoundSection) notFoundSection.classList.remove("d-none");
  if (notFoundMessage) {
    notFoundMessage.textContent =
      `No sample hostel matched the ID "${requestedId}". Please choose a hostel from the Switch Hostel dropdown above or return to Shared Rooms.`;
  }
}

// =========================================================
// 7. Wishlist & Recently Viewed Actions (Synced with Page 7)
// =========================================================

function toggleActiveHostelWishlist() {
  if (!activeHostel) return;

  const wishlistIds = readIdsFromStorage(WISHLIST_STORAGE_KEY);
  const existingIndex = wishlistIds.indexOf(activeHostel.id);

  if (existingIndex === -1) {
    wishlistIds.push(activeHostel.id);
  } else {
    wishlistIds.splice(existingIndex, 1);
  }

  writeIdsToStorage(WISHLIST_STORAGE_KEY, wishlistIds);
  updateWishlistUI(activeHostel);
}

function saveRecentlyViewed(hostelId) {
  if (!hostelId || !findHostelById(hostelId)) return;

  const recentIds = readIdsFromStorage(RECENT_STORAGE_KEY);
  const updatedIds = [hostelId];

  for (let i = 0; i < recentIds.length; i++) {
    if (recentIds[i] !== hostelId && updatedIds.length < MAX_RECENT_ITEMS) {
      updatedIds.push(recentIds[i]);
    }
  }

  writeIdsToStorage(RECENT_STORAGE_KEY, updatedIds);
}

function renderRecentlyViewed() {
  const container = document.getElementById("recentlyViewedGrid");
  const clearBtn = document.getElementById("clearRecentBtn");
  if (!container) return;

  const recentIds = readIdsFromStorage(RECENT_STORAGE_KEY);
  const validHostels = [];

  for (let i = 0; i < recentIds.length; i++) {
    const item = findHostelById(recentIds[i]);
    if (item) {
      validHostels.push(item);
    }
  }

  if (validHostels.length === 0) {
    if (clearBtn) clearBtn.classList.add("d-none");
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card py-4" role="status">
          <p class="fw-semibold mb-1">No recently viewed hostels yet.</p>
          <p class="small text-secondary mb-0">
            Hostels you open from <a href="shared-rooms.html">Shared Rooms</a> or via the Switch Hostel selector will appear here.
          </p>
        </div>
      </div>
    `;
    return;
  }

  if (clearBtn) clearBtn.classList.remove("d-none");

  let html = "";
  for (let i = 0; i < validHostels.length; i++) {
    const item = validHostels[i];
    const isCurrent = activeHostel && activeHostel.id === item.id;
    html += `
      <div class="col-sm-6 col-lg-3">
        <article class="recent-room-card d-flex flex-column">
          <span class="hostel-type-badge align-self-start mb-2">${item.roomType}</span>
          <h3 class="h6 fw-bold mb-1">${item.hostelName}</h3>
          <p class="small text-secondary mb-2">
            <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${item.cityArea}
          </p>
          <p class="fw-bold mb-3" style="color: var(--ss-dark-green);">
            ${formatPKR(item.rentPerStudent)} <span class="small fw-normal text-secondary">/ student</span>
          </p>
          <a
            href="hostel-details.html?id=${encodeURIComponent(item.id)}"
            class="btn ${isCurrent ? "btn-dark-green" : "btn-outline-ss"} btn-sm rounded-pill mt-auto align-self-start"
          >
            ${isCurrent ? "Currently Viewing" : "View Hostel"}
          </a>
        </article>
      </div>
    `;
  }

  container.innerHTML = html;
}

function clearRecentlyViewed() {
  try {
    localStorage.removeItem(RECENT_STORAGE_KEY);
  } catch (error) {
    showStorageNotice("Could not clear recently viewed history.");
  }
  renderRecentlyViewed();
}

// =========================================================
// 8. Initialization & URL Handling
// =========================================================

function populateHostelSelector() {
  const selector = document.getElementById("hostelSelector");
  if (!selector) return;

  selector.innerHTML = "";
  for (let i = 0; i < hostelsData.length; i++) {
    const hostel = hostelsData[i];
    const option = document.createElement("option");
    option.value = hostel.id;
    option.textContent = `${hostel.hostelName} (${hostel.cityArea})`;
    selector.appendChild(option);
  }
}

function showUrlNotice(message) {
  const notice = document.getElementById("urlNoticeBox");
  if (!notice) return;
  notice.innerHTML = `<i class="bi bi-info-circle-fill me-2" aria-hidden="true"></i>${message}`;
  notice.classList.remove("d-none");
}

function hideUrlNotice() {
  const notice = document.getElementById("urlNoticeBox");
  if (!notice) return;
  notice.textContent = "";
  notice.classList.add("d-none");
}

function loadHostelFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const rawId = params.get("id");
  const requestedId = rawId ? rawId.trim() : "";

  if (requestedId === "") {
    // Arrived directly (for example from navbar) with no ?id= parameter
    const defaultHostel = hostelsData[0];
    showUrlNotice(
      "No hostel ID was specified in the URL, so the first sample listing is displayed below. Use Switch Hostel to inspect other listings."
    );
    renderHostelDetails(defaultHostel);
    renderRecentlyViewed();
    return;
  }

  const matchedHostel = findHostelById(requestedId);
  if (!matchedHostel) {
    hideUrlNotice();
    showNotFoundState(requestedId);
    renderRecentlyViewed();
    return;
  }

  hideUrlNotice();
  saveRecentlyViewed(matchedHostel.id);
  renderHostelDetails(matchedHostel);
  renderRecentlyViewed();
}

document.addEventListener("DOMContentLoaded", function () {
  populateHostelSelector();
  loadHostelFromUrl();

  const selector = document.getElementById("hostelSelector");
  if (selector) {
    selector.addEventListener("change", function () {
      const chosen = findHostelById(selector.value);
      if (!chosen) return;

      hideUrlNotice();
      saveRecentlyViewed(chosen.id);
      renderHostelDetails(chosen);
      renderRecentlyViewed();

      // Update URL cleanly without reloading so refreshing stays on the chosen hostel
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "hostel-details.html?id=" + encodeURIComponent(chosen.id));
      }
    });
  }

  const loadDefaultBtn = document.getElementById("loadDefaultHostelBtn");
  if (loadDefaultBtn) {
    loadDefaultBtn.addEventListener("click", function () {
      const defaultHostel = hostelsData[0];
      hideUrlNotice();
      saveRecentlyViewed(defaultHostel.id);
      renderHostelDetails(defaultHostel);
      renderRecentlyViewed();

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "hostel-details.html?id=" + encodeURIComponent(defaultHostel.id));
      }
    });
  }

  // Gallery thumbnail buttons
  const thumbButtons = document.querySelectorAll(".gallery-thumb-btn");
  for (let i = 0; i < thumbButtons.length; i++) {
    thumbButtons[i].addEventListener("click", function () {
      const index = Number(this.getAttribute("data-slide-index"));
      if (activeHostel) {
        renderGallerySlide(activeHostel, index);
      }
    });
  }

  // Wishlist button
  const wishlistBtn = document.getElementById("wishlistToggleBtn");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", toggleActiveHostelWishlist);
  }

  // Rent estimator dropdown
  const durationSelect = document.getElementById("estimatorDuration");
  if (durationSelect) {
    durationSelect.addEventListener("change", updateRentEstimator);
  }

  // Clear recently viewed
  const clearRecentBtn = document.getElementById("clearRecentBtn");
  if (clearRecentBtn) {
    clearRecentBtn.addEventListener("click", clearRecentlyViewed);
  }
});
