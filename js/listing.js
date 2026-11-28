/* ===== DATA: Naya hostel add karna ho to yahan add karein ===== */
const LISTINGS = {
  boys: [
    { name: "City Star Hostel", city: "Islamabad", university: "NUST", rent: 12000, rooms: 5, features: ["Wi-Fi", "Security"], image: "city-star.jpg" },
    { name: "Student Inn", city: "Rawalpindi", university: "Arid Agriculture University", rent: 10000, rooms: 3, features: ["Mess", "Study Area"], image: "student-inn.jpg" }
  ],
  girls: [
    { name: "Safe Home Hostel", city: "Islamabad", rent: 15000, security: "24/7", rooms: 4, features: ["CCTV", "Mess"], image: "safe-home.jpg" },
    { name: "Comfort Girls Hostel", city: "Rawalpindi", rent: 13000, security: "CCTV", rooms: 2, features: ["Wi-Fi", "Laundry"], image: "comfort-girls.jpg" }
  ],
  rooms: [
    { name: "Private Room A", city: "Islamabad", rent: 18000, furniture: "Bed, Table", facilities: "Attached Bath", features: ["AC", "Wi-Fi"], image: "room-a.jpg" },
    { name: "Private Room B", city: "Rawalpindi", rent: 14000, furniture: "Bed, Wardrobe", facilities: "Wi-Fi Available", features: ["Study Desk"], image: "room-b.jpg" }
  ]
};

const BUDGETS = [10000, 12000, 15000, 18000, 20000];

// Page detect karein (boys, girls, rooms) body data-page ke zariye
const pageType = document.body.getAttribute("data-page");
const items = LISTINGS[pageType] || [];

// DOM Elements
const form = document.getElementById("filterForm");
const cityEl = document.getElementById("cityFilter");
const uniEl = document.getElementById("universityFilter");
const budgetEl = document.getElementById("budgetFilter");
const sortEl = document.getElementById("sortFilter");
const results = document.getElementById("results");
const count = document.getElementById("resultCount");

const money = (n) => "PKR " + n.toLocaleString("en-US");

// Dropdowns fill karein
function fill(select, values, label = (v) => v) {
  if (!select) return;
  values.forEach((v) => select.add(new Option(label(v), v)));
}
const unique = (key) => [...new Set(items.map((i) => i[key]))].sort();

if (cityEl) fill(cityEl, unique("city"));
if (uniEl) fill(uniEl, unique("university"));
if (budgetEl) fill(budgetEl, BUDGETS, (v) => "Up to " + money(v));

// Card Design (Bootstrap Green Theme)
function createCard(item) {
  const imgUrl = item.image.startsWith("http") ? item.image : `../images/${item.image}`;
  
  let featuresHTML = "";
  if (item.features) {
    featuresHTML = item.features.map(f => `<span class="badge bg-light text-dark border me-1 mb-1">${f}</span>`).join("");
  }

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm border-0">
        <img src="${imgUrl}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600&h=400'">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title fw-bold mb-0">${item.name}</h5>
            <span class="badge bg-success">${item.city}</span>
          </div>
          <p class="text-muted small mb-2">
            <i class="bi bi-geo-alt-fill me-1"></i> ${item.city} <br>
            ${item.university ? `<i class="bi bi-mortarboard-fill me-1"></i> ${item.university} <br>` : ''}
            ${item.security ? `<i class="bi bi-shield-fill-check me-1"></i> ${item.security} Security <br>` : ''}
            ${item.furniture ? `<i class="bi bi-lamp-fill me-1"></i> ${item.furniture} <br>` : ''}
            ${item.facilities ? `<i class="bi bi-house-fill me-1"></i> ${item.facilities} <br>` : ''}
          </p>
          <div class="mb-3 flex-grow-1">
            ${featuresHTML}
          </div>
          <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
            <div>
              <span class="fw-bold text-dark-green fs-5">${money(item.rent)}</span>
              <span class="text-muted small">/month</span>
            </div>
            <a href="hostel-details.html" class="btn btn-outline-dark-green btn-sm rounded-pill px-3">Details</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Filter aur Render Logic
let applied = { city: "", university: "", budget: 0 };

function render() {
  let list = items.filter((i) =>
    (!applied.city || i.city === applied.city) &&
    (!applied.university || i.university === applied.university) &&
    (!applied.budget || i.rent <= applied.budget)
  );
  
  if (sortEl && sortEl.value) {
    list.sort((a, b) => (sortEl.value === "low" ? a.rent - b.rent : b.rent - a.rent));
  }

  if (count) count.textContent = `${list.length} ${list.length === 1 ? 'result' : 'results'} found`;
  
  if (results) {
    results.innerHTML = list.length
      ? list.map(createCard).join("")
      : `<div class="col-12 text-center py-5"><h4 class="text-muted">No results found</h4><p>Try changing city or budget.</p></div>`;
  }
}

// Event Listeners
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    applied = {
      city: cityEl ? cityEl.value : "",
      university: uniEl ? uniEl.value : "",
      budget: budgetEl ? Number(budgetEl.value) : 0
    };
    render();
  });
}

if (sortEl) sortEl.addEventListener("change", render);

const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if(form) form.reset();
    if(sortEl) sortEl.value = "";
    applied = { city: "", university: "", budget: 0 };
    render();
  });
}

// Initial Render
render();