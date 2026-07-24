// Fallback only — used if the /api/services request fails or hasn't loaded
// yet. The live data now comes from the admin-managed Services API.
export const services = [
  { icon: "Globe2", slug: "immigration-consulting", title: "Immigration Consulting", description: "End-to-end migration strategy from eligibility assessment to landing — covering skilled, family, investor and humanitarian streams." },
  { icon: "Plane", slug: "visa-processing", title: "Visa Processing", description: "Meticulous handling of work, tourist, business and family visas with a 99% approval track record across 40+ jurisdictions." },
  { icon: "FileCheck2", slug: "document-attestation", title: "Document Attestation", description: "Notarisation, MOFA, embassy and apostille attestation for educational, personal and commercial documents." },
  { icon: "Briefcase", slug: "business-setup", title: "Business Setup", description: "Company formation, trade licenses and corporate structuring in the UAE mainland, free zones and offshore." },
  { icon: "Landmark", slug: "pr-citizenship", title: "PR & Citizenship", description: "Permanent residency and citizenship-by-investment programmes across Europe, Canada and the Caribbean." },
  { icon: "GraduationCap", slug: "study-abroad", title: "Study Abroad", description: "University shortlisting, admissions, student visas and post-study work strategy for 20+ destinations." },
  { icon: "ShieldCheck", slug: "investor-visa", title: "Investor Visa", description: "Golden Visa, investor and start-up routes for entrepreneurs seeking long-term global mobility." },
  { icon: "Users2", slug: "corporate-mobility", title: "Corporate Mobility", description: "Global talent relocation, work-permit management and HR partnerships for multinational employers." },
];

export const visas = [
  { title: "Work Visa", tag: "Skilled Migration", desc: "Employer-sponsored and points-based work permits for skilled professionals." },
  { title: "Golden Visa", tag: "Long-term Residency", desc: "10-year UAE Golden Visa for investors, specialists, and outstanding talent." },
  { title: "Business Visa", tag: "Investors & Founders", desc: "Multi-entry and start-up visas across the UAE, UK, Canada, and EU." },
  { title: "Tourist Visa", tag: "Short-stay", desc: "Rapid short-stay visas for family visits, leisure travel and transit." },
  { title: "Student Visa", tag: "Education", desc: "Study permits and post-study work routes for accredited universities." },
  { title: "Family Visa", tag: "Dependents", desc: "Sponsor spouses, children and parents under family reunification programmes." },
  { title: "Permanent Residency", tag: "Settlement", desc: "PR pathways in Canada, Australia, UK and select European nations." },
  { title: "Investor Visa", tag: "Capital Migration", desc: "Residency and citizenship-by-investment across 15+ programmes worldwide." },
];

export const countries = [
  { name: "Dubai (UAE)", region: "Middle East", tag: "Golden Visa · Employment · Business" },
  { name: "Poland", region: "Europe", tag: "Work Permit · TRC" },
  { name: "Slovakia", region: "Europe", tag: "Employment · Blue Card" },
  { name: "Germany", region: "Europe", tag: "EU Blue Card · Job Seeker" },
  { name: "Czech Republic", region: "Europe", tag: "Employee Card · Work Permit" },
  { name: "Bulgaria", region: "Europe", tag: "Work Visa · Single Permit" },
  { name: "Romania", region: "Europe", tag: "Work Visa · Long-stay D" },
  { name: "Lithuania", region: "Europe", tag: "National D Visa · Work" },
  { name: "Slovenia", region: "Europe", tag: "Single Permit · Employment" },
  { name: "Croatia", region: "Europe", tag: "Residence & Work Permit" },
  { name: "France", region: "Europe", tag: "Talent Passport · Work" },
  { name: "Netherlands", region: "Europe", tag: "Highly Skilled Migrant" },
  { name: "Serbia", region: "Europe", tag: "Work Permit · Residence" },
  { name: "Albania", region: "Europe", tag: "Work & Residence Permit" },
  { name: "Belarus", region: "Europe", tag: "Work Visa · Residence" },
  { name: "Montenegro", region: "Europe", tag: "Temporary Residence · Work" },
  { name: "Malta", region: "Europe", tag: "Single Permit · Key Employee" },
  { name: "Latvia", region: "Europe", tag: "Work Visa · Residence" },
  { name: "Cyprus", region: "Europe", tag: "Employment Visa · Residence" },
  { name: "Malaysia", region: "Asia", tag: "Employment Pass · MM2H" },
  { name: "Singapore", region: "Asia", tag: "Employment Pass · S Pass" },
  { name: "Taiwan", region: "Asia", tag: "Work Permit · Gold Card" },
  { name: "Russia", region: "Europe/Asia", tag: "Work Visa · Invitation" },
  { name: "Ukraine", region: "Europe", tag: "Work Permit · Residence" },
  { name: "Vietnam", region: "Asia", tag: "Work Permit · TRC" },
  { name: "USA", region: "North America", tag: "H-1B · EB-3 · O-1" },
  { name: "New Zealand", region: "Oceania", tag: "Accredited Employer Work Visa" },
  { name: "Australia", region: "Oceania", tag: "Skilled Independent · 482" },
  { name: "Armenia", region: "Asia", tag: "Work Permit · Residence" },
  { name: "Georgia", region: "Asia", tag: "Work Visa · Residence" },
  { name: "Israel", region: "Middle East", tag: "B/1 Work Visa · Expert" },
];

export const stats = [
  { value: "20+", label: "Years of legacy" },
  { value: "12,000", label: "Successful cases" },
  { value: "40+", label: "Countries served" },
  { value: "99%", label: "Approval rate" },
];

export const process = [
  { step: "01", title: "Free assessment", desc: "A senior consultant profiles your goals, background and eligibility across every viable route." },
  { step: "02", title: "Route strategy", desc: "We recommend the fastest, most cost-effective pathway with transparent timelines and outcomes." },
  { step: "03", title: "Documentation", desc: "Our specialists compile, translate, notarise and attest every document to embassy standard." },
  { step: "04", title: "Application filing", desc: "We submit and represent your file with dedicated case officers monitoring every touchpoint." },
  { step: "05", title: "Landing & settlement", desc: "Post-approval, we handle relocation, banking, schooling and long-term settlement support." },
];

export const testimonials = [
  { quote: "SDB navigated a complex investor route across three jurisdictions with clarity and precision. Approval landed in nine weeks.", name: "R. Menon", role: "Managing Director", country: "UAE → Canada" },
  { quote: "From assessment to landing, their team felt like a private office — proactive, exacting, and deeply networked.", name: "Aisha K.", role: "Consultant Radiologist", country: "India → UK" },
  { quote: "We relocated fifteen engineers to Dubai without a single hiccup. SDB is now our default mobility partner.", name: "T. Halvorsen", role: "Chief People Officer", country: "Norway → UAE" },
];

export const faqs = [
  { q: "How long does a typical visa application take?", a: "Timelines vary by country and category: from 3 working days for short-stay UAE tourist visas to 6–12 months for skilled PR programmes such as Canadian Express Entry. During your assessment we share a realistic timeline for every route we recommend." },
  { q: "Do you guarantee visa approval?", a: "No ethical firm can guarantee outcomes issued by sovereign governments. What we guarantee is exacting eligibility screening, embassy-grade documentation and disciplined case management — the ingredients behind our 99% approval track record." },
  { q: "Where is SDB International Group headquartered?", a: "Our global headquarters is in Business Bay, Dubai. We maintain partner offices and case teams across the GCC, Europe, Canada, the United Kingdom and Australia." },
  { q: "Can you assist businesses relocating multiple employees?", a: "Yes. Our corporate mobility desk handles bulk work-permit processing, dependent visas, tax onboarding and settlement services for enterprises relocating teams across borders." },
  { q: "Do you handle document attestation?", a: "We manage full-cycle attestation — notary, home-country MOFA, destination-country embassy and apostille — for educational, personal and commercial documents across 40+ jurisdictions." },
  { q: "How do I begin?", a: "Book a complimentary 30-minute consultation through our contact page. A senior consultant will review your profile and outline every viable route before you commit to anything." },
];

export const jobCountries = ["Dubai (UAE)", "Poland", "Slovakia", "Germany", "Czech Republic", "Bulgaria", "Romania", "Lithuania", "Slovenia", "Croatia", "France", "Netherlands", "Serbia", "Albania", "Belarus", "Montenegro", "Malta", "Latvia", "Cyprus", "Malaysia", "Singapore", "Taiwan", "Russia", "Ukraine", "Vietnam", "USA", "New Zealand", "Australia", "Armenia", "Georgia", "Israel"];

export const jobCategories = ["Construction", "Hospitality", "IT", "Retail", "Transportation", "Security", "Warehouse", "Agriculture"];

// export const jobs = [
//   { id: 1, title: "Construction Worker", country: "United Kingdom", category: "Construction", date: "06 July 2026", salary: "GBP 1,000", salaryValue: 1300, perks: ["Visa Support", "Accommodation", "Transport"], description: "Seeking hardworking and reliable Construction Workers to join construction projects in the United Kingdom. The ideal candidate will assist with general construction activities and site materials." },
//   { id: 2, title: "Electrician", country: "Greece", category: "Construction", date: "04 July 2026", salary: "EUR 950", salaryValue: 1050, perks: ["Accommodation", "Visa Support", "Transport"], description: "Looking for skilled and experienced Electricians to join construction, maintenance, and electrical service teams in Greece. The candidate will be responsible for installing and testing systems." },
//   { id: 3, title: "Delivery Bike Rider", country: "Bulgaria", category: "Transportation", date: "23 June 2026", salary: "EUR 700", salaryValue: 770, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are seeking reliable and responsible Delivery Bike Riders to join delivery teams in Bulgaria. The ideal candidate will be responsible for delivering food, packages, or products safely and on time." },
//   { id: 4, title: "Garments Helper", country: "Russia", category: "Retail", date: "20 June 2026", salary: "RUB 45,000", salaryValue: 500, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are looking for hardworking and detail-oriented Garments Helpers to support garment production and textile operations in Russia. The candidate will assist with fabric handling and packing." },
//   { id: 5, title: "Retail Associate", country: "Greece", category: "Retail", date: "19 June 2026", salary: "EUR 1,299", salaryValue: 1440, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are looking for motivated and customer-focused Retail Associates to join retail teams in Greece. The candidate will assist customers, manage store operations, and maintain product displays." },
//   { id: 6, title: "Heavy Truck Driver", country: "Latvia", category: "Transportation", date: "19 June 2026", salary: "EUR 2,000", salaryValue: 2200, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are looking for experienced and responsible Heavy Truck Drivers to join transportation teams in Latvia. The ideal candidate will safely operate heavy vehicles and transport goods efficiently." },
//   { id: 7, title: "Waiter", country: "Serbia", category: "Hospitality", date: "14 June 2026", salary: "EUR 1,000", salaryValue: 1100, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are seeking skilled and hardworking Carpenters and Waitstaff to join hospitality teams in Serbia. The ideal candidate will have experience in service work, including customer care." },
//   { id: 8, title: "Warehouse Worker", country: "United Arab Emirates", category: "Warehouse", date: "11 June 2026", salary: "AED 1,500", salaryValue: 1500, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are seeking dedicated Warehouse Workers to support daily warehouse operations in Dubai. The ideal candidate will assist with receiving, storing, picking, packing, and dispatching goods." },
//   { id: 9, title: "Farm Worker", country: "Czech Republic", category: "Agriculture", date: "08 June 2026", salary: "EUR 1,400", salaryValue: 1540, perks: ["Accommodation", "Visa Support", "Transport"], description: "We are seeking hardworking and reliable Farm Workers to join agricultural operations in the Czech Republic. The successful candidate will assist with crop cultivation, harvesting, and livestock care." },
//   { id: 10, title: "Waiter", country: "United Arab Emirates", category: "Hospitality", date: "08 June 2026", salary: "AED 1,200", salaryValue: 1200, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are looking for enthusiastic and customer-focused Waiters to join our team in Dubai, UAE. The ideal candidate will provide excellent customer service, take food and beverage orders accurately." },
//   { id: 11, title: "General Warehouse Workers", country: "Serbia", category: "Warehouse", date: "23 April 2026", salary: "EUR 800", salaryValue: 880, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are currently hiring Warehouse Workers, General Workers, and Construction Workers for reputable companies in Serbia. The selected candidates will support daily operations in warehouses." },
//   { id: 12, title: "General Workers", country: "Germany", category: "Warehouse", date: "23 April 2026", salary: "EUR 2,000", salaryValue: 2200, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are currently hiring Warehouse Workers and General Workers for reputable companies in Germany. The selected candidates will support warehouse operations and logistics activities." },
//   { id: 13, title: "Warehouse Worker", country: "Czech Republic", category: "Warehouse", date: "23 April 2026", salary: "EUR 1,300", salaryValue: 1430, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are currently hiring Warehouse Workers and General Workers for reputable companies in the Czech Republic. The selected candidates will assist in warehouse operations and logistics handling." },
//   { id: 14, title: "Security Guard", country: "United Arab Emirates", category: "Security", date: "23 April 2026", salary: "AED 1,700", salaryValue: 1700, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are currently hiring Security Guards for reputable companies in Dubai. The selected candidates will be responsible for maintaining safety, monitoring premises, and ensuring that all site protocols are followed." },
//   { id: 15, title: "Bike Rider", country: "United Arab Emirates", category: "Transportation", date: "23 April 2026", salary: "AED 3,000", salaryValue: 3000, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are currently hiring Bike Riders for delivery and logistics companies in Dubai. The selected candidates will be responsible for timely and safe delivery of goods while maintaining excellent service." },
//   { id: 16, title: "Labour (General Worker)", country: "United Arab Emirates", category: "Construction", date: "23 April 2026", salary: "AED 1,000", salaryValue: 1000, perks: ["Visa Support", "Accommodation", "Transport"], description: "We are currently hiring General Labourers for reputable companies across the UAE. The selected candidates will assist in construction, warehouse, and general work environments, supporting daily operations." },
// ];
