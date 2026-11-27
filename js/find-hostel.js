/**
 * Student Shelter — Find a Hostel Script (js/find-hostel.js)
 * Renders dynamic hostel listings and filters by name and city in real-time.
 */

function createHostelCardImage(cityLabel, startColor, endColor) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${startColor}"/>
          <stop offset="100%" stop-color="${endColor}"/>
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#bg)"/>
      <circle cx="515" cy="65" r="85" fill="rgba(234,245,232,0.12)"/>
      <circle cx="85" cy="295" r="105" fill="rgba(234,245,232,0.08)"/>
      <g fill="none" stroke="#EAF5E8" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
        <path d="M210 175 L300 105 L390 175"/>
        <rect x="228" y="175" width="144" height="100" rx="6" fill="rgba(255,255,255,0.08)"/>
        <rect x="282" y="220" width="36" height="55" rx="4"/>
        <rect x="246" y="194" width="24" height="22" rx="3"/>
        <rect x="330" y="194" width="24" height="22" rx="3"/>
      </g>
      <text x="300" y="322" text-anchor="middle" fill="#EAF5E8" font-family="Segoe UI, sans-serif" font-size="18" font-weight="600">${cityLabel}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

const hostels = [
  {
    name: "Green Valley Scholars Hostel",
    city: "Islamabad",
    price: 18500,
    type: "Boys Hostel",
    image: createHostelCardImage("Islamabad • H-12", "#064E2B", "#0B7A43")
  },
  {
    name: "Capital Pearl Girls Hostel",
    city: "Islamabad",
    price: 20000,
    type: "Girls Hostel",
    image: createHostelCardImage("Islamabad • G-10", "#0A5C36", "#14804D")
  },
  {
    name: "Crescent Girls Residency",
    city: "Lahore",
    price: 21000,
    type: "Girls Hostel",
    image: createHostelCardImage("Lahore • Johar Town", "#054426", "#0D6E40")
  },
  {
    name: "Model Town Study Residency",
    city: "Lahore",
    price: 19500,
    type: "Boys Hostel",
    image: createHostelCardImage("Lahore • Model Town", "#075E34", "#15803D")
  },
  {
    name: "Campus Edge Student Suites",
    city: "Karachi",
    price: 16500,
    type: "Shared Room",
    image: createHostelCardImage("Karachi • Gulshan", "#064E2B", "#166534")
  },
  {
    name: "Clifton Horizon Girls Lodge",
    city: "Karachi",
    price: 23500,
    type: "Single Room",
    image: createHostelCardImage("Karachi • Clifton", "#08532F", "#15803D")
  },
  {
    name: "Margalla Pines Student Home",
    city: "Rawalpindi",
    price: 15500,
    type: "Boys Hostel",
    image: createHostelCardImage("Rawalpindi • Scheme III", "#064E2B", "#0E7442")
  },
  {
    name: "Khyber Scholars Residence",
    city: "Peshawar",
    price: 14000,
    type: "Boys Hostel",
    image: createHostelCardImage("Peshawar • University Town", "#0A5C36", "#16A34A")
  }
];

const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const resultsGrid = document.getElementById("hostelsResultsGrid");
const resultsCount = document.getElementById("resultsCount");

let activeTypeFilter = "";

/**
 * Populate City dropdown options dynamically from the hostels array.
 */
function populateCities() {
  if (!cityFilter) return;

  const cities = [...new Set(hostels.map((h) => h.city))].sort();
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });
}

/**
 * Read optional query params (?q=...&city=...&type=...) passed from index.html.
 */
function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const queryParam = params.get("q");
  const cityParam = params.get("city");
  const typeParam = params.get("type");

  if (queryParam && searchInput) {
    searchInput.value = queryParam;
  }

  if (cityParam && cityFilter) {
    const match = Array.from(cityFilter.options).find(
      (opt) => opt.value.toLowerCase() === cityParam.toLowerCase()
    );
    if (match) {
      cityFilter.value = match.value;
    }
  }

  if (typeParam) {
    activeTypeFilter = typeParam.trim();
  }
}

/**
 * Filter hostels and render cards or the empty state message.
 */
function renderHostels() {
  if (!resultsGrid) return;

  const searchTerm = (searchInput?.value || "").trim().toLowerCase();
  const selectedCity = cityFilter?.value || "all";

  const filtered = hostels.filter((hostel) => {
    const matchesName =
      searchTerm === "" ||
      hostel.name.toLowerCase().includes(searchTerm) ||
      hostel.city.toLowerCase().includes(searchTerm) ||
      hostel.type.toLowerCase().includes(searchTerm);

    const matchesCity =
      selectedCity === "all" || hostel.city.toLowerCase() === selectedCity.toLowerCase();

    const matchesType =
      activeTypeFilter === "" || hostel.type.toLowerCase() === activeTypeFilter.toLowerCase();

    return matchesName && matchesCity && matchesType;
  });

  if (resultsCount) {
    resultsCount.textContent =
      filtered.length === 1 ? "Showing 1 hostel" : `Showing ${filtered.length} hostels`;
  }

  if (filtered.length === 0) {
    resultsGrid.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card" role="status" aria-live="polite">
          <div class="empty-state-icon">
            <i class="bi bi-search" aria-hidden="true"></i>
          </div>
          <h3 class="h5 fw-bold mb-2">No hostels found matching your criteria.</h3>
          <p class="text-secondary small mb-3">
            Try searching a different hostel name or selecting another city.
          </p>
          <button type="button" id="resetSearchBtn" class="btn btn-dark-green rounded-pill px-4">
            Reset Filters
          </button>
        </div>
      </div>
    `;

    document.getElementById("resetSearchBtn")?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (cityFilter) cityFilter.value = "all";
      activeTypeFilter = "";
      renderHostels();
    });
    return;
  }

  resultsGrid.innerHTML = filtered
    .map(
      (hostel) => `
      <div class="col-md-6 col-lg-4">
        <article class="ss-card h-100 d-flex flex-column">
          <img
            src="${hostel.image}"
            alt="${hostel.name}"
            class="hostel-card-img"
          />
          <div class="p-4 d-flex flex-column flex-grow-1">
            <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
              <span class="hostel-type-badge">${hostel.type}</span>
              <span class="small text-secondary">
                <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${hostel.city}
              </span>
            </div>
            <h2 class="h5 fw-bold mb-3">${hostel.name}</h2>
            <div class="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
              <div>
                <span class="hostel-price">PKR ${hostel.price.toLocaleString()}</span>
                <span class="small text-secondary d-block">per month</span>
              </div>
              <button type="button" class="btn btn-dark-green btn-sm rounded-pill px-3">
                Book Visit
              </button>
            </div>
          </div>
        </article>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  populateCities();
  applyUrlFilters();
  renderHostels();

  searchInput?.addEventListener("input", renderHostels);
  cityFilter?.addEventListener("change", () => {
    activeTypeFilter = "";
    renderHostels();
  });
});
