// Edit this file to add real batches. Each QR code points to batch.html?id=<BATCH ID>
// All numbers below are EXAMPLE / PROTOTYPE data until BUET lab results are available.
window.BATCHES = {
  "PP-0001": {
    demo: true,
    status: "Prototype batch · pending BUET lab validation",
    sourceFactory: "Factory A",
    plasticType: "LDPE",
    acceptedKg: 900,
    productionDate: "Add date",
    areaSqFt: 500,
    composition: { "Recycled PE": "1.80 kg / sq ft", "Sand": "4.20 kg / sq ft", "Basalt fibre": "0.03 kg / sq ft" },
    tests: [
      { name: "Compressive strength", target: "≥ 20 MPa", result: "21.0 MPa (example)" },
      { name: "Water absorption", target: "< 1.5%", result: "1.2% (example)" },
      { name: "UV & temperature durability", target: "Pass", result: "To be tested" }
    ],
    loadClass: "Light traffic: pedestrian paths, courtyards, driveways",
    qc: "Inspection recorded",
    recoveredKg: 900
  }
};
