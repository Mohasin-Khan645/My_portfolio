# Portfolio (HTML + CSS + Vanilla JS)

Premium, high-performance, fully responsive developer portfolio for **Mohammad Mohasin Khan** (Frontend Developer & DevOps Enthusiast).

## Run locally

- **Option A (quick)**: Open `portfolio/index.html` in your browser.
- **Option B (recommended)**: Serve with a local web server for best results.

```bash
# from repo root
cd portfolio
npx serve .
```

## Customize

- **Profile image**
  - Replace the placeholder avatar by adding an image and updating the hero markup:
    - Put your file in `portfolio/assets/images/`
    - Replace the `MK` initials block inside `.profile__inner` with an `<img>`

- **Resume**
  - Replace `portfolio/assets/resume.txt` with your real resume (PDF recommended).
  - Keep the same filename (or update both resume links in `index.html`).

- **Social links & contact info**
  - Update placeholders in:
    - Floating social sidebar (`<aside class="social-rail">`)
    - Contact cards in `#contact`
    - Footer social links

## Features included

- Sticky glassmorphism navbar + blur-on-scroll
- Scroll progress indicator
- Active section highlight
- Mobile hamburger menu + ESC close
- Hero typing animation + particles canvas
- Animated counters on scroll
- Section reveal animations
- Skill category filtering + animated progress bars
- Project filtering
- Dark/Light mode toggle (persisted)
- Cursor glow effect (disabled on touch/reduced-motion)
- Back-to-top button
- Contact form validation (front-end only)

