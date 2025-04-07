// 画像を読み込む関数
function loadImage(event, cardNum) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const img = document.getElementById('image' + cardNum);
    img.src = e.target.result;
    img.style.display = 'block'; // 画像を表示
  };
  
  if (file) {
    reader.readAsDataURL(file);
  }
}

// PDF保存機能（仮実装）
function downloadPDF() {
  alert("PDF保存機能はまだ実装していません");
}

// 画像リセット
function resetImages() {
  const images = document.querySelectorAll('.card-image');
  images.forEach(img => {
    img.style.display = 'none';
    img.src = '';
  });
}

// カードサイズ変更
function resizeCards() {
  const size = document.getElementById("cardSize").value;
  const customSizeDiv = document.getElementById("customSize");
  
  if (size === "custom") {
    customSizeDiv.style.display = "block";
  } else {
    customSizeDiv.style.display = "none";
    setCardSize(size);
  }
}

function setCardSize(size) {
  let width, height;
  
  if (size === "63x88") {
    width = 63;
    height = 88;
  } else if (size === "59x86") {
    width = 59;
    height = 86;
  }

  const cards = document.querySelectorAll('.card-image');
  cards.forEach(card => {
    card.style.width = width + 'mm';
    card.style.height = height + 'mm';
  });
}
