// content.js
import './styles/contentStyles.css';

// Function to check if the current page is a 'Checkout' page
function checkForCheckoutPage() {
  // Example: Check if the URL contains the word 'checkout'
  let bodyText = document.body.innerText.toLowerCase();
  if (window.location.href.match(/checkout|buy|purchase|payment/i) || bodyText.includes('checkout')) {
    // If it's a checkout page, send a message to the background script
    console.log('Checkout page detected.');
    showSaveReceiptPopup();
  }
}

// Function to show a modal popup
function showSaveReceiptPopup() {
  if (document.getElementById('receiptScannerModal')) {
    return; // Modal already exists
  }
  
  // Create the modal container
  var modal = document.createElement('div');
  modal.id = 'receiptScannerModal';

  // Add text to the modal
  var title = document.createElement('div');
  title.id = 'notification-title';
  title.textContent = 'Checkout Page Detected!';
  modal.appendChild(title);
  var message = document.createElement('div');
  message.id = 'notification-message';
  message.textContent = 'Do you want to save the receipt?';
  modal.appendChild(message);

  //Add buttons to the modal as divs
  var buttonContainer = document.createElement('div');
  buttonContainer.id = 'notification-buttons';
  modal.appendChild(buttonContainer);

  // Add 'Yes' button
  var yesButton = document.createElement('div');
  yesButton.id = 'yes';
  yesButton.className = 'button';
  yesButton.textContent = 'Yes';
  buttonContainer.appendChild(yesButton);

  // Add 'No' button
  var noButton = document.createElement('div');
  noButton.id = 'no';
  noButton.className = 'button'
  noButton.textContent = 'No';
  buttonContainer.appendChild(noButton);

  // Append the modal to the body
  setTimeout(() => {
    document.body.appendChild(modal);
  }, 1000);
  console.log('Modal created.');
  modal.offsetHeight; // Force the browser to recalculate the modal's styles
  setEventListeners(yesButton, noButton, modal);
}

function setEventListeners(yesButton, noButton, modal) {
  yesButton.addEventListener('click', function() {
    console.log('Saving receipt...');
    processCheckoutPage();
    //getUUID(processCheckoutPage);
    document.body.removeChild(modal); // Close the modal
  });
  noButton.addEventListener('click', function() {
    console.log('Receipt save cancelled.');
    document.body.removeChild(modal); // Close the modal
  });
}

function minifyString(str) {
  return str.replace(/\s+/g, ' ').trim();
}

function processCheckoutPage() {
  let bodyText = document.body.innerText.toLowerCase();
  var gpt_prompt = 'I would like you to parse this data from a checkout page for me. The data I want is the following: \n\n';
  gpt_prompt += '1. Each individual item in the order, including the name, quantity, and price. \n';
  gpt_prompt += '2. The total price of the order. \n';
  gpt_prompt += '3. The name of the store. \n';
  const minifiedPrompt = minifyString(bodyText);
  gpt_prompt += minifiedPrompt;
  console.log(gpt_prompt);
  // Script to get the UUID from storage for lambda function verification using DynamoDB
  browser.storage.local.get(['extensionUUID'], function(result) {
    if (result.extensionUUID) {
        // Use the UUID
        console.log('UUID:', result.extensionUUID);
    }
  });

  fetch('${SERVER_PROXY_URL}', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          prompt: gpt_prompt  // Replace with the actual prompt
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.text(); // Get the response as text first
  })
  .then(text => {
      console.log("Raw response text:", text);
      try {
          const jsonResponse = JSON.parse(text); // Parse the text as JSON
  
          // Access the nested 'content' field
          const contentData = jsonResponse.choices && jsonResponse.choices.length > 0
              ? jsonResponse.choices[0].message.content
              : null;
  
          if (contentData) {
              // Process this content data further as needed
              console.log("Extracted content:", contentData);
              // For CSV conversion, you might need to parse this content string to extract structured data
              // This parsing will depend on how you want to structure your CSV and the format of 'contentData'
              const items = parseContentData(contentData);
              saveReceiptData(items);
              const csvData = convertDataToCSV(items);
              downloadCSV(csvData, 'checkout_data.csv');
              getReceiptData();
          } else {
              throw new Error('Content data not found in response');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          throw new Error('Error parsing JSON: ' + error.message);
        }
  })
  .catch(error => console.error('Error:', error));
}

function convertDataToCSV(parsedData) {
  const csvRows = [];
  const headers = ['Item Name', 'Quantity', 'Price'];
  csvRows.push(headers.join(','));

  for (const item of parsedData.items) {
      csvRows.push(`"${item.name}","${item.quantity}","${item.price}"`);
  }

  // Add total, store, and date
  csvRows.push(`\n"Total Price","${parsedData.total}"`);
  csvRows.push(`"Store Name","${parsedData.store}"`);
  csvRows.push(`"Date","${parsedData.date}"`);

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

function parseContentData(contentData) {
  const items = [];
  const itemRegex = /- Name: (.+?)\n\s+- Quantity: (\d+)\n\s+- Price: \$(\d+\.\d+)/g;
  const totalRegex = /The total price of the order: \$(\d+\.\d+)/;
  const storeRegex = /The name of the store: (.+)/;
  const date = new Date().toLocaleDateString(); // Assuming the date is the current date
  let match;

  while ((match = itemRegex.exec(contentData)) !== null) {
      items.push({
          name: match[1].trim(),
          quantity: match[2].trim(),
          price: match[3].trim()
      });
  }

  const totalMatch = totalRegex.exec(contentData);
  const storeMatch = storeRegex.exec(contentData);

  const total = totalMatch ? totalMatch[1] : "N/A";
  const store = storeMatch ? storeMatch[1].trim() : "N/A";

  return { items, total, store, date };
}

function saveReceiptData(parsedData) {
  const key = 'receipts';
  browser.storage.local.get([key], function(result) {
      const receipts = result[key] ? result[key] : [];
      receipts.push(parsedData);
      browser.storage.local.set({[key]: receipts}, function() {
          console.log('Receipt data saved locally.');
      });
  });
}

function getReceiptData() {
  browser.storage.local.get(['receipts'], function(result) {
      if (result.receipts) {
          console.log('Retrieved receipt data:', result.receipts);
          // Process or display this data as needed
      }
  });
}

checkForCheckoutPage();