# NinjaScan.ai Dashboard UI

Enterprise-grade Web Accessibility Scanner Dashboard built with React 18, TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd NinjaScan_Website_Scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or  
   yarn dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The dashboard will load with sample data

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.0.0",
  "vite": "^4.4.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.3.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "lucide-react": "^0.400.0"
}
```

### Charts & Visualization
```json
{
  "recharts": "^2.8.0"
}
```

### Development Tools
```json
{
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.0.0",
  "eslint": "^8.45.0",
  "prettier": "^3.0.0"
}
```

## 🎨 Features

- **WCAG 2.2 & EN 301 549 Compliance Scanning**
- **Dual-Ring Gauge Visualization** (Recharts)
- **Category-based Issue Management**
- **Keyboard Navigation & Screen Reader Support**
- **Multi-language Support** (EN, DE, FR, IT, ES)
- **Export Functionality** (PDF, CSV, VPAT)
- **Focus Management & Accessibility**
- **Responsive Design**

## 🏗️ Architecture

```
src/
├── pages/
│   └── Dashboard.tsx          # Main dashboard page
├── components/
│   ├── GaugeMeter.tsx        # Dual-ring compliance gauge
│   ├── CategoryCard.tsx      # Accessibility category cards
│   ├── IssuePanel.tsx        # Slide-in issue details panel
│   ├── ExportButtons.tsx     # PDF/CSV/VPAT export options
│   └── LocaleToggle.tsx      # Language switcher
├── data/
│   ├── types.ts              # TypeScript interfaces
│   └── sampleIssues.json     # Demo data
└── i18n/
    ├── en.json               # English translations
    ├── de.json               # German translations
    ├── fr.json               # French translations
    ├── it.json               # Italian translations
    └── es.json               # Spanish translations
```

## 🎯 Usage

### Basic Navigation

1. **Domain Scanning**
   - Enter domain in the search field
   - Click "Free Scan" or press Enter
   - View real-time scanning progress

2. **Score Analysis**
   - Central gauge shows WCAG 2.2 & EN 301 549 scores
   - Color coding: Green (80%+), Yellow (60-79%), Red (<60%)
   - Compliance status and risk level badges

3. **Issue Exploration**
   - Click any category card to view detailed issues
   - Side panel slides in with issue list
   - Focus is trapped within the panel
   - Press Escape to close

4. **Export Reports**
   - PDF: Complete visual report
   - CSV: Raw data for analysis
   - VPAT: Accessibility compliance template

### Keyboard Navigation

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and cards
- **Escape**: Close panels and dropdowns
- **Arrow Keys**: Navigate within dropdown menus

### Language Support

- Click the globe icon in the header
- Select from: English, Deutsch, Français, Italiano, Español
- All UI text updates dynamically

## 🧪 Testing

### Manual QA Checklist

#### Keyboard Navigation
- [ ] Tab order follows logical sequence
- [ ] All interactive elements are focusable
- [ ] Focus indicators are visible (2px outline offset)
- [ ] Escape key closes panels/dropdowns
- [ ] Enter/Space activates buttons

#### Screen Reader Support
- [ ] All images have appropriate alt text
- [ ] Headings follow proper hierarchy (h1 → h2 → h3)
- [ ] ARIA labels on icons and buttons
- [ ] Form inputs have associated labels
- [ ] Status updates are announced

#### Responsive Design
- [ ] Mobile (320px+): Stacked layout
- [ ] Tablet (768px+): Mixed grid layout  
- [ ] Desktop (1024px+): Side-by-side layout
- [ ] Touch targets are 44px minimum

#### Color & Contrast
- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] Interactive elements meet contrast requirements
- [ ] Color is not the only way to convey information
- [ ] Focus indicators are clearly visible

#### Locale Switching
- [ ] All supported languages display correctly
- [ ] Date/time formats update per locale
- [ ] Text direction is preserved
- [ ] No text overflow or truncation

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Run accessibility tests
npm run a11y-test
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#22c55e) 
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale (#171717 → #fafafa)

### Typography
- **Font**: Inter (system fallback)
- **Sizes**: xs (12px) → 4xl (36px)
- **Weights**: normal (400), medium (500), semibold (600), bold (700)

### Spacing
- **Scale**: 4px base unit
- **Containers**: max-width 1280px, centered
- **Cards**: 24px padding, 16px border radius

### Shadows
- **Soft**: rgba(0, 0, 0, 0.08)
- **Soft-lg**: rgba(0, 0, 0, 0.12)
- **Soft-xl**: rgba(0, 0, 0, 0.16)

## 🐛 Troubleshooting

### Common Issues

**Gauge not rendering**: Check that Recharts is installed
```bash
npm install recharts
```

**Icons missing**: Verify Lucide React installation
```bash
npm install lucide-react
```

**TypeScript errors**: Ensure all type definitions are installed
```bash
npm install -D @types/react @types/react-dom
```

**Tailwind styles not applying**: Check postcss.config.js and tailwind.config.ts

### Performance

- **Bundle size**: Target <500kb gzipped
- **First paint**: Target <1.5s
- **Interactivity**: Target <2.5s

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ for accessibility and inclusion** 