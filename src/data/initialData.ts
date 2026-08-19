import { PortfolioData } from '../types';

export const initialPortfolioData: PortfolioData = {
  profile: {
    fullName: 'Patrick Etomet',
    headline: 'IT Support Specialist • Software Developer • Systems & Data Analyst',
    supportingHeadline: 'Systems Administrator • Project & Digital Innovation Practitioner • Founder, Arata Synergy',
    location: 'Luzira, Nakawa, Kampala, Uganda',
    email: 'etomet2patrick@gmail.com',
    phoneDisplay: '+256 791 170 164',
    whatsappInternational: '256791170164',
    whatsappMessage: 'Hello Patrick, I found your portfolio and would like to connect.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/patrick-etomet/',
      x: 'https://x.com/ArataPatrickEto',
      facebook: 'https://facebook.com/patrick.etomet',
      github: 'https://github.com/etometpatrick'
    },
    heroEyebrow: 'Kampala, Uganda • Open to technology, data, systems, and impact opportunities',
    heroHeadline: 'Building practical digital systems that turn complex work into clear, useful experiences.',
    heroCopy: 'I am Patrick Etomet—an IT support specialist, software developer, systems and data analyst, and founder of Arata Synergy. I combine technology, analysis, and human-centred problem-solving to improve how people, organisations, and communities work.',
    aboutTitle: 'About Patrick Etomet',
    aboutTheme: 'From digital exclusion to practical innovation.',
    aboutStory: [
      'Patrick’s early schooling in rural Uganda offered little or no access to computers. He first encountered computers and the internet during advanced secondary school in 2010–2011, which sparked a lasting commitment to technology and digital inclusion.',
      'Driven by curiosity and purpose, he supported national digital-registration work in 2014, participated in humanitarian OpenStreetMap initiatives from 2015, trained community learners, and progressed into IT support, systems analysis, databases, and software engineering.',
      'He is currently pursuing a Bachelor of Science in Business Computing and Data Analytics at Victoria University Kampala. Today, his work connects dependable technology with efficient services, structured data, and sustainable community empowerment.'
    ],
    monogram: 'PE',
    avatarUrl: '/profile.jpg',
    openGraphImage: '/profile.jpg',
    metaTitle: 'Patrick Etomet | IT Specialist, Software Developer & Systems Analyst',
    metaDescription: 'Personal portfolio and systems showcase of Patrick Etomet — IT Support Specialist, Software Developer, Systems & Data Analyst, and Founder of Arata Synergy in Kampala, Uganda.',
    analyticsId: '',
    accentColor: '#0D9488'
  },
  values: [
    {
      id: 'val-1',
      title: 'Practical Problem-Solving',
      description: 'Designing resilient, user-friendly solutions that directly solve immediate operational bottlenecks rather than building unnecessary complexity.',
      iconName: 'Wrench',
      sort_order: 1,
      is_published: true
    },
    {
      id: 'val-2',
      title: 'Continuous Learning',
      description: 'Constantly expanding technical foundations across computing paradigms, emerging data frameworks, system security, and software architecture.',
      iconName: 'BookOpen',
      sort_order: 2,
      is_published: true
    },
    {
      id: 'val-3',
      title: 'Responsible Technology',
      description: 'Safeguarding user privacy, ensuring role-based access integrity, auditing workflows, and respecting data confidentiality at every layer.',
      iconName: 'ShieldCheck',
      sort_order: 3,
      is_published: true
    },
    {
      id: 'val-4',
      title: 'Inclusive Digital Opportunity',
      description: 'Bridging the digital divide through grassroots training, open geospatial data, and accessible technology that empowers underserved communities.',
      iconName: 'Users',
      sort_order: 4,
      is_published: true
    }
  ],
  expertise: [
    {
      id: 'exp-1',
      title: 'IT Support & Systems Administration',
      description: 'Comprehensive troubleshooting, user support, hardware and workstation diagnostics, software deployment, system reliability monitoring, and operational continuity.',
      tags: ['Hardware & OS Diagnostics', 'Network Troubleshooting', 'User Support & Helpdesk', 'System Maintenance', 'Preventive Care'],
      evidenceStatement: 'Proven record of maintaining reliable workstations, configuring office networks, diagnosing software issues, and providing dependable IT support for day-to-day operations.',
      iconName: 'Server',
      sort_order: 1,
      is_published: true
    },
    {
      id: 'exp-2',
      title: 'Software & Web Development',
      description: 'Architecting modern, responsive web applications, Progressive Web Apps (PWAs), RESTful APIs, data-backed workflows, and maintainable user interfaces.',
      tags: ['React & TypeScript', 'Node.js & Express', 'PHP & REST APIs', 'Tailwind CSS', 'PWA Architecture'],
      evidenceStatement: 'Hands-on experience developing intuitive frontend interfaces, clean backend APIs, and performant web workflows tailored for practical organizational needs.',
      iconName: 'Code2',
      sort_order: 2,
      is_published: true
    },
    {
      id: 'exp-3',
      title: 'Systems Analysis & Process Improvement',
      description: 'Requirements discovery, business process mapping, workflow modelling, architectural documentation, and translating complex operational needs into usable digital systems.',
      tags: ['Requirements Elicitation', 'Workflow Diagramming', 'System Architecture', 'Functional Specifications', 'Process Optimization'],
      evidenceStatement: 'Structured approach to evaluating manual business procedures, designing automated digital alternatives, and drafting clear technical specifications.',
      iconName: 'Workflow',
      sort_order: 3,
      is_published: true
    },
    {
      id: 'exp-4',
      title: 'Data Analytics & Databases',
      description: 'Data cleaning, structured SQL querying, relational database design, KPI dashboards, reporting pipelines, and evidence-based decision support.',
      tags: ['SQL & PostgreSQL', 'MySQL / MariaDB', 'Data Cleaning & Normalization', 'Dashboard Visualization', 'Spreadsheet Analytics'],
      evidenceStatement: 'Academic grounding and project application in relational schema design, query optimization, data aggregation, and analytical insights generation.',
      iconName: 'Database',
      sort_order: 4,
      is_published: true
    },
    {
      id: 'exp-5',
      title: 'Project Management, Security & Documentation',
      description: 'Project planning, agile coordination, digital risk awareness, access control principles, technical writing, audit trail maintenance, and deployment governance.',
      tags: ['Technical Documentation', 'Role-Based Access Control', 'Digital Security Awareness', 'Project Coordination', 'Auditability'],
      evidenceStatement: 'Commitment to comprehensive technical manuals, user guides, security-first system design, and verifiable project delivery milestones.',
      iconName: 'Shield',
      sort_order: 5,
      is_published: true
    },
    {
      id: 'exp-6',
      title: 'Mapping, Training & Digital Empowerment',
      description: 'Humanitarian mapping and geospatial data contribution via OpenStreetMap, grassroots digital skills facilitation, mentoring, and community learning initiatives.',
      tags: ['OpenStreetMap / QGIS', 'Digital Literacy Facilitation', 'Youth & Women Mentorship', 'Community Workshops', 'Volunteer Coordination'],
      evidenceStatement: 'Years of active participation in open mapping projects, training community cohorts in computer literacy, and leading digital skills workshops in Uganda.',
      iconName: 'MapPin',
      sort_order: 6,
      is_published: true
    }
  ],
  experience: [
    {
      id: 'journey-1',
      period: '1999 – 2009',
      title: 'Foundational Education in Rural Uganda',
      organization: 'Primary & Lower Secondary Education',
      location: 'Uganda',
      description: 'Completed primary and lower secondary schooling in a rural setting with little to no direct access to computers, fostering resilience, resourcefulness, and a strong appetite for structured learning.',
      highlights: [
        'Overcame resource constraints through dedication to academic fundamentals',
        'Developed early problem-solving skills and community leadership mindset'
      ],
      sort_order: 1,
      is_published: true
    },
    {
      id: 'journey-2',
      period: '2010 – 2011',
      title: 'First Interaction with Computing & Internet',
      organization: 'Advanced Secondary Education',
      location: 'Uganda',
      description: 'First meaningful hands-on encounter with computers and the internet during advanced secondary schooling, igniting a lifelong passion for computing, digital communications, and systems thinking.',
      highlights: [
        'Learned basic computer architecture, word processing, and internet research',
        'Solidified intention to pursue an impactful career in information technology'
      ],
      sort_order: 2,
      is_published: true
    },
    {
      id: 'journey-3',
      period: '2014',
      title: 'National Digital Registration Support & IT Training',
      organization: 'National Digital Enrollment Initiative / Formal IT Studies',
      location: 'Uganda',
      description: 'Participated in supporting digital registration workflows and data capture during national enrollment activities, while undertaking formal foundational IT and systems coursework.',
      highlights: [
        'Assisted with field data entry, identity verification, and device operation',
        'Gained hands-on exposure to large-scale public data collection procedures'
      ],
      sort_order: 3,
      is_published: true
    },
    {
      id: 'journey-4',
      period: '2015 – Present',
      title: 'Humanitarian Mapping & Community Digital Facilitation',
      organization: 'OpenStreetMap Community & Digital Literacy Networks',
      location: 'Kampala & East Africa',
      description: 'Active contributor to OpenStreetMap humanitarian mapping efforts and volunteer digital skills training sessions for youth and community groups.',
      highlights: [
        'Mapped vulnerable infrastructure to support humanitarian response and planning',
        'Conducted digital skills sessions on basic computer literacy and internet safety'
      ],
      sort_order: 4,
      is_published: true
    },
    {
      id: 'journey-5',
      period: 'Ongoing / Current',
      title: 'BSc in Business Computing & Data Analytics',
      organization: 'Victoria University Kampala',
      location: 'Kampala, Uganda',
      description: 'Undergraduate studies focused on business intelligence, software engineering, database management systems, data visualization, systems analysis, and enterprise computing.',
      highlights: [
        'Rigorous training in SQL, relational databases, business process analysis, and programming',
        'Applying academic theory to practical prototypes and community software solutions'
      ],
      sort_order: 5,
      is_published: true
    },
    {
      id: 'journey-6',
      period: 'Founder Journey',
      title: 'Founder & Innovation Lead',
      organization: 'Arata Synergy',
      location: 'Kampala, Uganda',
      description: 'Established Arata Synergy to connect technology, innovation, and sociopreneurship with practical digital opportunity, human-centred software development, and community impact initiatives.',
      highlights: [
        'Positioned around Technology | Innovation | Sociopreneurship',
        'Spearheading digital empowerment programs and privacy-conscious software concepts'
      ],
      sort_order: 6,
      is_published: true
    }
  ],
  education: [
    {
      id: 'edu-1',
      program: 'Bachelor of Science in Business Computing and Data Analytics',
      institution: 'Victoria University Kampala',
      location: 'Kampala, Uganda',
      period: 'Current / Ongoing',
      status: 'In Progress',
      details: 'Comprehensive curriculum covering Database Management Systems (DBMS), Advanced SQL, Object-Oriented Programming, Systems Analysis & Design, Business Intelligence, Data Analytics, and IT Project Management.',
      sort_order: 1,
      is_published: true
    },
    {
      id: 'edu-2',
      program: 'Formal IT Training & Computing Studies',
      institution: 'Verified Computing Institution',
      location: 'Uganda',
      period: 'Completed',
      status: 'Completed',
      details: 'Rigorous coursework in computer hardware diagnostics, operating systems administration, network fundamentals, web basics, and technical troubleshooting.',
      sort_order: 2,
      is_published: true
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'OpenStreetMap & Geospatial Data Collection',
      issuer: 'Humanitarian OpenStreetMap Community',
      issue_date: 'Verified Participant',
      sort_order: 1,
      is_published: true
    }
  ],
  skills: [
    {
      id: 'sk-1',
      category: 'Languages & Core Programming',
      skills: ['JavaScript (ES6+)', 'TypeScript', 'PHP', 'Python (Analytics)', 'Java', 'HTML5 / Modern CSS']
    },
    {
      id: 'sk-2',
      category: 'Web Frameworks & Frontend',
      skills: ['React.js', 'Progressive Web Apps (PWA)', 'Tailwind CSS', 'Responsive Layouts', 'REST APIs', 'Node.js / Express']
    },
    {
      id: 'sk-3',
      category: 'Databases & Data Management',
      skills: ['PostgreSQL', 'MySQL / MariaDB', 'SQL Query Optimization', 'Relational Schema Design', 'Data Cleaning & Normalization', 'Prisma ORM']
    },
    {
      id: 'sk-4',
      category: 'IT Support & Systems Administration',
      skills: ['Hardware Diagnostics', 'Windows & Linux Admin', 'Network Setup & LAN', 'Workstation Deployment', 'User Troubleshooting', 'Preventive Maintenance']
    },
    {
      id: 'sk-5',
      category: 'Analysis, GIS & Productivity',
      skills: ['Systems Analysis', 'Workflow Modeling', 'OpenStreetMap / QGIS', 'Data Visualization', 'Microsoft Excel & Office Suite', 'Technical Documentation']
    },
    {
      id: 'sk-6',
      category: 'Security, Process & DevOps',
      skills: ['Git & GitHub Version Control', 'Docker Basics', 'Role-Based Access Control (RBAC)', 'Digital Security Best Practices', 'Agile Coordination']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      slug: 'arata-synergy',
      title: 'Arata Synergy',
      subtitle: 'Technology • Innovation • Sociopreneurship Ecosystem',
      category: 'Social Impact',
      status: 'Active',
      role: 'Founder & Lead Practitioner',
      confidentiality_level: 'Public',
      summary: 'A founder-led Ugandan innovation hub and ecosystem connecting technology, innovation, and sociopreneurship to unlock digital opportunity and human-centred solutions.',
      challenge: 'Talented youth and grassroots community initiatives in Uganda frequently lack access to structured digital skills, mentorship, and practical systems engineering that connect learning directly to economic opportunity.',
      approach: 'Created a multidisciplinary platform centered on three pillars: Technology (practical systems development), Innovation (creative problem-solving for local challenges), and Sociopreneurship (sustainable social impact ventures).',
      contribution: 'Directing strategic vision, curriculum design for digital literacy cohorts, technical architecture of internal web platforms, and community outreach programs.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Community Facilitation', 'Open Mapping'],
      outcomes: [
        'Established core pillars for technology training and youth digital empowerment in Uganda',
        'Facilitated open mapping and tech awareness sessions for local community members',
        'Served as the launchpad for experimental social-impact prototypes and educational media'
      ],
      external_url: 'https://facebook.com/patrick.etomet',
      is_published: true,
      sort_order: 1
    },
    {
      id: 'proj-2',
      slug: 'pensions-go',
      title: 'PensionsGo — Workflow Automation Prototype',
      subtitle: 'Controlled Digital Pension Workflow & Records Prototype',
      category: 'Systems',
      status: 'Prototype',
      role: 'Developer & Technical Documentation Author',
      confidentiality_level: 'Safe Public Summary',
      summary: 'A secure, controlled prototype exploring digitized pension workflows, multi-stage approval pipelines, claimant visibility, records indexing, and auditable processing.',
      challenge: 'Manual and paper-heavy pension processing workflows often lead to long wait times, tracking difficulties for beneficiaries, data entry redundancy, and documentation bottlenecks.',
      approach: 'Engineered a clean proof-of-concept system featuring role-based dashboards, secure document intake, status notifications, query resolution logs, and strict audit trails while maintaining absolute confidentiality of organizational data.',
      contribution: 'Developed responsive web and PWA interface components, drafted functional specifications, designed normalized relational database tables for record tracking, and authored comprehensive user documentation.',
      technologies: ['PHP / API Services', 'MySQL / MariaDB', 'PWA / Responsive Web', 'Role-Based Access Control', 'Audit Trails'],
      outcomes: [
        'Demonstrated how digital status tracking reduces physical query overhead for claimants',
        'Modelled end-to-end processing stages with immutable timestamped action logging',
        'Strictly anonymized case study adhering to confidentiality guidelines'
      ],
      is_published: true,
      sort_order: 2
    },
    {
      id: 'proj-3',
      slug: 'synergy-kinos',
      title: 'Synergy-KinOS™',
      subtitle: 'Privacy-Conscious Family Operating System Concept',
      category: 'Concept/Prototype',
      status: 'In Development',
      role: 'System Architect & Lead Developer',
      confidentiality_level: 'Public',
      summary: 'A privacy-conscious digital operating system and Progressive Web App concept designed for family communication, shared memories, collaborative calendars, household budgeting, and role-aware privacy.',
      challenge: 'Existing family management apps are either fragmented across multiple single-purpose tools or compromise family privacy with intrusive third-party data tracking.',
      approach: 'Designing a unified, modular PWA that combines family calendars, milestone records, secure media archiving, and expense tracking under strict end-user privacy controls and role-based permissions (parents, children, elders).',
      contribution: 'Architecting component models, drafting relational database schemas for multi-tenant family structures, and building the interactive prototype frontend.',
      technologies: ['React', 'TypeScript', 'PWA Architecture', 'Tailwind CSS', 'Encrypted Local Storage', 'Role-Aware Security'],
      outcomes: [
        'Completed interactive UI architecture and state models for core family modules',
        'Implemented progressive offline-first caching for low-bandwidth environments'
      ],
      is_published: true,
      sort_order: 3
    },
    {
      id: 'proj-4',
      slug: 'digital-empowerment-programme',
      title: 'Digital Empowerment Programme',
      subtitle: 'Practical Digital Literacy & Skills Initiative',
      category: 'Social Impact',
      status: 'Initiative / Pilot',
      role: 'Lead Facilitator & Curriculum Designer',
      confidentiality_level: 'Public',
      summary: 'A community-oriented digital skills initiative providing hands-on training in computer literacy, online safety, basic coding concepts, and digital tools for youth and underserved learners.',
      challenge: 'Widespread digital exclusion in peri-urban and rural communities prevents young people and women from accessing remote work, online learning, and digital public services.',
      approach: 'Delivering structured, accessible workshops emphasizing practical, immediate skills: typing, word processing, email etiquette, safe web navigation, smartphone productivity, and basic data entry.',
      contribution: 'Creating practical step-by-step training handouts, conducting hands-on lab sessions, and providing 1-on-1 mentorship to participants with zero prior computer experience.',
      technologies: ['Digital Literacy Pedagogy', 'Computer Hardware Labs', 'Internet Safety Training', 'Community Engagement'],
      outcomes: [
        'Trained community learners in foundational computing and online safety',
        'Built confidence among first-time computer users in Kampala communities'
      ],
      is_published: true,
      sort_order: 4
    },
    {
      id: 'proj-5',
      slug: 'synergy-media-network',
      title: 'Synergy Media Network',
      subtitle: 'Educational & Motivational Tech Content Initiative',
      category: 'Media',
      status: 'Active',
      role: 'Content Creator & Publisher',
      confidentiality_level: 'Public',
      summary: 'A multimedia content initiative producing practical tech guides, career insights, and motivational stories to inspire African youth to embrace technology and problem-solving.',
      challenge: 'Many aspiring tech enthusiasts in East Africa lack relatable role models and localized guidance on navigating non-traditional paths into tech.',
      approach: 'Publishing concise, encouraging articles and media posts highlighting lessons from rural origins to digital engineering, practical IT tips, and continuous learning strategies.',
      contribution: 'Authoring articles, designing graphics, and engaging with aspiring tech learners across social channels.',
      technologies: ['Digital Storytelling', 'Content Strategy', 'Social Media Publishing', 'Graphic Design'],
      outcomes: [
        'Engaged audiences across Uganda and regional networks with authentic learning stories',
        'Promoted digital inclusion and self-taught computing best practices'
      ],
      is_published: true,
      sort_order: 5
    }
  ],
  impact: [
    {
      id: 'imp-1',
      title: 'From Exclusion to Participation',
      description: 'Empowering first-time computer users and underserved community members with the skills, confidence, and tools required to participate in the modern digital economy.',
      targetGroup: 'Youth, Women & Learners',
      badge: 'Digital Inclusion',
      sort_order: 1,
      is_published: true
    },
    {
      id: 'imp-2',
      title: 'Open Geospatial & Humanitarian Mapping',
      description: 'Contributing to open map data on OpenStreetMap to ensure unmapped rural and peri-urban infrastructure is visible for disaster management, healthcare, and planning.',
      targetGroup: 'Humanitarian & Urban Planners',
      badge: 'Open Data',
      sort_order: 2,
      is_published: true
    },
    {
      id: 'imp-3',
      title: 'From Concept to Implementation',
      description: 'Translating community and business challenges into practical, resilient digital workflows that reduce administrative overhead and improve public accessibility.',
      targetGroup: 'Organizations & Grassroots Initiatives',
      badge: 'Systems Innovation',
      sort_order: 3,
      is_published: true
    }
  ],
  cv: {
    id: 'cv-main',
    displayTitle: 'Patrick Etomet — Curriculum Vitae',
    versionDate: 'August 2026',
    downloadFilename: 'Patrick_Etomet_CV.pdf',
    is_published: true,
    summaryText: 'IT Support Specialist, Software Developer, and Systems & Data Analyst with a track record spanning hardware diagnostics, database systems, PWA web development, OpenStreetMap initiatives, and social innovation leadership in Kampala, Uganda.',
    pdfUrl: ''
  },
  settings: {
    siteTitle: 'Patrick Etomet — IT Support Specialist, Systems Developer & Data Analyst',
    metaDescription: 'Personal portfolio and systems showcase for Patrick Etomet — IT Support Specialist, Software Developer, and Systems & Data Analyst in Kampala, Uganda.',
    metaKeywords: [
      'Patrick Etomet',
      'IT Support Uganda',
      'Software Developer Kampala',
      'Data Analytics Uganda',
      'Victoria University Kampala',
      'Arata Synergy',
      'Systems Analyst'
    ],
    analyticsId: '',
    accentColor: '#10b981',
    enablePublicContactForm: true
  }
};
