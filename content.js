// content.js
import './styles/contentStyles.css';
import {processCheckoutPage} from './js/process_checkout.js';

// Function to check if the current page is a 'Checkout' page
function checkForCheckoutPage() {
  // Example: Check if the URL contains the word 'checkout'
  let bodyText = document.body.innerText.toLowerCase();
  if (window.location.href.match(/checkout|buy|purchase|payment|order/i)) {
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
    handleYesButtonClick(modal);
  });
  noButton.addEventListener('click', function() {
    console.log('Receipt save cancelled.');
    document.body.removeChild(modal); // Close the modal
  });
}


async function handleYesButtonClick(modal) {
  while(modal.firstChild) {
    modal.removeChild(modal.firstChild);
  }
  var savingMessage = document.createElement('div');
  savingMessage.id = 'saving-message';
  savingMessage.textContent = 'Saving receipt...';
  modal.appendChild(savingMessage);

  try {
    await processCheckoutPage();
    // This code runs after processCheckoutPage completes
    savingMessage.textContent = 'Receipt saved!';
    setTimeout(function() {
        document.body.removeChild(modal); // Close the modal after 2 seconds
    }, 2000);
  } catch (error) {
      savingMessage.textContent = 'Error saving receipt.';
      // Handle any errors here
      console.error("Error processing checkout page:", error);
  }
}

checkForCheckoutPage();