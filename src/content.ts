/* Everything here comes from Fakhrus's CV, his publications and his own
   GitHub repositories. Don't add clients, numbers or quotes that aren't there. */

export const EMAIL = 'fakhroosyakir@gmail.com'

export const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fakhrus-syakir-65bb72205' },
  { label: 'GitHub', href: 'https://github.com/KHR00S' },
  { label: 'Instagram', href: 'https://www.instagram.com/fakhrus_syakir' },
]

export const driveThumb = (id: string, w = 640) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`
export const driveView = (id: string) => `https://drive.google.com/file/d/${id}/view`

/* the three things he works in, ordered surface to depth */
export const STRATA = [
  {
    name: 'Network',
    line: 'Day job. Enterprise routing, switching and security for clients of Mastersystem.',
    tools: ['Routing & switching', 'LAN/WAN', 'Network security', 'Enterprise infrastructure', 'Troubleshooting'],
  },
  {
    name: 'Power',
    line: 'Training. Electrical engineering at Syiah Kuala University, then plant work in Aceh.',
    tools: ['ETAP', 'PVsyst', 'CX-One', 'AutoCAD', 'HMI & PLC systems', 'K3 Listrik (BNSP)'],
  },
  {
    name: 'Learning',
    line: 'Research. Machine-learning forecasts for lakes, and a Bangkit distinction in ML.',
    tools: ['Python', 'TensorFlow', 'RStudio', 'Streamlit', 'Time-series forecasting'],
  },
] as const

export interface Experience {
  when: string
  role: string
  org: string
  place?: string
  points: string[]
  live?: boolean
}

/* newest first */
export const EXPERIENCE: Experience[] = [
  {
    live: true,
    when: '2026 – now',
    role: 'Junior Network Engineer',
    org: 'PT Mastersystem Infotama',
    place: 'Jakarta',
    points: [
      'Configure, deploy and support enterprise network infrastructure: routing and switching.',
      'Help implement, monitor and troubleshoot LAN/WAN and network security devices.',
      'Support client network operations and maintenance with the engineering team.',
    ],
  },
  {
    when: 'Jan – Mar 2026',
    role: 'Commissioning team, HMI installation',
    org: 'PT Kumatsu Gata Group',
    place: 'LPG Compressor K-6405, PT Perta Arun Gas',
    points: [
      'Installed and configured HMI panels for the compressor control system.',
      'Integrated the PLC, field instruments and the HMI interface.',
      'Ran commissioning, system tests and troubleshooting against the engineering drawings.',
    ],
  },
  {
    when: '2024',
    role: 'Machine Learning cohort, Distinction',
    org: 'Bangkit Academy led by Google',
    points: [
      'Built the dental-disease detection model for our capstone, reaching 98% accuracy.',
      'Optimised how the project stored its data.',
    ],
  },
  {
    when: 'Dec 2023 – Jan 2024',
    role: 'Electrical Engineering Intern',
    org: 'PT Perta Arun Gas',
    place: 'Lhokseumawe, Aceh',
    points: [
      'Reviewed electrical single-line diagrams.',
      'Helped troubleshoot and repair relay control systems on the production line.',
      'Supported cathodic-protection measurements for the water-intake basin.',
    ],
  },
  {
    when: 'May 2023 – Jun 2025',
    role: 'Research Manager',
    org: 'KSPM USK Investment Club',
    points: [
      'Led the research department and coordinated its members.',
      'Wrote the research reports behind the club’s initiatives.',
    ],
  },
  {
    when: '2021 – 2025',
    role: 'B.Eng, Electrical Engineering',
    org: 'Syiah Kuala University',
    points: [],
  },
]

export interface Publication {
  href: string
  title: string
  venue: string
  date: string
  badge: string
  cover: Cover
}

/* covers are served by each publisher; width/height are the source pixels */
export interface Cover {
  src: string
  width: number
  height: number
  alt: string
  /** journal or issue page the cover links to */
  href: string
  caption: string
}

export const PUBLICATIONS: Publication[] = [
  {
    href: 'https://link.springer.com/article/10.1007/s00704-025-05717-3',
    title: 'Integration of machine learning and time series analysis for upwelling prediction in Lake Laut Tawar, Indonesia',
    venue: 'Theoretical and Applied Climatology, Springer',
    date: '15 Aug 2025',
    badge: 'Scopus Q2',
    cover: {
      src: 'https://media.springernature.com/w440/springer-static/cover-hires/journal/704?as=webp',
      width: 440,
      height: 584,
      alt: 'Cover of the journal Theoretical and Applied Climatology, published by Springer',
      href: 'https://link.springer.com/journal/704',
      caption: 'Theoretical and Applied Climatology, Springer. Indexed in Scopus, Q2.',
    },
  },
  {
    href: 'https://ejournal.nusamandiri.ac.id/index.php/jitk/article/view/6665',
    title: 'Forecasting upwelling in Lake Maninjau using VAR, SVM and dashboard visualisation',
    venue: 'Jurnal Ilmu Pengetahuan dan Teknologi Komputer (JITK)',
    date: '02 Dec 2025',
    badge: 'SINTA 2',
    cover: {
      src: 'https://ojs.nusamandiri.ac.id/public/journals/3/cover_issue_135_en.jpg',
      width: 1240,
      height: 1755,
      alt: 'Cover of JITK, Jurnal Ilmu Pengetahuan dan Teknologi Komputer, Vol. 11 No. 2, November 2025',
      href: 'https://ojs.nusamandiri.ac.id/index.php/jitk/issue/view/135',
      caption: 'Vol. 11 No. 2, November 2025',
    },
  },
  {
    href: 'https://heca-analitika.com/ijds/article/view/211',
    title: 'Forecasting upwelling phenomena in Lake Laut Tawar: a semi-supervised learning approach',
    venue: 'Infolitika Journal of Data Science',
    date: '19 Nov 2024',
    badge: 'International journal',
    cover: {
      src: 'https://heca-analitika.com/public/journals/9/cover_issue_34_en_US.jpg',
      width: 2480,
      height: 3510,
      alt: 'Cover of Infolitika Journal of Data Science, Vol. 2 No. 2, November 2024',
      href: 'https://heca-analitika.com/ijds/issue/view/34',
      caption: 'Vol. 2 No. 2, November 2024',
    },
  },
]

export interface Build {
  year: string
  title: string
  desc: string
  tools: string[]
  href: string
  linkLabel: string
}

export const BUILDS: Build[] = [
  {
    year: '2025',
    title: 'Upwelling forecast, Lake Maninjau',
    desc: 'VAR and SVM models with a dashboard that shows the forecast. The code behind the JITK paper.',
    tools: ['Python', 'SVM', 'VAR', 'Dashboard'],
    href: 'https://github.com/KHR00S/upwelling-pred-maninjau',
    linkLabel: 'Code on GitHub',
  },
  {
    year: '2025',
    title: 'On-grid solar plant, 1.8 MWp',
    desc: 'Design and simulation of a utility-scale PV plant, from array sizing to yield, in a Taalenta Digital course.',
    tools: ['PVsyst', 'Electrical design'],
    href: 'https://drive.google.com/file/d/1u6dCyv74dUBawV8DrqMPItkq6k4xszP3/view',
    linkLabel: 'Certificate',
  },
  {
    year: '2024',
    title: 'T-Det-D, dental disease detection',
    desc: 'Bangkit capstone with a team of six. YOLOv8 models read front, top and bottom photos of teeth and serve predictions through an API.',
    tools: ['Python', 'YOLOv8', 'Cloud Run API'],
    href: 'https://github.com/KHR00S/C241-IC02',
    linkLabel: 'Code on GitHub',
  },
  {
    year: '2024',
    title: 'Air quality in Wanshouxigong',
    desc: 'Five years of PM2.5 and PM10 readings: trends, correlations with weather, and the days pollution turned hazardous.',
    tools: ['Python', 'pandas', 'Streamlit'],
    href: 'https://github.com/KHR00S/dashboard-airquality',
    linkLabel: 'Code on GitHub',
  },
  {
    year: '2023',
    title: 'Flood monitoring for Cilacap',
    desc: 'A dashboard that predicts floods from rainfall data, built by group 4 for the DTS TSA 2023 machine-learning programme.',
    tools: ['Python', 'Keras', 'Streamlit'],
    href: 'https://github.com/KHR00S/ENCE',
    linkLabel: 'Code on GitHub',
  },
]
