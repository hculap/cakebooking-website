#!/bin/bash

# CakeBooking Blog Post Images Generation Script
# This script generates all the images needed for the "Last Minute Orders" blog post

echo "🎨 Starting Blog Post Images Generation..."
echo "======================================================="

# Activate virtual environment
source venv/bin/activate

# Blog Post Hero Image
echo "1/5 🏆 Generating blog post hero image..."
python generate_images.py \
  -p "Professional baker working quickly in modern bakery kitchen preparing elegant cake, sense of urgency but maintaining quality, beautiful cake decorating workspace, skilled hands working on last-minute order, warm lighting, time pressure but professional results" \
  -f "blog-post-last-minute-hero" \
  -s "1536x1024"

# Ready-Made Cakes Display
echo "2/5 🍰 Generating ready-made cakes display image..."
python generate_images.py \
  -p "Modern bakery display case filled with beautiful ready-made cakes, elegant glass showcase, variety of cakes available for immediate purchase, professional bakery interior, clean modern design, appetizing cake presentation" \
  -f "blog-post-ready-made-cakes" \
  -s "1536x1024"

# Custom Cake Process
echo "3/5 🎨 Generating custom cake process image..."
python generate_images.py \
  -p "Intricate custom wedding cake being decorated with detailed sugar flowers and complex designs, professional decorator working on elaborate cake, time-intensive artisan process, beautiful decorating techniques, showing complexity of personalized cakes" \
  -f "blog-post-custom-cake-process" \
  -s "1536x1024"

# Related Article - Mistakes
echo "4/5 ⚠️ Generating related mistakes article image..."
python generate_images.py \
  -p "Common cake ordering mistakes illustrated with helpful tips, before and after comparison showing what can go wrong, educational infographic style, cake ordering guide, professional advice visualization, warning signs and solutions" \
  -f "blog-post-related-mistakes" \
  -s "1536x1024"

# Related Article - Pricing
echo "5/5 💰 Generating related pricing article image..."
python generate_images.py \
  -p "Detailed cake pricing breakdown infographic, ingredient costs visualization, labor factors, decoration pricing, professional cake business cost analysis, educational pricing chart, transparent cost structure illustration" \
  -f "blog-post-related-pricing" \
  -s "1536x1024"

echo ""
echo "✨ Blog post image generation complete!"
echo "======================================================="
echo "Generated images:"
echo "  • blog-post-last-minute-hero.png"
echo "  • blog-post-ready-made-cakes.png"
echo "  • blog-post-custom-cake-process.png"
echo "  • blog-post-related-mistakes.png"
echo "  • blog-post-related-pricing.png"
echo ""
echo "All images are ready for the refined blog post! 🎂✨" 