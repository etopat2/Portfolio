# Patrick Etomet — Personal Portfolio & Systems Showcase

Production-grade, highly polished personal portfolio and systems showcase for **Patrick Etomet**, based in Luzira, Kampala, Uganda. 

Patrick Etomet combines **IT support**, **software and systems development**, **data analysis**, **systems administration**, **project management**, **geospatial mapping (OpenStreetMap)**, **digital security awareness**, and **social-impact leadership (Arata Synergy)**.

---

## Key Highlights & Architectural Features

### 1. Refined African Technology & Impact Aesthetic
- **Palette**: Deep navy/slate backdrop, crisp light containers, vibrant emerald/teal accents, restrained warm gold badges.
- **Typography**: Paired *Plus Jakarta Sans* for contemporary interface clarity with *JetBrains Mono* for timestamps, data tags, reference codes, and technical matrices.
- **Micro-interactions**: Smooth animated modals, tab filters, printable PDF views, and instant state feedback.

### 2. Public Experience
- **Hero & Identity**: Clear positioning, verified location (*Luzira, Nakawa, Kampala, Uganda*), verified contact channels, and quick jump actions.
- **Authentic Bio & Guiding Values**: Patrick's personal journey from early rural computer scarcity to self-taught technology and formal computing studies. Core principles: *Integrity & Privacy*, *Practical Problem-Solving*, *Continuous Learning*, *Community Empowerment*.
- **Core Expertise Matrix**: 6 distinct domains with applied skill tags and verifiable evidence statements (IT Support & Hardware Diagnostics, Systems & Software Development, Systems & Data Analysis, Systems Administration & Security, Project & Technical Management, Mapping & Geospatial Data).
- **Journey Timeline**: Chronological vertical progression featuring early milestones, national enrolment field experience, OSM humanitarian mapping, undergraduate studies at Victoria University Kampala, and founding Arata Synergy.
- **Filterable Projects & Systems**: Case study gallery with interactive detailed modal (including *Arata Synergy*, *PensionsGo* [safe public summary adhering to strict confidentiality], *Synergy-KinOS™*, *Digital Empowerment Programme*, *Synergy Media Network*).
- **Education, Skills & Certifications**: BSc in Business Computing & Data Analytics (Victoria University Kampala, current/ongoing), formal IT training, categorized technical stack, and humanitarian mapping badges.
- **Community & Social Impact**: Moving people from digital exclusion to participation and concepts into implementation.
- **Curriculum Vitae**: On-page executive summary, printable PDF view modal, and custom filename configuration.
- **Contact & Direct Channels**: Structured contact form with instant validation, bot honeypot protection, tracking reference code generator (`PE-2026-XXXX`), direct mailto link, direct phone call, and direct WhatsApp prefilled chat without requiring registration.

### 3. Secure Admin CMS (`/admin` or `#admin`)
- **Authentication**: JWT token authentication with bcrypt password hashing and allowlisted admin email addresses (`etomet2patrick@gmail.com`, `etopatt2@gmail.com`).
- **Dashboard Modules**:
  - **Overview**: Real-time message counts, unread alerts, published project metrics, quick export actions.
  - **Inquiries Inbox**: Searchable, filterable table (Unread, Read, Replied, Archived), drawer detail viewer, internal admin notes, instant email reply trigger, CSV export, and record deletion.
  - **Profile & Headlines**: Live editor for full name, tagline, phone, location, WhatsApp number & message, hero copy, and bio story paragraphs.
  - **Expertise Editor**: CRUD operations on domain cards, tags, and evidence statements.
  - **Journey Milestones**: CRUD operations for timeline milestones and highlights.
  - **Projects & Case Studies**: CRUD operations for projects, confidentiality classification, outcomes, tech stack, and external links.
  - **Education, Skills & Certifications**: Live management of degrees, skill groups, and certificates.
  - **Community Impact**: Pillar management for social empowerment initiatives.
  - **CV & Documents**: Document title, version date, and summary editor.
  - **Transactional Email Logs**: Resend API integration monitor and test notification trigger.
  - **Security & Audit Logs**: Immutable history of administrative changes.
  - **System Settings**: SEO metadata, meta keywords, admin password updater, and verified defaults resetter.

---

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start development server (Node.js + Vite middleware on port 3000)
npm run dev
```

### Production Build
```bash
# Compile client assets and backend bundle
npm run build

# Start production server
npm start
```

### Environment Variables
Configure `.env` based on `.env.example`:
```env
JWT_SECRET=your_secure_random_jwt_secret_key
RESEND_API_KEY=re_your_resend_api_key_here
ADMIN_EMAIL=etomet2patrick@gmail.com
```

---

## Admin Credentials
- **URL**: `http://localhost:3000/#admin` or `http://localhost:3000/admin`
- **Default Email**: `etomet2patrick@gmail.com`
- **Initial Password**: `PatrickUganda2026!` (changeable in Admin -> Settings)
