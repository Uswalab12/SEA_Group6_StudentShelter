// City data loaded dynamically into pages/locations.html
const cities = [
  {
    name: "Islamabad",
    subtitle: "Federal Capital • Near NUST, FAST, COMSATS & IIUI",
    hostelsCount: "28+ Hostels",
    startingPrice: "PKR 16,000 / month",
    image: "../images/islamabad.jpg",
    imageAlt: "Student residential sectors and greenery in Islamabad",
    description: "Quiet, green, and well-planned sectors with modern student residences, high-speed Wi-Fi, and easy metro access to major universities.",
    areas: ["H-12", "F-10", "G-11", "E-11", "I-8", "Chak Shahzad"]
  },
  {
    name: "Rawalpindi",
    subtitle: "Twin City Hub • Near ARID, FJWU & NUST EME",
    hostelsCount: "22+ Hostels",
    startingPrice: "PKR 13,500 / month",
    image: "../images/rawalpindi.jpg",
    imageAlt: "Student neighborhoods and transit hub in Rawalpindi",
    description: "Affordable and lively student neighborhoods offering convenient transport links along Murree Road and quick commutes across the twin cities.",
    areas: ["Satellite Town", "Saddar", "Shamsabad", "Chaklala Scheme III", "Bahria Town", "Peshawar Road"]
  },
  {
    name: "Lahore",
    subtitle: "Education Capital • Near PU, UET, LUMS, UCP & FAST",
    hostelsCount: "40+ Hostels",
    startingPrice: "PKR 14,500 / month",
    image: "../images/lahore.jpg",
    imageAlt: "University neighborhoods and campus life in Lahore",
    description: "Vibrant campus communities with furnished rooms, mess facilities, study lounges, and direct routes to Lahore's top universities.",
    areas: ["Johar Town", "Gulberg", "Model Town", "Garden Town", "Township", "DHA"]
  },
  {
    name: "Karachi",
    subtitle: "Coastal Metropolis • Near KU, NED, IBA & FAST",
    hostelsCount: "35+ Hostels",
    startingPrice: "PKR 15,000 / month",
    image: "../images/karachi.jpg",
    imageAlt: "Student hostels near University Road in Karachi",
    description: "Secure, well-connected student hostels close to University Road, main commercial centers, and public transit corridors.",
    areas: ["Gulshan-e-Iqbal", "Gulistan-e-Johar", "North Nazimabad", "PECHS", "Clifton", "DHA"]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("city-search");
  const clearFilterBtn = document.getElementById("clear-filter-btn");
  const resetBtn = document.getElementById("reset-search");
  const locationsGrid = document.getElementById("locations-grid");
  const resultsCount = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");

  // Function to generate Bootstrap Card
  function createCityCard(city, query) {
    // Image error handling (agar local image na mile to internet se le aaye)
    const imgUrl = city.image;
    const fallbackImg = "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600&h=400";

    // Areas HTML
    let areasHTML = "";
    city.areas.forEach(area => {
      const isMatch = query && area.toLowerCase().includes(query);
      const badgeClass = isMatch ? "bg-warning text-dark" : "bg-light text-dark border";
      areasHTML += `<span class="badge ${badgeClass} me-1 mb-1">${area}</span>`;
    });

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="position-relative">
            <img src="${imgUrl}" class="card-img-top" alt="${city.imageAlt}" style="height: 200px; object-fit: cover;" onerror="this.src='${fallbackImg}'">
            <span class="position-absolute top-0 end-0 m-2 badge bg-dark-green text-white shadow-sm">
              <i class="bi bi-buildings me-1"></i>${city.hostelsCount}
            </span>
          </div>
          
          <div class="card-body d-flex flex-column">
            <h3 class="h5 fw-bold text-dark-green mb-1">
              <i class="bi bi-geo-alt-fill me-1"></i>${city.name}
            </h3>
            <p class="text-muted small mb-2">${city.subtitle}</p>
            <p class="small text-secondary mb-3 flex-grow-1">${city.description}</p>
            
            <div class="mb-3">
              <span class="d-block text-muted small fw-semibold mb-1">Popular Areas:</span>
              ${areasHTML}
            </div>

            <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
              <div>
                <span class="d-block text-muted small">Starting from</span>
                <span class="fw-bold text-dark-green">${city.startingPrice}</span>
              </div>
              <a href="book-hostel.html?city=${encodeURIComponent(city.name)}" class="btn btn-outline-dark-green btn-sm rounded-pill px-3">Book Now</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Filter and Render Logic
  function renderCities(rawQuery = "") {
    const normalizedQuery = rawQuery.trim().toLowerCase();
    
    const filtered = cities.filter(city => {
      if (!normalizedQuery) return true;
      const matchesCity = city.name.toLowerCase().includes(normalizedQuery);
      const matchesArea = city.areas.some(area => area.toLowerCase().includes(normalizedQuery));
      return matchesCity || matchesArea;
    });

    // Clear Grid
    locationsGrid.innerHTML = "";

    // Handle No Results
    if (filtered.length === 0) {
      noResults.classList.remove("d-none");
      resultsCount.textContent = "0 cities found";
      return;
    }

    // Hide No Results
    noResults.classList.add("d-none");
    resultsCount.textContent = filtered.length === 1 ? "Showing 1 city" : `Showing ${filtered.length} cities`;

    // Render Cards
    filtered.forEach(city => {
      locationsGrid.insertAdjacentHTML("beforeend", createCityCard(city, normalizedQuery));
    });
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => renderCities(e.target.value));
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      renderCities(searchInput.value);
    });
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", () => {
      searchInput.value = "";
      renderCities("");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      renderCities("");
    });
  }

  // Initial Render
  renderCities();
});