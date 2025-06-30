// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a[href^="#"], button'); // Select all links and buttons in mobile menu

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  const isExpanded = !mobileMenu.classList.contains('hidden');
  mobileMenuButton.setAttribute('aria-expanded', isExpanded.toString());
  
  const svg = mobileMenuButton.querySelector('svg');
  if (!isExpanded) { // Menu is hidden
    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    mobileMenuButton.setAttribute('aria-label', 'Otwórz menu nawigacyjne');
  } else { // Menu is visible
    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    mobileMenuButton.setAttribute('aria-label', 'Zamknij menu nawigacyjne');
  }
});

// Close mobile menu on link/button click
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
      const svg = mobileMenuButton.querySelector('svg');
      svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
      mobileMenuButton.setAttribute('aria-label', 'Otwórz menu nawigacyjne');
    }
  });
});

// Tabs functionality
const tabCustomers = document.getElementById('tab-customers');
const tabBakers = document.getElementById('tab-bakers');
const tabContentCustomers = document.getElementById('tab-content-customers');
const tabContentBakers = document.getElementById('tab-content-bakers');

if (tabCustomers && tabBakers && tabContentCustomers && tabContentBakers) {
  const tabs = {
    customers: { btn: tabCustomers, content: tabContentCustomers },
    bakers: { btn: tabBakers, content: tabContentBakers }
  };

  const activateTab = (tabKey) => {
    Object.keys(tabs).forEach(key => {
      const tab = tabs[key];
      const isActive = key === tabKey;

      // Update button styles
      tab.btn.setAttribute('aria-selected', isActive.toString());
      if (isActive) {
        tab.btn.style.background = 'linear-gradient(135deg, var(--champagne-gold-start), var(--champagne-gold-end))';
        tab.btn.classList.add('text-midnight-navy');
        tab.btn.classList.remove('text-dove-gray');
      } else {
        tab.btn.style.background = 'transparent';
        tab.btn.classList.remove('text-midnight-navy');
        tab.btn.classList.add('text-dove-gray');
      }

      // Update content visibility and animation
      if (isActive) {
        tab.content.classList.remove('hidden');
        requestAnimationFrame(() => {
          tab.content.classList.add('active');
        });
      } else {
        tab.content.classList.remove('active');
        setTimeout(() => {
          // Only hide if it's not the active tab (prevents hiding it before it's shown)
          if (key !== tabKey) {
            tab.content.classList.add('hidden');
          }
        }, 300); // Must match CSS transition duration
      }
    });
  };

  tabCustomers.addEventListener('click', (e) => { e.preventDefault(); activateTab('customers'); });
  tabBakers.addEventListener('click', (e) => { e.preventDefault(); activateTab('bakers'); });

  // Set initial state on page load
  activateTab('customers'); 
  tabs.bakers.content.classList.add('hidden');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    // Ensure it's a valid internal link and not just "#"
    if (href.length > 1 && href.startsWith("#")) { 
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault(); // Prevent default only if target exists
          const offsetTop = target.offsetTop - 80; // Account for fixed header (h-16 is 64px, 80px gives more space)
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open and if the clicked link is inside the mobile menu
          if (!mobileMenu.classList.contains('hidden') && mobileMenu.contains(this)) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            const svg = mobileMenuButton.querySelector('svg');
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            mobileMenuButton.setAttribute('aria-label', 'Otwórz menu nawigacyjne');
          }
        }
    }
  });
});

// Update copyright year
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Function to handle tab switching based on URL hash
function checkHashForTab() {
  if (window.location.hash === '#for-bakers-section') {
    // Use a small timeout to ensure the rest of the page loads
    // and doesn't interfere with the click action.
    setTimeout(() => {
      if (tabBakers) {
        tabBakers.click();
        // Scroll again after tab switch to ensure correct position
        const target = document.getElementById('for-bakers-section');
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'auto' });
        }
      }
    }, 100);
  }
}

// Check hash on initial load
window.addEventListener('DOMContentLoaded', checkHashForTab);

// Check hash if it changes while on the page
window.addEventListener('hashchange', checkHashForTab);

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    document.querySelectorAll('.parallax-element').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
        const x = -(mouseX * speed) / 50; // Adjust divisor for sensitivity
        const y = -(mouseY * speed) / 50; // Adjust divisor for sensitivity
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
}, { passive: true });

// Bottom nav scroll behavior
let lastScrollTop = 0;
const bottomNav = document.getElementById('bottom-nav');
window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    // Downscroll
    bottomNav.classList.add('hidden-nav');
  } else {
    // Upscroll
    bottomNav.classList.remove('hidden-nav');
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, { passive: true });

// Interactive Hero Cake
const cakeDesign = document.getElementById('cake-design');
if (cakeDesign) {
    document.querySelector('.hero-gradient').addEventListener('mousemove', (e) => {
        const { left, top, width, height } = cakeDesign.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        
        const rotateX = -y / 40;
        const rotateY = x / 40;
        
        cakeDesign.style.transition = 'transform 0.1s ease-out';
        cakeDesign.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    document.querySelector('.hero-gradient').addEventListener('mouseleave', () => {
        cakeDesign.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        cakeDesign.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}
