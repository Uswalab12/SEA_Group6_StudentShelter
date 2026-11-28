/* ===== DATA: naya hostel add karna ho to yahan ek object aur likh dein ===== */
// NOTE: "university" sample value hai, apni asal value likhein.
const LISTINGS = {
  boys: [
    { name: "City Star Hostel", city: "Islamabad", university: "NUST", rent: 12000, rooms: 5, image: "city-star.jpg" },
    { name: "Student Inn", city: "Rawalpindi", university: "Arid Agriculture University", rent: 10000, rooms: 3, image: "student-inn.jpg" }
  ],
  girls: [
    { name: "Safe Home Hostel", city: "Islamabad", rent: 15000, security: "24/7", rooms: 4, image: "safe-home.jpg" },
    { name: "Comfort Girls Hostel", city: "Rawalpindi", rent: 13000, security: "CCTV", rooms: 2, image: "comfort-girls.jpg" }
  ],
  rooms: [
    { name: "Private Room A", city: "Islamabad", rent: 18000, furniture: "Bed, Table", facilities: "Attached Bath", facilityIcon: "bi-house-fill", image: "room-a.jpg" },
    { name: "Private Room B", city: "Rawalpindi", rent: 14000, furniture: "Bed, Wardrobe", facilities: "Wi-Fi Available", facilityIcon: "bi-wifi", image: "room-b.jpg" }
  ]
};

// Budget dropdown ke options (maximum monthly rent)
const BUDGETS = [10000, 12000, 15000, 18000, 20000];

const items = LISTINGS[document.body.dataset.page];
const form = document.getElementById("filterForm");
const cityEl = document.getElementById("cityFilter");
const uniEl = document.getElementById("universityFilter"); // sirf boys page par
const budgetEl = document.getElementById("budgetFilter");
const sortEl = document.getElementById("sortFilter");
const results = document.getElementById("results");
const count = document.getElementById("resultCount");

const money = (n) => "Rs. " + n.toLocaleString("en-US");

function fill(select, values, label = (v) => v) {
  values.forEach((v) => select.add(new Option(label(v), v)));
}
const unique = (key) => [...new Set(items.map((i) => i[key]))].sort();

fill(cityEl, unique("city"));
if (uniEl) fill(uniEl, unique("university"));
fill(budgetEl, BUDGETS, (v) => "Up to " + money(v));

function line(icon, text) {
  return `<li><i class="bi ${icon}" aria-hidden="true"></i><span>${text}</span></li>`;
}

function card(item) {
  let info = line("bi-geo-alt-fill", "Location: " + item.city) +
             line("bi-currency-rupee", "Monthly Rent: " + money(item.rent));
  if (item.security) info += line("bi-shield-fill-check", "Security: " + item.security);
  if (item.furniture) info += line("bi-lamp-fill", "Furniture: " + item.furniture);
  if (item.facilities) info += line(item.facilityIcon, "Facilities: " + item.facilities);
  if (item.rooms) info += line("bi-door-open-fill", "Available Rooms: " + item.rooms);

  return `
    <article class="listing-card">
      <img src="../images/${item.image}" alt="${item.name}">
      <div class="card-info">
        <h2>${item.name}</h2>
        <ul>${info}</ul>
        <a href="hostel-details.html" class="btn-details">View Details <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      </div>
    </article>`;
}

// Search button dabane par lagne wale filters
let applied = { city: "", university: "", budget: 0 };

function render() {
  const list = items.filter((i) =>
    (!applied.city || i.city === applied.city) &&
    (!applied.university || i.university === applied.university) &&
    (!applied.budget || i.rent <= applied.budget)
  );
  if (sortEl.value) {
    list.sort((a, b) => (sortEl.value === "low" ? a.rent - b.rent : b.rent - a.rent));
  }
  count.textContent = list.length + (list.length === 1 ? " result found" : " results found");
  results.innerHTML = list.length
    ? list.map(card).join("")
    : `<p class="no-result">Koi result nahi mila. City ya budget change karein.</p>`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  applied = {
    city: cityEl.value,
    university: uniEl ? uniEl.value : "",
    budget: Number(budgetEl.value)
  };
  render();
});

sortEl.addEventListener("change", render);

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  sortEl.value = "";
  applied = { city: "", university: "", budget: 0 };
  render();
});

render();
