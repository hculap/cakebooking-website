#!/bin/bash

# CakeBooking Blog Images Generation Script
# This script generates all the images needed for the blog section

echo "🎨 Starting CakeBooking Blog Images Generation..."
echo "======================================================="

# Activate virtual environment
source venv/bin/activate

# Blog Hero Image
echo "1/7 🏆 Generating blog hero image..."
python generate_images.py \
  -p "Professional female baker in modern kitchen creating stunning decorated cakes, beautiful workspace with elegant lighting, inspiring baking artistry atmosphere, warm golden lighting, professional cake decorating tools, high-end patisserie environment" \
  -f "blog-hero-baking-inspiration" \
  -s "1536x1024"

# Featured Article - Last Minute Orders
echo "2/7 ⏰ Generating featured last-minute orders image..."
python generate_images.py \
  -p "Elegant wedding cake being quickly prepared by skilled baker in professional kitchen, sense of urgency but maintaining quality, beautiful decorating process, modern bakery environment, skilled hands working on cake details" \
  -f "blog-featured-last-minute-orders" \
  -s "1536x1024"

# Cake Pricing Breakdown
echo "3/7 💰 Generating cake pricing breakdown image..."
python generate_images.py \
  -p "Professional cake pricing breakdown infographic, premium ingredients layout, cost factors visualization, artisan decorating tools, ingredient costs comparison, elegant modern design, educational cake business illustration" \
  -f "blog-cake-pricing-breakdown" \
  -s "1536x1024"

# Wedding Cake Styles
echo "4/7 💒 Generating wedding cake styles image..."
python generate_images.py \
  -p "Beautiful collection of wedding cake styles, classic elegant white cake, rustic naked cake, modern geometric design, vintage romantic style, side by side comparison, elegant wedding venue background, professional photography" \
  -f "blog-wedding-cake-styles" \
  -s "1536x1024"

# Cake Size Calculator
echo "5/7 📏 Generating cake size calculator image..."
python generate_images.py \
  -p "Cake size comparison chart, different diameter cakes arranged by size, 16cm to 28cm comparison, portion guide visualization, clean professional layout, measuring tools, educational cake sizing guide, modern bakery setting" \
  -f "blog-cake-size-calculator" \
  -s "1536x1024"

# Cake Ordering Mistakes
echo "6/7 ⚠️ Generating cake ordering mistakes image..."
python generate_images.py \
  -p "Common cake ordering mistakes illustrated, before and after comparison, what can go wrong examples, professional advice visualization, educational cake ordering guide, modern infographic style, warning signs and solutions" \
  -f "blog-cake-ordering-mistakes" \
  -s "1536x1024"

# Bakery Comparison
echo "7/7 🏪 Generating bakery comparison image..."
python generate_images.py \
  -p "Side by side comparison of traditional bakery storefront and modern artisan cake studio, different working environments, mass production vs custom work, professional equipment differences, traditional vs contemporary approach" \
  -f "blog-bakery-comparison" \
  -s "1536x1024"

echo ""
echo "✨ Blog image generation complete!"
echo "======================================================="
echo "Generated images:"
echo "  • blog-hero-baking-inspiration.png"
echo "  • blog-featured-last-minute-orders.png"  
echo "  • blog-cake-pricing-breakdown.png"
echo "  • blog-wedding-cake-styles.png"
echo "  • blog-cake-size-calculator.png"
echo "  • blog-cake-ordering-mistakes.png"
echo "  • blog-bakery-comparison.png"
echo ""
echo "All images are ready for the CakeBooking blog! 🎂✨" 