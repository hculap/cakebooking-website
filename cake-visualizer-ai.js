// Cake Visualizer AI Image Generator
let isGenerating = false;

// Configuration
const config = {
  size: 'small',
  layers: 2,
  cakeText: '',
  occasion: 'birthday',
  color: 'white',
  additionalColor: '',
  specialTheme: '',
  flavor: 'vanilla',
  decorations: {
    candles: true,
    flowers: false,
    berries: false,
    sprinkles: false
  }
};

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
  large: 'duży'
};

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
  caramel: 'karmelowy'
};

function init() {
  // Event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Size buttons
  document.querySelectorAll('[data-size]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-size]').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      config.size = button.dataset.size;
    });
  });

  // Layer input
  const cakeLayers = document.getElementById('cake-layers');
  if (cakeLayers) {
    cakeLayers.addEventListener('input', (e) => {
      config.layers = parseInt(e.target.value) || 2;
    });
  }

  // Cake text
  const cakeText = document.getElementById('cake-text');
  if (cakeText) {
    cakeText.addEventListener('input', (e) => {
      config.cakeText = e.target.value;
    });
  }

  // Occasion buttons
  document.querySelectorAll('[data-occasion]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-occasion]').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      config.occasion = button.dataset.occasion;
    });
  });

  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      config.color = swatch.dataset.color;
    });
  });

  // Additional color
  const additionalColor = document.getElementById('additional-color');
  if (additionalColor) {
    additionalColor.addEventListener('change', (e) => {
      config.additionalColor = e.target.value;
    });
  }

  // Special theme
  const specialTheme = document.getElementById('special-theme');
  if (specialTheme) {
    specialTheme.addEventListener('change', (e) => {
      config.specialTheme = e.target.value;
    });
  }

  // Flavor buttons
  document.querySelectorAll('[data-flavor]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-flavor]').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      config.flavor = button.dataset.flavor;
    });
  });

  // Decoration checkboxes
  document.querySelectorAll('[data-decoration]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      config.decorations[checkbox.dataset.decoration] = e.target.checked;
    });
  });

  // Generate button
  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateImage);
  }


}



function generatePrompt() {
  let prompt = `Profesjonalny tort ${occasionNames[config.occasion]}, `;
  
  // Size and layers
  prompt += `${sizeNames[config.size]} tort ${config.layers}-warstwowy, `;
  
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
  if (config.specialTheme) {
    prompt += `motyw ${config.specialTheme}, `;
  }
  
  // Cake text
  if (config.cakeText) {
    prompt += `z napisem "${config.cakeText}", `;
  }
  
  // Final touches
  prompt += `profesjonalna fotografia, studio lighting, wysokiej jakości, realistyczny, apetyczny`;
  
  return prompt;
}

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
    
    // Call the simple server endpoint
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        size: '1024x1024'
      })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    if (result.status === "success" && result.imageUrl) {
      // Success! Display the image directly
      generatedImage.src = result.imageUrl;
      generatedImage.onload = () => {
        loading.classList.add('hidden');
        generatedImage.classList.remove('hidden');
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





// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 