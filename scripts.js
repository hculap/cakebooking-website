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
// Make webhook functions global
window.sendToWebhook = async function sendToWebhook(data, eventType) {
    try {
        // Check if we have image data to send as multipart
        const hasImageData = data.imageFile || data.imageBlob;
        
        if (hasImageData) {
            console.log('📤 Sending multipart form data with image...');
            return await sendMultipartWebhook(data, eventType);
        } else {
            console.log('📤 Sending JSON data (no image)...');
            return await sendJsonWebhook(data, eventType);
        }
    } catch (error) {
        console.error('Webhook error:', error);
        return false;
    }
}

async function sendJsonWebhook(data, eventType) {
    const payload = {
        eventType: eventType,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        data: data
    };

    const payloadString = JSON.stringify(payload);
    const payloadSizeKB = Math.round(payloadString.length / 1024);
    console.log(`📦 JSON payload size: ${payloadSizeKB} KB`);

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: payloadString
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ JSON webhook failed: ${response.status} ${response.statusText}`);
        console.error(`❌ Response: ${errorText}`);
        return false;
    }

    console.log(`✅ JSON webhook success: ${response.status}`);
    return response.ok;
}

async function sendMultipartWebhook(data, eventType) {
    const formData = new FormData();
    
    // Add basic webhook data
    formData.append('eventType', eventType);
    formData.append('timestamp', new Date().toISOString());
    formData.append('userAgent', navigator.userAgent);
    formData.append('url', window.location.href);
    
    // Add all data fields as form fields
    const flattenObject = (obj, prefix = 'data') => {
        for (const [key, value] of Object.entries(obj)) {
            const fieldName = prefix ? `${prefix}[${key}]` : key;
            
            if (key === 'imageFile' || key === 'imageBlob') {
                // Skip image data here - handle separately
                continue;
            } else if (value && typeof value === 'object' && !Array.isArray(value)) {
                flattenObject(value, fieldName);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === 'object') {
                        flattenObject(item, `${fieldName}[${index}]`);
                    } else {
                        formData.append(`${fieldName}[${index}]`, String(item));
                    }
                });
            } else if (value !== null && value !== undefined) {
                formData.append(fieldName, String(value));
            }
        }
    };
    
    flattenObject(data);
    
    // Add image file if present
    if (data.imageBlob) {
        const filename = data.imageMetadata?.filename || 'cake-design.png';
        formData.append('imageFile', data.imageBlob, filename);
        console.log(`📎 Added image file: ${filename} (${data.imageBlob.size} bytes)`);
    }

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData // No Content-Type header - let browser set multipart boundary
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Multipart webhook failed: ${response.status} ${response.statusText}`);
        console.error(`❌ Response: ${errorText}`);
        return false;
    }

    console.log(`✅ Multipart webhook success: ${response.status}`);
    return response.ok;
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
 * Format contact details into HTML for email display
 * @param {Object} contactData - Contact form data
 * @returns {string} - Formatted HTML message for email
 */
function formatContactMessageHTML(contactData) {
    const { 'first-name': firstName, 'last-name': lastName, email, phone, subject, message } = contactData;
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f5f2; padding: 20px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #0F2238, #1a3a5c); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">💬 NOWA WIADOMOŚĆ KONTAKTOWA</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">📅 ${new Date().toLocaleString('pl-PL')}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">👤 DANE KONTAKTOWE</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin: 8px 0; color: #4a5568;"><strong>Imię i nazwisko:</strong> ${firstName || ''} ${lastName || ''}</li>
                <li style="margin: 8px 0; color: #4a5568;"><strong>Email:</strong> <a href="mailto:${email || ''}" style="color: #F472B6; text-decoration: none;">${email || ''}</a></li>
                <li style="margin: 8px 0; color: #4a5568;"><strong>Telefon:</strong> ${phone || ''}</li>
            </ul>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">📋 SZCZEGÓŁY WIADOMOŚCI</h3>
            <div style="margin: 12px 0; color: #4a5568;"><strong>Temat:</strong> ${subject || ''}</div>
            <div style="margin: 12px 0;">
                <strong style="color: #4a5568;">Wiadomość:</strong>
                <div style="background: #f7f5f2; padding: 15px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #F472B6; white-space: pre-wrap; color: #2d3748;">${message || ''}</div>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #F472B6, #D7B88F); color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <strong>⚡ Prosimy o szybką odpowiedź na wiadomość!</strong>
        </div>
    </div>`;
    
    return html;
}

/**
 * Format order details into HTML for email display
 * @param {Object} orderData - Complete order data
 * @returns {string} - Formatted HTML message for bakery
 */
function formatOrderMessageHTML(orderData) {
    const { customer, cake, size, taste, decorations = [], delivery, total, orderType, cakeImageUrl, generatedPrompt, layers, cakeText, occasion, color, additionalColor, specialTheme, flavor, deliveryAddress, deliveryDate, notes, hasImageAttachment } = orderData;
    
    let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f5f2; padding: 20px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #0F2238, #1a3a5c); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">🧁 NOWE ZAMÓWIENIE TORTU</h2>
            <p style="margin: 10px 0 5px 0; opacity: 0.9;">📅 ${new Date().toLocaleString('pl-PL')}</p>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">🏷️ ${orderType === 'ready_cake' ? 'Tort gotowy' : orderType === 'generated_cake' ? 'Tort wygenerowany AI' : 'Tort na zamówienie'}</p>
        </div>`;
    
    // Customer Information
    html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">👤 DANE KLIENTA</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin: 8px 0; color: #4a5568;"><strong>Imię i nazwisko:</strong> ${customer?.firstName || ''} ${customer?.lastName || ''}</li>
                <li style="margin: 8px 0; color: #4a5568;"><strong>Email:</strong> <a href="mailto:${customer?.email || ''}" style="color: #F472B6; text-decoration: none;">${customer?.email || ''}</a></li>
                <li style="margin: 8px 0; color: #4a5568;"><strong>Telefon:</strong> ${customer?.phone || ''}</li>
            </ul>
        </div>`;
    
    // Delivery Information
    html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">🚚 SPOSÓB ODBIORU</h3>`;
    
    if (delivery === 'pickup') {
        html += `<p style="margin: 8px 0; color: #4a5568;">• Odbiór własny</p>`;
    } else if (delivery === 'delivery') {
        html += `<p style="margin: 8px 0; color: #4a5568;">• Dostawa pod adres</p>`;
        if (deliveryAddress) {
            html += `<ul style="list-style: none; padding: 0 0 0 20px; margin: 8px 0; color: #4a5568;">`;
            html += `<li style="margin: 4px 0;">Adres: ${deliveryAddress.street || ''}</li>`;
            html += `<li style="margin: 4px 0;">Kod pocztowy: ${deliveryAddress.postalCode || ''}</li>`;
            html += `<li style="margin: 4px 0;">Miasto: ${deliveryAddress.city || ''}</li>`;
            html += `</ul>`;
        }
    }
    
    if (deliveryDate) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Data dostawy:</strong> ${deliveryDate}</p>`;
    }
    
    if (notes) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Uwagi:</strong> ${notes}</p>`;
    }
    html += `</div>`;
    
    // Cake Details
    html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">🎂 SZCZEGÓŁY TORTU</h3>`;
    
    if (cake?.name) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Tort:</strong> ${cake.name}</p>`;
    }
    if (size) {
        const sizeText = typeof size === 'object' ? size.name : size;
        const sizeNames = { small: 'Mały', medium: 'Średni', large: 'Duży' };
        const displaySize = sizeNames[size] || sizeText || size;
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Rozmiar:</strong> ${displaySize}</p>`;
    }
    if (layers) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Liczba warstw:</strong> ${layers}</p>`;
    }
    if (flavor) {
        const flavorNames = { vanilla: 'Waniliowy', chocolate: 'Czekoladowy', strawberry: 'Truskawkowy', lemon: 'Cytrynowy', carrot: 'Marchewkowy' };
        const displayFlavor = flavorNames[flavor] || flavor;
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Smak:</strong> ${displayFlavor}</p>`;
    }
    if (taste) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Smak:</strong> ${taste}</p>`;
    }
    if (color) {
        const colorNames = { white: 'Biały', pink: 'Różowy', blue: 'Niebieski', green: 'Zielony', orange: 'Pomarańczowy', brown: 'Brązowy', red: 'Czerwony', purple: 'Fioletowy', yellow: 'Żółty', black: 'Czarny' };
        const displayColor = colorNames[color] || color;
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Kolor główny:</strong> ${displayColor}</p>`;
    }
    if (additionalColor) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Kolor dodatkowy:</strong> ${additionalColor}</p>`;
    }
    if (occasion) {
        const occasionNames = { birthday: 'Urodzinowy', wedding: 'Ślubny', anniversary: 'Rocznicowy', graduation: 'Na ukończenie szkoły', celebration: 'Świąteczny' };
        const displayOccasion = occasionNames[occasion] || occasion;
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Okazja:</strong> ${displayOccasion}</p>`;
    }
    if (cakeText) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Napis na torcie:</strong> "${cakeText}"</p>`;
    }
    if (specialTheme) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Specjalny motyw:</strong> ${specialTheme}</p>`;
    }
    
    // Generated cake prompt
    if (generatedPrompt) {
        html += `<div style="margin: 12px 0;">
            <strong style="color: #4a5568;">Prompt AI:</strong>
            <div style="background: #f7f5f2; padding: 15px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #D7B88F; font-family: monospace; font-size: 14px; color: #2d3748;">${generatedPrompt}</div>
        </div>`;
    }
    
    // Decorations
    if (decorations && typeof decorations === 'object' && Object.keys(decorations).length > 0) {
        // Handle cake visualizer decorations object format
        const selectedDecorations = [];
        const decorationNames = { candles: 'Świeczki', flowers: 'Kwiaty cukrowe', berries: 'Owoce', sprinkles: 'Posypka' };
        
        Object.entries(decorations).forEach(([key, value]) => {
            if (value === true) {
                selectedDecorations.push(decorationNames[key] || key);
            }
        });
        
        if (selectedDecorations.length > 0) {
            html += `<div style="margin: 12px 0;"><strong style="color: #4a5568;">Dekoracje:</strong><ul style="margin: 8px 0; padding-left: 20px; color: #4a5568;">`;
            selectedDecorations.forEach(decoration => {
                html += `<li style="margin: 4px 0;">${decoration}</li>`;
            });
            html += `</ul></div>`;
        }
    } else if (decorations && Array.isArray(decorations) && decorations.length > 0) {
        // Handle traditional decorations array format
        html += `<div style="margin: 12px 0;"><strong style="color: #4a5568;">Dekoracje:</strong><ul style="margin: 8px 0; padding-left: 20px; color: #4a5568;">`;
        decorations.forEach(decoration => {
            if (typeof decoration === 'string') {
                html += `<li style="margin: 4px 0;">${decoration}</li>`;
            } else if (decoration.name) {
                html += `<li style="margin: 4px 0;">${decoration.name} (+${decoration.price} zł)</li>`;
            }
        });
        html += `</ul></div>`;
    }
    
    html += `</div>`;
    
    // Cake Image - Show attachment message instead of embedded image
    if (hasImageAttachment || cakeImageUrl) {
        html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">🖼️ ZDJĘCIE TORTU</h3>`;
        
        if (hasImageAttachment) {
            html += `
            <div style="background: linear-gradient(135deg, #F472B6, #D7B88F); color: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <p style="margin: 0; font-size: 16px; font-weight: bold;">📎 Obraz tortu AI załączony do zamówienia</p>
                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Plik obrazu został przesłany wraz z danymi zamówienia</p>
            </div>`;
        } else if (cakeImageUrl && !cakeImageUrl.startsWith('data:image/')) {
            // Handle regular image URLs (non-base64)
            html += `<img src="${cakeImageUrl}" alt="Zamówiony tort" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" />`;
        } else {
            html += `
            <div style="background: #f0f0f0; color: #666; padding: 15px; border-radius: 8px; border: 2px dashed #ccc;">
                <p style="margin: 0; font-size: 14px;">🎨 Obraz tortu został wygenerowany przez AI</p>
                <p style="margin: 8px 0 0 0; font-size: 12px;">Obraz jest dostępny w załącznikach do tego emaila</p>
            </div>`;
        }
        
        html += `</div>`;
    }
    
    // Total
    if (total) {
        html += `
        <div style="background: linear-gradient(135deg, #F472B6, #D7B88F); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 24px;">💰 SUMA: ${total} zł</h3>
        </div>`;
    }
    
    // Call to action
    html += `
        <div style="background: linear-gradient(135deg, #D7B88F, #F1E0C8); color: #0F2238; padding: 15px; border-radius: 8px; text-align: center;">
            <strong>⚡ Prosimy o kontakt z klientem w celu potwierdzenia zamówienia!</strong>
        </div>
    </div>`;
    
    return html;
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

    // Create formatted messages for contact handling
    const plainTextMessage = formatContactMessage(contactData);
    const htmlMessage = formatContactMessageHTML(contactData);

    // Add formatted messages to webhook data
    const webhookData = {
        ...contactData,
        plainTextMessage: plainTextMessage,
        htmlMessage: htmlMessage
    };

    return await sendToWebhook(webhookData, 'contact_form');
}

/**
 * Format order details into a Polish message with bullet points
 * @param {Object} orderData - Complete order data
 * @returns {string} - Formatted message for bakery
 */
function formatOrderMessage(orderData) {
    const { customer, cake, size, taste, decorations = [], delivery, total, orderType, cakeImageUrl, layers, cakeText, occasion, color, additionalColor, specialTheme, flavor, deliveryAddress, deliveryDate, notes } = orderData;

    let message = `🧁 NOWE ZAMÓWIENIE TORTU\n\n`;
    message += `📅 Data zamówienia: ${new Date().toLocaleString('pl-PL')}\n`;
    message += `🏷️ ${orderType === 'ready_cake' ? 'Tort gotowy' : orderType === 'generated_cake' ? 'Tort wygenerowany AI' : 'Tort na zamówienie'}\n\n`;

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
        if (deliveryAddress) {
            message += `  - Adres: ${deliveryAddress.street || ''}\n`;
            message += `  - Kod pocztowy: ${deliveryAddress.postalCode || ''}\n`;
            message += `  - Miasto: ${deliveryAddress.city || ''}\n`;
        }
    }
    
    if (deliveryDate) {
        message += `• Data dostawy: ${deliveryDate}\n`;
    }
    
    if (notes) {
        message += `• Uwagi: ${notes}\n`;
    }

    // Cake Details
    message += `\n🎂 SZCZEGÓŁY TORTU:\n`;
    if (cake?.name) {
        message += `• Tort: ${cake.name}\n`;
    }
    if (cakeImageUrl) {
        // Handle base64 images vs regular image paths
        if (cakeImageUrl.startsWith('data:image/')) {
            message += `• Zdjęcie tortu: [OBRAZ AI - DOŁĄCZONY DO EMAILA]\n`;
        } else {
            // Regular image path handling
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const fullImageUrl = baseUrl ? `${baseUrl}/${cakeImageUrl}` : cakeImageUrl;
            message += `• Zdjęcie tortu: ${fullImageUrl}\n`;
            message += `  (Ścieżka: ${cakeImageUrl})\n`;
        }
    }
    if (size) {
        const sizeNames = { small: 'Mały (do 8 osób)', medium: 'Średni (do 12 osób)', large: 'Duży (do 16 osób)' };
        message += `• Rozmiar: ${sizeNames[size] || size}\n`;
    }
    if (layers) {
        message += `• Liczba warstw: ${layers}\n`;
    }
    if (flavor) {
        const flavorNames = { vanilla: 'Waniliowy', chocolate: 'Czekoladowy', strawberry: 'Truskawkowy', lemon: 'Cytrynowy', carrot: 'Marchewkowy' };
        const displayFlavor = flavorNames[flavor] || flavor;
        message += `• Smak: ${displayFlavor}\n`;
    }
    if (taste) {
        message += `• Smak: ${taste}\n`;
    }
    if (color) {
        const colorNames = { white: 'Biały', pink: 'Różowy', blue: 'Niebieski', green: 'Zielony', orange: 'Pomarańczowy', brown: 'Brązowy', red: 'Czerwony', purple: 'Fioletowy', yellow: 'Żółty', black: 'Czarny' };
        const displayColor = colorNames[color] || color;
        message += `• Kolor główny: ${displayColor}\n`;
    }
    if (additionalColor) {
        message += `• Kolor dodatkowy: ${additionalColor}\n`;
    }
    if (occasion) {
        const occasionNames = { birthday: 'Urodzinowy', wedding: 'Ślubny', anniversary: 'Rocznicowy', graduation: 'Na ukończenie szkoły', celebration: 'Świąteczny' };
        const displayOccasion = occasionNames[occasion] || occasion;
        message += `• Okazja: ${displayOccasion}\n`;
    }
    if (cakeText) {
        message += `• Napis na torcie: "${cakeText}"\n`;
    }
    if (specialTheme) {
        message += `• Specjalny motyw: ${specialTheme}\n`;
    }

    // Decorations
    if (decorations && typeof decorations === 'object' && Object.keys(decorations).length > 0) {
        // Handle cake visualizer decorations object format
        const selectedDecorations = [];
        const decorationNames = { candles: 'Świeczki', flowers: 'Kwiaty cukrowe', berries: 'Owoce', sprinkles: 'Posypka' };
        
        Object.entries(decorations).forEach(([key, value]) => {
            if (value === true) {
                selectedDecorations.push(decorationNames[key] || key);
            }
        });
        
        if (selectedDecorations.length > 0) {
            message += `\n✨ DEKORACJE:\n`;
            selectedDecorations.forEach(decoration => {
                message += `• ${decoration}\n`;
            });
        }
    } else if (decorations && Array.isArray(decorations) && decorations.length > 0) {
        // Handle traditional decorations array format
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

    // AI Prompt for generated cakes
    if (orderData.generatedPrompt) {
        message += `\n🤖 PROMPT AI:\n`;
        message += `${orderData.generatedPrompt}\n`;
    }

    // Special notes
    if (customer?.notes || orderData.notes || notes) {
        message += `\n📝 UWAGI SPECJALNE:\n`;
        message += `${customer?.notes || orderData.notes || notes}\n`;
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

    // Extract base64 image URL for HTML message only
    const fullImageUrl = orderData.cakeImageUrl;
    const hasBase64Image = fullImageUrl && fullImageUrl.startsWith('data:image/');
    
    // Create clean order data for webhook (replace base64 with placeholder)
    const cleanOrderData = {
        ...orderData,
        cakeImageUrl: hasBase64Image ? '[AI_GENERATED_IMAGE]' : orderData.cakeImageUrl
    };

    // Create formatted messages - HTML gets full image, plain text gets placeholder
    const plainTextMessage = formatOrderMessage(cleanOrderData);
    const htmlMessage = formatOrderMessageHTML({
        ...cleanOrderData,
        cakeImageUrl: fullImageUrl // HTML message gets the full base64 image
    });

    // Add formatted messages to webhook data (using clean data)
    const webhookData = {
        ...cleanOrderData,
        plainTextMessage: plainTextMessage,
        htmlMessage: htmlMessage
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
window.sendCakeDesignToWebhook = async function sendCakeDesignToWebhook(designData, customerData = {}) {
    const data = {
        designData: designData,
        customerData: customerData,
        formType: 'cake_design',
        designDate: new Date().toISOString()
    };

    // Create formatted messages for design processing
    const plainTextMessage = formatCakeDesignMessage(designData, customerData);
    const htmlMessage = formatOrderMessageHTML({ 
        ...data, 
        orderType: 'cake_design', 
        generatedPrompt: designData.aiPrompt,
        cake: { name: 'Projekt tortu na zamówienie' }
    });

    // Add formatted messages to webhook data
    const webhookData = {
        ...data,
        plainTextMessage: plainTextMessage,
        htmlMessage: htmlMessage
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
