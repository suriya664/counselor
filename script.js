(function () {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });
})();

function showMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = "msg " + type;
}

function sanitizeInput(value) {
  return value.replace(/[<>]/g, "").trim();
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-counter"));
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.floor(progress * target);
          el.textContent = value.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  if (!triggers.length) return;

  triggers.forEach((trigger, index) => {
    const item = trigger.closest(".accordion-item");
    const panel = item ? item.querySelector(".accordion-panel") : null;
    if (panel) {
      const panelId = "accordion-panel-" + index;
      panel.id = panelId;
      trigger.setAttribute("aria-controls", panelId);
      trigger.setAttribute("aria-expanded", "false");
    }

    trigger.addEventListener("click", function () {
      const item = trigger.closest(".accordion-item");
      if (!item) return;
      const isActive = item.classList.toggle("active");
      trigger.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
  });
}

function setupMenuToggle() {
  const toggle = document.querySelector(".menu-toggle");
  const navRight = document.querySelector(".nav-right");
  if (!toggle || !navRight) return;

  toggle.addEventListener("click", function () {
    const isOpen = navRight.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

function setupThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  if (!themeToggle || !themeIcon) return;

  // Get saved theme or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });
}

function setupProgressSliders() {
  const sliders = document.querySelectorAll(".progress-slider");
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const progressItem = slider.closest(".progress-item");
    const progressFill = progressItem.querySelector(".progress-fill");
    const progressText = progressItem.querySelector(".progress-text");

    // Enable the slider
    slider.disabled = false;

    slider.addEventListener("input", function() {
      const value = this.value;
      progressFill.style.width = value + "%";
      progressText.textContent = value + "%";
    });

    // Show slider on hover
    slider.addEventListener("mouseenter", function() {
      this.style.opacity = "0.5";
    });

    slider.addEventListener("mouseleave", function() {
      this.style.opacity = "0";
    });
  });
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector(".theme-icon");
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const msg = document.getElementById("contactMsg");

    const name = sanitizeInput(document.getElementById("name").value);
    const email = sanitizeInput(document.getElementById("email").value.toLowerCase());
    const message = sanitizeInput(document.getElementById("message").value);
    const consent = document.getElementById("consent");
    const honeypot = document.getElementById("company");

    if (!name || !email || !message) {
      showMessage(msg, "Please complete all required fields.", "error");
      return;
    }

    if (honeypot && honeypot.value) {
      showMessage(msg, "Submission blocked.", "error");
      return;
    }

    if (consent && !consent.checked) {
      showMessage(msg, "Please confirm consent to be contacted.", "error");
      return;
    }

    showMessage(msg, "Thank you. Your secure intake request has been recorded.", "success");
    contactForm.reset();
  });
}

const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailField = document.getElementById("newsletterEmail");
    const msg = document.getElementById("newsletterMsg");
    const email = sanitizeInput(emailField.value.toLowerCase());

    if (!email || !email.includes("@")) {
      showMessage(msg, "Enter a valid email address.", "error");
      return;
    }

    showMessage(msg, "Subscribed successfully. Check your inbox for updates.", "success");
    newsletterForm.reset();
  });
}

function getUsers() {
  return JSON.parse(localStorage.getItem("cc_users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("cc_users", JSON.stringify(users));
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = sanitizeInput(document.getElementById("regName").value);
    const email = sanitizeInput(document.getElementById("regEmail").value.toLowerCase());
    const password = document.getElementById("regPassword").value;
    const msg = document.getElementById("registerMsg");

    if (password.length < 6) {
      showMessage(msg, "Password must be at least 6 characters.", "error");
      return;
    }

    const terms = document.getElementById("regTerms");
    if (terms && !terms.checked) {
      showMessage(msg, "Please agree to the Terms and Conditions.", "error");
      return;
    }

    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      showMessage(msg, "Email already exists.", "error");
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);
    localStorage.setItem("cc_session", JSON.stringify({ name, email }));
    showMessage(msg, "Registration successful. Redirecting...", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 700);
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = sanitizeInput(document.getElementById("loginEmail").value.toLowerCase());
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMsg");

    const user = getUsers().find((u) => u.email === email && u.password === password);
    if (!user) {
      showMessage(msg, "Invalid email or password.", "error");
      return;
    }

    localStorage.setItem("cc_session", JSON.stringify({ name: user.name, email: user.email }));
    showMessage(msg, "Login successful. Redirecting...", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 700);
  });
}

const dashboardUser = document.getElementById("dashboardUser");
if (dashboardUser) {
  const session = JSON.parse(localStorage.getItem("cc_session") || "null");
  if (!session) {
    dashboardUser.textContent = "Guest User";
  } else {
    dashboardUser.textContent = session.name + " (" + session.email + ")";
  }
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("cc_session");
    window.location.href = "index.html";
  });
}

animateCounters();
setupAccordion();
setupMenuToggle();
setupThemeToggle();
setupProgressSliders();
