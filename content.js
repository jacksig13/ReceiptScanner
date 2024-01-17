'Placeholder file for when content scripts are added'
// content.js

// Function to check if the current page is a 'Checkout' page
function checkForCheckoutPage() {
  // Example: Check if the URL contains the word 'checkout'
  let bodyText = document.body.innerText.toLowerCase();
  if (window.location.href.match(/checkout|cart|purchase|payment/i) || bodyText.includes('checkout')) {
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
  yesButton.onclick = function() {
      console.log('Saving receipt...');
      // Add your logic to handle the 'Yes' action
      document.body.removeChild(modal); // Close the modal
  };
  buttonContainer.appendChild(yesButton);

  // Add 'No' button
  var noButton = document.createElement('div');
  noButton.id = 'no';
  noButton.className = 'button'
  noButton.textContent = 'No';
  noButton.onclick = function() {
      console.log('Receipt save cancelled.');
      document.body.removeChild(modal); // Close the modal
  };
  buttonContainer.appendChild(noButton);

  // Append the modal to the body
  setTimeout(() => {
    document.body.appendChild(modal);
  }, 1000);
  console.log('Modal created.');
  modal.offsetHeight; // Force the browser to recalculate the modal's styles
}

checkForCheckoutPage();