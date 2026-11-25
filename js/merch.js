// Merch catalogue. Edit names, prices (in QAR), colours and sizes here.
// "status": "available" | "preorder" | "soon"

// The Club Jersey: the featured product. Update specs to match your supplier.
window.JERSEY = {
  name: "The Club Jersey",
  price: 165,
  status: "preorder",
  leadTime: "Made to order. Ready in about 3 weeks.",
  fits: ["Men’s fit", "Women’s fit"],
  // Back print options
  prints: [["full", "Name + number"], ["name", "Name only"], ["plain", "Plain back"]],
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  specs: [
    ["Court cut", "Slim athletic fit with a curved shirt-tail hem and side vents."],
    ["The spray number", "Your number sprayed big across the back, fading into grain. Sublimated, so it never cracks."],
    ["The rally", "Two balls in motion across the chest, with the crest embroidered sharp on top."],
    ["Performance knit", "Lightweight, quick-dry fabric for Doha nights."],
    ["Full sublimation", "Colours are dyed into the fabric. They won't crack or peel."],
    ["Mesh side panels", "Airflow where you need it during long rallies."],
    ["Raglan sleeves", "Cut for a full swing, overheads included."],
  ],
  // Approximate chest width, laid flat (cm)
  sizeChart: { XS: 46, S: 49, M: 52, L: 55, XL: 58, "2XL": 61, "3XL": 64 },
};
// The Court Polo: second featured product.
window.POLO = {
  name: "The Court Polo",
  price: 145,
  status: "preorder",
  leadTime: "Made to order. Ready in about 3 weeks.",
  fits: ["Men’s fit", "Women’s fit"],
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  prints: [["name", "Embroidered name"], ["court", "Court Map back"], ["plain", "No name"]],
  specs: [
    ["Court Map back print", "Optional: the club’s painted, annotated court across the back, screen-printed in two inks."],
    ["Quarter-zip placket", "Zip it up for the clubhouse, open it for match play."],
    ["Mesh side panels", "Contrast mesh with brass piping keeps you cool on court."],
    ["Tapered athletic cut", "Shaped through the body, split hem so it moves with you."],
    ["Embroidered crest", "The Different D on the chest, club name across the back."],
  ],
  sizeChart: { XS: 47, S: 50, M: 53, L: 56, XL: 59, "2XL": 62, "3XL": 65 },
};

// The Mabuhay Polo: Filipino-inspired pickleball polo.
window.PRO = {
  name: "The Mabuhay Polo",
  price: 199,
  status: "preorder",
  leadTime: "Made to order. Ready in about 3 weeks.",
  fits: ["Men’s fit", "Women’s fit"],
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  prints: [["full", "Name + number"], ["name", "Name only"], ["plain", "Plain back"]],
  specs: [
    ["Court polo cut", "Knit collar, three-button placket, athletic fit and a curved shirt-tail hem."],
    ["Filipino details", "A tonal banig weave in the print and an eight-ray sun with three stars under the collar."],
    ["1 of 1", "The weave is generated from your name, with a numbered hem tag. No two are alike."],
    ["Match-day fabric", "Lightweight performance knit, sublimated so colours never crack."],
  ],
  sizeChart: { XS: 46, S: 49, M: 52, L: 55, XL: 58, "2XL": 61, "3XL": 64 },
};

window.MERCH = [
  { id: "hoodie", name: "Night Session Hoodie", price: 159, status: "soon", art: "hoodie",
    blurb: "For January nights when the breeze picks up. Brushed fleece, puff-print logo.",
    colors: [["Navy", "#1D2840"], ["Court", "#4C6A8A"], ["Cream", "#F4EFE3"]], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "cap", name: "The Club Cap", price: 69, status: "soon", art: "cap",
    blurb: "Six-panel club cap with the Different D embroidered in navy and a brass-stitched strap. One size.",
    colors: [["Brass", "#9C7A45"], ["Ball", "#E2D2A6"], ["Navy", "#1D2840"]], sizes: [] },
  { id: "cover", name: "The Clubhouse Paddle Cover", price: 79, status: "soon", art: "cover",
    blurb: "Padded navy sleeve with the Different D stitched in brass. Fits standard paddles.",
    colors: [["Brass", "#9C7A45"], ["Court", "#4C6A8A"]], sizes: [] },
  { id: "towel", name: "Courtside Towel", price: 45, status: "soon", art: "towel",
    blurb: "Quick-dry microfibre with a fine heritage stripe. Clips to your bag.",
    colors: [["Cream", "#F4EFE3"], ["Brass", "#9C7A45"]], sizes: [] },
  { id: "balls", name: "Club Balls · 3 pack", price: 35, status: "soon", art: "balls",
    blurb: "Outdoor balls stamped with the Dink Different crest. Play well.",
    colors: [["Ball", "#E2D2A6"], ["Brass", "#9C7A45"]], sizes: [] },
  { id: "stickers", name: "Dinker Sticker Pack", price: 15, status: "soon", art: "stickers",
    blurb: "Six waterproof stickers for paddles, bottles and laptops.",
    colors: [], sizes: [] },
  { id: "bottle", name: "Kitchen Line Bottle", price: 65, status: "soon", art: "bottle",
    blurb: "Insulated steel, keeps water cold through four hours of open play.",
    colors: [["Court", "#4C6A8A"], ["Cream", "#F4EFE3"]], sizes: [] },
];

// The 20: the numbered 1-of-1 edition. Only 20 are ever made (the server hands out Nº 01-20).
// "extra" is added to the shirt price, in QAR.
window.EDITION = { name: "The 20", cap: 20, extra: 60 };

// The Court Set (women's): fitted polo with an open contrast collar + pleated tennis skirt.
window.SET = {
  name: "The Court Set",
  price: 249,
  status: "preorder",
  leadTime: "Made to order. Ready in about 3 weeks.",
  fits: ["Women’s fit"],
  prints: [["name", "Name on back"], ["social", "Courtside Social"], ["plain", "No name"]],
  sizes: ["XS", "S", "M", "L", "XL"],
  specs: [
    ["Courtside Social print", "Optional: three line-drawn balls inside an arch of type across the back of the top."],
    ["Open Johnny collar", "A contrast collar that lies flat and frames the neckline, with fine tipping."],
    ["Fitted, not tight", "Princess seams and a curved hem that sits just over the skirt’s waistband."],
    ["Pleated court skirt", "Box pleats that move with you, a tipped hem and built-in shorts with a ball pocket."],
    ["Quick-dry knit", "Light, breathable and made for long Doha nights on court."],
  ],
  sizeChart: { XS: 42, S: 45, M: 48, L: 51, XL: 54 },
};
