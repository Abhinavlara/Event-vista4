/* ============================================
   EVENT VISTA - Main JavaScript
   Navigation, Animations, Interactions
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollAnimations();
  initSmoothScroll();
  initNavbarScroll();
  initCounterAnimation();
});

/* === Mobile Navigation Toggle === */
function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
}

/* === Navbar Scroll Effect === */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Check initial scroll position
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
  }
}

/* === Scroll Animations with Intersection Observer === */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay for staggered animation
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, index * 100);
        
        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/* === Smooth Scroll for Anchor Links === */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* === Counter Animation for Stats === */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  
  if (counters.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
  const suffix = element.textContent.replace(/[0-9]/g, '');
  const duration = 2000;
  const steps = 60;
  const stepDuration = duration / steps;
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, stepDuration);
}

/* === Active Navigation Highlighting === */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Call on page load
highlightActiveNav();

/* === Form Utilities === */
function showMessage(type, message, containerId = 'message-container') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="${type}-message show">
      ${type === 'success' ? '<h4>✓ Success!</h4>' : '<h4>⚠ Error</h4>'}
      <p>${message}</p>
    </div>
  `;
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    const msg = container.querySelector(`.${type}-message`);
    if (msg) {
      msg.classList.remove('show');
      setTimeout(() => container.innerHTML = '', 300);
    }
  }, 5000);
}

/* === Ripple Effect for Buttons === */
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation to head
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

/* === Lazy Loading Images === */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if (images.length === 0) return;
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

initLazyLoading();

/* === Scroll to Top Button === */
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '↑';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #FF6B35, #FF8C5A);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
    z-index: 1000;
  `;
  
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.transform = 'scale(1.1)';
  });
  
  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.transform = 'scale(1)';
  });
}

initScrollToTop();

/* === Page Transition Effect === */
function initPageTransitions() {
  // Add loading class on page leave
  document.querySelectorAll('a:not([href^="#"]):not([href^="javascript"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
  
  // Fade in on page load
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  });
}

initPageTransitions();

/* === Utility: Format Currency === */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/* === Utility: Format Date === */
function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

console.log('🎉 Event Vista - Main JS Loaded Successfully!');
