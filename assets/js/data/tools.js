/* Single source of truth for categories and tools.
   To add a tool: add one row to RAW. Everything else renders from here.
   Row: [slug, name, categorySlug, icon, description, popularity(0-100), addedDate|null] */
(() => {
  const categories = [
    { slug: "pdf-tools", name: "PDF Tools", icon: "file", desc: "Compress, merge, split and convert PDF files." },
    { slug: "image-tools", name: "Image Tools", icon: "image", desc: "Resize, compress, crop and convert images." },
    { slug: "qr-barcode-tools", name: "QR Code & Barcode Tools", icon: "qr", desc: "Create QR codes and barcodes, or scan them." },
    { slug: "calculators", name: "Calculators", icon: "calc", desc: "Quick calculators for money, health and dates." },
    { slug: "text-tools", name: "Text Tools", icon: "text", desc: "Count, clean, compare and transform text." },
    { slug: "developer-tools", name: "Developer Tools", icon: "code", desc: "Format, encode, test and convert code and data." },
    { slug: "color-design-tools", name: "Color & Design Tools", icon: "palette", desc: "Pick, convert and check colors." },
    { slug: "other-utilities", name: "Other Utilities", icon: "grid", desc: "Handy everyday tools that fit nowhere else." }
  ];

  // Longer intro copy for each category page (also used as meta description source)
  const intros = {
    "pdf-tools": "Work with PDF files without installing software. Shrink large PDFs for email, combine several documents into one, split a long file into parts, or turn pages into images.",
    "image-tools": "Prepare photos and graphics for the web, email and social media. Resize to exact dimensions, reduce file size, crop to a ratio, or convert between common formats.",
    "qr-barcode-tools": "Create scannable codes for links, WiFi networks and contact details, make standard barcodes, or read a code from your camera or an image.",
    "calculators": "Get a quick answer for everyday math. Work out percentages and tips, estimate loan payments, check your BMI, count the days between dates, or convert units.",
    "text-tools": "Clean up and analyze writing in seconds. Count words and characters, change letter case, compare two versions, remove repeated lines, or sort a list.",
    "developer-tools": "Small utilities for everyday development work. Format and validate JSON, encode and decode strings, test regular expressions, generate hashes and UUIDs, and convert timestamps.",
    "color-design-tools": "Choose and check colors with confidence. Pick a color, convert between formats, build gradients and palettes, and test contrast for accessible text.",
    "other-utilities": "Useful tools that don't fit elsewhere. Create strong passwords, pick random numbers, compare time zones, or run a countdown."
  };
  categories.forEach(c => { c.intro = intros[c.slug]; });

  const RAW = [
    ["pdf-compressor","PDF Compressor","pdf-tools","file","Reduce PDF file size while keeping text sharp.",98,null],
    ["pdf-merger","PDF Merger","pdf-tools","layers","Combine several PDF files into one document.",94,null],
    ["pdf-splitter","PDF Splitter","pdf-tools","scissors","Split a PDF into separate pages or ranges.",80,null],
    ["image-to-pdf","Image to PDF","pdf-tools","image","Turn JPG and PNG images into a single PDF.",86,null],
    ["pdf-to-image","PDF to Image","pdf-tools","image","Save each PDF page as a JPG or PNG image.",78,null],
    ["rotate-pdf","Rotate PDF","pdf-tools","swap","Rotate PDF pages and save the new orientation.",62,null],
    ["unlock-pdf","Unlock PDF","pdf-tools","key","Remove a password you already know from a PDF.",70,"2026-10-24"],

    ["image-compressor","Image Compressor","image-tools","image","Shrink JPG, PNG and WebP files with little quality loss.",97,null],
    ["image-resizer","Image Resizer","image-tools","image","Change image dimensions for web, print or social media.",92,null],
    ["image-converter","Image Converter","image-tools","swap","Convert between JPG, PNG and WebP formats.",88,null],
    ["image-cropper","Image Cropper","image-tools","scissors","Crop an image to a custom or preset aspect ratio.",76,null],
    ["image-rotator","Image Rotator & Flipper","image-tools","swap","Rotate or flip an image in a click.",58,null],
    ["image-to-base64","Image to Base64","image-tools","code","Encode an image as a Base64 string for code.",55,null],
    ["exif-viewer","EXIF Data Viewer","image-tools","info","See camera and location details stored in a photo.",52,"2026-10-28"],

    ["qr-code-generator","QR Code Generator","qr-barcode-tools","qr","Create QR codes for links, text, email and more.",96,null],
    ["qr-code-scanner","QR Code Scanner","qr-barcode-tools","qr","Read a QR code from your camera or an image.",82,null],
    ["barcode-generator","Barcode Generator","qr-barcode-tools","barcode","Make Code 128, EAN and UPC barcodes.",72,null],
    ["wifi-qr-generator","WiFi QR Code Generator","qr-barcode-tools","qr","Let guests join your WiFi by scanning a code.",66,null],
    ["vcard-qr-generator","vCard QR Code Generator","qr-barcode-tools","user","Share contact details with a scannable code.",60,"2026-10-30"],

    ["percentage-calculator","Percentage Calculator","calculators","calc","Work out percentages, changes and discounts.",95,null],
    ["age-calculator","Age Calculator","calculators","calc","Find your exact age in years, months and days.",74,null],
    ["bmi-calculator","BMI Calculator","calculators","calc","Calculate body mass index in imperial or metric.",84,null],
    ["loan-calculator","Loan Calculator","calculators","calc","Estimate monthly payments and total interest.",85,null],
    ["tip-calculator","Tip Calculator","calculators","calc","Split a bill and add a tip in seconds.",79,null],
    ["date-calculator","Date Calculator","calculators","clock","Add or subtract days, or count days between dates.",68,null],
    ["unit-converter","Unit Converter","calculators","swap","Convert length, weight, temperature and more.",90,null],

    ["word-counter","Word Counter","text-tools","text","Count words, characters, sentences and reading time.",93,null],
    ["case-converter","Case Converter","text-tools","text","Switch text to upper, lower, title or sentence case.",83,null],
    ["text-diff","Text Compare","text-tools","text","Highlight the differences between two texts.",64,null],
    ["lorem-ipsum-generator","Lorem Ipsum Generator","text-tools","text","Generate placeholder text for designs and mockups.",67,null],
    ["remove-duplicate-lines","Remove Duplicate Lines","text-tools","text","Delete repeated lines from a list.",57,null],
    ["text-sorter","Text Sorter","text-tools","text","Sort lines alphabetically, numerically or at random.",50,null],
    ["slug-generator","Slug Generator","text-tools","link","Turn a title into a clean, URL-friendly slug.",48,"2026-10-26"],

    ["json-formatter","JSON Formatter","developer-tools","code","Format, validate and minify JSON.",91,null],
    ["base64-encoder","Base64 Encoder & Decoder","developer-tools","code","Encode text to Base64 or decode it back.",77,null],
    ["url-encoder","URL Encoder & Decoder","developer-tools","link","Escape or unescape characters in a URL.",65,null],
    ["uuid-generator","UUID Generator","developer-tools","hash","Create random version 4 UUIDs.",69,null],
    ["regex-tester","Regex Tester","developer-tools","code","Test regular expressions against sample text.",75,null],
    ["hash-generator","Hash Generator","developer-tools","hash","Generate SHA-256, SHA-1 and other hashes.",63,null],
    ["timestamp-converter","Timestamp Converter","developer-tools","clock","Convert Unix timestamps to readable dates.",71,null],
    ["css-minifier","CSS Minifier","developer-tools","code","Remove whitespace and comments from CSS.",54,"2026-10-29"],

    ["color-picker","Color Picker","color-design-tools","palette","Pick any color and copy its HEX, RGB or HSL value.",87,null],
    ["color-converter","Color Converter","color-design-tools","palette","Convert colors between HEX, RGB and HSL.",73,null],
    ["gradient-generator","Gradient Generator","color-design-tools","palette","Build CSS gradients and copy the code.",61,null],
    ["contrast-checker","Contrast Checker","color-design-tools","palette","Check text and background colors against WCAG.",59,null],
    ["palette-generator","Color Palette Generator","color-design-tools","palette","Create harmonious color palettes from one color.",56,null],

    ["password-generator","Password Generator","other-utilities","key","Create strong, random passwords.",89,null],
    ["random-number-generator","Random Number Generator","other-utilities","dice","Pick random numbers within any range.",53,null],
    ["timezone-converter","Time Zone Converter","other-utilities","globe","Compare times across cities and time zones.",81,null],
    ["countdown-timer","Countdown Timer","other-utilities","clock","Count down to an event or set a quick timer.",51,"2026-10-31"]
  ];

  const catName = Object.fromEntries(categories.map(c => [c.slug, c.name]));
  const tools = RAW.map(([slug, name, category, icon, desc, popularity, added]) =>
    ({ slug, name, category, categoryName: catName[category], icon, desc, popularity, added }));
  categories.forEach(c => { c.count = tools.filter(t => t.category === c.slug).length; });

  window.TOOLKIT = { categories, tools, byCategory: s => tools.filter(t => t.category === s), bySlug: s => tools.find(t => t.slug === s) };
})();
