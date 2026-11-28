/* ==========================================================================
   Studenty Shelter — Shared JavaScript (js/main.js)
   Handles shared site behaviour such as the mobile hamburger menu
   and automatic active-link highlighting in the navbar.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  highlightActiveNavLink();
  updateCopyrightYear();
});

/**
 * Controls opening and closing the mobile hamburger menu (under 768px).
 */
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Stop safely if the navbar elements are not found on the page
  if (!navToggle || !navLinks) return;

  // Helper function so opening/closing always updates ARIA attributes cleanly
  function setMenuOpen(isOpen) {
    navLinks.classList.toggle('is-open', isOpen);
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  }

  // Toggle menu when the hamburger button is clicked
  navToggle.addEventListener('click', () => {
    const isCurrentlyOpen = navLinks.classList.contains('is-open');
    setMenuOpen(!isCurrentlyOpen);
  });

  // Close menu when any navigation link inside it is clicked
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  // Close menu when clicking anywhere outside the navbar
  document.addEventListener('click', (event) => {
    const clickedInsideNav =
      navToggle.contains(event.target) || navLinks.contains(event.target);

    if (!clickedInsideNav && navLinks.classList.contains('is-open')) {
      setMenuOpen(false);
    }
  });

  // Close menu when the user presses the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  // Reset mobile menu state if the screen is resized to tablet/desktop (>= 768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && navLinks.classList.contains('is-open')) {
      setMenuOpen(false);
    }
  });
}

/**
 * Automatically highlights the navbar link that matches the current page URL.
 * Example: when you copy template.html to about.html, "About Us" gets the
 * light green pill highlight automatically.
 */
function highlightActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  if (!navLinks.length) return;

  // Extract just the file name from the URL (e.g., "about.html")
  const pathParts = window.location.pathname.split('/');
  const currentPage = pathParts[pathParts.length - 1] || 'index.html';

  // Find a link whose href matches the current file name
  const matchingLink = Array.from(navLinks).find((link) => {
    const href = link.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    return hrefFile === currentPage;
  });

  // Only update if there is an exact match (keeps template.html preview intact)
  if (matchingLink) {
    navLinks.forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    matchingLink.classList.add('active');
    matchingLink.setAttribute('aria-current', 'page');
  }
}

/**
 * Keeps the footer copyright year up to date automatically.
 */
function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}
