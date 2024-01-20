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

function loadExport() {
  const exportText = document.getElementById('export-text');
  exportText.addEventListener('click', function() {
      browser.storage.local.get('receipts', function(data) {
          const receipts = data.receipts;
          if (receipts && receipts.length > 0) {
              const csvData = convertAllReceiptsToCSV(receipts);
              downloadCSV(csvData, 'receipts.csv');
          }
      });
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

function convertAllReceiptsToCSV(receipts) {
  const csvRows = [];
  const headers = ['Receipt Number', 'Item Name', 'Quantity', 'Price'];
  csvRows.push(headers.join(','));

  receipts.forEach((receipt, receiptIndex) => {
      receipt.items.forEach(item => {
          csvRows.push(`"${receiptIndex + 1}","${item.name}","${item.quantity}","${item.price}"`);
      });

      // Add total, store, and date for each receipt
      csvRows.push(`,"Total Price","${receipt.total}"`);
      csvRows.push(`,"Store Name","${receipt.store}"`);
      csvRows.push(`,"Date","${receipt.date}"`);
      csvRows.push(""); // Adds an empty row for separation
  });

  return csvRows.join('\n');
}



function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/*
Structure:
<div id="receipts-container">
  <div class="receipts-title">Receipts (2)</div>
  <div id="receipts-inner-container">
    <div class="receipt-preview">
      <div class="receipt-preview-inner">
        <div class="receipt-total">Total: $10.00</div>
        <div class="receipt-date">Date: 1/1/2020</div>
      </div>
    </div>
  </div>
  <div class="receipts-footer">
    <p id="export-text">Export all receipts as CSV</p>
  </div>
</div>
*/
function displayReceipts(receipts, container) {
  container.innerHTML = ''; // Clear the loading message or previous content
  const title = document.createElement('div');
  title.className = 'receipts-title';
  title.textContent = `Receipts (${receipts.length})`;
  container.appendChild(title);

  const receiptInnerContainer = document.createElement('div');
  receiptInnerContainer.id = 'receipts-inner-container';
  container.appendChild(receiptInnerContainer);

  const footer = document.createElement('div');
  footer.className = 'receipts-footer';
  const exportText = document.createElement('p');
  exportText.id = 'export-text';
  exportText.textContent = 'Export all receipts as CSV';
  footer.appendChild(exportText);
  container.appendChild(footer);
  loadExport();

  receipts.forEach((receipt, index) => {
      // Create elements for each receipt and append to the container
      // The receipt preview will be a div with the total cost and date
      const receiptPreview = document.createElement('div');
      receiptPreview.className = 'receipt-preview';
      receiptPreview.style.top = `${(index * 25)}%`;

      // The receipt preview inner will be a div with the total cost and date
      const receiptPreviewInner = document.createElement('div');
      receiptPreviewInner.className = 'receipt-preview-inner';
      if (index !== receipts.length - 1) {
          receiptPreviewInner.style.borderBottom = '1px solid #000';
      }
      receiptPreview.appendChild(receiptPreviewInner);

      // 
      const totalCostElement = document.createElement('div');
      totalCostElement.className = 'receipt-total';
      totalCost = receipt.total;
      totalCostElement.textContent = `Total: $${totalCost}`;

      const receiptDateElement = document.createElement('div');
      receiptDateElement.className = 'receipt-date';
      receiptDate = receipt.date;
      receiptDateElement.textContent = `Date: ${receiptDate}`;

      receiptPreviewInner.appendChild(totalCostElement);
      receiptPreviewInner.appendChild(receiptDateElement);
      
      receiptInnerContainer.appendChild(receiptPreview);

      receiptPreview.addEventListener('click', function() {
          // Open the receipt page
          console.log(`Opening receipt ${index}...`);
          displayReceipt(receipt, container);
      });
  });
}

function displayReceipt(receipt, container) {
  container.innerHTML = '';
  container.className = 'receipt-view';
  const receiptElement = document.createElement('div');
  receiptElement.className = 'receipt';
  receipt.items.forEach(item => {
      const itemElement = document.createElement('p');
      itemElement.className = 'receipt-item';
      itemElement.textContent = `${item.name} x${item.quantity} $${item.price}`;
      receiptElement.appendChild(itemElement);
  });

  const totalCostElement = document.createElement('p');
  totalCostElement.className = 'receipt-total';
  totalCost = receipt.total;
  totalCostElement.textContent = `Total: $${totalCost}`;
  receiptElement.appendChild(totalCostElement);

  const receiptDateElement = document.createElement('p');
  receiptDateElement.className = 'receipt-date';
  receiptDate = receipt.date;
  receiptDateElement.textContent = `Date: ${receiptDate}`;
  receiptElement.appendChild(receiptDateElement);

  const receiptStoreElement = document.createElement('p');
  receiptStoreElement.className = 'receipt-store';
  receiptStore = receipt.store;
  receiptStoreElement.textContent = `Store: ${receiptStore}`;
  receiptElement.appendChild(receiptStoreElement);

  container.appendChild(receiptElement);
}