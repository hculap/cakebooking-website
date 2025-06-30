TODO: Cake Booking Landing Page - Fixes & Enhancements
Last Updated: June 30, 2025

This document outlines the necessary fixes and improvements for the Cake Booking landing page, based on a comprehensive UI/UX and code audit. Tasks are prioritized from critical to low-priority.

🟥 P0: Critical Fixes (Highest Priority)
These issues block core functionality or severely impact the user experience.

[ ] Implement Hero Section Search Bar:

Problem: The primary search functionality is completely missing from the hero section.

Task: Add the specified oval-shaped search bar with an icon. Ensure it is functional or, at minimum, a visually complete placeholder.

Reference: "UI Elements," "Critical Bugs (1.1)"

[ ] Replace Top Nav with Bottom Nav on Mobile:

Problem: The implemented "hamburger" menu does not match the mobile-first specification for a Bottom Navigation Bar. This negatively impacts usability on mobile devices.

Task: Remove the hamburger menu for mobile viewports. Implement a fixed (sticky) bottom navigation bar with 5 icons as per the design guide.

Reference: "UI Elements," "Critical Bugs (1.2)"

🟧 P1: High-Priority Fixes
These issues represent significant usability flaws, accessibility failures, or deviations from the design guide.

[ ] Fix Mobile Menu Behavior:

Problem: The mobile menu does not automatically close after a navigation link is clicked.

Task: Update the JavaScript to ensure the menu closes upon selection of a menu item, preventing a clunky two-tap navigation process.

Reference: "High-Impact Bugs (2.1)"

[ ] Correct Color Contrast for Accessibility:

Problem: "Dove Gray" text (#A8B4C5) on the navy background fails WCAG AA contrast requirements.

Task: Update the --dove-gray CSS variable to a lighter shade (e.g., #BFCAD9) to achieve a minimum contrast ratio of 4.5:1. Verify on all dark backgrounds.

Reference: "High-Impact Bugs (2.2)"

[ ] Implement Horizontal Scroll for Card Carousels:

Problem: The "Features" section uses a grid instead of the specified horizontally scrolling carousel.

Task: Refactor the features/cards sections to use a flexbox or grid layout that allows for horizontal scrolling on both desktop (with drag or buttons) and mobile (with swipe).

Reference: "Deviations and Missing Elements (3.1)"

[ ] Increase Touch Target Size for Mobile:

Problem: Some links and interactive elements may be too small for easy tapping on mobile.

Task: Review all interactive elements, especially footer links and social media icons, and ensure they meet the minimum recommended touch target size of 44x44px. Add padding if necessary.

Reference: "Bad UI Practices (Accessibility)"

🟨 P2: Medium-Priority Enhancements
These items will improve the site's polish and align it more closely with the brand's premium feel.

[ ] Refine Hero Button Hierarchy:

Problem: The two primary CTA buttons in the hero section have similar visual weight, causing user hesitation.

Task: Differentiate the primary ("Zaprojektuj swój tort") and secondary ("Znajdź cukiernię") buttons. Reduce the visual weight of the secondary button (e.g., use a "ghost button" style).

Reference: "Medium-Impact Bugs (3.1)"

[ ] Add Transitions for Tabbed Content:

Problem: The content in the "For Customers / For Bakers" section appears instantly on tab switch, which feels abrupt.

Task: Add a subtle fade-in/fade-out transition (e.g., 160ms) when switching between tabs to create a smoother user experience.

Reference: "Medium-Impact Bugs (3.2)"

[ ] Add Badges/Offers Elements:

Problem: The specified 28px circular offer badges are missing.

Task: Create the badge component and add examples to relevant cards or sections to demonstrate how promotions will be displayed.

Reference: "Deviations and Missing Elements (3.2)"

[ ] Fix Inconsistent Footer Spacing:

Problem: The spacing between the columns in the footer is not uniform.

Task: Adjust the CSS for the footer grid to ensure consistent gap or margin values between all columns.

Reference: "Low-Impact Bugs (4.1)"

🟩 P3: Low-Priority "Delight" Features
These are missed opportunities for microinteractions that would enhance user engagement.

[ ] Implement Hero Parallax Effect:

Problem: The hero section background and elements are static and do not react to user scroll.

Task: Add a parallax effect to the hero section where background and foreground elements move at different speeds on scroll.

Reference: "Deviations and Missing Elements (4.1)"

[ ] Add Interactive Tilt to Hero Cake:

Problem: The 3D cake illustration is a static element.

Task: Use JavaScript to make the cake element react to mouse movement (on desktop) or device gyroscope (on mobile), creating a subtle 3D tilt effect.

Reference: "Low-Impact Bugs (4.2)"