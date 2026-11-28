document.addEventListener("DOMContentLoaded", async () => {
  // Load the already supplied shared header and footer. Their files are not changed.
  try {
    const headerResponse = await fetch("../includes/header.html");
    if (headerResponse.ok) {
      document.getElementById("site-header").innerHTML = await headerResponse.text();
    }

    const footerResponse = await fetch("../includes/footer.html");
    if (footerResponse.ok) {
      document.getElementById("site-footer").innerHTML = await footerResponse.text();
    }

    // Correct paths only in the inserted shared includes for pages/ subfolder.
    document.querySelectorAll("#site-header a[href], #site-footer a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("pages/")) link.setAttribute("href", href.replace(/^pages\//, ""));
      else if (href === "index.html") link.setAttribute("href", "../index.html");
    });
    document.querySelectorAll("#site-header img[src], #site-footer img[src]").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("images/")) {
        img.setAttribute("src", "../" + src);
        const fallback = img.getAttribute("onerror");
        if (fallback) img.setAttribute("onerror", fallback.replaceAll("'images/", "'../images/"));
      }
    });
  } catch (error) {
    console.error("Could not load shared header/footer. Run the site with VS Code Live Server.", error);
  }

  // Attach the dark-mode button after the header HTML has been inserted.
  const themeButton = document.getElementById("darkModeToggle");
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      themeButton.setAttribute("aria-pressed", document.body.classList.contains("dark-mode") ? "true" : "false");
    });
  }

  // Filter only after the user presses Search.
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const city = (document.getElementById("city")?.value || "").trim().toLowerCase();
      const university = (document.getElementById("university")?.value || "").trim().toLowerCase();
      const budgetText = (document.getElementById("budget")?.value || "").trim();
      const maxRent = budgetText === "" ? Number.POSITIVE_INFINITY : Number(budgetText);

      const listings = document.querySelectorAll("#listings .listing");
      let visibleCount = 0;

      listings.forEach((listing) => {
        const listingCity = (listing.dataset.city || "").trim().toLowerCase();
        const listingUniversity = (listing.dataset.university || "").trim().toLowerCase();
        const listingRent = Number(listing.dataset.rent);

        const cityMatches = city === "" || listingCity === city;
        const universityMatches = university === "" || listingUniversity === university;
        const rentMatches = budgetText === "" || (Number.isFinite(listingRent) && listingRent <= maxRent);

        const shouldShow = cityMatches && universityMatches && rentMatches;
        listing.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });

      const noResults = document.getElementById("noResults");
      if (noResults) noResults.hidden = visibleCount > 0;
    });
  }

  // Demo button action.
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      alert("Selected: " + (button.dataset.name || "Hostel"));
    });
  });
});
