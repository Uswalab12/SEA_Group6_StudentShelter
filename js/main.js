/**
 * Student Shelter — Main Script (js/main.js)
 * 1. Load Header and Footer dynamically with correct paths & active states.
 * 2. Dark Mode toggle with localStorage persistence.
 * 3. Featured Hostels array & dynamic card rendering.
 */

const THEME_KEY = "studentShelterTheme";

// 1. Hostel SVG Generator
function buildHostelSvg(title, bgStart, bgEnd) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bgStart}"/>
          <stop offset="100%" stop-color="${bgEnd}"/>
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#g)"/>
      <circle cx="510" cy="70" r="90" fill="rgba(234,245,232,0.12)"/>
      <circle cx="90" cy="300" r="110" fill="rgba(234,245,232,0.08)"/>
      <g fill="none" stroke="#EAF5E8" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
        <path d="M210 175 L300 105 L390 175"/>
        <rect x="228" y="175" width="144" height="100" rx="6" fill="rgba(255,255,255,0.08)"/>
        <rect x="282" y="220" width="36" height="55" rx="4"/>
        <rect x="246" y="194" width="24" height="22" rx="3"/>
        <rect x="330" y="194" width="24" height="22" rx="3"/>
      </g>
      <text x="300" y="322" text-anchor="middle" fill="#EAF5E8" font-family="Segoe UI, sans-serif" font-size="18" font-weight="600">${title}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

// 2. Hostels Data
const featuredHostels = [
  {
    name: "Green Valley Scholars Hostel",
    city: "Islamabad",
    price: 18500,
    image: buildHostelSvg("Islamabad • H-12", "#064E2B", "#0B7A43")
  },
  {
    name: "Crescent Girls Residency",
    city: "Lahore",
    price: 21000,
    image: buildHostelSvg("Lahore • Johar Town", "#0A5C36", "#14804D")
  },
  {
    name: "Campus Edge Student Suites",
    city: "Karachi",
    price: 16500,
    image: buildHostelSvg("Karachi • Gulshan", "#054426", "#0D6E40")
  },
  {
    name: "Margalla Pines Student Home",
    city: "Rawalpindi",
    price: 15500,
    image: buildHostelSvg("Rawalpindi • Scheme III", "#075E34", "#15803D")
  }
];

// 3. Dark Mode Logic
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.setAttribute("data-bs-theme", isDark ? "dark" : "light");
  document.body.classList.toggle("dark-mode", isDark);

  const toggleBtn = document.getElementById("darkModeToggle");
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector("i");
  const label = toggleBtn.querySelector(".theme-label");

  if (icon) {
    icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  }
  if (label) {
    label.textContent = isDark ? "Light Mode" : "Dark Mode";
  }
  toggleBtn.setAttribute("aria-pressed", String(isDark));
}

function initDarkMode() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById("darkModeToggle");
  if (!toggleBtn) return;

  const newToggleBtn = toggleBtn.cloneNode(true);
  toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

  newToggleBtn.addEventListener("click", () => {
    const isCurrentlyDark = document.body.classList.contains("dark-mode");
    const nextTheme = isCurrentlyDark ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

// 4. Render Featured Hostels
function renderFeaturedHostels() {
  const grid = document.getElementById("featuredHostelsGrid");
  if (!grid) return; 

  // Determine base path for GitHub Pages vs Localhost
  const isLocalhost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  const repoName = "/SEA_Group6_StudentShelter"; // Make sure this matches your GitHub repo name exactly
  const basePath = isLocalhost ? "" : repoName;
  
  const isInsidePages = window.location.pathname.includes("/pages/");
  const linkPrefix = isInsidePages ? "../" : "";

  grid.innerHTML = featuredHostels
    .map(
      (hostel) => `
      <div class="col-sm-6 col-lg-3">
        <article class="ss-card h-100 d-flex flex-column">
          <img src="${hostel.image}" alt="${hostel.name}" class="hostel-card-img" />
          <div class="p-4 d-flex flex-column flex-grow-1">
            <span class="hostel-type-badge mb-2 align-self-start">
              <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>${hostel.city}
            </span>
            <h3 class="h5 fw-bold mb-3">${hostel.name}</h3>
            <div class="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
              <div>
                <span class="hostel-price">PKR ${hostel.price.toLocaleString()}</span>
                <span class="small text-secondary d-block">per month</span>
              </div>
              <a href="${basePath}${linkPrefix}pages/find-hostel.html?city=${encodeURIComponent(hostel.city)}" class="btn btn-dark-green btn-sm rounded-pill px-3">
                View
              </a>
            </div>
          </div>
        </article>
      </div>
    `
    )
    .join("");
}

// 5. Load Header and Footer
async function loadLayout() {
  // 1. Check for Localhost vs GitHub Pages
  const isLocalhost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  const repoName = "/SEA_Group6_StudentShelter"; // Ensure this matches your GitHub repository name
  const basePath = isLocalhost ? "" : repoName;

  // 2. Check if we are inside the 'pages' folder
  const isInsidePages = window.location.pathname.includes("/pages/");
  const prefix = isInsidePages ? "../" : "";

  try {
    // Load Header
    const headerResponse = await fetch(basePath + prefix + "includes/header.html");
    if (headerResponse.ok) {
      const headerData = await headerResponse.text();
      const headerPlaceholder = document.getElementById("header-placeholder");
      
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerData;
        
        // Fix paths for pages folder AND GitHub Pages base path
        headerPlaceholder.querySelectorAll("img").forEach(img => {
          const src = img.getAttribute("src");
          // Skip absolute URLs
          if (src && !src.startsWith("http") && !src.startsWith("data:")) {
             img.src = basePath + prefix + src;
          }
          if (img.hasAttribute("onerror")) {
            img.setAttribute("onerror", `this.onerror=null;this.src='${basePath}${prefix}images/Student Shelter Green Logo.png';`);
          }
        });

        headerPlaceholder.querySelectorAll("a").forEach(link => {
          const href = link.getAttribute("href");
          if (href && !href.startsWith("#") && !href.startsWith("http")) {
            link.setAttribute("href", basePath + prefix + href);
          }
        });

        // Set Active Link
        const currentPath = window.location.pathname;
        const navLinks = headerPlaceholder.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
          link.classList.remove("active");
          const href = link.getAttribute("href");
          if (href) {
            if (currentPath.endsWith(href) || (href.includes("index.html") && (currentPath.endsWith("/") || currentPath.endsWith("index.html")))) {
              link.classList.add("active");
            }
          }
        });
        
        // Active Dropdowns
        if (currentPath.includes("find-hostel") || currentPath.includes("boys-hostels") || currentPath.includes("girls-hostels")) {
          const hostelsToggle = headerPlaceholder.querySelector(".nav-hostels");
          if (hostelsToggle) hostelsToggle.classList.add("active");
        }
        if (currentPath.includes("locations") || currentPath.includes("facilities") || currentPath.includes("reviews")) {
          const exploreToggle = headerPlaceholder.querySelector(".nav-explore");
          if (exploreToggle) exploreToggle.classList.add("active");
        }

        initDarkMode(); 
      }
    }

    // Load Footer
    const footerResponse = await fetch(basePath + prefix + "includes/footer.html");
    if (footerResponse.ok) {
      const footerData = await footerResponse.text();
      const footerPlaceholder = document.getElementById("footer-placeholder");
      
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerData;
        
        // Fix paths for pages folder AND GitHub Pages base path
        footerPlaceholder.querySelectorAll("img").forEach(img => {
          const src = img.getAttribute("src");
          if (src && !src.startsWith("http") && !src.startsWith("data:")) {
             img.src = basePath + prefix + src;
          }
          if (img.hasAttribute("onerror")) {
            img.setAttribute("onerror", `this.onerror=null;this.src='${basePath}${prefix}images/Student Shelter Green Logo.png';`);
          }
        });

        footerPlaceholder.querySelectorAll("a").forEach(link => {
          const href = link.getAttribute("href");
          if (href && !href.startsWith("#") && !href.startsWith("http")) {
            link.setAttribute("href", basePath + prefix + href);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error loading layout:", error);
  }
}

// 6. Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadLayout();            
  renderFeaturedHostels(); 
});