// faqs.js - makes the FAQs page interactive
// 1) mobile menu  2) one answer open at a time  3) search box

document.addEventListener("DOMContentLoaded", function () {

  // ---------- 1. MOBILE MENU (the ☰ button) ----------
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("mainNav");

  menuBtn.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
  });

  // press Escape to close the menu
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.focus();
    }
  });

  // ---------- 2. ACCORDION: only one answer open at a time ----------
  const allQuestions = document.querySelectorAll(".faq-group details");

  allQuestions.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        allQuestions.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ---------- 3. SEARCH ----------
  const searchBox = document.getElementById("faqSearch");
  const groups = document.querySelectorAll(".faq-group");
  const noResults = document.getElementById("noResults");

  searchBox.addEventListener("input", function () {
    const word = searchBox.value.trim().toLowerCase();
    let totalShown = 0;

    groups.forEach(function (group) {
      let shownInGroup = 0;

      group.querySelectorAll("details").forEach(function (item) {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(word);
        item.hidden = !matches;
        if (matches) shownInGroup++;
        // close any open answer while the user types, so the list stays tidy
        item.open = false;
      });

      // hide the whole group if none of its questions match
      group.hidden = shownInGroup === 0;
      totalShown += shownInGroup;
    });

    noResults.hidden = totalShown !== 0;
  });

});
