/* Header aur Footer - listing pages ke liye (pages/ folder).
   Header/footer mein change karna ho to yahan bhi karein. */
(function () {
  const ROOT = "../";

  const HEADER = `
<nav class="navbar navbar-expand-lg sticky-top ss-navbar">
  <div class="container py-1">
    <!-- Logo -->
    <a class="navbar-brand d-flex align-items-center gap-2" href="{{R}}index.html">
      <img
        src="{{R}}images/logo.png"
        onerror="this.onerror=null;this.src='{{R}}images/Student Shelter Green Logo.png';"
        alt="Student Shelter Logo"
        class="ss-navbar-logo"
      />
      <span class="ss-brand-text">Student Shelter</span>
    </a>

    <!-- Mobile Toggle -->
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mainNavbar"
      aria-controls="mainNavbar"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar Links -->
    <div class="collapse navbar-collapse" id="mainNavbar">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
        
        <!-- 1. Home -->
        <li class="nav-item">
          <a class="nav-link nav-home" href="{{R}}index.html">Home</a>
        </li>

        <!-- 2. Hostels Dropdown (Pages 3, 4, 5, 6, 7, 8) -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle nav-hostels" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Hostels
          </a>
          <ul class="dropdown-menu shadow border-0">
            <li><a class="dropdown-item" href="{{R}}pages/find-hostel.html">Find a Hostel</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="{{R}}pages/boys-hostels.html">Boys Hostels</a></li>
            <li><a class="dropdown-item" href="{{R}}pages/girls-hostels.html">Girls Hostels</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="{{R}}pages/single-rooms.html">Single Rooms</a></li>
            <li><a class="dropdown-item" href="{{R}}pages/shared-rooms.html">Shared Rooms</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="{{R}}pages/hostel-details.html">Hostel Details</a></li>
            <li><a class="dropdown-item" href="{{R}}pages/book-hostel.html">Book a Hostel</a></li>
          </ul>
        </li>

        <!-- 3. About Us -->
        <li class="nav-item">
          <a class="nav-link nav-about" href="{{R}}pages/about.html">About Us</a>
        </li>

        <!-- 4. Explore Dropdown (Pages 9, 10, 13) -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle nav-explore" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Explore
          </a>
          <ul class="dropdown-menu shadow border-0">
            <li><a class="dropdown-item" href="{{R}}pages/locations.html">Locations</a></li>
            <li><a class="dropdown-item" href="{{R}}pages/facilities.html">Facilities & Amenities</a></li>
            <li><a class="dropdown-item" href="{{R}}pages/reviews.html">Reviews & Ratings</a></li>
          </ul>
        </li>

        <!-- 5. FAQs -->
        <li class="nav-item">
          <a class="nav-link nav-faq" href="{{R}}pages/faq.html">FAQs</a>
        </li> 

        <!-- 6. Contact Us -->
        <li class="nav-item">
          <a class="nav-link nav-contact" href="{{R}}pages/contact.html">Contact Us</a>
        </li>

      </ul>

      <!-- Right Side Actions -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <!-- Search Icon -->
        <a href="{{R}}pages/find-hostel.html" class="btn-search-icon" aria-label="Search hostels" title="Search Hostels">
          <i class="bi bi-search"></i>
        </a>
        <!-- Dark Mode Toggle -->
        <button type="button" class="btn-theme-toggle" id="darkModeToggle" aria-pressed="false" aria-label="Toggle dark mode">
          <i class="bi bi-moon-stars-fill" aria-hidden="true"></i>
          <span class="theme-label">Dark Mode</span>
        </button>
        <!-- Login / Signup Button -->
        <a href="{{R}}pages/login.html" class="btn btn-dark-green rounded-pill px-3 py-2 text-decoration-none">
          Login / Sign Up
        </a>
      </div>
    </div>
  </div>
</nav>
`;

  const FOOTER = `
<!-- includes/footer.html -->
<footer class="ss-footer" id="contact-us">
  <div class="container">
    <div class="row g-4 align-items-start">
      <div class="col-lg-4">
        <a href="{{R}}index.html" class="footer-logo-wrap text-decoration-none mb-3" data-link>
          <img
            src="{{R}}images/logo.png"
            onerror="this.onerror=null;this.src='{{R}}images/Student Shelter Green Logo.png';"
            alt="Student Shelter Logo"
            class="footer-logo-img"
          />
          <span class="fw-bold" style="color: #064e2b;">Student Shelter</span>
        </a>
        <p class="small mb-3" style="max-width: 340px;">
          Helping students discover safe, affordable, and comfortable hostel living close to their campuses.
        </p>
        <div class="d-flex gap-2">
          <a href="#" class="social-icon-link" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
          <a href="#" class="social-icon-link" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
          <a href="#" class="social-icon-link" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
          <a href="#" class="social-icon-link" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
        </div>
      </div>

      <div class="col-sm-6 col-lg-4">
        <h5 class="h6 fw-bold mb-3">Explore</h5>
        <ul class="list-unstyled d-grid gap-2 small mb-0">
          <li><a href="{{R}}index.html" data-link>Home</a></li>
          <li><a href="{{R}}pages/find-hostel.html" data-link>Hostels</a></li>
          <li><a href="{{R}}pages/about.html" data-link>About Us</a></li>
          <li><a href="{{R}}pages/faq.html" data-link>FAQs</a></li>
        </ul>
      </div>

      <div class="col-sm-6 col-lg-4">
        <h5 class="h6 fw-bold mb-3">Contact Us</h5>
        <ul class="list-unstyled d-grid gap-2 small mb-0">
          <li><i class="bi bi-envelope-fill me-2" aria-hidden="true"></i> support@studentshelter.pk</li>
          <li><i class="bi bi-telephone-fill me-2" aria-hidden="true"></i> +92 300 1234567</li>
          <li><i class="bi bi-geo-alt-fill me-2" aria-hidden="true"></i> Islamabad &bull; Lahore &bull; Karachi</li>
        </ul>
      </div>
    </div>

    <hr class="footer-divider my-4" />
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center small gap-2">
      <span>&copy; 2026 Student Shelter. All rights reserved.</span>
      <span>Safe. Affordable. Comfortable.</span>
    </div>
  </div>
</footer>
`;

  function put(id, html) {
    document.getElementById(id).outerHTML = html.replaceAll("{{R}}", ROOT);
  }
  put("header-placeholder", HEADER);
  put("footer-placeholder", FOOTER);

  // Current page ko dropdown mein highlight karna
  const page = location.pathname.split("/").pop();
  document.querySelectorAll(".ss-navbar .dropdown-item").forEach(function (a) {
    if (a.getAttribute("href").endsWith("/" + page)) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // Dark mode (index.html wali same localStorage key)
  const btn = document.getElementById("darkModeToggle");
  function applyTheme(dark) {
    document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light");
    btn.setAttribute("aria-pressed", String(dark));
    btn.querySelector("i").className = dark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    btn.querySelector(".theme-label").textContent = dark ? "Light Mode" : "Dark Mode";
  }
  applyTheme(document.documentElement.getAttribute("data-bs-theme") === "dark");
  btn.addEventListener("click", function () {
    const dark = document.documentElement.getAttribute("data-bs-theme") !== "dark";
    applyTheme(dark);
    try { localStorage.setItem("studentShelterTheme", dark ? "dark" : "light"); } catch (e) {}
  });
})();
