#!/bin/bash

echo "🎂 Starting CakeBooking website image generation..."
echo "This will generate all necessary images for the website."
echo ""

# Activate virtual environment
source venv/bin/activate

echo "📸 Generating images..."
echo ""

# 1. Hero Section - Main wedding cake showcase (landscape for hero section)
echo "1/6 Generating hero wedding cake..."
python generate_images.py -p "Professional studio photography of an elegant three-tier white wedding cake with cascading white roses, pearl details, gold ribbon accents, positioned on a crystal glass cake stand, soft studio lighting, clean white background, luxury bakery presentation, high-end commercial photography" -f "hero-wedding-cake" -s "1536x1024"

# 2. Step 1 - Mobile app search interface (landscape for UI mockup)
echo "2/6 Generating search interface mockup..."
python generate_images.py -p "Clean modern mobile app interface showing cake search screen, map with bakery locations, filter options for cake types, search bar at top, colorful cake thumbnails in grid layout, professional UI design, modern smartphone mockup, light clean interface" -f "step1-search-interface" -s "1536x1024"

# 3. Step 2 - Order form interface (landscape for UI mockup)
echo "3/6 Generating order form interface..."
python generate_images.py -p "Professional mobile app order form interface, cake customization options with dropdown menus, calendar date picker, quantity selector, price calculator, clean modern UI design, smartphone mockup, elegant form layout with white background" -f "step2-order-form" -s "1536x1024"

# 4. Step 3 - Happy delivery scene (landscape for lifestyle photo)
echo "4/6 Generating delivery scene..."
python generate_images.py -p "Happy female customer receiving beautiful decorated cake at her front door from smiling male delivery person in uniform, residential setting, warm lighting, both people smiling, professional delivery box, welcoming home entrance, lifestyle photography" -f "step3-happy-delivery" -s "1536x1024"

# 5. Customer app interface (portrait for mobile app)
echo "5/6 Generating customer app interface..."
python generate_images.py -p "Mobile app interface showing cake design customization screen, color palette selector, decoration options, cake layers selector, preview of designed cake, modern clean UI, professional app design, smartphone mockup with elegant interface" -f "customer-app-interface" -s "1024x1536"

# 6. Baker dashboard interface (portrait for mobile/tablet app)
echo "6/6 Generating baker dashboard interface..."
python generate_images.py -p "Professional bakery management dashboard on tablet screen, order calendar, customer messages, analytics charts, order status tracking, clean modern business interface, professional baker workspace background, organized layout" -f "baker-dashboard-interface" -s "1024x1536"

echo ""
echo "✨ All images generated successfully!"
echo "🎯 Images saved to: images/ directory"
echo ""
echo "Generated files with optimized aspect ratios:"
echo "- hero-wedding-cake.png (1536x1024 - landscape)"
echo "- step1-search-interface.png (1536x1024 - landscape)" 
echo "- step2-order-form.png (1536x1024 - landscape)"
echo "- step3-happy-delivery.png (1536x1024 - landscape)"
echo "- customer-app-interface.png (1024x1536 - portrait)"
echo "- baker-dashboard-interface.png (1024x1536 - portrait)"
echo ""
echo "🚀 Your CakeBooking website is now ready with beautiful images!" 