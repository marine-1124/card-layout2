document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const saveButton = document.getElementById('save-pdf');
  const resetButton = document.getElementById('reset-images');
  const resizeSelect = document.getElementById('resize-options');
  const customSizeDiv = document.getElementById('custom-size');
  const customWidthInput = document.getElementById('custom-width');
  const customHeightInput = document.getElementById('custom-height');
  const cardContainer = document.getElementById('card-container');

  let cardImages = [];

  // ファイル選択で画像をアップロード
  fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          const reader = new FileReader();
          reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.classList.add('card-image');
            img.onload = function() {
              cardImages.push(img);
              renderImages();
            };
          };
          reader.readAsDataURL(file);
        } else {
          alert('JPEGまたはPNG画像のみ対応しています。');
        }
      });
    }
  });

  // 画像のグリッドを再描画
  function renderImages() {
    cardContainer.innerHTML = '';  // 現在の画像をクリア
    cardImages.forEach((img, index) => {
      const div = document.createElement('div');
      div.classList.add('card-item');
      div.appendChild(img);
      cardContainer.appendChild(div);
    });
  }

  // リサイズ選択肢変更時の処理
  resizeSelect.addEventListener('change', () => {
    const selectedSize = resizeSelect.value;
    cardImages.forEach(img => {
      if (selectedSize === '63x88') {
        img.style.width = '63mm';
        img.style.height = '88mm';
      } else if (selectedSize === '59x86') {
        img.style.width = '59mm';
        img.style.height = '86mm';
      } else if (selectedSize === 'custom') {
        customSizeDiv.style.display = 'block';
        const customWidth = customWidthInput.value;
        const customHeight = customHeightInput.value;
        if (customWidth && customHeight) {
          img.style.width = customWidth + 'mm';
          img.style.height = customHeight + 'mm';
        }
      }
    });
  });

  // PDF保存ボタン
  saveButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let xPos = 10, yPos = 10;
    const margin = 5;

    cardImages.forEach((card, index) => {
      const img = new Image();
      img.src = card.src;
      img.onload = function() {
        doc.addImage(img, 'PNG', xPos, yPos, 63, 88); // サイズは適宜調整

        if ((index + 1) % 3 === 0) {  // 3列ごとに改ページ
          doc.addPage();
          xPos = 10;
          yPos = 10;
        } else {
          xPos += 70;
        }
      };
    });

    doc.save('cards-layout.pdf');
  });

  // 画像リセットボタン
  resetButton.addEventListener('click', () => {
    cardImages = [];
    renderImages();
  });
});
