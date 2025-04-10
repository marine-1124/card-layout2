function downloadPDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const widthMM = getCurrentWidth();
  const heightMM = getCurrentHeight();
  const widthPt = mmToPt(widthMM);
  const heightPt = mmToPt(heightMM);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginBetween = mmToPt(2); // カード間のマージン

  const totalCardWidth = widthPt * 3 + marginBetween * 2;
  const startX = (pageWidth - totalCardWidth) / 2;
  const startY = 40;

  const images = document.querySelectorAll(".card-slot img");
  let x = startX;
  let y = startY;
  let count = 0;

  images.forEach((img) => {
    if (img.src && img.style.display !== "none") {
      doc.addImage(img.src, "PNG", x, y, widthPt, heightPt);
    }
    count++;
    if (count % 3 === 0) {
      x = startX;
      y += heightPt + marginBetween;
    } else {
      x += widthPt + marginBetween;
    }
  });

  doc.save("cards.pdf");
}
