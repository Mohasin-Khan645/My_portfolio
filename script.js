(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const isTouchLike =
    "ontouchstart" in window || (window.matchMedia?.("(pointer: coarse)")?.matches ?? false) || navigator.maxTouchPoints > 0;

  if (isTouchLike) document.body.classList.add("is-touch");

  // ---- Profile config (paste your real links once) ----
  const PROFILE = {
    contact: {
      email: "mohasinkhan9825@gmail.com",
      phone: "+917355609842", 
      location: "India",
    },
    socials: {
      github: "https://github.com/mohasin-Khan645", 
      linkedin: "https://www.linkedin.com/in/mohasin-khan-086a66301?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B05iySMNhTGSBuK0Ynf%2BeVg%3D%3D", 
      twitter: "https://x.com/Mohasin645?t=eeooximFnQAInZBJI2Ol6Q&s=09",
      instagram: "https://www.instagram.com/mohasin_khan645?igsh=MTBmcHphNGwyaHhlYw==", 
      facebook: "https://www.facebook.com/share/1GPzbXTa5M/", 
    },
    projects: {
      houseRental: { demo: "", code: "" },
      ecommerce: { demo: "", code: "" },
      weather: { demo: "", code: "" },
      taskflow: { demo: "", code: "" },
      medical: { demo: "", code: "" },
    },
  };

  const safeSetHref = (a, href) => {
    if (!(a instanceof HTMLAnchorElement)) return;
    const cleaned = String(href || "").trim();
    if (!cleaned) return;
    a.href = cleaned;
    if (/^https?:\/\//i.test(cleaned)) {
      a.target = "_blank";
      a.rel = "noreferrer";
    }
  };

  const setText = (el, value) => {
    if (!el) return;
    const v = String(value || "").trim();
    if (!v) return;
    el.textContent = v;
  };

  // ---- Modal helpers (focus trap, ESC close) ----
  const focusableSel =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let activeOverlay = null;
  let lastFocus = null;

  const getFocusables = (rootEl) => $$(focusableSel, rootEl).filter((el) => el.offsetParent !== null);

  const openOverlay = (overlay) => {
    if (!overlay) return;
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeOverlay = overlay;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";

    const f = getFocusables(overlay);
    window.setTimeout(() => (f[0] instanceof HTMLElement ? f[0].focus() : undefined), 0);
  };

  const closeOverlay = () => {
    if (!activeOverlay) return;
    const overlay = activeOverlay;
    activeOverlay = null;
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus?.();
    lastFocus = null;
  };

  window.addEventListener(
    "keydown",
    (e) => {
      if (!activeOverlay) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeOverlay();
        return;
      }
      if (e.key === "Tab") {
        const f = getFocusables(activeOverlay);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    true
  );

  // Close overlay via backdrop/close buttons
  $$("[data-close-overlay]").forEach((el) => {
    el.addEventListener("click", closeOverlay);
  });

  // ---- Toasts ----
  const toastsRoot = $("#toasts");
  const toast = (title, message) => {
    if (!toastsRoot) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `
      <div>
        <p class="toast__title"></p>
        <p class="toast__msg"></p>
      </div>
      <button class="toast__close" type="button" aria-label="Close">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z"/></svg>
      </button>
    `;
    $(".toast__title", el).textContent = String(title || "Done");
    $(".toast__msg", el).textContent = String(message || "");
    const close = () => {
      el.classList.remove("is-in");
      window.setTimeout(() => el.remove(), 180);
    };
    $(".toast__close", el).addEventListener("click", close);
    toastsRoot.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-in"));
    window.setTimeout(close, 2800);
  };

  // ---- Loader ----
  const loader = $("#page-loader");
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 450);
  };

  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, prefersReducedMotion ? 120 : 520);
  });

  // ---- Year ----
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Theme toggle (dark/light) ----
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const THEME_KEY = "mk_portfolio_theme";

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f7fb" : "#0a0a0a");
    // Notify other subsystems (particles)
    window.dispatchEvent(new CustomEvent("mk-theme-change", { detail: { theme } }));
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // ---- Apply socials/contact/projects from PROFILE ----
  // Socials (rail + contact + footer all use [data-social])
  $$("[data-social]").forEach((el) => {
    const key = el.getAttribute("data-social") || "";
    const url = PROFILE.socials[key];
    safeSetHref(el, url);
  });

  // Contact info (email/phone/location)
  const emailA = $("[data-contact='email']");
  if (emailA instanceof HTMLAnchorElement && PROFILE.contact.email) {
    const em = PROFILE.contact.email.trim();
    emailA.href = `mailto:${em}`;
    const span = $(".mono", emailA);
    setText(span ?? emailA, em);
  }

  const phoneA = $("[data-contact='phone']");
  if (phoneA instanceof HTMLAnchorElement && PROFILE.contact.phone) {
    const ph = PROFILE.contact.phone.trim();
    phoneA.href = `tel:${ph.replace(/\s+/g, "")}`;
    const span = $(".mono", phoneA);
    setText(span ?? phoneA, ph);
  }

  const locEl = $("[data-contact='location'] .mono") ?? $("[data-contact='location']");
  if (locEl) setText(locEl, PROFILE.contact.location);

  // Projects (buttons use [data-project-link="key.type"])
  $$("[data-project-link]").forEach((a) => {
    const token = a.getAttribute("data-project-link") || "";
    const [key, type] = token.split(".");
    const url = PROFILE.projects?.[key]?.[type];
    safeSetHref(a, url);
  });

  // ---- Copy to clipboard (email/phone) ----
  const copyText = async (text) => {
    const t = String(text || "").trim();
    if (!t) return false;
    try {
      await navigator.clipboard.writeText(t);
      return true;
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch {
        ta.remove();
        return false;
      }
    }
  };

  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const key = btn.getAttribute("data-copy");
      if (key === "email") {
        const text = $(".mono", $("[data-contact='email']"))?.textContent || PROFILE.contact.email;
        const ok = await copyText(text);
        toast(ok ? "Copied" : "Copy failed", ok ? "Email copied to clipboard." : "Your browser blocked clipboard access.");
      } else if (key === "phone") {
        const text = $(".mono", $("[data-contact='phone']"))?.textContent || PROFILE.contact.phone;
        const ok = await copyText(text);
        toast(ok ? "Copied" : "Copy failed", ok ? "Phone copied to clipboard." : "Your browser blocked clipboard access.");
      }
    });
  });

  // ---- Resume viewer modal ----
  const resumeOverlay = $("#resumeOverlay");
  $$("[data-open-resume]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openOverlay(resumeOverlay);
    });
  });

  // ---- Project case studies modal ----
  const projectOverlay = $("#projectOverlay");
  const projectTitle = $("#projectTitle");
  const projectMeta = $("#projectMeta");
  const projectBody = $("#projectBody");
  const projectDemo = $("#projectDemo");
  const projectCode = $("#projectCode");

  const CASE_STUDIES = {
    houseRental: {
      meta: "Backend • Admin workflows",
      title: "House Rental Management System",
      problem:
        "Managing listings, tenants, and rental workflows becomes messy without a clear data model and clean admin flows.",
      approach: [
        "Designed clear entities (properties, tenants, agreements) with predictable CRUD flows.",
        "Built clean UI states for search, filters, and detail views.",
        "Focused on validations and guardrails to reduce data errors.",
      ],
      results: ["Faster listing updates with structured forms", "Cleaner admin overview with filterable lists"],
      stack: ["Java", "Mongos", "Java Swing"],
    },
    ecommerce: {
      meta: "Frontend • Responsive UX",
      title: "E-commerce Website",
      problem: "Most storefront UIs fail on mobile and feel inconsistent across pages and components.",
      approach: [
        "Built a consistent component language (buttons, cards, spacing).",
        "Optimized layout for touch + mobile-first flows.",
        "Improved perceived performance with skeleton-like structure and smooth transitions.",
      ],
      results: ["Responsive UI across devices", "Cleaner cart + product browsing flow"],
      stack: ["HTML", "CSS", "JavaScript"],
    },
    weather: {
      meta: "Frontend • APIs",
      title: "Weather App",
      problem: "Weather data is only useful if it’s quick to access and easy to read.",
      approach: [
        "Fast search + clear weather presentation.",
        "Handled loading/empty/error states cleanly.",
        "Kept UI minimal with good typography and spacing.",
      ],
      results: ["Quick interaction loop", "Clear visual hierarchy for conditions"],
      stack: ["JavaScript","Html","CSS", "APIs"],
    },
    taskflow: {
      meta: "Backend • API design",
      title: "TaskFlow API",
      problem: "Task management needs a stable API contract and an architecture ready for auth + scaling.",
      approach: [
        "Designed REST endpoints with predictable conventions.",
        "Structured layers for controllers/services/db boundaries.",
        "Container-ready mindset (local parity with production).",
      ],
      results: ["Clear API surface", "Easier testing + extension"],
      stack: ["JavaScript", "Mongos", "Docker"],
    },
    medical: {
      meta: "DevOps • Automation mindset",
      title: "Medical Management System",
      problem: "Operational workflows need reliability, clear processes, and automation-friendly setup.",
      approach: [
        "Identified key flows (records, appointments, admin).",
        "Mapped where automation helps: backups, deployments, and environment consistency.",
        "Designed with maintainability and clear boundaries.",
      ],
      results: ["Stronger operational thinking", "Automation-ready structure"],
      stack: ["Docker", "CI/CD", "Linux"],
    },
  };

  const renderCaseStudy = (key) => {
    const cs = CASE_STUDIES[key];
    if (!cs || !projectBody) return;
    projectMeta.textContent = cs.meta;
    projectTitle.textContent = cs.title;
    projectBody.innerHTML = `
      <p><strong style="color: var(--text)">Problem:</strong> ${cs.problem}</p>
      <div>
        <p style="margin:0 0 8px"><strong style="color: var(--text)">Approach:</strong></p>
        <ul style="margin:0; padding-left: 18px">
          ${cs.approach.map((x) => `<li>${x}</li>`).join("")}
        </ul>
      </div>
      <div>
        <p style="margin:0 0 8px"><strong style="color: var(--text)">Results:</strong></p>
        <ul style="margin:0; padding-left: 18px">
          ${cs.results.map((x) => `<li>${x}</li>`).join("")}
        </ul>
      </div>
      <div>
        <p style="margin:0 0 8px"><strong style="color: var(--text)">Tech:</strong></p>
        <div class="tags" aria-label="Tech stack">${cs.stack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    `;

    const demo = PROFILE.projects?.[key]?.demo || "";
    const code = PROFILE.projects?.[key]?.code || "";
    projectDemo.hidden = !demo;
    projectCode.hidden = !code;
    safeSetHref(projectDemo, demo);
    safeSetHref(projectCode, code);
  };

  $$("[data-project-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-project-open");
      renderCaseStudy(key);
      openOverlay(projectOverlay);
    });
  });

  // Clicking anywhere on project card (except links/buttons) opens case study
  $$("[data-project-key]").forEach((card) => {
    card.addEventListener("click", (e) => {
      const t = e.target;
      if (t instanceof HTMLElement) {
        if (t.closest("a,button,input,textarea,select")) return;
      }
      const key = card.getAttribute("data-project-key");
      if (!key) return;
      renderCaseStudy(key);
      openOverlay(projectOverlay);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target;
      if (t instanceof HTMLElement && t.closest("a,button,input,textarea,select")) return;
      e.preventDefault();
      const key = card.getAttribute("data-project-key");
      if (!key) return;
      renderCaseStudy(key);
      openOverlay(projectOverlay);
    });
  });

  // ---- Command palette (Ctrl/⌘ K) ----
  const cmdkOverlay = $("#cmdkOverlay");
  const cmdkInput = $("#cmdkInput");
  const cmdkList = $("#cmdkList");
  const cmdkBtn = $("#cmdkBtn");

  const COMMANDS = [
    { type: "section", name: "Home", meta: "Section", action: () => (location.hash = "#home") },
    { type: "section", name: "About", meta: "Section", action: () => (location.hash = "#about") },
    { type: "section", name: "Skills", meta: "Section", action: () => (location.hash = "#skills") },
    { type: "section", name: "Education", meta: "Section", action: () => (location.hash = "#experience") },
    { type: "section", name: "Projects", meta: "Section", action: () => (location.hash = "#projects") },
    { type: "section", name: "DevOps Lab", meta: "Section", action: () => (location.hash = "#devops-lab") },
    { type: "section", name: "Services", meta: "Section", action: () => (location.hash = "#services") },
    { type: "section", name: "Achievements", meta: "Section", action: () => (location.hash = "#achievements") },
    { type: "section", name: "Contact", meta: "Section", action: () => (location.hash = "#contact") },
    { type: "action", name: "Open Resume", meta: "Modal", action: () => openOverlay(resumeOverlay) },
  ];

  const filterCommands = (q) => {
    const query = String(q || "").trim().toLowerCase();
    if (!query) return COMMANDS;
    return COMMANDS.filter((c) => (c.name + " " + c.meta).toLowerCase().includes(query));
  };

  let cmdkIndex = 0;
  const renderCmdk = (q = "") => {
    if (!cmdkList) return;
    const items = filterCommands(q);
    cmdkIndex = Math.min(cmdkIndex, Math.max(0, items.length - 1));
    cmdkList.innerHTML = items
      .map(
        (c, idx) => `
          <div class="cmdk__item" role="option" aria-selected="${idx === cmdkIndex}" data-cmdk-index="${idx}">
            <div>
              <div class="cmdk__name">${c.name}</div>
              <div class="cmdk__meta">${c.meta}</div>
            </div>
            <div class="kbd">${c.type === "section" ? "Enter" : "Run"}</div>
          </div>
        `
      )
      .join("");

    // Click handlers
    $$("[data-cmdk-index]", cmdkList).forEach((el) => {
      el.addEventListener("click", () => {
        const i = Number(el.getAttribute("data-cmdk-index"));
        const cmd = items[i];
        if (!cmd) return;
        closeOverlay();
        cmd.action();
      });
    });

    return items;
  };

  const openCmdk = () => {
    openOverlay(cmdkOverlay);
    if (cmdkInput instanceof HTMLInputElement) {
      cmdkInput.value = "";
      renderCmdk("");
      cmdkInput.focus();
    }
  };

  cmdkBtn?.addEventListener("click", openCmdk);

  window.addEventListener("keydown", (e) => {
    const isK = (e.key || "").toLowerCase() === "k";
    if ((e.ctrlKey || e.metaKey) && isK) {
      e.preventDefault();
      openCmdk();
    }
  });

  cmdkInput?.addEventListener("input", () => {
    cmdkIndex = 0;
    renderCmdk(cmdkInput.value);
  });

  cmdkInput?.addEventListener("keydown", (e) => {
    const items = filterCommands(cmdkInput.value);
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      cmdkIndex = Math.min(items.length - 1, cmdkIndex + 1);
      renderCmdk(cmdkInput.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      cmdkIndex = Math.max(0, cmdkIndex - 1);
      renderCmdk(cmdkInput.value);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = items[cmdkIndex];
      if (!cmd) return;
      closeOverlay();
      cmd.action();
    }
  });

  // ---- GitHub stats (public API) ----
  const ghRoot = $("#githubStats");
  const ghFollowers = $("[data-gh='followers']");
  const ghRepos = $("[data-gh='repos']");
  const ghStars = $("[data-gh='stars']");

  const parseGitHubUsername = (url) => {
    const u = String(url || "").trim();
    if (!u) return "";
    // Accept "username" too
    if (!u.includes("/")) return u.replace(/^@/, "");
    try {
      const parsed = new URL(u);
      const parts = parsed.pathname.split("/").filter(Boolean);
      return (parts[0] || "").replace(/^@/, "");
    } catch {
      const parts = u.split("/").filter(Boolean);
      return (parts[parts.length - 1] || "").replace(/^@/, "");
    }
  };

  const fetchJson = async (url) => {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  };

  const sumTopRepoStars = (repos, topN = 12) => {
    const list = Array.isArray(repos) ? repos : [];
    return list
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, topN)
      .reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  };

  const loadGitHubStats = async () => {
    if (!ghRoot) return;
    const username = parseGitHubUsername(PROFILE.socials.github);
    if (!username) return;

    ghRoot.classList.add("is-loading");
    try {
      const user = await fetchJson(`https://api.github.com/users/${encodeURIComponent(username)}`);
      const repos = await fetchJson(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);

      const followers = user.followers ?? 0;
      const publicRepos = user.public_repos ?? 0;
      const stars = sumTopRepoStars(repos, 12);

      if (ghFollowers) ghFollowers.textContent = String(followers);
      if (ghRepos) ghRepos.textContent = String(publicRepos);
      if (ghStars) ghStars.textContent = String(stars);
    } catch (err) {
      // Keep placeholders but explain via toast once.
      toast("GitHub stats", "Couldn’t load GitHub stats yet. Add your GitHub URL in PROFILE.socials.github.");
    } finally {
      ghRoot.classList.remove("is-loading");
    }
  };

  loadGitHubStats();

  // ---- Profile photo (fade-in with fallback) ----
  const profileImg = $(".profile__img");
  const profileInner = $(".profile__inner");

  const markProfileLoaded = () => profileInner?.classList.add("is-loaded");
  const markProfileFailed = () => {
    // Keep initials visible if the image isn't available.
    profileImg?.setAttribute("hidden", "true");
  };

  if (profileImg instanceof HTMLImageElement) {
    if (profileImg.complete && profileImg.naturalWidth > 0) {
      markProfileLoaded();
    } else {
      profileImg.addEventListener("load", markProfileLoaded, { once: true });
      profileImg.addEventListener("error", markProfileFailed, { once: true });
    }
  }

  // ---- Cursor glow (GPU-friendly via CSS vars) ----
  if (!prefersReducedMotion && !isTouchLike) {
    const glow = $("#cursor-glow");
    if (glow) {
      let raf = 0;
      let targetX = -999;
      let targetY = -999;

      const update = () => {
        glow.style.setProperty("--x", `${targetX}px`);
        glow.style.setProperty("--y", `${targetY}px`);
        raf = 0;
      };

      window.addEventListener(
        "mousemove",
        (e) => {
          targetX = e.clientX;
          targetY = e.clientY;
          if (!raf) raf = window.requestAnimationFrame(update);
        },
        { passive: true }
      );

      window.addEventListener(
        "mouseleave",
        () => {
          targetX = -999;
          targetY = -999;
          if (!raf) raf = window.requestAnimationFrame(update);
        },
        { passive: true }
      );
    }
  }

  // ---- Navbar: blur on scroll, active link ----
  const nav = $(".nav");
  const navMenu = $("#navMenu");
  const navLinks = $$(".nav__link", navMenu ?? document);

  // ---- Scroll progress + nav scrolled state + back-to-top ----
  const progressBar = $("#scroll-progress-bar");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY || 0;
    nav?.classList.toggle("is-scrolled", y > 8);
    toTop?.classList.toggle("is-visible", y > 700);

    if (progressBar) {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const p = Math.min(1, Math.max(0, y / max));
      progressBar.style.width = `${(p * 100).toFixed(2)}%`;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  // ---- Active section highlight (IntersectionObserver) ----
  const sectionIds = ["home", "about", "skills", "experience", "projects", "services", "achievements", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach((l) => {
      const href = l.getAttribute("href") || "";
      l.classList.toggle("is-active", href === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Pick the most visible entry in view for stable highlighting.
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (!visible.length) return;
        const id = visible[0].target.getAttribute("id");
        if (id) setActiveLink(id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-12% 0px -70% 0px" }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  // ---- Reveal animations + skill meters ----
  const revealEls = $$(".reveal");
  const skillCards = $$("[data-skill]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);

          // Trigger meters when a skill card appears.
          if (e.target.matches?.("[data-skill]")) {
            e.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
    skillCards.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    skillCards.forEach((el) => el.classList.add("is-visible"));
  }

  // ---- Counters ----
  const counters = $$("[data-counter]");
  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-target") || "0");
    if (!Number.isFinite(target) || target <= 0) return;
    const start = 0;
    const duration = prefersReducedMotion ? 0 : 900;
    const t0 = performance.now();

    const step = (now) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const counterObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          animateCounter(e.target);
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.45 }
    );
    counters.forEach((c) => counterObs.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // ---- Typing animation (rotating titles) ----
  const typingEl = $("#typing");
  const titles = ["Frontend Developer", "DevOps Enthusiast", "Web Developer", "Tech Learner"];

  const startTyping = () => {
    if (!typingEl) return;
    if (prefersReducedMotion) {
      typingEl.textContent = titles[0];
      return;
    }

    let i = 0;
    let text = "";
    let isDeleting = false;
    let lastTick = 0;

    const tick = (now) => {
      const full = titles[i % titles.length];
      const speed = isDeleting ? 38 : 52;
      if (now - lastTick < speed) return requestAnimationFrame(tick);
      lastTick = now;

      text = isDeleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1);
      typingEl.textContent = text;

      if (!isDeleting && text === full) {
        // Pause at full text.
        window.setTimeout(() => {
          isDeleting = true;
        }, 900);
      } else if (isDeleting && text === "") {
        isDeleting = false;
        i += 1;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };
  startTyping();

  // ---- Skill filtering ----
  const skillGrid = $("#skillGrid");
  const skillFilterBtns = $$("[data-filter]");

  const applySkillFilter = (filter) => {
    const cards = $$("[data-skill]", skillGrid ?? document);
    cards.forEach((c) => {
      const cat = c.getAttribute("data-category");
      const show = filter === "all" || cat === filter;
      c.hidden = !show;
    });
  };

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      skillFilterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applySkillFilter(btn.getAttribute("data-filter") || "all");
    });
  });

  // ---- Project filtering ----
  const projectGrid = $("#projectGrid");
  const projectFilterBtns = $$("[data-project-filter]");

  const applyProjectFilter = (filter) => {
    const cards = $$("[data-project]", projectGrid ?? document);
    cards.forEach((c) => {
      const cat = c.getAttribute("data-category");
      const show = filter === "all" || cat === filter;
      c.hidden = !show;
    });
  };

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      projectFilterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyProjectFilter(btn.getAttribute("data-project-filter") || "all");
    });
  });

  // ---- Contact form validation + email handoff (mailto) ----
  const form = $("#contactForm");
  const formNote = $("#formNote");

  const setFieldError = (name, msg) => {
    const input = $(`#${name}`);
    const err = $(`[data-error-for="${name}"]`);
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg || "";
  };

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  const resolveOwnerEmail = () => {
    const fromProfile = String(PROFILE?.contact?.email || "").trim();
    if (fromProfile) return fromProfile;

    const emailLink = $("[data-contact='email']");
    if (emailLink instanceof HTMLAnchorElement) {
      const text = String(emailLink.textContent || "").trim();
      if (isEmail(text)) return text;

      const href = String(emailLink.getAttribute("href") || "").trim();
      if (href.toLowerCase().startsWith("mailto:")) {
        const fromHref = href.slice(7).split("?")[0].trim();
        if (fromHref) return fromHref;
      }
    }
    return "";
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    setFieldError("name", "");
    setFieldError("email", "");
    setFieldError("message", "");
    if (formNote) formNote.textContent = "";

    let ok = true;
    if (name.length < 2) {
      setFieldError("name", "Please enter your name.");
      ok = false;
    }
    if (!isEmail(email)) {
      setFieldError("email", "Please enter a valid email address.");
      ok = false;
    }
    if (message.length < 10) {
      setFieldError("message", "Please write a message (at least 10 characters).");
      ok = false;
    }

    if (!ok) {
      if (formNote) formNote.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    const ownerEmail = resolveOwnerEmail();
    if (!ownerEmail) {
      if (formNote) formNote.textContent = "Owner email is missing. Set PROFILE.contact.email in script.js.";
      toast("Missing email", "Please set your email in PROFILE.contact.email.");
      return;
    }

    const subject = `Portfolio service inquiry from ${name}`;
    const body = [
      `Hi Mohammad Mohasin Khan,`,
      "",
      `Name: ${name}`,
      `Sender Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailto = `mailto:${encodeURIComponent(ownerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    if (formNote) formNote.textContent = "Your email app is opening with this message.";
    form.reset();
  });

  // ---- Particles canvas (lightweight, responsive) ----
  const canvas = $("#particles");
  if (canvas instanceof HTMLCanvasElement && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      let w = 0;
      let h = 0;
      let dpr = Math.min(2, window.devicePixelRatio || 1);
      let particles = [];
      let raf = 0;
      let themeMode = root.getAttribute("data-theme") === "light" ? "light" : "dark";

      const rand = (min, max) => min + Math.random() * (max - min);

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.round(Math.min(90, Math.max(34, (w * h) / 24000)));
        const hues =
          themeMode === "light"
            ? ["0, 140, 255", "120, 80, 255"]
            : ["0, 242, 255", "139, 92, 246"];
        particles = Array.from({ length: count }, () => ({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(0.9, 2.2),
          vx: rand(-0.25, 0.25),
          vy: rand(-0.2, 0.2),
          a: rand(0.22, 0.65),
          hue: Math.random() < 0.6 ? hues[0] : hues[1],
        }));
      };

      const step = () => {
        raf = 0;
        ctx.clearRect(0, 0, w, h);

        // Soft gradient wash for depth.
        const g = ctx.createRadialGradient(w * 0.2, h * 0.1, 40, w * 0.55, h * 0.7, Math.max(w, h));
        g.addColorStop(0, themeMode === "light" ? "rgba(0, 140, 255, 0.06)" : "rgba(0, 198, 255, 0.05)");
        g.addColorStop(0.5, themeMode === "light" ? "rgba(120, 80, 255, 0.05)" : "rgba(139, 92, 246, 0.04)");
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;

          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.hue}, ${p.a})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        requestNext();
      };

      const requestNext = () => {
        if (!raf) raf = window.requestAnimationFrame(step);
      };

      const onResize = () => {
        resize();
        requestNext();
      };

      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("mk-theme-change", (e) => {
        themeMode = e?.detail?.theme === "light" ? "light" : "dark";
        resize();
      });
      resize();
      requestNext();
    }
  }
})();
