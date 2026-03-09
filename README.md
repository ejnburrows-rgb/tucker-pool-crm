# Tucker Pool CRM

**Bilingual customer relationship management system for pool service businesses. Single-file web application with AI-powered client intake, payment tracking, scheduling, and offline-first architecture.**

## What It Does

Tucker Pool CRM is a production-ready business management platform designed specifically for pool maintenance and repair services. Built as a single-file HTML/CSS/JavaScript application (zero external framework dependencies beyond CDN libraries), it provides comprehensive client management, automated payment tracking, weekly scheduling, and AI-assisted client intake using photo recognition to extract business card details.

The system operates fully offline with a triple-layer persistence strategy, handles bilingual workflows (English/Spanish) seamlessly, and deploys instantly to Vercel with zero backend required.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript | Core application |
| **Charts** | Chart.js 4.x (CDN) | Revenue visualization |
| **Icons** | Font Awesome 6.4 (CDN) | UI iconography |
| **Fonts** | Google Fonts: Orbitron (headings), Inter (body) | Typography |
| **Storage** | localStorage, localStorage backup, IndexedDB | Triple-layer persistence |
| **AI** | Anthropic Claude API (Vision) | Photo-based client auto-fill |
| **CSS** | CSS Custom Properties, CSS Grid, Flexbox | Responsive design |
| **Container** | Docker + Nginx | Production deployment |
| **Deployment** | Vercel | Serverless hosting |
| **Code Quality** | ESLint | Linting & standards |

## Project Structure

```
tucker-pool-crm/
├── index.html                 # Complete app (HTML + CSS + JS, single-file)
├── package.json              # Project metadata & build scripts
├── components.json           # UI component configuration
├── Dockerfile                # Docker container build
├── nginx.conf                # Nginx reverse proxy config
├── .eslintrc.json           # ESLint configuration
└── README.md                 # This file
```

## Features

### Dashboard
- **6 Stat Cards**: Active Clients, Monthly Revenue, Services Today, Pending Payments, Outstanding Balance, Total Clients
- **Revenue Chart**: 6-month bar chart with month-over-month comparison
- **Recent Clients Table**: Quick-view of latest activity with payment status indicators
- **Global Search**: Find clients or services across all data instantly

### Client Management
- **Full CRUD**: Create, read, update, delete clients with validation
- **AI Photo Intake**: Snap a business card photo → Claude Vision extracts name, phone, address, pool type, service rate automatically
- **Smart Filters**: Filter by client status (Active/Inactive), payment status (Paid/Pending/Overdue), or assigned service day
- **CSV Bulk Import/Export**: Upload client lists or export for analysis
- **Client Detail Modal**: View complete history, payment record, service dates, rate negotiation logs
- **XSS Prevention**: DOM-based escaping for all user input

### Weekly Schedule
- **7-Day Grid View**: Color-coded by payment status (Green = Paid, Yellow = Pending, Red = Overdue)
- **Today Highlight**: Current day visually distinct
- **Service Notes**: Add/edit service details per day
- **Drag-to-Reschedule**: Move clients between days (optional UI)

### Payment Tracking
- **Monthly Dashboard**: Revenue vs. outstanding balance side-by-side
- **Payment Methods**: Record cash, check, card, Zelle, Venmo, or bank transfer
- **Per-Client Ledger**: Full payment history with dates and amounts
- **Overdue Alerts**: Identify which clients have outstanding balances

### Bilingual AI Assistant
- **Natural Language Interface**: Query in English or Spanish
- **Offline-First**: Runs against local data (no API calls unless Claude is enabled)
- **Query Examples**:
  - "How much did the Johnsons pay this month?" → Retrieves payment total
  - "Which pools need care next week?" → Lists upcoming services
  - "What's the address for the green algae pool?" → Client lookup
  - "Generate a payment reminder for overdue accounts" → Creates list
  - "Pool chemistry tips for cloudy water?" → Returns care advice

### Bilingual UI
- **Full EN/ES Translation**: All labels, buttons, modals, and messages translated
- **One-Click Toggle**: Language switcher in header
- **Persist Preference**: Remembers language choice across sessions

### Data & Security
- **Triple-Layer Persistence**:
  - Primary: localStorage (instant reads/writes)
  - Secondary: localStorage backup (redundancy check)
  - Tertiary: IndexedDB (large dataset fallback)
- **Auto-Save**: 800ms debounce on edits, 30s fallback flush-to-storage
- **JSON Backup/Restore**: Download client database as JSON, import backup
- **Zero Server Dependency**: Runs entirely in the browser
- **XSS Mitigation**: All dynamic content sanitized via DOM API

### Configuration
- **Company Info Settings**: Update business name, logo/photo, default service rate, payment terms
- **API Key Optional**: Enter Anthropic Claude API key to unlock advanced vision features
- **Color Theme**: Light/Dark mode toggle with CSS Custom Properties
- **Timezone Support**: Configure local timezone for scheduling

### Branding
- **NBO Badge**: "Built by NBO — Novo Business Order" footer and sidebar credit

## Run Locally

### Prerequisites
- Node.js 18+ (for package.json scripts)
- Or: Any modern web browser (can run HTML directly without Node)
- Optional: Docker 20.10+

### Option 1: Direct Browser (Recommended for Development)
```bash
# Clone the repository
git clone https://github.com/ejnburrows-rgb/tucker-pool-crm.git
cd tucker-pool-crm

# Open in browser (macOS/Linux)
open index.html

# Or Windows
start index.html

# Or use a local server
npx serve .    # Requires Node.js
# Navigate to http://localhost:3000
```

### Option 2: Docker
```bash
# Clone the repository
git clone https://github.com/ejnburrows-rgb/tucker-pool-crm.git
cd tucker-pool-crm

# Build Docker image
docker build -t tucker-pool-crm .

# Run container
docker run -p 8080:80 tucker-pool-crm

# Navigate to http://localhost:8080
```

### Option 3: Node.js Development Server
```bash
# Clone the repository
git clone https://github.com/ejnburrows-rgb/tucker-pool-crm.git
cd tucker-pool-crm

# Install dependencies (Optional, scripts only)
npm install

# Run development server
npm start
# Navigate to http://localhost:8080
```

## Deploy on Vercel

### Automatic Deployment (Recommended)
1. Push code to GitHub (`main` branch)
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project" → Select repository
4. Vercel auto-detects the project (static HTML)
5. Click "Deploy"
6. Your site is live at `https://your-project.vercel.app`

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
vercel

# Follow prompts to link project and deploy
```

### Environment Variables in Vercel
If using Anthropic Claude API for photo vision features:
1. Go to Vercel Project Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY` with your API key
3. Reference in `index.html` if needed (client-side only)

### Custom Domain
1. In Vercel Project Settings → Domains
2. Add your custom domain (e.g., `crm.tuckerpools.com`)
3. Update DNS records per Vercel instructions

## Configuration

### API Keys (Optional)
Anthropic Claude Vision is optional. To enable AI photo parsing:
1. Get API key from [Anthropic Console](https://console.anthropic.com)
2. Enter in app Settings → API Configuration
3. App stores key securely in browser localStorage (client-side only)

### Customization
Edit `index.html` style variables to match your branding:
```css
:root {
  --primary-color: #2563eb;      /* Button, accent color */
  --secondary-color: #64748b;    /* Text, borders */
  --success-color: #16a34a;      /* Paid status */
  --warning-color: #eab308;      /* Pending status */
  --error-color: #dc2626;        /* Overdue status */
  --font-family: 'Inter', sans-serif;
  --font-heading: 'Orbitron', sans-serif;
}
```

### Data Export
Export all client data as JSON for backup or third-party tools:
1. Settings → Data & Backup
2. Click "Download as JSON"
3. File saves to your computer

### Data Import
Restore from previous JSON export:
1. Settings → Data & Backup
2. Click "Upload JSON"
3. Select previously saved file
4. Data merges into current database

## Troubleshooting

**Issue: Data not persisting after refresh**
- Solution: Check browser localStorage is enabled (not in private mode)
- Fallback: Use IndexedDB (automatic fallback)

**Issue: Claude AI photo parsing not working**
- Check API key is entered correctly in Settings
- Verify Anthropic API key has usage credits
- Ensure camera/photo upload permissions granted

**Issue: Bilingual toggle not appearing**
- Refresh page (clear cache: Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check browser console for errors (F12 → Console)

**Issue: Vercel deployment shows blank page**
- Verify `index.html` is in root directory
- Check Vercel build logs for errors
- Try manual redeployment via Vercel CLI

## Performance

- **Load Time**: < 2 seconds (single file, no build step)
- **Storage Capacity**: ~10MB in localStorage, unlimited IndexedDB
- **Real-Time Sync**: 800ms debounce saves (responsive UI, efficient storage)
- **Offline Capability**: 100% offline-first (optional cloud sync with API)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS Safari 14+, Chrome Android 90+

## License

MIT License — See LICENSE file for details

---

**Built by NBO — Novo Business Order**

© Emilio José Novo 2026. All rights reserved.

[Live App](https://tucker-pool-crm-v2.vercel.app/) | [GitHub](https://github.com/ejnburrows-rgb/tucker-pool-crm) | [Report Issue](https://github.com/ejnburrows-rgb/tucker-pool-crm/issues)
