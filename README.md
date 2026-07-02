# Calculator

A pixel-perfect calculator web application inspired by Apple's macOS Calculator design language. Built with HTML, CSS, and vanilla JavaScript.

## Features

- macOS-inspired dark/light theme with circular buttons and orange operators
- Full calculator arithmetic (addition, subtraction, multiplication, division)
- Keyboard support for all operations
- Sound effects via Web Audio API
- Premium upgrade paywall modal on `=` press
- Glassmorphism modal with pricing cards
- Smooth animations and micro-interactions
- Responsive layout for desktop and mobile
- Accessible with ARIA labels and keyboard navigation
- Respects `prefers-reduced-motion`

## Usage

Open `index.html` in any modern browser. All calculator buttons work normally except `=`, which triggers a premium upgrade modal as a demonstration.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Number input |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operations |
| `%` | Percent |
| `Enter` or `=` | Open paywall modal |
| `Backspace` | Delete last digit |
| `Escape` | Clear all (AC) or close modal |

## Project Structure

```
calculator/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── icons/
    └── images/
```
