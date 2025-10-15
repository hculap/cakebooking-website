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
  vanilla: 'waniliowy',
  chocolate: 'czekoladowy',
  strawberry: 'truskawkowy',
  lemon: 'cytrynowy',
  carrot: 'marchewkowy'
};

// ===================================================================
// PROMPT GENERATION
// ===================================================================

function generatePrompt() {
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
  
  // Flavor
  prompt += `smak ${flavorNames[config.flavor]}, `;
  
  // Decorations
  const decorations = [];
  if (config.decorations.candles) decorations.push('świeczki');
  if (config.decorations.flowers) decorations.push('kwiaty');
  if (config.decorations.berries) decorations.push('jagody');
  if (config.decorations.sprinkles) decorations.push('posypka');
  
  if (decorations.length > 0) {
    prompt += `ozdobiony ${decorations.join(', ')}, `;
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
      config: config,
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
                <li style="margin: 8px 0; color: #4a5568;"><strong>Telefon:</strong> ${customer?.phone || ''}</li>
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
        const flavorNames = { vanilla: 'Waniliowy', chocolate: 'Czekoladowy', strawberry: 'Truskawkowy', lemon: 'Cytrynowy', carrot: 'Marchewkowy' };
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

        if (pricing.selectedSize === 'artistic') {
            html += `<p style="margin: 6px 0; font-weight: 600; color: #0F2238;">⭐ Tort artystyczny: ${pricing.displayPrice || INDIVIDUAL_PRICING_TEXT}</p>`;
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
        const flavorNames = { vanilla: 'Waniliowy', chocolate: 'Czekoladowy', strawberry: 'Truskawkowy', lemon: 'Cytrynowy', carrot: 'Marchewkowy' };
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
