/* Workspace definition for every tool (UI only). Keyed by slug.
   mode: "file" | "text" | "text2" | "fields"
   out:  "text" (readonly box) | "stats" (labels) | "box" (generic preview)  */
const sel = (label, opts) => ({ t: "select", label, opts });
const num = (label, val, ph) => ({ t: "number", label, val, ph });
const chk = (label, on = true) => ({ t: "checkbox", label, on });
const txt = (label, ph) => ({ t: "text", label, ph });
const pwd = (label, ph) => ({ t: "password", label, ph });
const area = (label, ph) => ({ t: "textarea", label, ph });
const date = label => ({ t: "date", label });
const time = label => ({ t: "time", label });
const color = (label, val) => ({ t: "color", label, val });

const IMG = "image/jpeg,image/png,image/webp";
const PDF = ".pdf,application/pdf";
const file = (accept, hint, multi, action, settings = [], out = "Result", outKind = "box") =>
  ({ mode: "file", accept, hint, multi, action, settings, out, outKind });
const text = (inLabel, ph, action, settings = [], out = "Result", outKind = "text", stats) =>
  ({ mode: "text", inLabel, ph, action, settings, out, outKind, stats });
const fields = (action, f, out = "Result", outKind = "text", stats) =>
  ({ mode: "fields", action, settings: f, out, outKind, stats });

const U = ["Miles", "Kilometers", "Feet", "Meters", "Inches", "Centimeters", "Pounds", "Kilograms", "Ounces", "Grams", "°F", "°C"];
const CITIES = ["New York", "Los Angeles", "Chicago", "London", "Paris", "Tokyo", "Sydney", "Dubai"];

module.exports = {
  /* PDF */
  "pdf-compressor": file(PDF, "PDF files", true, "Compress PDF", [sel("Compression level", ["Recommended", "Maximum compression", "Light compression"])], "Compressed PDF"),
  "pdf-merger": file(PDF, "Two or more PDF files", true, "Merge PDFs", [chk("Add a bookmark for each file", false)], "Merged PDF"),
  "pdf-splitter": file(PDF, "One PDF file", false, "Split PDF", [sel("Split mode", ["Every page", "Page ranges", "Extract selected pages"]), txt("Page ranges", "For example 1-3, 5, 8-10")], "Split files"),
  "image-to-pdf": file(IMG, "JPG, PNG or WebP images", true, "Create PDF", [sel("Page size", ["A4", "US Letter", "Fit to image"]), sel("Orientation", ["Automatic", "Portrait", "Landscape"])], "PDF document"),
  "pdf-to-image": file(PDF, "One PDF file", false, "Convert to images", [sel("Image format", ["JPG", "PNG"]), sel("Quality", ["Standard", "High"])], "Page images"),
  "rotate-pdf": file(PDF, "One PDF file", false, "Rotate PDF", [sel("Rotation", ["90° clockwise", "180°", "90° counterclockwise"]), sel("Pages", ["All pages", "Odd pages", "Even pages"])], "Rotated PDF"),
  "unlock-pdf": file(PDF, "One PDF file", false, "Unlock PDF", [pwd("PDF password", "Enter the password you know")], "Unlocked PDF"),

  /* Image */
  "image-compressor": file(IMG, "JPG, PNG or WebP images", true, "Compress images", [sel("Quality", ["Balanced", "Smallest file", "Best quality"]), sel("Output format", ["Keep original", "WebP", "JPG"])], "Compressed images"),
  "image-resizer": file(IMG, "JPG, PNG or WebP images", true, "Resize images", [num("Width (px)", 1280), num("Height (px)", 720), chk("Keep aspect ratio")], "Resized images"),
  "image-converter": file(IMG, "JPG, PNG or WebP images", true, "Convert images", [sel("Convert to", ["JPG", "PNG", "WebP"])], "Converted images"),
  "image-cropper": file(IMG, "One image", false, "Crop image", [sel("Aspect ratio", ["Free", "1:1 square", "4:3", "16:9", "3:2"])], "Cropped image"),
  "image-rotator": file(IMG, "One image", false, "Apply change", [sel("Action", ["Rotate 90° clockwise", "Rotate 90° counterclockwise", "Rotate 180°", "Flip horizontally", "Flip vertically"])], "Edited image"),
  "image-to-base64": file(IMG, "One image", false, "Encode image", [chk("Include data URI prefix")], "Base64 string", "text"),
  "exif-viewer": file("image/jpeg", "One JPG photo", false, "Read EXIF data", [], "Photo metadata", "stats", ["Camera", "Date taken", "Dimensions", "Location"]),

  /* QR & barcode */
  "qr-code-generator": fields("Generate QR code", [sel("Content type", ["Website link", "Plain text", "Email address", "Phone number"]), area("Content", "https://example.com"), sel("Size", ["Small", "Medium", "Large"]), sel("Error correction", ["Medium", "Low", "Quartile", "High"])], "QR code preview", "box"),
  "qr-code-scanner": file(IMG, "An image containing a QR code", false, "Scan QR code", [], "Decoded content", "text"),
  "barcode-generator": fields("Generate barcode", [sel("Format", ["Code 128", "EAN-13", "UPC-A", "Code 39"]), txt("Value", "123456789012"), chk("Show value under barcode")], "Barcode preview", "box"),
  "wifi-qr-generator": fields("Generate WiFi QR code", [txt("Network name (SSID)", "MyNetwork"), pwd("Password", "Network password"), sel("Security", ["WPA/WPA2", "WEP", "None"]), chk("Hidden network", false)], "QR code preview", "box"),
  "vcard-qr-generator": fields("Generate contact QR code", [txt("Full name", "Jane Smith"), txt("Phone", "(555) 010-1234"), txt("Email", "jane@example.com"), txt("Organization", "Example Inc.")], "QR code preview", "box"),

  /* Calculators */
  "percentage-calculator": fields("Calculate", [sel("Calculation", ["What is X% of Y?", "X is what percent of Y?", "Percentage change from X to Y"]), num("Value X", "", "20"), num("Value Y", "", "150")], "Answer", "stats", ["Result"]),
  "age-calculator": fields("Calculate age", [date("Date of birth"), date("Age on this date")], "Your age", "stats", ["Years", "Months", "Days"]),
  "bmi-calculator": fields("Calculate BMI", [sel("Units", ["Imperial (lb, in)", "Metric (kg, cm)"]), num("Weight", "", "160"), num("Height", "", "68")], "Your BMI", "stats", ["BMI", "Category"]),
  "loan-calculator": fields("Calculate payment", [num("Loan amount ($)", 25000), num("Interest rate (% per year)", 6.5), num("Term (years)", 5)], "Loan summary", "stats", ["Monthly payment", "Total interest", "Total cost"]),
  "tip-calculator": fields("Calculate tip", [num("Bill amount ($)", "", "84.50"), sel("Tip", ["15%", "18%", "20%", "Custom"]), num("Number of people", 2)], "Split summary", "stats", ["Tip", "Total", "Per person"]),
  "date-calculator": fields("Calculate date", [sel("Mode", ["Add days", "Subtract days", "Days between two dates"]), date("Start date"), num("Number of days", 30)], "Result", "stats", ["Resulting date", "Day of week"]),
  "unit-converter": fields("Convert", [sel("Category", ["Length", "Weight", "Temperature"]), num("Value", 1), sel("From", U), sel("To", [...U.slice(1), U[0]])], "Converted value", "stats", ["Result"]),

  /* Text */
  "word-counter": text("Your text", "Paste or type your text here", "Count words", [], "Text statistics", "stats", ["Words", "Characters", "Sentences", "Reading time"]),
  "case-converter": text("Your text", "Paste or type your text here", "Convert case", [sel("Convert to", ["UPPERCASE", "lowercase", "Title Case", "Sentence case"])], "Converted text"),
  "text-diff": { mode: "text2", labels: ["Original text", "Changed text"], action: "Compare texts", settings: [chk("Ignore letter case", false)], out: "Differences", outKind: "box" },
  "lorem-ipsum-generator": fields("Generate text", [sel("Unit", ["Paragraphs", "Sentences", "Words"]), num("Amount", 3), chk("Start with “Lorem ipsum”")], "Placeholder text"),
  "remove-duplicate-lines": text("Your list", "One item per line", "Remove duplicates", [chk("Ignore letter case", false), chk("Trim extra spaces")], "Cleaned list"),
  "text-sorter": text("Your list", "One item per line", "Sort lines", [sel("Order", ["A to Z", "Z to A", "Numeric", "Random"])], "Sorted list"),
  "slug-generator": fields("Generate slug", [txt("Title", "How to compress a PDF"), sel("Separator", ["Hyphen (-)", "Underscore (_)"]), chk("Lowercase")], "URL slug"),

  /* Developer */
  "json-formatter": text("JSON input", '{"name":"Toolkit","tools":50}', "Format JSON", [sel("Mode", ["Format", "Minify", "Validate"]), sel("Indentation", ["2 spaces", "4 spaces", "Tab"])], "Formatted JSON"),
  "base64-encoder": text("Your text", "Paste text or a Base64 string", "Convert", [sel("Direction", ["Encode to Base64", "Decode from Base64"])], "Output"),
  "url-encoder": text("Your text", "Paste a URL or text", "Convert", [sel("Direction", ["Encode", "Decode"])], "Output"),
  "uuid-generator": fields("Generate UUIDs", [num("How many", 5), chk("Uppercase", false), chk("Remove hyphens", false)], "Generated UUIDs"),
  "regex-tester": fields("Test expression", [txt("Regular expression", "^[a-z]+@[a-z]+\\.com$"), txt("Flags", "gi"), area("Test text", "Paste the text to search")], "Matches"),
  "hash-generator": text("Your text", "Paste or type your text here", "Generate hash", [sel("Algorithm", ["SHA-256", "SHA-1", "SHA-512", "MD5"])], "Hash"),
  "timestamp-converter": fields("Convert", [sel("Direction", ["Timestamp to date", "Date to timestamp"]), txt("Value", "1767225600")], "Converted value"),
  "css-minifier": text("Your CSS", ".card { padding: 16px; }", "Minify CSS", [chk("Remove comments")], "Minified CSS"),

  /* Color & design */
  "color-picker": fields("Get color codes", [color("Pick a color", "#4f46e5")], "Color codes", "stats", ["HEX", "RGB", "HSL"]),
  "color-converter": fields("Convert color", [txt("Color value", "#4f46e5 or rgb(79, 70, 229)"), sel("Convert to", ["HEX", "RGB", "HSL"])], "Converted color"),
  "gradient-generator": fields("Generate CSS", [color("Start color", "#4f46e5"), color("End color", "#0ea5e9"), sel("Direction", ["To right", "To bottom", "Diagonal"])], "CSS code"),
  "contrast-checker": fields("Check contrast", [color("Text color", "#16161a"), color("Background color", "#ffffff")], "Contrast results", "stats", ["Contrast ratio", "Normal text (AA)", "Large text (AA)"]),
  "palette-generator": fields("Generate palette", [color("Base color", "#4f46e5"), sel("Scheme", ["Complementary", "Analogous", "Triadic", "Monochromatic"])], "Color palette", "box"),

  /* Other */
  "password-generator": fields("Generate password", [num("Length", 16), chk("Uppercase letters"), chk("Lowercase letters"), chk("Numbers"), chk("Symbols")], "Your password"),
  "random-number-generator": fields("Generate numbers", [num("Minimum", 1), num("Maximum", 100), num("How many", 1), chk("Allow duplicates")], "Random numbers"),
  "timezone-converter": fields("Convert time", [sel("From", CITIES), sel("To", [...CITIES.slice(1), CITIES[0]]), time("Time")], "Converted time", "stats", ["Converted time", "Time difference"]),
  "countdown-timer": fields("Start countdown", [date("Target date"), time("Target time")], "Time remaining", "stats", ["Days", "Hours", "Minutes", "Seconds"])
};
