/* ==========================================================================
   Studenty Shelter — Contact Us Logic (js/contact.js)
   Handles contact form validation, live character counter, success message,
   and the single-open FAQ accordion.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
});

/**
 * Sets up validation, live character count, and submit handling
 * for the "Send a message" form.
 */
function initContactForm() {
  const MAX_MESSAGE_LENGTH = 500;
  const MIN_MESSAGE_LENGTH = 10;

  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('contact-success');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const counterEl = document.getElementById('message-counter');

  const errorName = document.getElementById('error-contact-name');
  const errorEmail = document.getElementById('error-contact-email');
  const errorPhone = document.getElementById('error-contact-phone');
  const errorSubject = document.getElementById('error-contact-subject');
  const errorMessage = document.getElementById('error-contact-message');

  if (!form) return;

  // Update live character counter whenever the user types in the message box
  function updateCharacterCounter() {
    const length = messageInput.value.length;
    counterEl.textContent = `${length} / ${MAX_MESSAGE_LENGTH} characters`;
    counterEl.classList.toggle('is-near-limit', length >= 450);
  }

  updateCharacterCounter();

  // Clear inline error as soon as the user starts fixing a field
  nameInput.addEventListener('input', () => clearError(nameInput, errorName));
  emailInput.addEventListener('input', () => clearError(emailInput, errorEmail));
  phoneInput.addEventListener('input', () => clearError(phoneInput, errorPhone));
  subjectInput.addEventListener('input', () => clearError(subjectInput, errorSubject));
  messageInput.addEventListener('input', () => {
    clearError(messageInput, errorMessage);
    updateCharacterCounter();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successBox.classList.add('hidden');

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    // 1. Full Name required
    if (!fullName) {
      showError(nameInput, errorName, 'Please enter your full name.');
      isValid = false;
    }

    // 2. Email required + valid format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email) {
      showError(emailInput, errorEmail, 'Please enter your email address.');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      showError(emailInput, errorEmail, 'Please enter a valid email address.');
      isValid = false;
    }

    // 3. Phone required + 11 digits starting with 03 (Pakistani mobile format)
    const phonePattern = /^03\d{9}$/;
    if (!phone) {
      showError(phoneInput, errorPhone, 'Please enter your phone number.');
      isValid = false;
    } else if (!phonePattern.test(phone)) {
      showError(
        phoneInput,
        errorPhone,
        'Phone must be 11 digits starting with 03 (e.g. 03001234567).'
      );
      isValid = false;
    }

    // 4. Subject required
    if (!subject) {
      showError(subjectInput, errorSubject, 'Please enter a subject.');
      isValid = false;
    }

    // 5. Message required + at least 10 characters
    if (!message) {
      showError(messageInput, errorMessage, 'Please write a message.');
      isValid = false;
    } else if (message.length < MIN_MESSAGE_LENGTH) {
      showError(
        messageInput,
        errorMessage,
        `Message must be at least ${MIN_MESSAGE_LENGTH} characters long.`
      );
      isValid = false;
    } else if (message.length > MAX_MESSAGE_LENGTH) {
      showError(
        messageInput,
        errorMessage,
        `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
      );
      isValid = false;
    }

    if (!isValid) return;

    // Show light green confirmation message and reset the form
    successBox.classList.remove('hidden');
    form.reset();
    updateCharacterCounter();
  });

  function showError(inputEl, errorEl, text) {
    inputEl.classList.add('is-invalid');
    errorEl.textContent = text;
  }

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove('is-invalid');
    errorEl.textContent = '';
  }
}

/**
 * Controls the FAQ accordion so only one answer stays open at a time.
 */
function initFaqAccordion() {
  const faqItems = Array.from(document.querySelectorAll('#faq-list .faq-item'));
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isAlreadyOpen = item.classList.contains('is-open');

      // Close all FAQ items first so only one answer is open at a time
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        const otherButton = otherItem.querySelector('.faq-question');
        if (otherButton) {
          otherButton.setAttribute('aria-expanded', 'false');
        }
      });

      // Open the clicked item if it was closed
      if (!isAlreadyOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
