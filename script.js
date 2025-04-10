const { jsPDF } = window.jspdf;

// mm to pt conversion
function mmToPt(mm) {
  return mm * 2.83465;
}

const cardGrid = document.getElementById("cardGrid");

// カードサイズを設定
function createSlots(widthMM, heightMM) {
  cardGrid.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement("div");
    slot.className = "card-slot";
    slot.style.width = `${widthMM}mm`;
    slot.style.height = `${heightMM}mm`;

    const img = document.createElement("img");
    img.style.display = "none";
    slot.appendChild(img);

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
          img.style.display = "block";
          if (document.getElementById("applyToAll").checked) {
            // チェックされている場合、すべてのカードに同じ画像を適用
            document.querySelectorAll(".card-slot img").forEach((image) => {
              image.src = e.target.result;
              image.style.display = "block";
            });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    slot.appendChild(input);

    // ドラッグ＆ドロップ
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("dragover");
    });
    slot.addEventListener("dragleave", () => {
      slot.classList.remove("dragover");
    });
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
          img.style.display = "block";
          if (document.getElementById("applyToAll").checked) {
            // チェックされている場合、すべてのカードに同じ画像を適用
            document.querySelectorAll(".card-slot img").forEach((image) => {
              image.src = e.target.result;
              image.style.display = "block";
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });

    cardGrid.appendChild(slot);
  }
}

function resetImages() {
  document.querySelectorAll(".card-slot img").forEach((img) => {
    img.src = "";
    img.style.display = "none";
  });
}

function downloadPDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const widthMM = getCurrentWidth();
  const heightMM = getCurrentHeight();
  const widthPt = mmToPt(widthMM);
  const heightPt = mmToPt(heightMM);
  const marginPt = mmToPt(5);
  const gapPt = mmToPt(3); // カード間の隙間

  const images = document.querySelectorAll(".card-slot img");
  let x = marginPt;
  let y = marginPt;
  let count = 0;

  const pageCount = parseInt(document.getElementById("pdfPageCount").value);
  const totalSlots = pageCount * 9;

  // 1ページに配置するカードの列数と行数を決定
  const columns = 3;
  const rows = 3;

  // PDFページごとのカード画像追加
  for (let i = 0; i < totalSlots; i++) {
    const img = images[i % 9]; // 9枚分繰り返し
    if (img.src && img.style.display !== "none") {
      doc.addImage(img.src, "PNG", x, y, widthPt, heightPt);
    }
    count++;
    x += widthPt + gapPt;

    if (count % columns === 0) {
      x = marginPt;
      y += heightPt + gapPt;
    }

    if (count % (columns * rows) === 0 && i < totalSlots - 1) { // 1ページに9枚×3行
      doc.addPage();
      x = marginPt;
      y = marginPt;
    }
  }

  // 最後に均等余白を確保するための調整
  const pageWidth = doc.internal.pageSize.getWidth();
  const totalWidth = columns * widthPt + (columns - 1) * gapPt;
  const leftOffset = (pageWidth - totalWidth) / 2;

  doc.save("cards.pdf");
}

function getCurrentWidth() {
  const sel = document.getElementById("sizeSelector").value;
  if (sel === "63x88") return 63;
  if (sel === "59x86") return 59;
  return parseFloat(document.getElementById("customWidth").value || 63);
}

function getCurrentHeight() {
  const sel = document.getElementById("sizeSelector").value;
  if (sel === "63x88") return 88;
  if (sel === "59x86") return 86;
  return parseFloat(document.getElementById("customHeight").value || 88);
}

// 初期設定
document.getElementById("sizeSelector").addEventListener("change", () => {
  const customFields = document.getElementById("customWidth").parentElement;
  if (document.getElementById("sizeSelector").value === "custom") {
    customFields.style.display = "block";
  } else {
    customFields.style.display = "none";
  }
});

// 初期化
createSlots(getCurrentWidth(), getCurrentHeight());
