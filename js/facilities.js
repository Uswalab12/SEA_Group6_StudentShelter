/**
 * Student Shelter — Facilities & Amenities Script (js/facilities.js)
 * Author: Mohammad Saood Khan (26i-3018)
 *
 * Purpose:
 * 1. Renders 14 general student hostel facility guide cards across 7 categories.
 * 2. Provides keyword search, category filtering, count display, reset, and empty state.
 * 3. Displays the exact 8 sample hostels from Pages 7 & 8 with their listed
 *    facility tags, amenity filters, and View Details links (?id=HOSTEL_ID).
 */

// =========================================================
// 1. General Hostel Facilities Guide (Informational Data)
// =========================================================
const generalFacilities = [
  {
    title: "24/7 CCTV & Main Gate Security",
    category: "Security & Safety",
    icon: "bi-shield-check",
    description:
      "Entrance cameras and a dedicated gate guard help monitor visitors and keep student residences secure day and night.",
    checkTip: "Ask which floors have CCTV coverage and what the visitor entry policy is."
  },
  {
    title: "Biometric Entry & On-Site Warden",
    category: "Security & Safety",
    icon: "bi-person-badge",
    description:
      "Controlled entry systems and a resident warden provide emergency support, attendance oversight, and safer late-evening returns.",
    checkTip: "Check gate curfew timings and whether a warden lives inside the building."
  },
  {
    title: "High-Speed WiFi Coverage",
    category: "Internet & Study",
    icon: "bi-wifi",
    description:
      "Reliable broadband lets students attend online lectures, submit assignments, and stream course videos without relying on mobile data.",
    checkTip: "Test WiFi signal strength inside the actual room, not just near the reception."
  },
  {
    title: "Quiet Study Lounge & Study Desks",
    category: "Internet & Study",
    icon: "bi-book-fill",
    description:
      "Dedicated study desks or a silent reading room make exam preparation easier when roommates have different schedules.",
    checkTip: "Confirm whether each bed comes with its own desk, chair, and power socket."
  },
  {
    title: "Attached Bathrooms & Water Supply",
    category: "Room Essentials",
    icon: "bi-droplet-fill",
    description:
      "Well-maintained attached or floor bathrooms with regular hot and cold water reduce morning rush before early university classes.",
    checkTip: "Ask how many students share each bathroom and if geysers work in winter."
  },
  {
    title: "Lockable Wardrobes & Storage",
    category: "Room Essentials",
    icon: "bi-lock-fill",
    description:
      "Individual lockable cupboards protect laptops, documents, and personal belongings in shared double, triple, or quad rooms.",
    checkTip: "Check if a padlock is provided or if you need to bring your own lock."
  },
  {
    title: "Daily Mess & Meal Plans",
    category: "Food & Mess",
    icon: "bi-cup-hot-fill",
    description:
      "In-house mess plans typically serve 2 to 3 daily meals, saving students time and money compared to ordering takeout every day.",
    checkTip: "Ask for the weekly menu and whether mess charges are included in monthly rent."
  },
  {
    title: "Clean Dining Hall & Kitchen Hygiene",
    category: "Food & Mess",
    icon: "bi-houses-fill",
    description:
      "A dedicated dining area keeps food odors out of shared bedrooms and encourages hygienic meal preparation.",
    checkTip: "Visit the dining hall during meal hours to check cleanliness and seating space."
  },
  {
    title: "In-House Laundry Service",
    category: "Laundry & Cleaning",
    icon: "bi-basket-fill",
    description:
      "Access to washing machines or scheduled laundry pickup helps students manage weekly clothes washing during busy semesters.",
    checkTip: "Verify if laundry is included in rent or charged per bag/month, and check ironing rules."
  },
  {
    title: "Regular Room & Corridor Cleaning",
    category: "Laundry & Cleaning",
    icon: "bi-stars",
    description:
      "Scheduled sweeping, mopping, and waste collection keep shared living spaces healthy and comfortable.",
    checkTip: "Ask how often rooms and washrooms are cleaned each week."
  },
  {
    title: "Generator, UPS & Solar Backup",
    category: "Utilities & Power Backup",
    icon: "bi-lightning-charge-fill",
    description:
      "Backup power keeps lights, fans, and WiFi routers running during load-shedding so assignments and study sessions are not interrupted.",
    checkTip: "Ask which appliances (WiFi, fans, laptops) stay powered during outages."
  },
  {
    title: "RO Filtered Drinking Water & Cooling",
    category: "Utilities & Power Backup",
    icon: "bi-snow",
    description:
      "Filtered drinking water dispensers and fans or optional AC help students stay healthy and comfortable in summer heat.",
    checkTip: "Confirm whether AC electricity is billed separately by sub-meter."
  },
  {
    title: "Prayer Area & Common Lounge",
    category: "Common Areas & Recreation",
    icon: "bi-people-fill",
    description:
      "Shared lounges and prayer spaces offer room to relax, socialize with classmates, and take breaks away from study desks.",
    checkTip: "Check lounge hours and whether indoor seating or TV areas stay quiet late at night."
  },
  {
    title: "Secure Bike & Vehicle Parking",
    category: "Common Areas & Recreation",
    icon: "bi-bicycle",
    description:
      "Gated or covered parking protects motorcycles and bicycles used for daily campus commutes.",
    checkTip: "Ask if parking spaces are free for residents or require prior registration."
  }
];

// =========================================================
// 2. Sample Hostels Dataset (Matches Pages 7 & 8 Exactly)
// =========================================================
const sampleHostels = [
  {
    id: "green-valley-scholars",
    hostelName: "Green Valley Scholars Hostel",
    cityArea: "Islamabad • Sector H-12",
    roomType: "Double Sharing",
    facilities: ["High-Speed WiFi", "Backup Power", "Study Desks", "Daily Mess"]
  },
  {
    id: "crescent-girls-residency",
    hostelName: "Crescent Girls Residency",
    cityArea: "Lahore • Johar Town",
    roomType: "Double Sharing",
    facilities: ["High-Speed WiFi", "CCTV Security", "Attached Bath", "Laundry"]
  },
  {
    id: "campus-edge-suites",
    hostelName: "Campus Edge Student Suites",
    cityArea: "Karachi • Gulshan-e-Iqbal",
    roomType: "Triple Sharing",
    facilities: ["High-Speed WiFi", "Generator Backup", "Cooling Fan & AC", "RO Water"]
  },
  {
    id: "margalla-pines-home",
    hostelName: "Margalla Pines Student Home",
    cityArea: "Rawalpindi • Scheme III",
    roomType: "Triple Sharing",
    facilities: ["WiFi", "Study Lounge", "Mess Included", "Bike Parking"]
  },
  {
    id: "khyber-scholars-residence",
    hostelName: "Khyber Scholars Residence",
    cityArea: "Peshawar • University Town",
    roomType: "Quad Sharing",
    facilities: ["WiFi", "24/7 Security", "Prayer Area", "Solar Backup"]
  },
  {
    id: "capital-pearl-girls",
    hostelName: "Capital Pearl Girls Hostel",
    cityArea: "Islamabad • Sector G-10",
    roomType: "Triple Sharing",
    facilities: ["High-Speed WiFi", "Warden On-Site", "Biometric Entry", "Dining Hall"]
  },
  {
    id: "model-town-study",
    hostelName: "Model Town Study Residency",
    cityArea: "Lahore • Model Town",
    roomType: "Quad Sharing",
    facilities: ["WiFi", "Quiet Study Room", "Laundry", "UPS Backup"]
  },
  {
    id: "clifton-horizon-lodge",
    hostelName: "Clifton Horizon Girls Lodge",
    cityArea: "Karachi • Clifton Block 5",
    roomType: "Double Sharing",
    facilities: ["High-Speed WiFi", "CCTV & Guard", "Lockable Wardrobes", "RO Water"]
  }
];

let activeHostelAmenity = "all";

// =========================================================
// 3. Facilities Guide Filtering & Rendering
// =========================================================

function syncCategoryPills(selectedCategory) {
  const pills = document.querySelectorAll("#categoryPills .category-pill-btn");
  for (let i = 0; i < pills.length; i++) {
    const pillCategory = pills[i].getAttribute("data-category");
    const isActive = pillCategory === selectedCategory;
    pills[i].classList.toggle("active", isActive);
    pills[i].setAttribute("aria-pressed", isActive ? "true" : "false");
  }
}

function renderFacilities() {
  const searchInput = document.getElementById("facilitySearch");
  const categorySelect = document.getElementById("categoryFilter");
  const grid = document.getElementById("facilityGrid");
  const countEl = document.getElementById("facilityResultsCount");

  if (!grid) return;

  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedCategory = categorySelect ? categorySelect.value : "all";

  syncCategoryPills(selectedCategory);

  const matchingFacilities = [];
  for (let i = 0; i < generalFacilities.length; i++) {
    const item = generalFacilities[i];

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.checkTip.toLowerCase().includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      matchingFacilities.push(item);
    }
  }

  if (countEl) {
    const total = generalFacilities.length;
    const shown = matchingFacilities.length;
    countEl.textContent = `Showing ${shown} of ${total} general ${shown === 1 ? "facility" : "facilities"}`;
  }

  if (matchingFacilities.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card" role="status" aria-live="polite">
          <div class="empty-state-icon">
            <i class="bi bi-search" aria-hidden="true"></i>
          </div>
          <h3 class="h5 fw-bold mb-2">No facilities match your search.</h3>
          <p class="text-secondary small mb-3">
            Try a different keyword or reset the category filter to view all 14 facilities.
          </p>
          <button type="button" id="emptyFacilityResetBtn" class="btn btn-dark-green rounded-pill px-4">
            Reset Filters
          </button>
        </div>
      </div>
    `;

    const emptyResetBtn = document.getElementById("emptyFacilityResetBtn");
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener("click", resetFacilityFilters);
    }
    return;
  }

  let html = "";
  for (let i = 0; i < matchingFacilities.length; i++) {
    const item = matchingFacilities[i];
    html += `
      <div class="col-md-6 col-lg-4">
        <article class="ss-card h-100 p-4 d-flex flex-column">
          <div class="d-flex align-items-start gap-3 mb-3">
            <div class="facility-icon-box" aria-hidden="true">
              <i class="bi ${item.icon}"></i>
            </div>
            <div>
              <span class="facility-category-badge mb-2">${item.category}</span>
              <h3 class="h5 fw-bold mb-0">${item.title}</h3>
            </div>
          </div>

          <p class="small text-secondary mb-3">${item.description}</p>

          <div class="facility-tip-box mt-auto">
            <p class="small fw-semibold mb-1" style="color: var(--ss-dark-green);">
              <i class="bi bi-check-circle-fill me-1" aria-hidden="true"></i>What to check / ask:
            </p>
            <p class="small text-secondary mb-0">${item.checkTip}</p>
          </div>
        </article>
      </div>
    `;
  }

  grid.innerHTML = html;
}

function resetFacilityFilters() {
  const searchInput = document.getElementById("facilitySearch");
  const categorySelect = document.getElementById("categoryFilter");

  if (searchInput) searchInput.value = "";
  if (categorySelect) categorySelect.value = "all";

  renderFacilities();
}

// =========================================================
// 4. Sample Hostel Amenities Comparison
// =========================================================

/**
 * Checks whether a single facility tag string matches the chosen amenity filter key.
 */
function tagMatchesFilter(tagText, filterKey) {
  const text = tagText.toLowerCase();

  if (filterKey === "wifi") {
    return text.includes("wifi");
  }
  if (filterKey === "power") {
    return (
      text.includes("backup") ||
      text.includes("generator") ||
      text.includes("ups") ||
      text.includes("solar")
    );
  }
  if (filterKey === "mess") {
    return text.includes("mess") || text.includes("dining");
  }
  if (filterKey === "laundry") {
    return text.includes("laundry");
  }
  if (filterKey === "security") {
    return (
      text.includes("security") ||
      text.includes("cctv") ||
      text.includes("guard") ||
      text.includes("warden") ||
      text.includes("biometric")
    );
  }

  return false;
}

function syncHostelAmenityButtons(selectedAmenity) {
  const buttons = document.querySelectorAll("#hostelAmenityFilters .category-pill-btn");
  for (let i = 0; i < buttons.length; i++) {
    const key = buttons[i].getAttribute("data-amenity");
    const isActive = key === selectedAmenity;
    buttons[i].classList.toggle("active", isActive);
    buttons[i].setAttribute("aria-pressed", isActive ? "true" : "false");
  }
}

function renderHostelComparison() {
  const grid = document.getElementById("hostelComparisonGrid");
  const countEl = document.getElementById("hostelMatchCount");
  if (!grid) return;

  syncHostelAmenityButtons(activeHostelAmenity);

  const matchingHostels = [];
  for (let i = 0; i < sampleHostels.length; i++) {
    const hostel = sampleHostels[i];

    if (activeHostelAmenity === "all") {
      matchingHostels.push(hostel);
      continue;
    }

    let hasMatch = false;
    for (let j = 0; j < hostel.facilities.length; j++) {
      if (tagMatchesFilter(hostel.facilities[j], activeHostelAmenity)) {
        hasMatch = true;
        break;
      }
    }

    if (hasMatch) {
      matchingHostels.push(hostel);
    }
  }

  if (countEl) {
    countEl.textContent = `Showing ${matchingHostels.length} of ${sampleHostels.length} sample hostels`;
  }

  if (matchingHostels.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card" role="status">
          <p class="fw-semibold mb-2">No sample hostels match that amenity filter.</p>
          <button type="button" id="resetHostelAmenityBtn" class="btn btn-dark-green btn-sm rounded-pill px-4">
            Show All Hostels
          </button>
        </div>
      </div>
    `;
    const resetBtn = document.getElementById("resetHostelAmenityBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        activeHostelAmenity = "all";
        renderHostelComparison();
      });
    }
    return;
  }

  let html = "";
  for (let i = 0; i < matchingHostels.length; i++) {
    const hostel = matchingHostels[i];

    let tagsHtml = "";
    for (let j = 0; j < hostel.facilities.length; j++) {
      const tag = hostel.facilities[j];
      const highlight =
        activeHostelAmenity !== "all" && tagMatchesFilter(tag, activeHostelAmenity);
      tagsHtml += `<span class="amenity-tag ${highlight ? "is-highlighted" : ""}">${tag}</span>`;
    }

    html += `
      <div class="col-md-6 col-lg-3">
        <article class="ss-card h-100 p-4 d-flex flex-column">
          <span class="hostel-type-badge align-self-start mb-2">${hostel.roomType}</span>
          <h3 class="h6 fw-bold mb-1">${hostel.hostelName}</h3>
          <p class="small text-secondary mb-3">
            <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${hostel.cityArea}
          </p>

          <p class="small fw-semibold mb-2">Listed Sample Tags:</p>
          <div class="d-flex flex-wrap gap-1 mb-3">
            ${tagsHtml}
          </div>

          <div class="mt-auto pt-3 border-top">
            <a
              href="hostel-details.html?id=${encodeURIComponent(hostel.id)}"
              class="btn btn-dark-green btn-sm rounded-pill px-3 w-100"
            >
              View Details <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
            </a>
          </div>
        </article>
      </div>
    `;
  }

  grid.innerHTML = html;
}

// =========================================================
// 5. Event Listeners & Page Initialization
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("facilitySearch");
  const categorySelect = document.getElementById("categoryFilter");
  const resetBtn = document.getElementById("resetFacilityFiltersBtn");
  const categoryPills = document.getElementById("categoryPills");
  const hostelAmenityFilters = document.getElementById("hostelAmenityFilters");

  if (searchInput) {
    searchInput.addEventListener("input", renderFacilities);
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", renderFacilities);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetFacilityFilters);
  }

  if (categoryPills) {
    categoryPills.addEventListener("click", function (event) {
      const btn = event.target.closest(".category-pill-btn");
      if (!btn) return;

      const selectedCategory = btn.getAttribute("data-category");
      if (categorySelect) {
        categorySelect.value = selectedCategory;
      }
      renderFacilities();
    });
  }

  if (hostelAmenityFilters) {
    hostelAmenityFilters.addEventListener("click", function (event) {
      const btn = event.target.closest(".category-pill-btn");
      if (!btn) return;

      activeHostelAmenity = btn.getAttribute("data-amenity") || "all";
      renderHostelComparison();
    });
  }

  // Initial render
  renderFacilities();
  renderHostelComparison();
});
