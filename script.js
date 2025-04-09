let cardWidth = 63;
let cardHeight = 88;

document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

function applyCardSize() {
  cardWidth = parseFloat(document.getElementById("cardWidth").value);
  cardHeight = parseFloat(document.getElementById("cardHeight").value);
  layoutCards(window.uploadedFiles || []);
}

function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  window.uploadedFiles = files;
  layoutCards(files);
}

function layoutCards(files) {
  const container = document.getElementById("canvasContainer");
  container.innerHTML = "";

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("card");
      img.style.width = `${cardWidth}mm`;
      img.style.height = `${cardHeight}mm`;
      container.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function generatePDF() {
  const element = document.getElementById("canvasContainer");
  const opt = {
    margin: [10, 10], // 上下左右マージン（mm）
    filename: 'card_layout.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}
