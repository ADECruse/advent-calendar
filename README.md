# Advent Calendar Website

An interactive advent calendar website with 24 windows that reveal photos or messages when opened. Built with vanilla HTML, Tailwind CSS, and ES6 JavaScript.

## Features

- **24 Interactive Windows**: Click on each day's window to reveal a surprise
- **Date Restrictions**: Windows can only be opened on or after their respective dates (December 1-24)
- **Persistent State**: Opened windows are saved in localStorage
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Photo & Message Support**: Display images or text messages for each day
- **Modern UI**: Beautiful gradient design with smooth animations

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build Tailwind CSS:
   ```bash
   # Development mode (watches for changes)
   npm run build:css
   
   # Production mode (minified)
   npm run build:css:prod
   ```

3. Open `index.html` in a web browser
   - For local development, you may need to run a local server due to CORS restrictions when loading `content.json`
   - You can use Python's built-in server: `python3 -m http.server 8000`
   - Or use any other local web server

## Configuration

Edit `content.json` to customize the content for each day. You can include both a photo and a message, or just one of them.

### New Format (Recommended)

```json
{
  "day": 1,
  "photo": "images/day1.jpg",      // Optional: path/URL to an image
  "message": "Your message here",   // Optional: text message
  "title": "Day 1 - Title"
}
```

### Legacy Format (Still Supported)

```json
{
  "day": 1,
  "type": "photo",  // or "message"
  "content": "path/to/photo.jpg",  // or your message text
  "title": "Day 1 - Title"
}
```

### Examples

**Both photo and message:**
```json
{
  "day": 1,
  "photo": "images/day1.jpg",
  "message": "Look at this beautiful photo! ❤️",
  "title": "Day 1"
}
```

**Just a photo:**
```json
{
  "day": 2,
  "photo": "images/day2.jpg",
  "title": "Day 2"
}
```

**Just a message:**
```json
{
  "day": 3,
  "message": "You're amazing! ❤️",
  "title": "Day 3"
}
```

**Legacy format (still works):**
```json
{
  "day": 4,
  "type": "photo",
  "content": "images/day4.jpg",
  "title": "Day 4"
}
```

## File Structure

```
advent-calendar/
├── index.html          # Main HTML file
├── script.js           # ES6 JavaScript logic
├── content.json        # Content configuration
├── package.json        # npm dependencies and scripts
├── src/
│   └── input.css       # Tailwind CSS source file
├── dist/
│   └── output.css      # Compiled Tailwind CSS (generated)
└── README.md           # This file
```

## How It Works

1. The calendar loads content from `content.json`
2. Each window checks if it can be opened based on the current date
3. When a window is opened, the content is displayed in a modal overlay
4. Opened windows are saved to localStorage and persist across sessions
5. Windows that have been opened are visually distinct (green with checkmark)

## Customization

- **Colors**: Modify Tailwind classes in `index.html` and `script.js`
- **Layout**: Adjust the grid columns in the `calendar-grid` div
- **Animations**: Customize the CSS animations in `src/input.css`
- **Tailwind Config**: Add custom Tailwind configuration if needed (Tailwind v4 uses CSS-based config)

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript (const, let, arrow functions, classes, async/await)
- CSS Grid
- localStorage
- Fetch API

## License

Free to use and modify for personal projects.

