document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded.");
  const iframe = document.getElementById('popup-frame');
  console.log("loading receipts...");
  
  //Back arrow functionality
  loadBackArrow();
  loadReceipts();
});

function loadBackArrow() {
  const backArrow = document.getElementById("back-button");
  backArrow.addEventListener("click", function () {
    const receiptsContainer = document.getElementById('receipts-container');
    if (receiptsContainer.className === "receipt-view") {
      window.location.href = '../html/receipts.html';
    } else {
      console.log("Returning to main menu...");
      window.location.href = "../popup.html";
    }
  });
}

function loadReceipts() {
  const receiptsContainer = document.getElementById('receipts-container');
  browser.storage.local.get('receipts', function(data) {
      const receipts = data.receipts;
      if (receipts && receipts.length > 0) {
          displayReceipts(receipts, receiptsContainer);
      } else {
          receiptsContainer.textContent = 'No receipts to display';
      }
  });
}

function displayReceipts(receipts, container) {
  container.innerHTML = ''; // Clear the loading message or previous content
  const title = document.createElement('div');
  title.className = 'receipts-title';
  title.textContent = `Receipts (${receipts.length})`;
  container.appendChild(title);
  receipts.forEach((receipt, index) => {
      // Create elements for each receipt and append to the container
      const receiptElement = document.createElement('div');
      receiptElement.className = 'receipt menu-item';
      receiptElement.style.top = `${index * 25}%`;

      const totalCostElement = document.createElement('div');
      totalCostElement.className = 'receipt-total';
      totalCost = receipt.total;
      totalCostElement.textContent = `Total: $${totalCost}`;

      const receiptDateElement = document.createElement('div');
      receiptDateElement.className = 'receipt-date';
      receiptDate = receipt.date;
      receiptDateElement.textContent = `Date: ${receiptDate}`;

      receiptElement.appendChild(totalCostElement);
      receiptElement.appendChild(receiptDateElement);
      
      container.appendChild(receiptElement);

      receiptElement.addEventListener('click', function() {
          // Open the receipt page
          console.log(`Opening receipt ${index}...`);
          container.innerHTML = '';
          displayReceipt(receipt, container);
      });
  });
}

function displayReceipt(receipt, container) {
  container.className = 'receipt-view';
  const receiptElement = document.createElement('div');
  receiptElement.className = 'receipt';
  receipt.items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'receipt-item';
      itemElement.textContent = `${item.name} x${item.quantity} $${item.price}`;
      receiptElement.appendChild(itemElement);
  });
  const totalCostElement = document.createElement('div');
  totalCostElement.className = 'receipt-total';
  totalCost = receipt.total;
  totalCostElement.textContent = `Total: $${totalCost}`;
  receiptElement.appendChild(totalCostElement);

  const receiptDateElement = document.createElement('div');
  receiptDateElement.className = 'receipt-date';
  receiptDate = receipt.date;
  receiptDateElement.textContent = `Date: ${receiptDate}`;
  receiptElement.appendChild(receiptDateElement);

  const receiptStoreElement = document.createElement('div');
  receiptStoreElement.className = 'receipt-store';
  receiptStore = receipt.store;
  receiptStoreElement.textContent = `Store: ${receiptStore}`;
  receiptElement.appendChild(receiptStoreElement);

  container.appendChild(receiptElement);
}