// SebaKendra Data Catalogue — mirrors blueprint §3 Feature Catalogue
// Each entry: { slug, name (BN), en, icon, fee (৳), days, desc, docs[], fields[] }

const SERVICE_CATEGORIES = [
  { slug:'citizen', name:'নাগরিক সেবা', en:'Citizen Services', icon:'🏛️' },
  { slug:'nid', name:'NID ও ভোটার সেবা', en:'NID & Voter Services', icon:'🪪' },
  { slug:'certificate', name:'সনদ আবেদন সহায়তা', en:'Certificate Assistance', icon:'📜' },
  { slug:'govt', name:'সরকারি আবেদন', en:'Government Applications', icon:'🏢' },
  { slug:'education', name:'শিক্ষা সেবা', en:'Education Services', icon:'🎓' },
];

const SERVICES = [
  // 3.1 Citizen Services (20)
  { slug:'nagorik-sana', cat:'citizen', name:'নাগরিকত্ব সনদ আবেদন সহায়তা', en:'Citizenship Certificate Assistance', icon:'📜', fee:150, days:'৩-৫ দিন', docs:['জাতীয় পরিচয়পত্র (NID)','জন্ম নিবন্ধন সনদ','পাসপোর্ট সাইজ ছবি'], desc:'ইউনিয়ন পরিষদ/পৌরসভা থেকে নাগরিকত্ব সনদ পাওয়ার সম্পূর্ণ আবেদন সহায়তা — ফর্ম পূরণ, কাগজপত্র যাচাই ও সরকারি পোর্টালে সাবমিশন গাইড।' },
  { slug:'charitrik-sana', cat:'citizen', name:'চারিত্রিক সনদ আবেদন সহায়তা', en:'Character Certificate Assistance', icon:'✅', fee:150, days:'৩-৫ দিন', docs:['NID কপি','ছবি','স্থানীয় প্রত্যয়ন'], desc:'পুলিশ/ইউপি থেকে চারিত্রিক সনদের আবেদন প্রক্রিয়ায় ধাপে ধাপে সহায়তা।' },
  { slug:'warish-sana', cat:'citizen', name:'ওয়ারিশ সনদ আবেদন সহায়তা', en:'Heir Certificate Assistance', icon:'👨‍👩‍👧', fee:200, days:'৫-৭ দিন', docs:['মৃত ব্যক্তির NID/মৃত্যু সনদ','ওয়ারিশদের NID','সম্পর্কের প্রমাণ'], desc:'ওয়ারিশ সনদ আবেদনের জন্য প্রয়োজনীয় কাগজপত্র ও ফর্ম পূরণে সহায়তা।' },
  { slug:'paribarik-sana', cat:'citizen', name:'পারিবারিক সনদ', en:'Family Certificate', icon:'🏠', fee:150, days:'৩-৫ দিন', docs:['পরিবারের সদস্যদের NID','জন্ম নিবন্ধন'], desc:'পারিবারিক সনদ আবেদন ও প্রক্রিয়াকরণ সহায়তা।' },
  { slug:'obibahito-sana', cat:'citizen', name:'অবিবাহিত সনদ', en:'Unmarried Certificate', icon:'💍', fee:150, days:'৩-৫ দিন', docs:['NID কপি','ছবি'], desc:'অবিবাহিত সনদের আবেদন সহায়তা — বিদেশে চাকরি/ভিসার জন্য বহুল ব্যবহৃত।' },
  { slug:'mrityu-sana', cat:'citizen', name:'মৃত্যু সনদ আবেদন সহায়তা', en:'Death Certificate Assistance', icon:'🕊️', fee:150, days:'৩-৫ দিন', docs:['মৃত ব্যক্তির NID','মৃত্যুর প্রমাণ/ডাক্তারি সনদ','আবেদনকারীর NID'], desc:'মৃত্যু সনদ আবেদনের সম্পূর্ণ নির্দেশনা ও ফর্ম সহায়তা।' },
  { slug:'jonmo-nibondhon', cat:'citizen', name:'জন্ম নিবন্ধন আবেদন নির্দেশনা', en:'Birth Registration Guide', icon:'👶', fee:100, days:'১-৩ দিন', docs:['শিশুর তথ্য','পিতা-মাতার NID','হাসপাতালের সনদ'], desc:'অনলাইনে জন্ম নিবন্ধন আবেদনের ধাপে ধাপে গাইড ও ফর্ম পূরণ সহায়তা।' },
  { slug:'jonmo-sংশোধন', cat:'citizen', name:'জন্ম নিবন্ধন সংশোধন গাইড', en:'Birth Registration Correction', icon:'✏️', fee:100, days:'৩-৫ দিন', docs:['বর্তমান জন্ম নিবন্ধন','সংশোধনের প্রমাণ'], desc:'জন্ম নিবন্ধনের নাম/তারিখ সংশোধনের আবেদন প্রক্রিয়া।' },
  { slug:'mrityu-nibondhon', cat:'citizen', name:'মৃত্যু নিবন্ধন নির্দেশনা', en:'Death Registration Guide', icon:'📋', fee:100, days:'১-৩ দিন', docs:['মৃত ব্যক্তির তথ্য','মৃত্যু সনদ'], desc:'মৃত্যু নিবন্ধনের অনলাইন আবেদন নির্দেশনা।' },
  { slug:'trade-license', cat:'citizen', name:'ট্রেড লাইসেন্স নতুন আবেদন ও নবায়ন', en:'Trade License New & Renewal', icon:'🏪', fee:250, days:'৩-৭ দিন', docs:['ব্যবসার ঠিকানা প্রমাণ','NID','ছবি','বাড়ি ভাড়ার চুক্তি (প্রযোজ্য)'], desc:'সিটি কর্পোরেশন/পৌরসভা/ইউনিয়ন পরিষদের ট্রেড লাইসেন্স আবেদন ও নবায়ন সহায়তা।' },
  { slug:'holding-tax', cat:'citizen', name:'হোল্ডিং ট্যাক্স গাইড', en:'Holding Tax Guide', icon:'🏡', fee:100, days:'১-৩ দিন', docs:['হোল্ডিং নম্বর','খতিয়ান'], desc:'হোল্ডিং ট্যাক্স পরিশোধ ও রসিদ সংগ্রহের নির্দেশনা।' },
  { slug:'bhumi-kor', cat:'citizen', name:'ভূমি উন্নয়ন কর গাইড', en:'Land Development Tax Guide', icon:'🌾', fee:100, days:'১-৩ দিন', docs:['খতিয়ান নম্বর','মৌজা'], desc:'ভূমি উন্নয়ন কর (খাজনা) অনলাইনে পরিশোধের গাইড।' },
  { slug:'khatian-namjari', cat:'citizen', name:'খতিয়ান ও নামজারি আবেদন গাইড', en:'Khatian & Mutation Guide', icon:'🗺️', fee:200, days:'৫-১০ দিন', docs:['খতিয়ান কপি','দলিল','NID'], desc:'নামজারি (মিউটেশন) ও খতিয়ান সংক্রান্ত আবেদন সহায়তা।' },
  { slug:'sarkari-form', cat:'govt', name:'সরকারি আবেদন ফর্ম', en:'Government Application Forms', icon:'📄', fee:80, days:'১ দিন', docs:['আবেদনের ধরন অনুযায়ী'], desc:'সকল ধরনের সরকারি আবেদন ফর্ম পূরণ ও প্রিন্ট সহায়তা।' },
  { slug:'govt-job-apply', cat:'govt', name:'সরকারি চাকরির আবেদন সহায়তা', en:'Government Job Application', icon:'💼', fee:150, days:'১-২ দিন', docs:['CV/জীবনবৃত্তান্ত','ছবি','শিক্ষাগত সনদ'], desc:'BPSC/সরকারি চাকরির অনলাইন আবেদন সম্পূর্ণ সহায়তা — ফর্ম পূরণ থেকে অ্যাডমিট কার্ড পর্যন্ত।' },
  { slug:'passport', cat:'govt', name:'পাসপোর্ট আবেদন সহায়তা', en:'Passport Application Assistance', icon:'🛂', fee:200, days:'২-৪ দিন', docs:['NID','জন্ম নিবন্ধন','ছবি','পূর্ববর্তী পাসপোর্ট (থাকলে)'], desc:'ই-পাসপোর্ট আবেদন, ফি পরিশোধ ও সাক্ষাৎকারের প্রস্তুতি সহায়তা।' },
  { slug:'police-clearance', cat:'govt', name:'পুলিশ ক্লিয়ারেন্স গাইড', en:'Police Clearance Guide', icon:'🚔', fee:150, days:'৩-৭ দিন', docs:['NID','পাসপোর্ট','ছবি'], desc:'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট (PCC) আবেদন প্রক্রিয়া।' },
  { slug:'driving-license', cat:'govt', name:'ড্রাইভিং লাইসেন্স আবেদন গাইড', en:'Driving License Guide', icon:'🚗', fee:150, days:'৩-৫ দিন', docs:['NID','ছবি','মেডিকেল সনদ'], desc:'BRTA ড্রাইভিং লাইসেন্স আবেদন ও পরীক্ষার প্রস্তুতি গাইড।' },
  { slug:'bhatta', cat:'citizen', name:'সরকারি ভাতা আবেদন নির্দেশনা', en:'Government Allowance Guide', icon:'💰', fee:100, days:'২-৪ দিন', docs:['NID','ব্যাংক অ্যাকাউন্ট','প্রমাণপত্র'], desc:'বয়স্ক ভাতা, বিধবা ভাতা, প্রতিবন্ধী ভাতা আবেদন নির্দেশনা।' },
  { slug:'education-apply', cat:'education', name:'শিক্ষাপ্রতিষ্ঠানের অনলাইন আবেদন সহায়তা', en:'Educational Institution Application', icon:'🎓', fee:120, days:'১-২ দিন', docs:['মার্কশিট','ছবি','NID/জন্ম নিবন্ধন'], desc:'ভর্তি, স্কলারশিপ ও শিক্ষা প্রতিষ্ঠানের অনলাইন আবেদন সহায়তা।' },
  // 3.2 NID & Voter
  { slug:'nid-server-copy', cat:'nid', name:'NID সার্ভার কপি সহায়তা', en:'NID Server Copy Assistance', icon:'🪪', fee:120, days:'১-২ দিন', docs:['NID নম্বর','জন্ম তারিখ'], desc:'NID সার্ভার কপি সংগ্রহের আবেদন সহায়তা (আপনার নিজের তথ্যের জন্য, সম্মতিসহ)।' },
  { slug:'nid-correction', cat:'nid', name:'NID সংশোধন গাইড', en:'NID Correction Guide', icon:'✏️', fee:150, days:'৩-৭ দিন', docs:['বর্তমান NID','সংশোধনের প্রমাণ'], desc:'NID-এর নাম, ঠিকানা, জন্ম তারিখ সংশোধনের আবেদন গাইড।' },
  { slug:'nid-reissue', cat:'nid', name:'NID পুনঃইস্যু গাইড', en:'NID Reissue Guide', icon:'🔄', fee:120, days:'৩-৫ দিন', docs:['NID নম্বর','ছবি'], desc:'হারানো/নষ্ট NID পুনঃইস্যুর আবেদন প্রক্রিয়া।' },
  { slug:'voter-registration', cat:'nid', name:'নতুন ভোটার নিবন্ধন গাইড', en:'New Voter Registration Guide', icon:'🗳️', fee:100, days:'২-৪ দিন', docs:['জন্ম নিবন্ধন','NID','ছবি'], desc:'নতুন ভোটার নিবন্ধনের সম্পূর্ণ নির্দেশনা।' },
  { slug:'voter-slip', cat:'nid', name:'ভোটার স্লিপ জেনারেটর', en:'Voter Slip Generator', icon:'🧾', fee:60, days:'তাৎক্ষণিক', docs:['ভোটার নম্বর','জন্ম তারিখ'], desc:'আপনার ভোটার তথ্য দিয়ে A4 স্লিপ তৈরি ও প্রিন্ট।' },
  { slug:'voter-info', cat:'nid', name:'ভোটার তথ্য গাইড', en:'Voter Information Guide', icon:'ℹ️', fee:60, days:'তাৎক্ষণিক', docs:['ভোটার নম্বর'], desc:'ভোটার তালিকা ও কেন্দ্রের তথ্য খোঁজার নির্দেশনা।' },
  { slug:'polling-center', cat:'nid', name:'ভোটকেন্দ্রের তথ্য', en:'Polling Center Information', icon:'📍', fee:50, days:'তাৎক্ষণিক', docs:['ভোটার নম্বর'], desc:'আপনার নির্ধারিত ভোটকেন্দ্রের তথ্য ও অবস্থান।' },
  { slug:'nid-checklist', cat:'nid', name:'NID ডকুমেন্ট চেকলিস্ট', en:'NID Document Checklist', icon:'☑️', fee:0, days:'তাৎক্ষণিক', docs:[], desc:'NID আবেদনের জন্য প্রয়োজনীয় কাগজপত্রের সম্পূর্ণ চেকলিস্ট।' },
  // Certificates
  { slug:'certificate-verify-help', cat:'certificate', name:'সনদ যাচাই সহায়তা', en:'Certificate Verification Help', icon:'🔍', fee:80, days:'১ দিন', docs:['সনদ নম্বর'], desc:'সেবাকেন্দ্র ইস্যুকৃত রসিদ/সনদের পাবলিক ভেরিফিকেশন সহায়তা।' },
  { slug:'affidavit', cat:'certificate', name:'হলফনামা/এফিডেভিট সহায়তা', en:'Affidavit Assistance', icon:'⚖️', fee:200, days:'২-৩ দিন', docs:['NID','ছবি'], desc:'হলফনামা/এফিডেভিট প্রস্তুত ও নোটারি প্রক্রিয়া সহায়তা।' },
];

// 3.3 Digital Photo Studio
const PHOTO_TOOLS = [
  { slug:'passport-photo', name:'পাসপোর্ট ছবি মেকার', en:'Passport Photo Maker', icon:'🪪', price:0, pro:true },
  { slug:'nid-photo', name:'NID ছবি মেকার', en:'NID Photo Maker', icon:'🪪', price:0, pro:true },
  { slug:'visa-photo', name:'ভিসা ছবি মেকার', en:'Visa Photo Maker', icon:'✈️', price:0, pro:true },
  { slug:'student-photo', name:'স্টুডেন্ট আইডি ছবি', en:'Student ID Photo', icon:'🎓', price:0, pro:true },
  { slug:'job-photo', name:'চাকরির আবেদন ছবি', en:'Job Application Photo', icon:'💼', price:0, pro:true },
  { slug:'bg-remove', name:'ব্যাকগ্রাউন্ড রিমুভার', en:'Background Remover', icon:'✂️', price:0, pro:true },
  { slug:'bg-color', name:'ব্যাকগ্রাউন্ড কালার চেঞ্জার', en:'Background Color Changer', icon:'🎨', price:0, pro:true },
  { slug:'face-crop', name:'অটো ফেস ক্রপ ও সেন্টারিং', en:'Auto Face Crop', icon:'🎯', price:0, pro:true },
  { slug:'photo-resize', name:'ফটো রিসাইজ', en:'Photo Resize', icon:'📐', price:0, pro:true },
  { slug:'kb-compress', name:'KB কম্প্রেসার', en:'KB Compressor', icon:'🗜️', price:0, pro:true },
  { slug:'format-convert', name:'ফরম্যাট কনভার্টার', en:'Format Converter', icon:'🔁', price:0, pro:true },
  { slug:'a4-sheet', name:'A4 ফটো শিট মেকার', en:'A4 Photo Sheet Maker', icon:'🖨️', price:0, pro:true },
  { slug:'4r-layout', name:'4R / 5R লেআউট', en:'4R / 5R Layout', icon:'🖼️', price:0, pro:true },
  { slug:'signature', name:'সিগনেচার ক্রপার ও রিসাইজার', en:'Signature Cropper', icon:'✍️', price:0, pro:true },
  { slug:'image-pdf', name:'ছবি থেকে PDF', en:'Image to PDF', icon:'📄', price:0, pro:true },
  { slug:'enhancer', name:'ফটো এনহ্যান্সার', en:'Photo Enhancer', icon:'✨', price:0, pro:true },
];

// 3.4 PDF & Document Tools
const PDF_TOOLS = [
  { slug:'pdf-merge', name:'PDF মার্জ', en:'PDF Merge', icon:'🔗', price:0 },
  { slug:'pdf-split', name:'PDF স্প্লিট', en:'PDF Split', icon:'✂️', price:0 },
  { slug:'pdf-compress', name:'PDF কম্প্রেস', en:'PDF Compress', icon:'🗜️', price:0 },
  { slug:'pdf-jpg', name:'PDF থেকে JPG', en:'PDF to JPG', icon:'🖼️', price:0 },
  { slug:'jpg-pdf', name:'JPG থেকে PDF', en:'JPG to PDF', icon:'📄', price:0 },
  { slug:'pdf-rotate', name:'PDF পেজ রোটেট', en:'PDF Rotate', icon:'🔄', price:0 },
  { slug:'pdf-watermark', name:'PDF ওয়াটারমার্ক', en:'PDF Watermark', icon:'💧', price:0 },
  { slug:'pdf-page-num', name:'পেজ নম্বর', en:'Page Number', icon:'🔢', price:0 },
  { slug:'pdf-reorder', name:'পেজ রিঅর্ডার', en:'Reorder Pages', icon:'↕️', price:0 },
  { slug:'pdf-crop', name:'PDF ক্রপ', en:'PDF Crop', icon:'✂️', price:0 },
  { slug:'image-compress', name:'ছবি কম্প্রেস', en:'Image Compressor', icon:'🗜️', price:0 },
  { slug:'image-convert', name:'ছবি কনভার্টার', en:'Image Converter', icon:'🔁', price:0 },
  { slug:'word-maker', name:'ওয়ার্ড ফাইল মেকার', en:'Word File Maker', icon:'📝', price:0 },
  { slug:'excel-maker', name:'এক্সেল ফাইল মেকার', en:'Excel File Maker', icon:'📊', price:0 },
  { slug:'text-pdf', name:'টেক্সট থেকে PDF', en:'Text to PDF', icon:'📄', price:0 },
  { slug:'ocr-bangla', name:'OCR বাংলা', en:'OCR Bangla', icon:'🔎', price:0, pro:true },
  { slug:'ocr-english', name:'OCR ইংরেজি', en:'OCR English', icon:'🔎', price:0, pro:true },
  { slug:'qr-doc', name:'QR ডকুমেন্ট জেনারেটর', en:'QR Document Generator', icon:'⬛', price:0 },
  { slug:'doc-vault', name:'ডিজিটাল ডকুমেন্ট ভল্ট', en:'Document Vault', icon:'🔐', price:0, pro:true },
];

// 3.5 Bangla & Office Tools
const BANGLA_TOOLS = [
  { slug:'unicode-bijoy', name:'ইউনিকোড ↔ বিজয় কনভার্টার', en:'Unicode ↔ Bijoy', icon:'🔤', price:0 },
  { slug:'bangla-typing', name:'বাংলা টাইপিং প্র্যাকটিস', en:'Typing Practice', icon:'⌨️', price:0 },
  { slug:'bangla-font', name:'বাংলা ফন্ট কনভার্টার', en:'Font Converter', icon:'🔠', price:0 },
  { slug:'spell-check', name:'বাংলা বানান চেকার', en:'Spell Checker', icon:'✔️', price:0 },
  { slug:'date-convert', name:'বাংলা তারিখ কনভার্টার', en:'Date Converter', icon:'📅', price:0 },
  { slug:'number-convert', name:'সংখ্যা কনভার্টার (EN↔BN)', en:'Number Converter', icon:'🔢', price:0 },
  { slug:'amount-words', name:'টাকার অঙ্কে কথায়', en:'Amount in Words', icon:'💬', price:0 },
  { slug:'dorkhasto', name:'বাংলা দরখাস্ত জেনারেটর', en:'Application Generator', icon:'📝', price:0 },
  { slug:'chuti-apply', name:'ছুটির আবেদন', en:'Leave Application', icon:'🏖️', price:0 },
  { slug:'job-apply-letter', name:'চাকরির আবেদন', en:'Job Application Letter', icon:'💼', price:0 },
  { slug:'prottayon', name:'প্রত্যয়নপত্রের খসড়া', en:'Certificate Draft', icon:'📜', price:0 },
  { slug:'office-notice', name:'অফিস নোটিশ জেনারেটর', en:'Office Notice', icon:'📢', price:0 },
  { slug:'meeting-resolution', name:'মিটিং রেজুলেশন', en:'Meeting Resolution', icon:'🤝', price:0 },
  { slug:'attendance-sheet', name:'হাজিরা শিট', en:'Attendance Sheet', icon:'✅', price:0 },
  { slug:'salary-sheet', name:'বেতন শিট', en:'Salary Sheet', icon:'💰', price:0 },
  { slug:'exam-routine', name:'পরীক্ষার রুটিন', en:'Exam Routine', icon:'🗓️', price:0 },
  { slug:'invoice-gen', name:'ইনভয়েস জেনারেটর', en:'Invoice Generator', icon:'🧾', price:0 },
  { slug:'money-receipt', name:'মানি রিসিপ্ট', en:'Money Receipt', icon:'🧾', price:0 },
];

// 3.6 AI Tools Hub
const AI_TOOLS = [
  { slug:'ai-cv', name:'AI CV রাইটার', en:'AI CV Writer', icon:'📄', credits:5 },
  { slug:'ai-cover', name:'AI কভার লেটার', en:'AI Cover Letter', icon:'✉️', credits:5 },
  { slug:'ai-application', name:'AI আবেদন রাইটার', en:'AI Application Writer', icon:'📝', credits:4 },
  { slug:'ai-email', name:'AI ইমেইল রাইটার', en:'AI Email Writer', icon:'📧', credits:3 },
  { slug:'ai-caption', name:'AI ফেসবুক ক্যাপশন', en:'AI FB Caption', icon:'📱', credits:2 },
  { slug:'ai-biz-desc', name:'AI বিজনেস বর্ণনা', en:'AI Business Description', icon:'🏢', credits:4 },
  { slug:'ai-product', name:'AI প্রোডাক্ট বর্ণনা', en:'AI Product Description', icon:'🛍️', credits:4 },
  { slug:'ai-seo', name:'AI SEO মেটা জেনারেটর', en:'AI SEO Meta', icon:'🔍', credits:3 },
  { slug:'ai-blog', name:'AI ব্লগ আউটলাইন', en:'AI Blog Outline', icon:'✍️', credits:5 },
  { slug:'ai-translate', name:'AI অনুবাদ', en:'AI Translation', icon:'🌐', credits:3 },
  { slug:'ai-summarize', name:'AI সারসংক্ষেপ', en:'AI Summarizer', icon:'📋', credits:4 },
  { slug:'ai-grammar', name:'AI গ্রামার চেকার', en:'AI Grammar Checker', icon:'✔️', credits:2 },
  { slug:'ai-bg-remove', name:'AI ব্যাকগ্রাউন্ড রিমুভার', en:'AI BG Remover', icon:'✂️', credits:8 },
  { slug:'ai-enhance', name:'AI ছবি এনহ্যান্সার', en:'AI Image Enhancer', icon:'✨', credits:8 },
  { slug:'ai-poster', name:'AI পোস্টার টেক্সট', en:'AI Poster Text', icon:'🎨', credits:4 },
  { slug:'ai-biz-name', name:'AI বিজনেস নাম জেনারেটর', en:'AI Business Name', icon:'💡', credits:3 },
  { slug:'ai-doc-assist', name:'AI ডকুমেন্ট অ্যাসিস্ট্যান্ট', en:'AI Document Assistant', icon:'🤖', credits:5 },
  { slug:'ai-reply', name:'AI কাস্টমার রিপ্লাই', en:'AI Customer Reply', icon:'💬', credits:3 },
  { slug:'ai-social', name:'AI সোশ্যাল মিডিয়া প্ল্যানার', en:'AI Social Planner', icon:'📅', credits:5 },
];

// 3.7 Business Tools
const BUSINESS_TOOLS = [
  { slug:'pos-light', name:'POS Light', icon:'🧾', desc:'দোকানের বিক্রয় পয়েন্ট — দ্রুত বিল ও পেমেন্ট' },
  { slug:'sales-mgmt', name:'সেলস ম্যানেজমেন্ট', icon:'📈', desc:'বিক্রয় ট্র্যাকিং ও রিপোর্ট' },
  { slug:'expense-mgmt', name:'খরচ ম্যানেজমেন্ট', icon:'💸', desc:'দৈনিক/মাসিক খরচের হিসাব' },
  { slug:'inventory', name:'ইনভেন্টরি ও স্টক অ্যালার্ট', icon:'📦', desc:'স্টক লেভেল ও লো-স্টক সতর্কতা' },
  { slug:'customer-mgmt', name:'কাস্টমার ম্যানেজমেন্ট', icon:'👥', desc:'কাস্টমার ডাটাবেস ও লেজার' },
  { slug:'invoice-maker', name:'ইনভয়েস মেকার', icon:'🧾', desc:'পেশাদার ইনভয়েস ও PDF এক্সপোর্ট' },
  { slug:'due-mgmt', name:'বাকি/দেনা ম্যানেজমেন্ট', icon:'📒', desc:'ডিজিটাল কাস্টমার লেজার' },
  { slug:'sales-report', name:'দৈনিক/মাসিক রিপোর্ট', icon:'📊', desc:'বিক্রয় ও লাভের রিপোর্ট' },
  { slug:'restaurant-pos', name:'রেস্টুরেন্ট POS ও QR মেনু', icon:'🍽️', desc:'টেবিল ম্যানেজমেন্ট ও QR মেনু' },
  { slug:'shop-website', name:'শপ ওয়েবসাইট বিল্ডার', icon:'🌐', desc:'নিজের অনলাইন শপ তৈরি করুন' },
  { slug:'digital-card', name:'ডিজিটাল ভিজিটিং কার্ড', icon:'💳', desc:'Smart QR বিজনেস কার্ড' },
  { slug:'sms-campaign', name:'বাল্ক SMS ক্যাম্পেইন', icon:'📩', desc:'অনুমতিপ্রাপ্ত তালিকায় SMS পাঠান' },
  { slug:'qr-generator', name:'QR কোড জেনারেটর', icon:'⬛', desc:'ডাইনামিক QR কোড তৈরি' },
  { slug:'link-bio', name:'লিংক ইন বায়ো', icon:'🔗', desc:'সব লিংক এক পেজে' },
];

// 3.9 Jobs
const JOBS = [
  { title:'সহকারী প্রোগ্রামার (PHP/Laravel)', company:'সেবাকেন্দ্র টেক', type:'ফুল-টাইম', loc:'ঢাকা (হাইব্রিড)', salary:'৳৪০,০০০–৬০,০০০', deadline:'৩০ নভেম্বর ২০২৬', tag:'সরকারি/প্রাইভেট' },
  { title:'কাস্টমার সাপোর্ট এক্সিকিউটিভ', company:'ডিজিটাল সেবা লিমিটেড', type:'ফুল-টাইম', loc:'চট্টগ্রাম', salary:'৳২৫,০০০–৩৫,০০০', deadline:'১৫ ডিসেম্বর ২০২৬', tag:'প্রাইভেট' },
  { title:'ডাটা এন্ট্রি অপারেটর', company:'ইউনিয়ন ডিজিটাল সেন্টার', type:'পার্ট-টাইম', loc:'কক্সবাজার', salary:'৳১৮,০০০–২২,০০০', deadline:'২০ ডিসেম্বর ২০২৬', tag:'সরকারি' },
  { title:'গ্রাফিক ডিজাইনার', company:'ক্রিয়েটিভ হাব', type:'ফ্রিল্যান্স', loc:'রিমোট', salary:'প্রজেক্ট ভিত্তিক', deadline:'২৫ ডিসেম্বর ২০২৬', tag:'প্রাইভেট' },
];

// 3.12 Courses
const COURSES = [
  { slug:'computer-basic', name:'কম্পিউটার বেসিক কোর্স', icon:'💻', lessons:24, hours:'১২ ঘণ্টা', level:'শিক্ষানবিশ', price:499 },
  { slug:'office-app', name:'অফিস অ্যাপ্লিকেশন কোর্স', icon:'📊', lessons:32, hours:'১৬ ঘণ্টা', level:'শিক্ষানবিশ', price:799 },
  { slug:'digital-service', name:'ডিজিটাল সেবা প্রশিক্ষণ', icon:'🏛️', lessons:20, hours:'১০ ঘণ্টা', level:'মধ্যম', price:999 },
  { slug:'pdf-photo', name:'PDF ও ফটো এডিটিং', icon:'🎨', lessons:18, hours:'৯ ঘণ্টা', level:'মধ্যম', price:699 },
  { slug:'business-mgmt', name:'ব্যবসা ব্যবস্থাপনা', icon:'📈', lessons:26, hours:'১৪ ঘণ্টা', level:'উন্নত', price:1299 },
  { slug:'entrepreneur-training', name:'উদ্যোক্তা প্রশিক্ষণ', icon:'🚀', lessons:30, hours:'১৫ ঘণ্টা', level:'সব স্তর', price:1499 },
];

// Centers
const CENTERS = [
  { slug:'cox-bazar-sadar', name:'কক্সবাজার সদর ডিজিটাল সেন্টার', district:'কক্সবাজার', upazila:'সদর', owner:'মোঃ রফিকুল ইসলাম', rating:4.8, orders:1250, phone:'০১৭XX-XXXXXX' },
  { slug:'chattogram-kotwali', name:'চট্টগ্রাম কোতোয়ালী সেবা কেন্দ্র', district:'চট্টগ্রাম', upazila:'কোতোয়ালী', owner:'ফাতেমা আক্তার', rating:4.9, orders:2100, phone:'০১৮XX-XXXXXX' },
  { slug:'dhaka-mirpur', name:'ঢাকা মিরপুর ডিজিটাল সেন্টার', district:'ঢাকা', upazila:'মিরপুর', owner:'তানভীর হাসান', rating:4.7, orders:1800, phone:'০১৯XX-XXXXXX' },
  { slug:'sylhet-sadar', name:'সিলেট সদর সেবা কেন্দ্র', district:'সিলেট', upazila:'সদর', owner:'শারমিন সুলতানা', rating:4.6, orders:980, phone:'০১৭XX-XXXXXX' },
];

// Pricing (§10)
const PLANS = [
  { slug:'free', name:'Free', bn:'ফ্রি', price:0, period:'চিরকাল', features:['সীমিত ফ্রি টুলস','সাধারণ ড্যাশবোর্ড','সীমিত ডকুমেন্ট প্রসেসিং','কমিউনিটি সাপোর্ট'] },
  { slug:'basic', name:'Basic', bn:'বেসিক', price:299, period:'/মাস', features:['প্রিমিয়াম টুলস','বেশি ইউসেজ লিমিট','ডকুমেন্ট টেমপ্লেট','অর্ডার হিস্ট্রি','ইমেইল সাপোর্ট'] },
  { slug:'professional', name:'Professional', bn:'প্রফেশনাল', price:599, period:'/মাস', featured:true, features:['AI ক্রেডিট (৫০০/মাস)','বিজনেস টুলস','প্রায়োরিটি সাপোর্ট','অ্যাডভান্সড এক্সপোর্ট','ব্যাচ প্রসেসিং'] },
  { slug:'business', name:'Business', bn:'বিজনেস', price:1499, period:'/মাস', features:['বিজনেস ড্যাশবোর্ড','মাল্টিপল স্টাফ','কাস্টমার ম্যানেজমেন্ট','সেলস অ্যানালিটিক্স','API অ্যাক্সেস (নির্ধারিত সীমায়)'] },
  { slug:'center-partner', name:'Center Partner', bn:'সেন্টার পার্টনার', price:999, period:'/মাস', features:['উদ্যোক্তা ড্যাশবোর্ড','সেন্টার ম্যানেজমেন্ট','কমিশন ট্র্যাকিং','কাস্টমার অর্ডার','ট্রেনিং ও সাপোর্ট'] },
];

// Blog
const POSTS = [
  { slug:'passport-apply-guide', title:'ই-পাসপোর্ট আবেদন: সম্পূর্ণ গাইড ২০২৬', date:'১০ নভেম্বর ২০২৬', cat:'গাইড', excerpt:'ই-পাসপোর্ট আবেদন থেকে সাক্ষাৎকার পর্যন্ত ধাপে ধাপে নির্দেশনা...' },
  { slug:'nid-correction', title:'NID সংশোধন: কোন তথ্য কীভাবে বদলাবেন', date:'২ নভেম্বর ২০২৬', cat:'NID', excerpt:'নাম, ঠিকানা ও জন্ম তারিখ সংশোধনের সঠিক প্রক্রিয়া জেনে নিন...' },
  { slug:'photo-studio-tips', title:'পাসপোর্ট ছবি তোলার ৭টি টিপস', date:'২৫ অক্টোবর ২০২৬', cat:'টুলস', excerpt:'রিজেক্ট না খেয়ে একবারেই সঠিক সাইজের ছবি তৈরি করুন...' },
  { slug:'entrepreneur-guide', title:'ডিজিটাল সেন্টার উদ্যোক্তা হওয়ার গাইড', date:'১৮ অক্টোবর ২০২৬', cat:'ব্যবসা', excerpt:'কম পুঁজিতে কীভাবে সেবা কেন্দ্রের উদ্যোক্তা হবেন...' },
];

const FAQS = [
  { q:'SebaKendra কি সরকারি প্রতিষ্ঠান?', a:'না। SebaKendra একটি অনুমোদিত সহায়তা ও প্রসেসিং প্ল্যাটফর্ম। সরকারি সেবা সংশ্লিষ্ট সরকারি পোর্টাল বা কর্তৃপক্ষই ইস্যু করে এবং আবেদন সেখানেই সম্পন্ন হয়। আমরা ফর্ম পূরণ, কাগজপত্র যাচাই ও প্রক্রিয়া নির্দেশনায় সহায়তা করি।' },
  { q:'পেমেন্ট কীভাবে করব? আমার bKash PIN কি দিতে হবে?', a:'bKash অফিসিয়াল চেকআউটের মাধ্যমে পেমেন্ট করবেন — আপনার PIN/OTP কখনো SebaKendra-তে নেওয়া হয় না। পেমেন্ট সার্ভার-সাইডে যাচাইয়ের পরই অর্ডার সক্রিয় হয়।' },
  { q:'অর্ডারের স্ট্যাটাস কীভাবে দেখব?', a:'ড্যাশবোর্ড → আমার অর্ডার থেকে প্রতিটি অর্ডারের স্ট্যাটাস, রসিদ ও ডেলিভারি দেখতে পারবেন। গুরুত্বপূর্ণ আপডেটে SMS/ইমেইল নোটিফিকেশন পাবেন।' },
  { q:'রিফান্ড পলিসি কী?', a:'সেবা প্রদানের আগে বাতিল করলে সম্পূর্ণ রিফান্ড। আংশিক কাজ সম্পন্ন হলে প্রযোজ্য ফি বাদ দিয়ে রিফান্ড করা হয়। রিফান্ড ৩-৫ কর্মদিবসে মূল পেমেন্ট মাধ্যমে ফেরত যায়।' },
  { q:'উদ্যোক্তা হিসেবে কীভাবে যুক্ত হব?', a:'উদ্যোক্তা পেজ থেকে রেজিস্ট্রেশন করুন, তথ্য ও কাগজপত্র জমা দিন। Admin যাচাইয়ের পর Center ID ও কমিশন ওয়ালেট চালু হবে।' },
  { q:'আমার ব্যক্তিগত তথ্য কি নিরাপদ?', a:'হ্যাঁ। NID ও সংবেদনশীল ডকুমেন্ট এনক্রিপ্টেড প্রাইভেট স্টোরেজে থাকে, অ্যাক্সেস লগ সংরক্ষিত হয় এবং শুধু অনুমোদিত কর্মীরাই দেখতে পারেন।' },
];

const REVIEWS = [
  { name:'মোঃ জসিম উদ্দিন', role:'কক্সবাজার', text:'পাসপোর্ট আবেদনে পুরো সহায়তা পেয়েছি। ফর্ম পূরণ থেকে সাক্ষাৎকার পর্যন্ত সব ধাপ বুঝিয়ে দিয়েছে।', stars:5 },
  { name:'নুসরাত জাহান', role:'চট্টগ্রাম', text:'ফটো স্টুডিও টুলটা অসাধারণ — পাসপোর্ট ছবি এক মিনিটে রেডি। দোকানে আর লাইন দিতে হয় না।', stars:5 },
  { name:'আরিফুল হক', role:'ঢাকা', text:'উদ্যোক্তা হিসেবে যুক্ত হয়ে মাসে ভালো কমিশন পাচ্ছি। ওয়ালেট ও রিপোর্টিং সিস্টেম খুব সহজ।', stars:5 },
  { name:'শারমিন আক্তার', role:'সিলেট', text:'বাংলা দরখাস্ত জেনারেটর দিয়ে অফিসের সব আবেদন সহজে তৈরি করি। সময় বাঁচে অনেক।', stars:5 },
];
