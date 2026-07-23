/* ============================================================
   Portfolio JavaScript – Anupol Kullasut
   Interactions, Animations & Scroll Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. Navbar: scroll effect + active link tracking
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateNavbar = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  const updateActiveLink = () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveLink();
  }, { passive: true });

  updateNavbar();

  /* ----------------------------------------------------------
     2. Hamburger mobile menu
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     3. Intersection Observer: scroll reveal
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll([
    '.section-header',
    '.about-text',
    '.about-info-cards',
    '.stat-card',
    '.skill-category',
    '.timeline-item',
    '.edu-card',
    '.contact-card',
    '.info-card',
  ].join(','));

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings within parent
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx <= 4) el.classList.add(`reveal-delay-${idx}`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     4. Smooth scroll for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     5. Skill tags hover ripple effect
  ---------------------------------------------------------- */
  document.querySelectorAll('.skill-tag, .course-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    tag.addEventListener('mouseleave', function () {
      this.style.transition = 'all 0.15s ease';
    });
  });

  /* ----------------------------------------------------------
     6. Stat counter animation
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateStat = (el) => {
    const text = el.textContent.trim();
    // Only animate numeric parts
    const match = text.match(/^(\d+)/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = text.replace(match[0], '');
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.ceil(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ----------------------------------------------------------
     7. Typing effect on hero title
  ---------------------------------------------------------- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < originalText.length) {
        heroTitle.textContent += originalText[charIndex++];
        setTimeout(typeChar, 35);
      }
    };

    // Start after hero badge animation
    setTimeout(typeChar, 700);
  }

  /* ----------------------------------------------------------
     8. Floating cards parallax on mouse move (hero only)
  ---------------------------------------------------------- */
  const heroSection = document.getElementById('hero');
  const floatingCards = document.querySelectorAll('.floating-card');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xRatio = (clientX / innerWidth - 0.5) * 2;
      const yRatio = (clientY / innerHeight - 0.5) * 2;

      floatingCards.forEach((card, i) => {
        const depth = (i + 1) * 6;
        const x = xRatio * depth;
        const y = yRatio * depth;
        card.style.transform = `translate(${x}px, ${y}px)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      floatingCards.forEach(card => {
        card.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     9. Page load progress bar
  ---------------------------------------------------------- */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #06b6d4);
    z-index: 9999;
    transition: width 0.3s ease, opacity 0.5s ease;
    width: 0%;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressBar.style.opacity = scrollTop > 50 ? '1' : '0';
  }, { passive: true });

  /* ----------------------------------------------------------
     10. Current year in footer
  ---------------------------------------------------------- */
  const footerText = document.getElementById('footer-text');
  if (footerText) {
    footerText.textContent = `© ${new Date().getFullYear()} Anupol Kullasut. Built with passion & precision.`;
  }


  /* ----------------------------------------------------------
     12. Scroll-to-top on logo click
  ---------------------------------------------------------- */
  document.getElementById('nav-logo-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     13. Copy-to-clipboard for [data-copy] elements
  ---------------------------------------------------------- */
  // Create toast element once
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.innerHTML = `
    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span id="toast-msg">Copied!</span>
  `;
  document.body.appendChild(toast);

  let toastTimer = null;

  const showToast = (text) => {
    document.getElementById('toast-msg').textContent = `Copied: ${text}`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', async () => {
      const value = el.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(value);
        showToast(value);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(value);
      }
    });
  });

});

/* ============================================================
   Lightbox – Screenshot Viewer
   ============================================================ */
function openLightbox(src, caption) {
  const overlay = document.getElementById('lightbox-overlay');
  const img     = document.getElementById('lightbox-img');
  const cap     = document.getElementById('lightbox-caption');
  img.src = src;
  img.alt = caption;
  cap.textContent = caption;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
