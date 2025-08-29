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

// Webhook utility functions
const WEBHOOK_URL = 'https://hook.eu1.make.com/qcelwbyfxwo2n31203lpt9fj0p4z3dil';

/**
 * Send data to webhook
 * @param {Object} data - The data to send
 * @param {string} eventType - Type of event (contact_form, order_form, etc.)
 * @returns {Promise<boolean>} - Success status
 */
async function sendToWebhook(data, eventType) {
    try {
        const payload = {
            eventType: eventType,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            data: data
        };

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return response.ok;
    } catch (error) {
        console.error('Webhook error:', error);
        return false;
    }
}

/**
 * Format contact details into a Polish message with bullet points
 * @param {Object} contactData - Contact form data
 * @returns {string} - Formatted message for contact handling
 */
function formatContactMessage(contactData) {
    const { 'first-name': firstName, 'last-name': lastName, email, phone, subject, message } = contactData;

    let formattedMessage = `💬 NOWA WIADOMOŚĆ KONTAKTOWA\n\n`;
    formattedMessage += `📅 Data wiadomości: ${new Date().toLocaleString('pl-PL')}\n\n`;

    // Contact Information
    formattedMessage += `👤 DANE KONTAKTOWE:\n`;
    formattedMessage += `• Imię i nazwisko: ${firstName || ''} ${lastName || ''}\n`;
    formattedMessage += `• Email: ${email || ''}\n`;
    formattedMessage += `• Telefon: ${phone || ''}\n\n`;

    // Message Details
    formattedMessage += `📋 SZCZEGÓŁY WIADOMOŚCI:\n`;
    formattedMessage += `• Temat: ${subject || ''}\n`;
    formattedMessage += `• Wiadomość:\n${message || ''}\n\n`;

    formattedMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    formattedMessage += `⚡ Prosimy o szybką odpowiedź na wiadomość!\n`;

    return formattedMessage;
}

/**
 * Send contact form data to webhook
 * @param {FormData|Object} formData - Contact form data
 * @returns {Promise<boolean>} - Success status
 */
async function sendContactFormToWebhook(formData) {
    const data = formData instanceof FormData ? Object.fromEntries(formData) : formData;
    const contactData = {
        ...data,
        formType: 'contact'
    };

    // Create formatted message for contact handling
    const contactMessage = formatContactMessage(contactData);

    // Add formatted message to webhook data
    const webhookData = {
        ...contactData,
        contactMessage: contactMessage
    };

    return await sendToWebhook(webhookData, 'contact_form');
}

/**
 * Format order details into a Polish message with bullet points
 * @param {Object} orderData - Complete order data
 * @returns {string} - Formatted message for bakery
 */
function formatOrderMessage(orderData) {
    const { customer, cake, size, taste, decorations = [], delivery, total, orderType } = orderData;

    let message = `🧁 NOWE ZAMÓWIENIE TORTU\n\n`;
    message += `📅 Data zamówienia: ${new Date().toLocaleString('pl-PL')}\n`;
    message += `🏷️ Typ zamówienia: ${orderType === 'ready_cake' ? 'Tort gotowy' : 'Tort na zamówienie'}\n\n`;

    // Customer Information
    message += `👤 DANE KLIENTA:\n`;
    message += `• Imię i nazwisko: ${customer?.firstName || ''} ${customer?.lastName || ''}\n`;
    message += `• Email: ${customer?.email || ''}\n`;
    message += `• Telefon: ${customer?.phone || ''}\n`;

    // Delivery Information
    message += `\n🚚 SPOSÓB ODBIORU:\n`;
    if (delivery === 'pickup') {
        message += `• Odbiór własny\n`;
    } else if (delivery === 'delivery') {
        message += `• Dostawa pod adres\n`;
        if (customer?.address) {
            message += `• Adres: ${customer.address.street || ''}\n`;
            message += `• Kod pocztowy: ${customer.address.postalCode || ''}\n`;
            message += `• Miasto: ${customer.address.city || ''}\n`;
        }
    }

    // Cake Details
    message += `\n🎂 SZCZEGÓŁY TORTU:\n`;
    if (cake?.name) {
        message += `• Tort: ${cake.name}\n`;
    }
    if (size) {
        const sizeNames = { small: 'Mały (do 8 osób)', medium: 'Średni (do 12 osób)', large: 'Duży (do 16 osób)' };
        message += `• Rozmiar: ${sizeNames[size] || size}\n`;
    }
    if (taste) {
        message += `• Smak: ${taste}\n`;
    }

    // Decorations
    if (decorations && decorations.length > 0) {
        message += `\n✨ DEKORACJE:\n`;
        decorations.forEach(decoration => {
            if (typeof decoration === 'string') {
                message += `• ${decoration}\n`;
            } else if (decoration.name) {
                message += `• ${decoration.name} (+${decoration.price} zł)\n`;
            }
        });
    }

    // Total
    if (total) {
        message += `\n💰 ŁĄCZNA KWOTA: ${total} zł\n`;
    }

    // Special notes
    if (customer?.notes || orderData.notes) {
        message += `\n📝 UWAGI SPECJALNE:\n`;
        message += `${customer?.notes || orderData.notes}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `⚡ Prosimy o pilne przygotowanie zamówienia!\n`;

    return message;
}

/**
 * Send order form data to webhook
 * @param {FormData|Object} formData - Order form data
 * @param {Object} additionalData - Additional order data (cake config, etc.)
 * @returns {Promise<boolean>} - Success status
 */
async function sendOrderFormToWebhook(formData, additionalData = {}) {
    const data = formData instanceof FormData ? Object.fromEntries(formData) : formData;
    const orderData = {
        ...data,
        ...additionalData,
        formType: 'order',
        orderDate: new Date().toISOString()
    };

    // Create formatted message for bakery
    const bakeryMessage = formatOrderMessage(orderData);

    // Add formatted message to webhook data
    const webhookData = {
        ...orderData,
        bakeryMessage: bakeryMessage
    };

    return await sendToWebhook(webhookData, 'order_form');
}

/**
 * Format cake design details into a Polish message with bullet points
 * @param {Object} designData - Cake design configuration
 * @param {Object} customerData - Customer information if available
 * @returns {string} - Formatted message for design processing
 */
function formatCakeDesignMessage(designData, customerData = {}) {
    const { size, layers, cakeText, occasion, color, additionalColor, specialTheme, flavor, decorations, aiPrompt } = designData;

    let message = `🎨 NOWE ZLECENIE PROJEKTU TORTU\n\n`;
    message += `📅 Data zlecenia: ${new Date().toLocaleString('pl-PL')}\n\n`;

    // Design Specifications
    message += `🎂 PARAMETRY TORTU:\n`;
    const sizeNames = { small: 'Mały (do 8 osób)', medium: 'Średni (do 12 osób)', large: 'Duży (do 16 osób)' };
    message += `• Rozmiar: ${sizeNames[size] || size}\n`;
    message += `• Liczba warstw: ${layers || 2}\n`;
    message += `• Smak: ${flavor || 'Niezdefiniowany'}\n`;
    message += `• Kolor podstawowy: ${color || 'Niezdefiniowany'}\n`;
    if (additionalColor) {
        message += `• Kolor dodatkowy: ${additionalColor}\n`;
    }

    // Occasion and Theme
    message += `\n🎉 OKAZJA I TEMAT:\n`;
    message += `• Okazja: ${occasion || 'Niezdefiniowana'}\n`;
    if (specialTheme) {
        message += `• Temat specjalny: ${specialTheme}\n`;
    }
    if (cakeText) {
        message += `• Tekst na torcie: "${cakeText}"\n`;
    }

    // Decorations
    if (decorations && Object.keys(decorations).length > 0) {
        message += `\n✨ DEKORACJE:\n`;
        Object.entries(decorations).forEach(([key, value]) => {
            if (value === true) {
                const decorationNames = {
                    candles: 'Świeczki',
                    flowers: 'Kwiaty',
                    berries: 'Jagody',
                    sprinkles: 'Posypka'
                };
                message += `• ${decorationNames[key] || key}\n`;
            }
        });
    }

    // AI Prompt
    if (aiPrompt) {
        message += `\n🤖 PROMPT DO AI:\n`;
        message += `${aiPrompt}\n\n`;
    }

    // Customer Information (if available)
    if (customerData && Object.keys(customerData).length > 0) {
        message += `👤 DANE KLIENTA:\n`;
        if (customerData.firstName || customerData.lastName) {
            message += `• Imię i nazwisko: ${customerData.firstName || ''} ${customerData.lastName || ''}\n`;
        }
        if (customerData.email) {
            message += `• Email: ${customerData.email}\n`;
        }
        if (customerData.phone) {
            message += `• Telefon: ${customerData.phone}\n`;
        }
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `⚡ Prosimy o przygotowanie projektu wizualizacji!\n`;

    return message;
}

/**
 * Send cake design data to webhook
 * @param {Object} designData - Cake design configuration
 * @param {Object} customerData - Customer information if available
 * @returns {Promise<boolean>} - Success status
 */
async function sendCakeDesignToWebhook(designData, customerData = {}) {
    const data = {
        designData: designData,
        customerData: customerData,
        formType: 'cake_design',
        designDate: new Date().toISOString()
    };

    // Create formatted message for design processing
    const designMessage = formatCakeDesignMessage(designData, customerData);

    // Add formatted message to webhook data
    const webhookData = {
        ...data,
        designMessage: designMessage
    };

    return await sendToWebhook(webhookData, 'cake_design');
}

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

// Randomize art-deco-line positions on page load
function randomizeArtDecoLines() {
    const artDecoLines = document.querySelectorAll('.art-deco-line');
    if (artDecoLines.length > 0) {
        artDecoLines.forEach(line => {
            const parentElement = line.closest('.parallax-element');
            if (parentElement) {
                // Get current position
                const currentTop = parseInt(parentElement.style.top) || 0;
                const currentBottom = parseInt(parentElement.style.bottom) || 0;
                
                // Add random offset to Y position (-100px to +100px)
                const randomOffset = Math.floor(Math.random() * 200) - 100;
                
                if (parentElement.style.top) {
                    const newTop = Math.max(20, currentTop + randomOffset);
                    parentElement.style.top = `${newTop}px`;
                } else if (parentElement.style.bottom) {
                    const newBottom = Math.max(20, currentBottom + randomOffset);
                    parentElement.style.bottom = `${newBottom}px`;
                }
            }
        });
    }
}

// Parallax effect on scroll - subtle and natural
function updateParallax() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length > 0) {
        parallaxElements.forEach(el => {
            // Skip art-deco-line elements from parallax movement
            if (el.querySelector('.art-deco-line')) {
                return;
            }
            
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
            // Make it much more subtle by dividing by 10 and reducing the speed multiplier
            const yPos = -(scrollTop * speed * 0.1);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Throttle scroll events for smoother performance
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', () => {
    requestTick();
    ticking = false;
}, { passive: true });

// Initialize art-deco-line randomization on page load
window.addEventListener('DOMContentLoaded', randomizeArtDecoLines);

// Bottom nav scroll behavior
let lastScrollTop = 0;
const bottomNav = document.getElementById('bottom-nav');
if (bottomNav) {
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
}

// Automatic Hero Cake Animation
const cakeDesign = document.getElementById('cake-design');
if (cakeDesign) {
    let startTime = Date.now();
    
    function animateCake() {
        const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
        
        // Smooth continuous rotation with different speeds for X and Y axes
        const rotateX = Math.sin(elapsed * 0.3) * 3; // Gentle vertical tilt
        const rotateY = Math.sin(elapsed * 0.2) * 5; // Gentle horizontal rotation
        const scale = 1 + Math.sin(elapsed * 0.4) * 0.02; // Very subtle breathing effect
        
        cakeDesign.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        
        requestAnimationFrame(animateCake);
    }
    
    // Start the animation
    animateCake();
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqSearch = document.getElementById('faq-search');
    const faqAccordion = document.getElementById('faq-accordion');
    const noResults = document.getElementById('no-results');

    // Only initialize FAQ if elements exist
    if (faqQuestions.length > 0) {
        // Initialize all FAQ items as closed
        function initializeFAQ() {
            faqQuestions.forEach(question => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('.faq-icon');
                
                if (answer && icon) {
                    answer.style.maxHeight = '0px';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        }

        // Toggle FAQ item
        function toggleFAQ(question) {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            
            if (!answer || !icon) return;
            
            const isOpen = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';

            if (isOpen) {
                // Close
                answer.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
                question.setAttribute('aria-expanded', 'false');
            } else {
                // Close all others first
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question) {
                        const otherAnswer = otherQuestion.nextElementSibling;
                        const otherIcon = otherQuestion.querySelector('.faq-icon');
                        if (otherAnswer && otherIcon) {
                            otherAnswer.style.maxHeight = '0px';
                            otherIcon.style.transform = 'rotate(0deg)';
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // Open this one
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                question.setAttribute('aria-expanded', 'true');
            }
        }

    // Add click listeners to FAQ questions
    faqQuestions.forEach(question => {
        question.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFAQ(this);
        });

        // Initialize aria-expanded
        question.setAttribute('aria-expanded', 'false');
    });

        // FAQ Search functionality
        if (faqSearch && faqAccordion && noResults) {
            faqSearch.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                const faqItems = document.querySelectorAll('.faq-item');
                let visibleCount = 0;

                faqItems.forEach(item => {
                    const questionElement = item.querySelector('.faq-question h3');
                    const answerElement = item.querySelector('.faq-answer p');
                    
                    if (questionElement && answerElement) {
                        const question = questionElement.textContent.toLowerCase();
                        const answer = answerElement.textContent.toLowerCase();
                        
                        if (searchTerm === '' || question.includes(searchTerm) || answer.includes(searchTerm)) {
                            item.style.display = 'block';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                            visibleCount++;
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(-10px)';
                            setTimeout(() => {
                                if (!item.querySelector('.faq-question h3')?.textContent.toLowerCase().includes(faqSearch.value.toLowerCase()) && 
                                    !item.querySelector('.faq-answer p')?.textContent.toLowerCase().includes(faqSearch.value.toLowerCase())) {
                                    item.style.display = 'none';
                                }
                            }, 300);
                        }
                    }
                });

                // Show/hide no results message
                if (visibleCount === 0 && searchTerm !== '') {
                    noResults.classList.remove('hidden');
                    faqAccordion.style.opacity = '0.5';
                } else {
                    noResults.classList.add('hidden');
                    faqAccordion.style.opacity = '1';
                }
            });

            // Add search icon animation
            faqSearch.addEventListener('focus', function() {
                const searchIcon = this.previousElementSibling?.querySelector('i');
                if (searchIcon) {
                    searchIcon.style.transform = 'scale(1.1)';
                    searchIcon.style.color = 'var(--champagne-gold-start)';
                }
            });

            faqSearch.addEventListener('blur', function() {
                const searchIcon = this.previousElementSibling?.querySelector('i');
                if (searchIcon) {
                    searchIcon.style.transform = 'scale(1)';
                    searchIcon.style.color = '';
                }
            });
        }

        // Initialize FAQ
        initializeFAQ();

        // Add smooth scrolling to FAQ items when they open
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
                    
                    if (!isInView) {
                        this.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }
                }, 300); // Wait for animation to complete
            });
        });
    }
});
