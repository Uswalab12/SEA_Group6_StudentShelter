// City data loaded dynamically into pages/locations.html
const cities = [
  {
    name: "Islamabad",
    subtitle: "Federal Capital • Near NUST, FAST, COMSATS & IIUI",
    hostelsCount: "28+ Hostels",
    startingPrice: "PKR 16,000 / month",
    image: "../images/islamabad.jpg",
    imageAlt: "Student residential sectors and greenery in Islamabad",
    description:
      "Quiet, green, and well-planned sectors with modern student residences, high-speed Wi-Fi, and easy metro access to major universities.",
    areas: ["H-12", "F-10", "G-11", "E-11", "I-8", "Chak Shahzad"]
  },
  {
    name: "Rawalpindi",
    subtitle: "Twin City Hub • Near ARID, FJWU & NUST EME",
    hostelsCount: "22+ Hostels",
    startingPrice: "PKR 13,500 / month",
    image: "../images/rawalpindi.jpg",
    imageAlt: "Student neighborhoods and transit hub in Rawalpindi",
    description:
      "Affordable and lively student neighborhoods offering convenient transport links along Murree Road and quick commutes across the twin cities.",
    areas: ["Satellite Town", "Saddar", "Shamsabad", "Chaklala Scheme III", "Bahria Town", "Peshawar Road"]
  },
  {
    name: "Lahore",
    subtitle: "Education Capital • Near PU, UET, LUMS, UCP & FAST",
    hostelsCount: "40+ Hostels",
    startingPrice: "PKR 14,500 / month",
    image: "../images/lahore.jpg",
    imageAlt: "University neighborhoods and campus life in Lahore",
    description:
      "Vibrant campus communities with furnished rooms, mess facilities, study lounges, and direct routes to Lahore's top universities.",
    areas: ["Johar Town", "Gulberg", "Model Town", "Garden Town", "Township", "DHA"]
  },
  {
    name: "Karachi",
    subtitle: "Coastal Metropolis • Near KU, NED, IBA & FAST",
    hostelsCount: "35+ Hostels",
    startingPrice: "PKR 15,000 / month",
    image: "../images/karachi.jpg",
    imageAlt: "Student hostels near University Road in Karachi",
    description:
      "Secure, well-connected student hostels close to University Road, main commercial centers, and public transit corridors.",
    areas: ["Gulshan-e-Iqbal", "Gulistan-e-Johar", "North Nazimabad", "PECHS", "Clifton", "DHA"]
  }
];

const DARK_MODE_STORAGE_KEY = "darkMode";
const CURRENT_USER_STORAGE_KEY = "currentUser";
const SVG_NS = "http://www.w3.org/2000/svg";

function createSvgIcon(className, viewBox, paths, { fill = "none", stroke = "#064E2B", strokeWidth = "2" } = {}) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", fill);
  if (stroke !== "none") {
    svg.setAttribute("stroke", stroke);
    svg.setAttribute("stroke-width", strokeWidth);
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
  }
  svg.setAttribute("aria-hidden", "true");

  paths.forEach(({ tag = "path", attrs }) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    svg.appendChild(el);
  });

  return svg;
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("city-search");
  const clearButton = document.getElementById("clear-search");
  const clearFilterButton = document.getElementById("clear-filter-btn");
  const resetButton = document.getElementById("reset-search");
  const locationsGrid = document.getElementById("locations-grid");
  const resultsCount = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navSearchBtn = document.getElementById("nav-search-btn");
  const darkModeBtn = document.getElementById("dark-mode-toggle");
  const navLoginBtn = document.getElementById("nav-login-btn");
  const dropdowns = document.querySelectorAll(".nav-dropdown");

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

  // Mobile navigation toggle
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

  // Navbar dropdown toggles
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

  // Navbar search button scrolls to and focuses the city search input
  if (navSearchBtn && searchInput) {
    navSearchBtn.addEventListener("click", () => {
      closeMobileMenu();
      const searchSection = document.getElementById("search-section");
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      searchInput.focus({ preventScroll: true });
    });
  }

  // Dark Mode toggle with localStorage persistence
  function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
    if (!darkModeBtn) return;
    darkModeBtn.setAttribute("aria-pressed", String(enabled));
    const label = darkModeBtn.querySelector(".theme-label");
    if (label) {
      label.textContent = enabled ? "Light Mode" : "Dark Mode";
    }
  }

  const savedDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true";
  applyDarkMode(savedDarkMode);

  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      const nextState = !document.body.classList.contains("dark-mode");
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(nextState));
      applyDarkMode(nextState);
    });
  }

  // Show active logged-in student indicator on navbar Login button
  function syncNavbarUser() {
    if (!navLoginBtn) return;
    try {
      const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user && user.fullName) {
        const firstName = user.fullName.trim().split(/\s+/)[0];
        navLoginBtn.textContent = `Account (${firstName})`;
      }
    } catch {
      // Ignore malformed storage
    }
  }
  syncNavbarUser();

  /**
   * Create a single city card element from city data.
   */
  function createCityCard(city, normalizedQuery) {
    const card = document.createElement("article");
    card.className = "city-card";

    // City Image Banner + Hostels Count Badge
    const media = document.createElement("div");
    media.className = "city-card-media";

    const img = document.createElement("img");
    img.src = city.image;
    img.alt = city.imageAlt;
    img.className = "city-card-img";
    img.loading = "lazy";

    const badge = document.createElement("span");
    badge.className = "city-badge";
    const badgeIcon = createSvgIcon(
      "city-badge-icon",
      "0 0 24 24",
      [
        { attrs: { d: "M3 21h18" } },
        { attrs: { d: "M5 21V7l8-4v18" } },
        { attrs: { d: "M19 21V11l-6-4" } }
      ]
    );
    const badgeText = document.createElement("span");
    badgeText.textContent = city.hostelsCount;
    badge.appendChild(badgeIcon);
    badge.appendChild(badgeText);

    media.appendChild(img);
    media.appendChild(badge);

    const body = document.createElement("div");
    body.className = "city-card-body";

    const topSection = document.createElement("div");

    const header = document.createElement("div");
    header.className = "city-card-header";

    const titleGroup = document.createElement("div");
    const titleRow = document.createElement("div");
    titleRow.className = "city-title-row";

    const pinIcon = createSvgIcon(
      "city-pin-icon",
      "0 0 24 24",
      [
        { attrs: { d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" } },
        { tag: "circle", attrs: { cx: "12", cy: "9", r: "2.2" } }
      ]
    );

    const nameEl = document.createElement("h3");
    nameEl.className = "city-name";
    nameEl.textContent = city.name;

    titleRow.appendChild(pinIcon);
    titleRow.appendChild(nameEl);

    const subtitleEl = document.createElement("p");
    subtitleEl.className = "city-subtitle";
    subtitleEl.textContent = city.subtitle;

    titleGroup.appendChild(titleRow);
    titleGroup.appendChild(subtitleEl);
    header.appendChild(titleGroup);

    const desc = document.createElement("p");
    desc.className = "city-description";
    desc.textContent = city.description;

    const areasBlock = document.createElement("div");
    areasBlock.className = "city-areas-block";

    const areasHeader = document.createElement("div");
    areasHeader.className = "areas-header";
    const areasIcon = createSvgIcon(
      "areas-icon",
      "0 0 24 24",
      [
        { tag: "polygon", attrs: { points: "1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" } },
        { tag: "line", attrs: { x1: "8", y1: "2", x2: "8", y2: "18" } },
        { tag: "line", attrs: { x1: "16", y1: "6", x2: "16", y2: "22" } }
      ]
    );
    const areasLabel = document.createElement("span");
    areasLabel.className = "areas-label";
    areasLabel.textContent = "Popular Student Areas";
    areasHeader.appendChild(areasIcon);
    areasHeader.appendChild(areasLabel);

    const areaList = document.createElement("ul");
    areaList.className = "area-tags";

    city.areas.forEach((area) => {
      const tag = document.createElement("li");
      tag.className = "area-tag";
      if (normalizedQuery && area.toLowerCase().includes(normalizedQuery)) {
        tag.classList.add("matched");
      }
      tag.textContent = area;
      areaList.appendChild(tag);
    });

    areasBlock.appendChild(areasHeader);
    areasBlock.appendChild(areaList);

    topSection.appendChild(header);
    topSection.appendChild(desc);
    topSection.appendChild(areasBlock);

    const footer = document.createElement("div");
    footer.className = "city-card-footer";

    const priceBox = document.createElement("div");
    priceBox.className = "city-price";

    const priceLabelRow = document.createElement("div");
    priceLabelRow.className = "price-label-row";
    const priceIcon = createSvgIcon(
      "price-icon",
      "0 0 24 24",
      [
        { attrs: { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" } },
        { tag: "line", attrs: { x1: "7", y1: "7", x2: "7.01", y2: "7" } }
      ]
    );
    const priceLabel = document.createElement("span");
    priceLabel.className = "price-label";
    priceLabel.textContent = "Starting from";
    priceLabelRow.appendChild(priceIcon);
    priceLabelRow.appendChild(priceLabel);

    const priceValue = document.createElement("span");
    priceValue.className = "price-value";
    priceValue.textContent = city.startingPrice;

    priceBox.appendChild(priceLabelRow);
    priceBox.appendChild(priceValue);

    const bookBtn = document.createElement("a");
    bookBtn.href = `book-hostel.html?city=${encodeURIComponent(city.name)}`;
    bookBtn.className = "btn btn-primary";
    bookBtn.textContent = "Book a Hostel";

    footer.appendChild(priceBox);
    footer.appendChild(bookBtn);

    body.appendChild(topSection);
    body.appendChild(footer);

    card.appendChild(media);
    card.appendChild(body);

    return card;
  }

  /**
   * Filter cities by city name or area and render cards.
   */
  function renderCities(rawQuery = "") {
    const normalizedQuery = rawQuery.trim().toLowerCase();

    if (clearButton) {
      clearButton.hidden = normalizedQuery.length === 0;
    }

    const filtered = cities.filter((city) => {
      if (!normalizedQuery) return true;
      const matchesCity = city.name.toLowerCase().includes(normalizedQuery);
      const matchesArea = city.areas.some((area) =>
        area.toLowerCase().includes(normalizedQuery)
      );
      return matchesCity || matchesArea;
    });

    locationsGrid.innerHTML = "";

    if (filtered.length === 0) {
      noResults.hidden = false;
      resultsCount.textContent = "0 cities found";
      return;
    }

    noResults.hidden = true;
    resultsCount.textContent =
      filtered.length === 1 ? "Showing 1 city" : `Showing ${filtered.length} cities`;

    const fragment = document.createDocumentFragment();
    filtered.forEach((city) => {
      fragment.appendChild(createCityCard(city, normalizedQuery));
    });
    locationsGrid.appendChild(fragment);
  }

  function resetSearch() {
    searchInput.value = "";
    renderCities("");
    searchInput.focus();
  }

  searchInput.addEventListener("input", (event) => {
    renderCities(event.target.value);
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderCities(searchInput.value);
  });

  if (clearButton) {
    clearButton.addEventListener("click", resetSearch);
  }

  if (clearFilterButton) {
    clearFilterButton.addEventListener("click", resetSearch);
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetSearch);
  }

  // Initial render from JS array
  renderCities();
});
