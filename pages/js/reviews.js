/* ==========================================================================
   Studenty Shelter — Reviews & Ratings Logic (js/reviews.js)
   Handles rating summary calculations, filtering, sorting, pagination,
   mobile "Load more", form validation, and localStorage persistence.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'studentyShelterReviews_v1';
  const ITEMS_PER_PAGE = 6;

  // List of made-up hostels across Islamabad, Rawalpindi, and Lahore
  const HOSTELS = [
    { name: 'Green Crest Boys Hostel', city: 'Islamabad' },
    { name: 'Margalla View Girls Residency', city: 'Islamabad' },
    { name: 'Crescent Scholars Lodge', city: 'Rawalpindi' },
    { name: 'Pinewood Student Inn', city: 'Rawalpindi' },
    { name: 'Canal View Hostel', city: 'Lahore' },
    { name: 'Model Town Scholars Home', city: 'Lahore' }
  ];

  // 12 initial sample reviews from students in Islamabad, Rawalpindi, and Lahore
  const DEFAULT_REVIEWS = [
    {
      id: 1,
      name: 'Ayesha Siddiqui',
      city: 'Islamabad',
      hostel: 'Margalla View Girls Residency',
      rating: 5,
      comment: 'Super clean rooms, reliable fiber Wi-Fi for online lectures, and only a 5-minute walk from the H-12 campus gate.',
      date: '2026-11-22'
    },
    {
      id: 2,
      name: 'Hamza Tariq',
      city: 'Islamabad',
      hostel: 'Green Crest Boys Hostel',
      rating: 5,
      comment: 'Backup generator works seamlessly during load shedding and the study lounge stays quiet during exam week.',
      date: '2026-11-19'
    },
    {
      id: 3,
      name: 'Zainab Malik',
      city: 'Lahore',
      hostel: 'Canal View Hostel',
      rating: 4,
      comment: 'Friendly warden and hygienic mess food. Laundry service is quick, though evening tea timing could be slightly earlier.',
      date: '2026-11-16'
    },
    {
      id: 4,
      name: 'Bilal Ahmed',
      city: 'Rawalpindi',
      hostel: 'Crescent Scholars Lodge',
      rating: 5,
      comment: 'Best budget-friendly hostel near Saddar metro station. Biometric entry makes it feel very secure.',
      date: '2026-11-13'
    },
    {
      id: 5,
      name: 'Maham Raza',
      city: 'Lahore',
      hostel: 'Model Town Scholars Home',
      rating: 5,
      comment: 'Bright ventilated rooms with attached baths and filtered drinking water on every floor. Highly recommended!',
      date: '2026-11-10'
    },
    {
      id: 6,
      name: 'Usman Farooq',
      city: 'Rawalpindi',
      hostel: 'Pinewood Student Inn',
      rating: 3,
      comment: 'Good location and polite staff, but the third-floor Wi-Fi signal drops occasionally in the late evening.',
      date: '2026-11-06'
    },
    {
      id: 7,
      name: 'Hira Nawaz',
      city: 'Islamabad',
      hostel: 'Margalla View Girls Residency',
      rating: 4,
      comment: 'Very safe environment for out-of-city students. Hot water in winter and punctual shuttle van to campus.',
      date: '2026-11-02'
    },
    {
      id: 8,
      name: 'Saad Mahmood',
      city: 'Lahore',
      hostel: 'Canal View Hostel',
      rating: 5,
      comment: 'Spacious twin-sharing rooms, neat study desks, and great biryani on Fridays. Worth every rupee.',
      date: '2026-10-28'
    },
    {
      id: 9,
      name: 'Fatima Javed',
      city: 'Rawalpindi',
      hostel: 'Crescent Scholars Lodge',
      rating: 4,
      comment: 'Quiet neighborhood and clean common kitchen. Maintenance team fixes small issues the same day.',
      date: '2026-10-22'
    },
    {
      id: 10,
      name: 'Daniyal Hussain',
      city: 'Islamabad',
      hostel: 'Green Crest Boys Hostel',
      rating: 2,
      comment: 'Rooms are decent, however parking for motorbikes gets crowded during weekdays and needs better management.',
      date: '2026-10-15'
    },
    {
      id: 11,
      name: 'Amna Qureshi',
      city: 'Lahore',
      hostel: 'Model Town Scholars Home',
      rating: 5,
      comment: 'Felt right at home in my first semester. 24/7 CCTV, helpful warden, and fast laundry turnaround.',
      date: '2026-10-09'
    },
    {
      id: 12,
      name: 'Taimoor Ali',
      city: 'Rawalpindi',
      hostel: 'Pinewood Student Inn',
      rating: 1,
      comment: 'Our room AC took over a week to get serviced in warm weather. Staff should respond faster to repair requests.',
      date: '2026-10-03'
    }
  ];

  // Application state
  let allReviews = loadReviews();
  let currentPage = 1;
  let mobileVisibleCount = ITEMS_PER_PAGE;
  let selectedRating = 0;

  // DOM references
  const averageRatingEl = document.getElementById('average-rating');
  const averageStarsEl = document.getElementById('average-stars');
  const totalReviewsEl = document.getElementById('total-reviews');
  const ratingBarsEl = document.getElementById('rating-bars');

  const filterForm = document.getElementById('filter-form');
  const filterHostelEl = document.getElementById('filter-hostel');
  const filterRatingEl = document.getElementById('filter-rating');
  const sortByEl = document.getElementById('sort-by');

  const reviewsGridEl = document.getElementById('reviews-grid');
  const paginationEl = document.getElementById('pagination');
  const loadMoreWrapEl = document.getElementById('load-more-wrap');
  const loadMoreBtn = document.getElementById('load-more-btn');

  const reviewForm = document.getElementById('review-form');
  const nameInput = document.getElementById('reviewer-name');
  const hostelSelect = document.getElementById('review-hostel');
  const ratingInput = document.getElementById('review-rating');
  const commentInput = document.getElementById('review-comment');
  const starButtons = Array.from(document.querySelectorAll('#star-rating-input .star-btn'));
  const formSuccessEl = document.getElementById('form-success');

  const errorNameEl = document.getElementById('error-name');
  const errorHostelEl = document.getElementById('error-hostel');
  const errorRatingEl = document.getElementById('error-rating');
  const errorCommentEl = document.getElementById('error-comment');

  // Initialize UI
  populateHostelDropdowns();
  setupStarRatingInput();
  setupFilterListeners();
  setupFormSubmission();
  renderAll();

  // Re-render pagination / load-more layout if viewport crosses 768px
  let lastIsMobile = isMobileViewport();
  window.addEventListener('resize', () => {
    const nowMobile = isMobileViewport();
    if (nowMobile !== lastIsMobile) {
      lastIsMobile = nowMobile;
      renderReviewsList();
    }
  });

  /* ------------------------------------------------------------------------
     Storage Helpers
     ------------------------------------------------------------------------ */

  function loadReviews() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      // Fall back to default reviews if localStorage is unavailable
    }
    return DEFAULT_REVIEWS.slice();
  }

  function saveReviews(reviews) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      // Ignore storage quota / privacy mode errors gracefully
    }
  }

  /* ------------------------------------------------------------------------
     Dropdown Setup
     ------------------------------------------------------------------------ */

  function populateHostelDropdowns() {
    HOSTELS.forEach((hostel) => {
      const label = `${hostel.name} (${hostel.city})`;

      const filterOption = document.createElement('option');
      filterOption.value = hostel.name;
      filterOption.textContent = label;
      filterHostelEl.appendChild(filterOption);

      const formOption = document.createElement('option');
      formOption.value = hostel.name;
      formOption.textContent = label;
      hostelSelect.appendChild(formOption);
    });
  }

  /* ------------------------------------------------------------------------
     Rendering: Summary + Reviews + Pagination / Load More
     ------------------------------------------------------------------------ */

  function renderAll() {
    renderSummary();
    renderReviewsList();
  }

  /**
   * Calculates average rating, total review count, and 5-to-1 star bar widths
   * from all stored reviews.
   */
  function renderSummary() {
    const total = allReviews.length;
    const sum = allReviews.reduce((acc, item) => acc + Number(item.rating), 0);
    const average = total > 0 ? sum / total : 0;

    averageRatingEl.textContent = average.toFixed(1);
    totalReviewsEl.textContent = `${total} ${total === 1 ? 'review' : 'reviews'}`;

    // Render rounded star icons for the overall average
    averageStarsEl.innerHTML = '';
    const roundedStars = Math.round(average);
    for (let i = 1; i <= 5; i++) {
      averageStarsEl.appendChild(createStarSvg(i <= roundedStars));
    }

    // Count reviews for each star level (5 down to 1)
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((review) => {
      const star = Number(review.rating);
      if (counts[star] !== undefined) {
        counts[star] += 1;
      }
    });

    // Build horizontal distribution bars
    ratingBarsEl.innerHTML = '';
    for (let star = 5; star >= 1; star--) {
      const count = counts[star];
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

      const row = document.createElement('div');
      row.className = 'rating-bar-row';

      const label = document.createElement('span');
      label.className = 'rating-bar-label';
      label.textContent = `${star} star`;

      const track = document.createElement('div');
      track.className = 'rating-bar-track';
      track.setAttribute('aria-label', `${star} star: ${count} reviews (${percentage}%)`);

      const fill = document.createElement('div');
      fill.className = 'rating-bar-fill';
      fill.style.width = `${percentage}%`;
      track.appendChild(fill);

      const countEl = document.createElement('span');
      countEl.className = 'rating-bar-count';
      countEl.textContent = String(count);

      row.append(label, track, countEl);
      ratingBarsEl.appendChild(row);
    }
  }

  /**
   * Filters and sorts reviews according to the current filter bar selections.
   */
  function getFilteredAndSortedReviews() {
    const selectedHostel = filterHostelEl.value;
    const selectedStar = filterRatingEl.value;
    const sortBy = sortByEl.value;

    const filtered = allReviews.filter((review) => {
      const matchesHostel =
        selectedHostel === 'all' || review.hostel === selectedHostel;
      const matchesRating =
        selectedStar === 'all' || Number(review.rating) === Number(selectedStar);
      return matchesHostel && matchesRating;
    });

    // Sort a shallow copy without mutating allReviews
    return filtered.slice().sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rating - a.rating || new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating || new Date(b.date) - new Date(a.date);
      }
      // Default: "newest"
      return new Date(b.date) - new Date(a.date) || b.id - a.id;
    });
  }

  function renderReviewsList() {
    const filtered = getFilteredAndSortedReviews();
    reviewsGridEl.innerHTML = '';

    // Empty state when no reviews match
    if (filtered.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'card empty-state';
      emptyCard.innerHTML = `
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>No reviews found. Try changing your filters.</p>
      `;
      reviewsGridEl.appendChild(emptyCard);
      paginationEl.innerHTML = '';
      loadMoreWrapEl.classList.add('hidden');
      return;
    }

    let visibleReviews = [];

    if (isMobileViewport()) {
      // Mobile (< 768px): show incremental slice with "Load more"
      visibleReviews = filtered.slice(0, mobileVisibleCount);
      paginationEl.innerHTML = '';

      if (mobileVisibleCount < filtered.length) {
        loadMoreWrapEl.classList.remove('hidden');
      } else {
        loadMoreWrapEl.classList.add('hidden');
      }
    } else {
      // Desktop / Tablet (>= 768px): 6 reviews per page with numbered pagination
      loadMoreWrapEl.classList.add('hidden');
      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      visibleReviews = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      renderPagination(totalPages);
    }

    visibleReviews.forEach((review, index) => {
      const card = createReviewCard(review, index);
      reviewsGridEl.appendChild(card);
    });
  }

  /**
   * Builds one review card element safely using textContent for user strings.
   */
  function createReviewCard(review, index) {
    const card = document.createElement('article');
    card.className = 'card review-card';
    card.style.animationDelay = `${index * 0.05}s`;

    // Header: Circle initial avatar + Student Name + City
    const header = document.createElement('div');
    header.className = 'review-card-header';

    const avatar = document.createElement('div');
    avatar.className = 'review-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = review.name.trim().charAt(0).toUpperCase() || 'S';

    const meta = document.createElement('div');
    const author = document.createElement('h3');
    author.className = 'review-author';
    author.textContent = review.name;

    const city = document.createElement('p');
    city.className = 'review-city';
    city.textContent = review.city || getHostelCity(review.hostel);

    meta.append(author, city);
    header.append(avatar, meta);

    // Hostel name
    const hostel = document.createElement('p');
    hostel.className = 'review-hostel';
    hostel.textContent = review.hostel;

    // Star rating
    const stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
    for (let i = 1; i <= 5; i++) {
      stars.appendChild(createStarSvg(i <= Number(review.rating)));
    }

    // Comment text
    const comment = document.createElement('p');
    comment.className = 'review-comment';
    comment.textContent = review.comment;

    // Date
    const date = document.createElement('time');
    date.className = 'review-date';
    date.setAttribute('datetime', review.date);
    date.textContent = formatDisplayDate(review.date);

    card.append(header, hostel, stars, comment, date);
    return card;
  }

  function renderPagination(totalPages) {
    paginationEl.innerHTML = '';
    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = createPageButton('Previous', currentPage - 1, currentPage === 1);
    paginationEl.appendChild(prevBtn);

    // Numbered page buttons (1, 2, 3...)
    for (let page = 1; page <= totalPages; page++) {
      const btn = createPageButton(String(page), page, false, page === currentPage);
      paginationEl.appendChild(btn);
    }

    // Next button
    const nextBtn = createPageButton('Next', currentPage + 1, currentPage === totalPages);
    paginationEl.appendChild(nextBtn);
  }

  function createPageButton(label, targetPage, isDisabled, isActive = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `page-btn${isActive ? ' active' : ''}`;
    btn.textContent = label;
    btn.disabled = isDisabled;
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    }

    btn.addEventListener('click', () => {
      currentPage = targetPage;
      renderReviewsList();
      reviewsGridEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    return btn;
  }

  /* ------------------------------------------------------------------------
     Filter & Load More Event Listeners
     ------------------------------------------------------------------------ */

  function setupFilterListeners() {
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      currentPage = 1;
      mobileVisibleCount = ITEMS_PER_PAGE;
      renderReviewsList();
    });

    // Also update live when changing any filter/sort dropdown
    [filterHostelEl, filterRatingEl, sortByEl].forEach((select) => {
      select.addEventListener('change', () => {
        currentPage = 1;
        mobileVisibleCount = ITEMS_PER_PAGE;
        renderReviewsList();
      });
    });

    loadMoreBtn.addEventListener('click', () => {
      mobileVisibleCount += ITEMS_PER_PAGE;
      renderReviewsList();
    });
  }

  /* ------------------------------------------------------------------------
     Write a Review: Interactive Stars & Validation
     ------------------------------------------------------------------------ */

  function setupStarRatingInput() {
    const container = document.getElementById('star-rating-input');

    function updateStarClasses(hoverValue = 0) {
      starButtons.forEach((btn) => {
        const value = Number(btn.dataset.value);
        btn.classList.toggle('is-selected', value <= selectedRating);
        btn.classList.toggle('is-hovered', hoverValue > 0 && value <= hoverValue);
        btn.setAttribute('aria-checked', String(value === selectedRating));
      });
    }

    starButtons.forEach((btn) => {
      const value = Number(btn.dataset.value);

      btn.addEventListener('mouseenter', () => {
        updateStarClasses(value);
      });

      btn.addEventListener('click', () => {
        selectedRating = value;
        ratingInput.value = String(value);
        updateStarClasses(0);
        clearFieldError(container, errorRatingEl);
      });
    });

    container.addEventListener('mouseleave', () => {
      updateStarClasses(0);
    });
  }

  function setupFormSubmission() {
    // Clear individual field errors while the user edits
    nameInput.addEventListener('input', () => clearFieldError(nameInput, errorNameEl));
    hostelSelect.addEventListener('change', () => clearFieldError(hostelSelect, errorHostelEl));
    commentInput.addEventListener('input', () => clearFieldError(commentInput, errorCommentEl));

    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault();
      formSuccessEl.classList.add('hidden');

      const name = nameInput.value.trim();
      const hostel = hostelSelect.value;
      const rating = Number(ratingInput.value);
      const comment = commentInput.value.trim();

      let isValid = true;

      if (!name) {
        setFieldError(nameInput, errorNameEl, 'Please enter your name.');
        isValid = false;
      }

      if (!hostel) {
        setFieldError(hostelSelect, errorHostelEl, 'Please select a hostel.');
        isValid = false;
      }

      if (!rating || rating < 1 || rating > 5) {
        setFieldError(
          document.getElementById('star-rating-input'),
          errorRatingEl,
          'Please choose a star rating (1 to 5).'
        );
        isValid = false;
      }

      if (comment.length < 10) {
        setFieldError(
          commentInput,
          errorCommentEl,
          'Please write at least 10 characters in your comment.'
        );
        isValid = false;
      }

      if (!isValid) return;

      // Build and prepend the new review at the top of the list
      const newReview = {
        id: Date.now(),
        name,
        city: getHostelCity(hostel),
        hostel,
        rating,
        comment,
        date: getTodayIsoDate()
      };

      allReviews.unshift(newReview);
      saveReviews(allReviews);

      // Reset filters to show the newly added review right at the top
      filterHostelEl.value = 'all';
      filterRatingEl.value = 'all';
      sortByEl.value = 'newest';
      currentPage = 1;
      mobileVisibleCount = ITEMS_PER_PAGE;

      // Update rating summary, bars, and cards immediately
      renderAll();

      // Reset form inputs and star selection
      reviewForm.reset();
      selectedRating = 0;
      ratingInput.value = '0';
      starButtons.forEach((btn) => {
        btn.classList.remove('is-selected', 'is-hovered');
        btn.setAttribute('aria-checked', 'false');
      });

      // Show green confirmation message
      formSuccessEl.classList.remove('hidden');
    });
  }

  /* ------------------------------------------------------------------------
     Utility Helpers
     ------------------------------------------------------------------------ */

  function isMobileViewport() {
    return window.innerWidth < 768;
  }

  function getHostelCity(hostelName) {
    const found = HOSTELS.find((item) => item.name === hostelName);
    return found ? found.city : 'Pakistan';
  }

  function getTodayIsoDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(isoDate) {
    const parsed = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function setFieldError(element, errorEl, message) {
    element.classList.add('is-invalid');
    errorEl.textContent = message;
  }

  function clearFieldError(element, errorEl) {
    element.classList.remove('is-invalid');
    errorEl.textContent = '';
  }

  function createStarSvg(isFilled) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', `star-icon ${isFilled ? 'star-filled' : 'star-empty'}`);

    const polygon = document.createElementNS(svgNS, 'polygon');
    polygon.setAttribute(
      'points',
      '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
    );
    svg.appendChild(polygon);
    return svg;
  }
});
