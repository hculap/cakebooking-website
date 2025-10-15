// ===================================================================
// COMPLETE CAKE VISUALIZER - ALL FUNCTIONS IN ONE FILE
// ===================================================================
// This file contains everything needed for the cake visualizer to work
// No external dependencies except cookies.js
// ===================================================================

// Configuration
const WEBHOOK_URL = 'https://hook.eu1.make.com/qcelwbyfxwo2n31203lpt9fj0p4z3dil';
let isGenerating = false;

// ===================================================================
// MAPPINGS AND TRANSLATIONS
// ===================================================================

// Color names mapping
const colorNames = {
  white: 'biały',
  pink: 'różowy', 
  blue: 'niebieski',
  green: 'zielony',
  orange: 'pomarańczowy',
  brown: 'brązowy',
  red: 'czerwony',
  purple: 'fioletowy',
  yellow: 'żółty',
  black: 'czarny'
};

// Size names mapping
const sizeNames = {
  small: 'mały',
  medium: 'średni',
  large: 'duży',
  artistic: 'artystyczny'
};
const INDIVIDUAL_PRICING_TEXT = 'Wycena indywidualna po zgłoszeniu';
const priceFormatter = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 });

// Occasion names mapping
const occasionNames = {
  birthday: 'urodzinowy',
  wedding: 'ślubny',
  anniversary: 'rocznicowy',
  graduation: 'na ukończenie szkoły',
  celebration: 'świąteczny'
};

// Flavor names mapping
const flavorNames = {
  'truskawkowy-raj': 'Truskawkowy Raj',
  'czekoladowa-pokusa': 'Czekoladowa Pokusa',
  'malinowa-rozkosz': 'Malinowa Rozkosz',
  'tropikalny-szal': 'Tropikalny Szał',
  'waniliowy-sen': 'Waniliowy Sen',
  'orzechowa-rozpusta': 'Orzechowa Rozpusta',
  'cytrynowa-chmurka': 'Cytrynowa Orzeźwiająca Chmurka',
  'kawowe-love': 'Kawowe Love',
  'pistacjowy-oblok': 'Pistacjowy Obłok',
  'kraina-raffaello': 'Kraina Raffaello'
};

// Flavor descriptions for AI prompts
const flavorDescriptions = {
  'truskawkowy-raj': 'delicate sponge cake with whipped cream and strawberry mousse',
  'czekoladowa-pokusa': 'moist chocolate sponge with dark and milk chocolate cream and blackcurrant accents',
  'malinowa-rozkosz': 'vanilla sponge with raspberry mousse and white chocolate cream',
  'tropikalny-szal': 'coconut sponge with mango passionfruit cream and pineapple accents',
  'waniliowy-sen': 'classic vanilla sponge with light vanilla whipped cream and mango layers',
  'orzechowa-rozpusta': 'chocolate hazelnut sponge with hazelnut cream and Nutella swirls',
  'cytrynowa-chmurka': 'lemon sponge with lemon curd and airy mascarpone cream',
  'kawowe-love': 'coffee sponge with tiramisu cream and cocoa dusting',
  'pistacjowy-oblok': 'vanilla sponge with raspberry mousse and pistachio cream',
  'kraina-raffaello': 'coconut sponge with creamy coconut filling and Raffaello-style pralines'
};

const flavorPerPortionAdjustments = {
  'truskawkowy-raj': 0,
  'czekoladowa-pokusa': 2,
  'malinowa-rozkosz': 1.5,
  'tropikalny-szal': 1.5,
  'waniliowy-sen': 1,
  'orzechowa-rozpusta': 2.5,
  'cytrynowa-chmurka': 1.5,
  'kawowe-love': 1.5,
  'pistacjowy-oblok': 3.5,
  'kraina-raffaello': 2.5
};

if (!window.flavorPerPortionAdjustments) {
  window.flavorPerPortionAdjustments = flavorPerPortionAdjustments;
}

const sizePortions = {
  small: 8,
  medium: 12,
  large: 20,
  artistic: null
};

if (!window.sizePortions) {
  window.sizePortions = sizePortions;
}

// Add-on definitions
const addonDefinitions = {
  'figurki-slonik': { label: 'Figurka: słonik', price: 60, type: 'boolean', prompt: 'elephant figurine cake topper', unitLabel: null },
  'figurki-mis': { label: 'Figurka: miś', price: 60, type: 'boolean', prompt: 'bear figurine cake topper', unitLabel: null },
  'figurki-aniol': { label: 'Figurka: aniołek', price: 70, type: 'boolean', prompt: 'angel figurine cake topper', unitLabel: null },
  'figurki-kokarda': { label: 'Figurka: kokarda', price: 40, type: 'boolean', prompt: 'bow-style cake topper', unitLabel: null },
  'figurki-piesek': { label: 'Figurka: piesek', price: 60, type: 'boolean', prompt: 'puppy figurine cake topper', unitLabel: null },
  'figurki-jednorozec': { label: 'Figurka: jednorożec', price: 70, type: 'boolean', prompt: 'unicorn figurine cake topper', unitLabel: null },
  'figurki-kotek': { label: 'Figurka: kotek', price: 60, type: 'boolean', prompt: 'kitten figurine cake topper', unitLabel: null },
  'wydruk-zdjecie': { label: 'Wydruk jadalny', price: 20, type: 'boolean', prompt: 'edible photo print panel', unitLabel: null },
  'kwiaty': { label: 'Kwiaty', price: 10, type: 'quantity', prompt: 'fresh floral accents', unitLabel: 'szt.' },
  'makaroniki': { label: 'Makaroniki', price: 6, type: 'quantity', prompt: 'macarons', unitLabel: 'szt.' },
  'napis': { label: 'Napis na torcie', price: 15, type: 'boolean', prompt: 'custom inscription on top', unitLabel: null },
  'kwiaty-cukrowe': { label: 'Kwiaty cukrowe', price: 5, type: 'quantity', prompt: 'sugar flowers', unitLabel: 'szt.' },
  'swieczki': { label: 'Świeczki', price: 3, type: 'quantity', prompt: 'classic birthday candles', unitLabel: 'szt.' },
  'swieczka-cyfra': { label: 'Świeczka cyfra', price: 10, type: 'quantity', prompt: 'number candle', unitLabel: 'szt.' },
  'owoce': { label: 'Owoce', price: 10, type: 'quantity', prompt: 'fresh fruit toppings (100g portions)', unitLabel: 'porcje 100 g' },
  'posypka': { label: 'Posypka', price: 5, type: 'quantity', prompt: 'sprinkle accents (20g portions)', unitLabel: 'porcje 20 g' }
};

if (!window.addonDefinitions) {
  window.addonDefinitions = addonDefinitions;
}

function getCurrentConfig() {
  const cfg = window.config || window.generateImageConfig || window.cakeVisualizerConfig;
  if (!cfg) {
    throw new ReferenceError('Visualizer configuration is not available');
  }
  return cfg;
}

function formatPerPortionValue(value) {
  if (!Number.isFinite(value)) return '';
  const hasFraction = Math.abs(value % 1) > 0;
  return value.toLocaleString('pl-PL', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0
  });
}

function normalizeDecorationsList(decorations) {
  const items = [];
  
  if (!decorations) {
    return items;
  }

  // Legacy array format support
  if (Array.isArray(decorations)) {
    decorations.forEach((entry) => {
      if (typeof entry === 'string') {
        items.push({ key: null, label: entry, quantity: null, unitLabel: null, unitPrice: null, totalPrice: null });
      } else if (entry && typeof entry === 'object') {
        const label = entry.name || entry.label || 'Dodatek';
        const quantity = typeof entry.quantity === 'number' ? entry.quantity : null;
        const unitLabel = entry.unit || entry.unitLabel || null;
        const price = typeof entry.price === 'number' ? entry.price : null;
        items.push({ key: null, label, quantity, unitLabel, unitPrice: price, totalPrice: price });
      }
    });
    return items;
  }

  if (typeof decorations !== 'object') {
    return items;
  }

  Object.entries(decorations).forEach(([key, rawValue]) => {
    const definition = addonDefinitions[key];
    if (!definition) {
      if (rawValue === true || rawValue === 'true') {
        items.push({ key, label: key, quantity: null, unitLabel: null, unitPrice: null, totalPrice: null });
      }
      return;
    }

    if (definition.type === 'quantity') {
      const numericValue = parseInt(rawValue, 10);
      if (Number.isFinite(numericValue) && numericValue > 0) {
        items.push({
          key,
          label: definition.label,
          quantity: numericValue,
          unitLabel: definition.unitLabel || null,
          unitPrice: definition.price,
          totalPrice: definition.price * numericValue
        });
      }
    } else {
      const isSelected = rawValue === true || rawValue === 'true';
      if (isSelected) {
        items.push({
          key,
          label: definition.label,
          quantity: null,
          unitLabel: null,
          unitPrice: definition.price,
          totalPrice: definition.price
        });
      }
    }
  });

  return items;
}

// ===================================================================
// PROMPT GENERATION
// ===================================================================

function generatePrompt() {
  const config = getCurrentConfig();
  const isArtistic = config.size === 'artistic';
  let prompt = `Profesjonalny tort ${occasionNames[config.occasion]}, `;
  
  // Size and layers
  const sizeLabel = sizeNames[config.size] || 'spersonalizowany';
  prompt += `${sizeLabel} tort ${config.layers}-warstwowy, `;
  
  // Color
  prompt += `${colorNames[config.color]} kolor, `;
  
  // Additional color
  if (config.additionalColor) {
    prompt += `z akcentami ${config.additionalColor}, `;
  }
  
  // Flavor - use description instead of name
  const flavorDescription = flavorDescriptions[config.flavor] || 'classic cake flavor';
  prompt += `${flavorDescription}, `;
  
  // Decorations
  const selectedAddons = normalizeDecorationsList(config.decorations);
  if (selectedAddons.length > 0) {
    const descriptors = selectedAddons.map(item => {
      const definition = item.key ? addonDefinitions[item.key] : null;
      const baseDescriptor = definition?.prompt || item.label.toLowerCase();
      if (definition?.type === 'quantity' && item.quantity) {
        return `${item.quantity}x ${baseDescriptor}`;
      }
      return baseDescriptor;
    });
    prompt += `ozdobiony ${descriptors.join(', ')}, `;
  }
  
  // Special theme
  if (isArtistic && config.specialTheme) {
    prompt += `motyw ${config.specialTheme}, `;
  }
  
  // Cake text
  if (isArtistic && config.cakeText) {
    prompt += `z napisem "${config.cakeText}", `;
  }
  
  // Final touches
  prompt += `profesjonalna fotografia, studio lighting, wysokiej jakości, realistyczny, apetyczny`;
  
  return prompt;
}

// ===================================================================
// WEBHOOK FUNCTIONS
// ===================================================================

// Main webhook function with multipart support
async function sendToWebhook(data, eventType) {
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

// JSON webhook for data without images
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

// Multipart webhook for data with images
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

// Hybrid webhook: JSON data + image file in single multipart request
async function sendHybridWebhook(jsonData, imageBlob, imageMetadata, eventType) {
    const formData = new FormData();
    
    // Add basic webhook metadata
    formData.append('eventType', eventType);
    formData.append('timestamp', new Date().toISOString());
    formData.append('userAgent', navigator.userAgent);
    formData.append('url', window.location.href);
    
    // Add JSON data as individual form fields
    for (const [key, value] of Object.entries(jsonData)) {
        if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    }
    console.log('📦 Added JSON data as individual form fields');
    
    // Add image file if present
    if (imageBlob) {
        const filename = imageMetadata?.filename || 'cake-design.png';
        formData.append('imageFile', imageBlob, filename);
        console.log(`📎 Added image file: ${filename} (${imageBlob.size} bytes)`);
    }

    console.log('🚀 Sending hybrid JSON + image multipart request...');

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData // No Content-Type header - let browser set multipart boundary
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Hybrid webhook failed: ${response.status} ${response.statusText}`);
        console.error(`❌ Response: ${errorText}`);
        return false;
    }

    console.log(`✅ Hybrid webhook success: ${response.status}`);
    return response.ok;
}

// ===================================================================
// IMAGE GENERATION
// ===================================================================

async function generateImage() {
  if (isGenerating) return;
  
  isGenerating = true;
  const generateBtn = document.getElementById('generate-btn');
  const placeholder = document.getElementById('placeholder');
  const loading = document.getElementById('loading');
  const generatedImage = document.getElementById('generated-image');
  
  if (!generateBtn || !placeholder || !loading || !generatedImage) {
    console.error('Required elements not found');
    isGenerating = false;
    return;
  }
  
  // Show loading state
  placeholder.classList.add('hidden');
  loading.classList.remove('hidden');
  generatedImage.classList.add('hidden');
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin h-5 w-5 mr-3"></i>Generuję...';
  
  try {
    const prompt = generatePrompt();
    console.log('🎨 Generated prompt:', prompt);

    // Send image generation request to Make.com webhook
    const imageGenerationData = {
      prompt: prompt,
      config: getCurrentConfig(),
      size: '1024x1024',
      formType: 'cake_image_generation'
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'cake_image_generation',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        data: imageGenerationData
      })
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook request failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('🎨 Make.com response:', result);

    // Handle base64 image data from Make.com webhook response
    if (result.image && result.image.startsWith('data:image/')) {
      // If Make.com returns data URL with base64
      result.imageUrl = result.image;
      result.status = "success";
      console.log('✅ Using data URL format from Make.com');
    } else if (result.image) {
      // If Make.com returns just base64, convert to data URL
      result.imageUrl = `data:image/png;base64,${result.image}`;
      result.status = "success";
      console.log('✅ Converting base64 to data URL');
    } else if (result.status !== "success") {
      throw new Error(result.error || 'No image data received from Make.com');
    }

    if (result.status === "success" && result.imageUrl) {
      // Success! Display the image directly
      generatedImage.src = result.imageUrl;
      generatedImage.onload = () => {
        loading.classList.add('hidden');
        generatedImage.classList.remove('hidden');
        console.log('✅ Image displayed successfully');
        const orderButtons = document.querySelectorAll('[data-order-button]');
        orderButtons.forEach(btn => btn.classList.remove('hidden'));
        if (typeof window.visualizerUpdateOrderSummary === 'function') {
          window.visualizerUpdateOrderSummary();
        }
      };
      generatedImage.onerror = () => {
        throw new Error('Nie udało się załadować obrazu');
      };
    } else {
      throw new Error('Nieoczekiwana odpowiedź serwera');
    }
    
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Show error state
    loading.classList.add('hidden');
    placeholder.classList.remove('hidden');
    placeholder.innerHTML = `
      <div class="w-32 h-32 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <i class="fa-solid fa-exclamation-triangle text-6xl text-red-400"></i>
      </div>
      <h3 class="text-xl font-semibold text-red-600 mb-2">Błąd generowania</h3>
      <p class="text-red-500">Spróbuj ponownie za chwilę</p>
    `;
    
    // Reset placeholder after 3 seconds
    setTimeout(() => {
      placeholder.innerHTML = `
        <div class="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-cake-candles text-6xl text-gray-400"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Wizualizacja Twojego tortu</h3>
        <p class="text-gray-500">Wybierz opcje i kliknij "Generuj obraz" aby zobaczyć swój tort</p>
      `;
    }, 3000);
  } finally {
    // Reset button state
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fa-solid fa-magic h-5 w-5 mr-3"></i>Generuj obraz tortu';
    isGenerating = false;
  }
}

// ===================================================================
// EMAIL MESSAGE FORMATTING
// ===================================================================

// Format order details into HTML for email display
function formatOrderMessageHTML(orderData) {
    const { customer, cake, size, layers, cakeText, occasion, color, additionalColor, specialTheme, flavor, decorations = {}, delivery, deliveryMethod, deliveryAddress, deliveryDate, deliveryTime, notes, total, orderType, hasImageAttachment, generatedPrompt, pricing } = orderData;
    
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
                <li style="margin: 8px 0; color: #4a5568;"><strong>Telefon:</strong> ${customer?.phone || ''}</li>`;

    if (customer?.completionDate) {
        html += `<li style="margin: 8px 0; color: #4a5568;"><strong>Termin realizacji:</strong> ${customer.completionDate}</li>`;
    }
    if (customer?.completionTime) {
        html += `<li style="margin: 8px 0; color: #4a5568;"><strong>Preferowana godzina odbioru:</strong> ${customer.completionTime}</li>`;
    }
    if (customer?.orderNotes) {
        html += `<li style="margin: 8px 0; color: #4a5568;"><strong>Uwagi do zamówienia:</strong> ${customer.orderNotes}</li>`;
    }

    html += `
            </ul>
        </div>`;
    
    // Delivery Information
    html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">🚚 SPOSÓB ODBIORU</h3>`;
    
    // Use deliveryMethod if available, fallback to old delivery field
    const deliveryDetails = delivery && typeof delivery === 'object' ? delivery : {};
    const method = deliveryMethod || (typeof delivery === 'string' ? delivery : undefined);
    const deliveryDateValue = deliveryDate || deliveryDetails.deliveryDate;
    const deliveryTimeValue = deliveryTime || deliveryDetails.deliveryTime;
    const deliveryNotes = notes || deliveryDetails.notes;
    
    if (method === 'pickup') {
        html += `<p style="margin: 8px 0; color: #4a5568;">• Odbiór własny</p>`;
    } else if (method === 'delivery') {
        html += `<p style="margin: 8px 0; color: #4a5568;">• Dostawa pod adres</p>`;
        // Check both delivery object and direct delivery fields
        const address = deliveryAddress || delivery;
        if (address && (address.street || address.postalCode || address.city)) {
            html += `<ul style="list-style: none; padding: 0 0 0 20px; margin: 8px 0; color: #4a5568;">`;
            if (address.street) html += `<li style="margin: 4px 0;">Adres: ${address.street}</li>`;
            if (address.postalCode) html += `<li style="margin: 4px 0;">Kod pocztowy: ${address.postalCode}</li>`;
            if (address.city) html += `<li style="margin: 4px 0;">Miasto: ${address.city}</li>`;
            html += `</ul>`;
        }
    }
    
    if (deliveryDateValue) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Data dostawy:</strong> ${deliveryDateValue}</p>`;
    }

    if (deliveryTimeValue) {
        html += `<p style="margin: 4px 0 12px 0; color: #4a5568;"><strong>Godzina:</strong> ${deliveryTimeValue}</p>`;
    }

    if (deliveryNotes) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Uwagi:</strong> ${deliveryNotes}</p>`;
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
        const sizeNames = { small: 'Mały', medium: 'Średni', large: 'Duży', artistic: 'Tort artystyczny' };
        const displaySize = sizeNames[size] || size;
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Rozmiar:</strong> ${displaySize}</p>`;
    }
    if (layers) {
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Liczba warstw:</strong> ${layers}</p>`;
    }
    if (flavor) {
        const displayFlavor = flavorNames[flavor] || flavor;
        html += `<p style="margin: 8px 0; color: #4a5568;"><strong>Smak:</strong> ${displayFlavor}</p>`;
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
    const normalizedDecorations = normalizeDecorationsList(decorations);
    if (normalizedDecorations.length > 0) {
        html += `<div style="margin: 12px 0;"><strong style="color: #4a5568;">Dodatki:</strong><ul style="margin: 8px 0; padding-left: 20px; color: #4a5568;">`;
        normalizedDecorations.forEach(item => {
            const detailParts = [];
            if (item.quantity !== null && item.quantity !== undefined) {
                const unitLabel = item.unitLabel ? ` ${item.unitLabel}` : '';
                detailParts.push(`${item.quantity}${unitLabel}`);
            }
            if (typeof item.totalPrice === 'number') {
                detailParts.push(`${priceFormatter.format(item.totalPrice)} zł`);
            }
            const detailText = detailParts.length > 0 ? ` (${detailParts.join(', ')})` : '';
            html += `<li style="margin: 4px 0;">${item.label}${detailText}</li>`;
        });
        html += `</ul></div>`;
    }
    
    html += `</div>`;
    
    if (pricing) {
        const sizeLabels = { small: 'Mały', medium: 'Średni', large: 'Duży' };
        html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">💰 Ceny orientacyjne</h3>
            <p style="margin: 8px 0; color: #4a5568;"><strong>Wybrany wariant:</strong> ${pricing.displayPrice || INDIVIDUAL_PRICING_TEXT}</p>`;
        
        const variantEntries = Object.entries(pricing.variants || {});
        variantEntries.forEach(([variantKey, variantValue]) => {
            const formattedValue = Number.isFinite(variantValue) ? `${priceFormatter.format(variantValue)} zł` : (variantValue ?? '—');
            const label = sizeLabels[variantKey] || variantKey;
            const isSelected = pricing.selectedSize === variantKey;
            const lineStyle = isSelected ? 'margin: 6px 0; font-weight: 600; color: #0F2238;' : 'margin: 6px 0; color: #4a5568;';
            const prefix = isSelected ? '⭐ ' : '';
            html += `<p style="${lineStyle}">${prefix}${label}: ${formattedValue}</p>`;
        });

        const flavorPerPortionValue = pricing.flavorPerPortion;
        const flavorAdjustmentValue = pricing.flavorAdjustment;
        const portionCountValue = pricing.portions;
        if (Number.isFinite(flavorAdjustmentValue) && flavorAdjustmentValue > 0) {
            const detailParts = [];
            if (Number.isFinite(flavorPerPortionValue) && flavorPerPortionValue > 0) {
                detailParts.push(`${formatPerPortionValue(flavorPerPortionValue)} zł / porcja`);
            }
            if (Number.isFinite(portionCountValue) && portionCountValue > 0) {
                detailParts.push(`${portionCountValue} porcji`);
            }
            const detailText = detailParts.length > 0 ? ` (${detailParts.join(', ')})` : '';
            html += `<p style="margin: 6px 0; color: #4a5568;"><strong>Dopłata za smak:</strong> ${priceFormatter.format(flavorAdjustmentValue)} zł${detailText}</p>`;
        } else if (Number.isFinite(flavorPerPortionValue) && flavorPerPortionValue > 0) {
            html += `<p style="margin: 6px 0; color: #4a5568;"><strong>Dopłata za smak:</strong> ${formatPerPortionValue(flavorPerPortionValue)} zł / porcja</p>`;
        }

        if (pricing.selectedSize === 'artistic') {
            html += `<p style="margin: 6px 0; font-weight: 600; color: #0F2238;">⭐ Tort artystyczny: ${pricing.displayPrice || INDIVIDUAL_PRICING_TEXT}</p>`;
        }

        if (Array.isArray(pricing.addons) && pricing.addons.length > 0) {
            html += `<div style="margin-top: 12px;">`;
            html += `<p style="margin: 6px 0; color: #4a5568;"><strong>Dodatki:</strong></p>`;
            html += `<ul style="margin: 4px 0 0 0; padding-left: 20px; color: #4a5568;">`;
            pricing.addons.forEach(addon => {
                const detailParts = [];
                if (addon.type === 'quantity' && Number.isFinite(addon.value) && addon.value > 0) {
                    const unitLabel = addon.unitLabel ? ` ${addon.unitLabel}` : '';
                    detailParts.push(`${addon.value}${unitLabel}`);
                }
                if (Number.isFinite(addon.totalPrice)) {
                    detailParts.push(`${priceFormatter.format(addon.totalPrice)} zł`);
                }
                const detailText = detailParts.length > 0 ? ` (${detailParts.join(', ')})` : '';
                html += `<li style="margin: 4px 0;">${addon.label}${detailText}</li>`;
            });
            html += `</ul>`;
            if (Number.isFinite(pricing.addonsTotal) && pricing.addonsTotal > 0) {
                html += `<p style="margin: 6px 0; font-weight: 600; color: #0F2238;">Łącznie dodatki: ${priceFormatter.format(pricing.addonsTotal)} zł</p>`;
            }
            html += `</div>`;
        } else if (Number.isFinite(pricing.addonsTotal) && pricing.addonsTotal > 0) {
            html += `<p style="margin: 6px 0; font-weight: 600; color: #0F2238;">Łącznie dodatki: ${priceFormatter.format(pricing.addonsTotal)} zł</p>`;
        }

        if (pricing.note) {
            html += `<p style="margin: 10px 0 0 0; color: #6b7280; font-size: 13px;"><em>${pricing.note}</em></p>`;
        }

        html += `</div>`;
    }
    
    // Cake Image - Show attachment message instead of embedded image
    if (hasImageAttachment) {
        html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #0F2238; margin: 0 0 15px 0; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">🖼️ ZDJĘCIE TORTU</h3>
            <div style="background: linear-gradient(135deg, #F472B6, #D7B88F); color: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <p style="margin: 0; font-size: 16px; font-weight: bold;">📎 Obraz tortu AI załączony do zamówienia</p>
                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Plik obrazu został przesłany wraz z danymi zamówienia</p>
            </div>
        </div>`;
    }
    
    // Total
    if (total && total > 0) {
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

// Format order details into plain text for email
function formatOrderMessage(orderData) {
    const { customer, cake, size, layers, cakeText, occasion, color, additionalColor, specialTheme, flavor, decorations = {}, delivery, deliveryMethod, deliveryAddress, deliveryDate, deliveryTime, notes, total, orderType, generatedPrompt, pricing } = orderData;

    let message = `🧁 NOWE ZAMÓWIENIE TORTU\n\n`;
    message += `📅 ${new Date().toLocaleString('pl-PL')}\n`;
    message += `🏷️ ${orderType === 'ready_cake' ? 'Tort gotowy' : orderType === 'generated_cake' ? 'Tort wygenerowany AI' : 'Tort na zamówienie'}\n\n`;

    // Customer Information
    message += `👤 DANE KLIENTA:\n`;
    message += `Imię i nazwisko: ${customer?.firstName || ''} ${customer?.lastName || ''}\n`;
    message += `Email: ${customer?.email || ''}\n`;
    message += `Telefon: ${customer?.phone || ''}\n`;

    if (customer?.completionDate) {
        message += `Termin realizacji: ${customer.completionDate}\n`;
    }
    if (customer?.completionTime) {
        message += `Preferowana godzina odbioru: ${customer.completionTime}\n`;
    }
    if (customer?.orderNotes) {
        message += `Uwagi do zamówienia: ${customer.orderNotes}\n`;
    }

    // Delivery Information
    message += `\n🚚 SPOSÓB ODBIORU:\n`;
    
    // Use deliveryMethod if available, fallback to old delivery field
    const deliveryDetails = delivery && typeof delivery === 'object' ? delivery : {};
    const method = deliveryMethod || (typeof delivery === 'string' ? delivery : undefined);
    const deliveryDateValue = deliveryDate || deliveryDetails.deliveryDate;
    const deliveryTimeValue = deliveryTime || deliveryDetails.deliveryTime;
    const deliveryNotes = notes || deliveryDetails.notes;
    
    if (method === 'pickup') {
        message += `• Odbiór własny\n`;
    } else if (method === 'delivery') {
        message += `• Dostawa pod adres\n`;
        // Check both delivery object and direct delivery fields
        const address = deliveryAddress || delivery;
        if (address && (address.street || address.postalCode || address.city)) {
            if (address.street) message += `  - Adres: ${address.street}\n`;
            if (address.postalCode) message += `  - Kod pocztowy: ${address.postalCode}\n`;
            if (address.city) message += `  - Miasto: ${address.city}\n`;
        }
    }
    
    if (deliveryDateValue) {
        message += `• Data dostawy: ${deliveryDateValue}\n`;
    }
    if (deliveryTimeValue) {
        message += `• Preferowana godzina: ${deliveryTimeValue}\n`;
    }

    if (deliveryNotes) {
        message += `• Uwagi: ${deliveryNotes}\n`;
    }

    // Cake Details
    message += `\n🎂 SZCZEGÓŁY TORTU:\n`;
    if (cake?.name) {
        message += `Tort: ${cake.name}\n`;
    }
    
    message += `[OBRAZ AI - ZAŁĄCZONY DO EMAILA]\n`;
    
    if (size) {
        const sizeNames = { small: 'Mały (do 8 osób)', medium: 'Średni (do 12 osób)', large: 'Duży (do 16 osób)', artistic: 'Tort artystyczny (indywidualny projekt)' };
        message += `Rozmiar: ${sizeNames[size] || size}\n`;
    }
    if (layers) {
        message += `Liczba warstw: ${layers}\n`;
    }
    if (flavor) {
        const displayFlavor = flavorNames[flavor] || flavor;
        message += `Smak: ${displayFlavor}\n`;
    }
    if (color) {
        const colorNames = { white: 'Biały', pink: 'Różowy', blue: 'Niebieski', green: 'Zielony', orange: 'Pomarańczowy', brown: 'Brązowy', red: 'Czerwony', purple: 'Fioletowy', yellow: 'Żółty', black: 'Czarny' };
        const displayColor = colorNames[color] || color;
        message += `Kolor główny: ${displayColor}\n`;
    }
    if (additionalColor) {
        message += `Kolor dodatkowy: ${additionalColor}\n`;
    }
    if (occasion) {
        const occasionNames = { birthday: 'Urodzinowy', wedding: 'Ślubny', anniversary: 'Rocznicowy', graduation: 'Na ukończenie szkoły', celebration: 'Świąteczny' };
        const displayOccasion = occasionNames[occasion] || occasion;
        message += `Okazja: ${displayOccasion}\n`;
    }
    if (cakeText) {
        message += `Napis na torcie: "${cakeText}"\n`;
    }
    if (specialTheme) {
        message += `Specjalny motyw: ${specialTheme}\n`;
    }

    // Decorations
    const normalizedDecorations = normalizeDecorationsList(decorations);
    if (normalizedDecorations.length > 0) {
        message += `\n✨ DODATKI:\n`;
        normalizedDecorations.forEach(item => {
            const detailParts = [];
            if (item.quantity !== null && item.quantity !== undefined) {
                const unitLabel = item.unitLabel ? ` ${item.unitLabel}` : '';
                detailParts.push(`${item.quantity}${unitLabel}`);
            }
            if (typeof item.totalPrice === 'number') {
                detailParts.push(`${priceFormatter.format(item.totalPrice)} zł`);
            }
            const detailText = detailParts.length > 0 ? ` (${detailParts.join(', ')})` : '';
            message += `• ${item.label}${detailText}\n`;
        });
    }

    if (pricing) {
        message += `\n💰 CENY ORIENTACYJNE:\n`;
        if (pricing.displayPrice) {
            message += `Wybrany wariant: ${pricing.displayPrice}\n`;
        }
        const variantEntries = Object.entries(pricing.variants || {});
        variantEntries.forEach(([variantKey, variantValue]) => {
            const labelMap = { small: 'Mały', medium: 'Średni', large: 'Duży' };
            const formattedValue = Number.isFinite(variantValue) ? `${priceFormatter.format(variantValue)} zł` : (variantValue ?? '—');
            const prefix = pricing.selectedSize === variantKey ? '⭐ ' : '• ';
            message += `${prefix}${labelMap[variantKey] || variantKey}: ${formattedValue}\n`;
        });
        if (pricing.selectedSize === 'artistic') {
            message += `⭐ Tort artystyczny: ${pricing.displayPrice || INDIVIDUAL_PRICING_TEXT}\n`;
        }
        const flavorPerPortionValue = pricing.flavorPerPortion;
        const flavorAdjustmentValue = pricing.flavorAdjustment;
        const portionCountValue = pricing.portions;
        if (Number.isFinite(flavorAdjustmentValue) && flavorAdjustmentValue > 0) {
            const detailParts = [];
            if (Number.isFinite(flavorPerPortionValue) && flavorPerPortionValue > 0) {
                detailParts.push(`${formatPerPortionValue(flavorPerPortionValue)} zł / porcja`);
            }
            if (Number.isFinite(portionCountValue) && portionCountValue > 0) {
                detailParts.push(`${portionCountValue} porcji`);
            }
            const detailText = detailParts.length > 0 ? ` (${detailParts.join(', ')})` : '';
            message += `Dopłata za smak: ${priceFormatter.format(flavorAdjustmentValue)} zł${detailText}\n`;
        } else if (Number.isFinite(flavorPerPortionValue) && flavorPerPortionValue > 0) {
            message += `Dopłata za smak: ${formatPerPortionValue(flavorPerPortionValue)} zł / porcja\n`;
        }
        if (Array.isArray(pricing.addons) && pricing.addons.length > 0) {
            message += `\nDodatki:\n`;
            pricing.addons.forEach(addon => {
                const detailParts = [];
                if (addon.type === 'quantity' && Number.isFinite(addon.value) && addon.value > 0) {
                    const unitLabel = addon.unitLabel ? ` ${addon.unitLabel}` : '';
                    detailParts.push(`${addon.value}${unitLabel}`);
                }
                if (Number.isFinite(addon.totalPrice)) {
                    detailParts.push(`${priceFormatter.format(addon.totalPrice)} zł`);
                }
                const detailText = detailParts.length > 0 ? ` (${detailParts.join(', ')})` : '';
                message += `• ${addon.label}${detailText}\n`;
            });
        }
        if (Number.isFinite(pricing.addonsTotal) && pricing.addonsTotal > 0) {
            message += `Łącznie dodatki: ${priceFormatter.format(pricing.addonsTotal)} zł\n`;
        }
        if (pricing.note) {
            message += `${pricing.note}\n`;
        }
    }

    // AI Prompt for generated cakes
    if (generatedPrompt) {
        message += `\n🤖 PROMPT AI:\n`;
        message += `${generatedPrompt}\n`;
    }

    // Total
    if (total && total > 0) {
        message += `\n💰 ŁĄCZNA KWOTA: ${total} zł\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `⚡ Prosimy o pilne przygotowanie zamówienia!\n`;

    return message;
}

// ===================================================================
// ORDER SUBMISSION FUNCTIONS
// ===================================================================

// Send cake order with multipart image data
async function sendCakeOrderToWebhook(orderData, customerData) {
  // Extract base64 image data
  const imageBase64ForHtml = orderData.cake?.generatedImageBase64;
  
  // Convert base64 to blob for multipart form data
  let imageBlob = null;
  let imageMetadata = null;
  
  if (imageBase64ForHtml) {
    try {
      const timestamp = new Date().getTime();
      const filename = `cake-design-${timestamp}.png`;
      
      // Convert base64 to blob
      const base64Data = imageBase64ForHtml.replace(/^data:image\/[a-z]+;base64,/, '');
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      imageBlob = new Blob([bytes], { type: 'image/png' });
      
      imageMetadata = {
        filename: filename,
        contentType: 'image/png',
        size: imageBlob.size,
        hasImage: true
      };
      
      console.log(`📎 Image blob created: ${filename} (${imageBlob.size} bytes)`);
      console.log('📤 Will send as multipart form data to webhook');
    } catch (error) {
      console.error('❌ Error creating image blob:', error);
      imageMetadata = {
        filename: `cake-design-${new Date().getTime()}.png`,
        contentType: 'image/png',
        hasImage: false,
        error: 'Blob creation failed: ' + error.message
      };
    }
  }
  
  // Create clean order data without large base64 strings
  const cleanOrderData = {
    ...orderData,
    cake: {
      ...orderData.cake,
      generatedImageBase64: null // Remove base64 from order data
    }
  };
  
  // Restructure data to match standardized format
  const standardizedOrderData = {
    customer: customerData,
    cake: {
      name: 'Tort wygenerowany AI',
      config: orderData.cake?.config,
      generatedPrompt: orderData.cake?.generatedPrompt
    },
    size: orderData.size,
    layers: orderData.layers,
    cakeText: orderData.cakeText,
    occasion: orderData.occasion,
    color: orderData.color,
    additionalColor: orderData.additionalColor,
    specialTheme: orderData.specialTheme,
    flavor: orderData.flavor,
    decorations: orderData.decorations,
    deliveryMethod: orderData.deliveryMethod || (orderData.delivery?.street ? 'delivery' : 'pickup'),
    delivery: orderData.delivery?.street ? 'delivery' : 'pickup',
    deliveryAddress: orderData.delivery?.street ? {
      street: orderData.delivery.street,
      postalCode: orderData.delivery.postalCode,
      city: orderData.delivery.city
    } : null,
    deliveryDate: orderData.delivery?.deliveryDate || orderData.deliveryDate,
    deliveryTime: orderData.delivery?.deliveryTime || orderData.deliveryTime,
    notes: orderData.delivery?.notes || orderData.notes,
    total: orderData.total || 0,
    orderType: 'generated_cake',
    cakeImageUrl: null, // No image URL - sending as multipart
    hasImageAttachment: imageBlob ? true : false,
    generatedPrompt: orderData.cake?.generatedPrompt,
    pricing: orderData.pricing,
    formType: 'generated_cake_order',
    orderDate: new Date().toISOString()
  };

  // Generate formatted email messages
  const htmlMessage = formatOrderMessageHTML(standardizedOrderData);
  const plainTextMessage = formatOrderMessage(standardizedOrderData);

  // Prepare simplified order data - just the HTML message like contact form
  const webhookOrderData = {
    htmlMessage: htmlMessage,
    plainTextMessage: plainTextMessage
  };

  console.log('🚀 Sending hybrid request (HTML message + image)...');
  
  // Send HTML message and image in single multipart request
  const result = await sendHybridWebhook(webhookOrderData, imageBlob, imageMetadata, 'order_form');
  
  if (!result) {
    console.error('❌ Failed to send order data and image');
    return false;
  }

  console.log('✅ Order data and image sent successfully in single request');
  return true;
}

// ===================================================================
// GLOBAL FUNCTION EXPORTS
// ===================================================================

// Make functions available globally for the HTML page
window.generateImage = generateImage;
window.sendCakeOrderToWebhook = sendCakeOrderToWebhook;
window.sendToWebhook = sendToWebhook;

console.log('✅ Cake Visualizer Complete - All functions loaded');
