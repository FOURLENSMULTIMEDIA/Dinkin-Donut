// Merch catalogue. Edit names, prices (in QAR), colours and sizes here.
// "status": "available" | "preorder" | "soon"

// The Glaze Jersey: the featured product. Update specs to match your supplier.
window.JERSEY = {
  name: "The Glaze Jersey",
  price: 165,
  status: "preorder",
  leadTime: "Made to order. Ready in about 3 weeks.",
  fits: ["Men’s fit", "Women’s fit"],
  // Back print options
  prints: [["full", "Name + number"], ["name", "Name only"], ["plain", "Plain back"]],
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  specs: [
    ["Performance knit", "Lightweight, quick-dry fabric for Doha nights."],
    ["Full sublimation", "Colours are dyed into the fabric. They won't crack or peel."],
    ["Mesh side panels", "Airflow where you need it during long rallies."],
    ["Raglan sleeves", "Cut for a full swing, overheads included."],
  ],
  // Approximate chest width, laid flat (cm)
  sizeChart: { XS: 46, S: 49, M: 52, L: 55, XL: 58, "2XL": 61, "3XL": 64 },
};
// The Clubhouse Polo: second featured product.
window.POLO = {
  name: "The Clubhouse Polo",
  price: 145,
  status: "preorder",
  leadTime: "Made to order. Ready in about 3 weeks.",
  fits: ["Men’s fit", "Women’s fit"],
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  prints: [["name", "Embroidered name"], ["plain", "No name"]],
  specs: [
    ["Piqué knit", "Breathable, holds its shape after every wash."],
    ["Embroidered crest", "The bitten-ball mark, stitched on the chest."],
    ["Tipped collar", "Glaze and ball stripes on the collar and cuffs."],
    ["Court to café", "Smart enough for the clubhouse, light enough to play in."],
  ],
  sizeChart: { XS: 47, S: 50, M: 53, L: 56, XL: 59, "2XL": 62, "3XL": 65 },
};

window.MERCH = [
  { id: "tee", name: "Glazed Classic Tee", price: 89, status: "soon", art: "tee",
    blurb: "Heavyweight cotton, full-colour bitten-ball mark on the chest. Cut for court and café.",
    colors: [["Cream", "#FFF6EA"], ["Glaze", "#FF5FA2"], ["Choco", "#3B2416"]], sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { id: "hoodie", name: "Night Session Hoodie", price: 159, status: "soon", art: "hoodie",
    blurb: "For January nights in Doha when the breeze picks up. Brushed fleece, puff-print logo.",
    colors: [["Choco", "#3B2416"], ["Court", "#2F7A4F"], ["Cream", "#FFF6EA"]], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "cap", name: "Stay Glazed Cap", price: 69, status: "soon", art: "cap",
    blurb: "Six-panel dad cap with an embroidered donut and a lime under-brim. One size.",
    colors: [["Glaze", "#FF5FA2"], ["Ball", "#D7F03C"], ["Choco", "#3B2416"]], sizes: [] },
  { id: "cover", name: "Bite Club Paddle Cover", price: 79, status: "soon", art: "cover",
    blurb: "Padded neoprene sleeve with a bite cut out of the corner. Fits standard paddles.",
    colors: [["Glaze", "#FF5FA2"], ["Court", "#2F7A4F"]], sizes: [] },
  { id: "towel", name: "Sprinkle Court Towel", price: 45, status: "soon", art: "towel",
    blurb: "Quick-dry microfibre covered in sprinkles. Clips to your bag.",
    colors: [["Cream", "#FFF6EA"], ["Glaze", "#FF5FA2"]], sizes: [] },
  { id: "balls", name: "Glaze Balls · 3 pack", price: 35, status: "soon", art: "balls",
    blurb: "Outdoor balls stamped with the Dinkin' Donut mark. Sweet, then beaten.",
    colors: [["Ball", "#D7F03C"], ["Glaze", "#FF5FA2"]], sizes: [] },
  { id: "stickers", name: "Dinker Sticker Pack", price: 15, status: "soon", art: "stickers",
    blurb: "Six waterproof stickers for paddles, bottles and laptops.",
    colors: [], sizes: [] },
  { id: "bottle", name: "Kitchen Line Bottle", price: 65, status: "soon", art: "bottle",
    blurb: "Insulated steel, keeps water cold through four hours of open play.",
    colors: [["Court", "#2F7A4F"], ["Cream", "#FFF6EA"]], sizes: [] },
];
