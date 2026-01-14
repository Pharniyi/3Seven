# 3Sevens - Pure HTML/CSS/JavaScript Website

This is a pure HTML, CSS, and JavaScript implementation of the 3Sevens bridal and floral design website.

## File Structure

```
3Sevens/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles (converted from Tailwind)
├── script.js           # JavaScript for slider functionality
├── assets/             # Images and logos
│   ├── bgImage1.png
│   ├── bgImage2.png
│   ├── bgImage3.png
│   ├── bgImage4.png
│   ├── brideImage1.jpg
│   ├── flowerImage2.jpg
│   ├── brideflowerImage3.jpg
│   ├── flower2image4.jpg
│   ├── logo.png
│   ├── facebook-logo.png
│   ├── twitter-logo.png
│   ├── tiktok-logo.png
│   ├── linkedin-logo.png
│   └── instagram-logo.png
└── README.md           # This file
```

## Features

- **Fixed Navigation Bar**: Transparent navbar with social media links and menu items
- **Auto-rotating Background Slider**: Full-screen image slider with directional animations
- **Small Image Carousel**: Secondary slider on the hero section
- **Gradient Overlays**: Custom gradient masks for visual effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Pure CSS Animations**: Smooth transitions and slide effects

## How to Use

Simply open `index.html` in a web browser. No build process or dependencies required!

### Local Development

You can use any local server to run the website:

**Python:**
```bash
python -m http.server 8000
```

**Node.js (http-server):**
```bash
npx http-server
```

**VS Code Live Server:**
Install the "Live Server" extension and click "Go Live"

Then open `http://localhost:8000` (or the port shown) in your browser.

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Notes

- All Tailwind CSS classes have been converted to pure CSS
- React components have been converted to vanilla JavaScript
- Swiper.js dependency has been replaced with custom JavaScript slider implementation
- All animations and effects are preserved from the original React version

"# 3Sevens" 
