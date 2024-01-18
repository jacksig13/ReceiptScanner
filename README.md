# ReceiptScanner
Browser extension for scanning online receipts automatically via the 'Checkout' page, and storing them in a designated folder.

## Goals/TODO
1) Add functionality for scanning websites for the 'Checkout' page and log items/prices and total with tax.
    - Implement popup message asking users if they would like to save the detected receipt (DONE)
    - Implement functionality for parsing webpage and exporting all individual items/prices/quantities, as well as the total price, date, and seller. (DONE)
    - Implement 'Auto Log' checkbox to allow auto-saving of receipts without the popup message

2) Add functionality to menu buttons 
    - 'View Receipts': Open designated storage folder (possibly open a separate menu within extension for a cleaner breakdown)
    - 'Upload Receipts': Upload receipts to a cloud location
    - 'Settings': Open separate menu for choosing settings (possible settings TBD)
    - 'FAQ': Open FAQ menu with drop down menus for each question

3) Format received data to be outputted in PDF format.

4) Allow users to change the desired output folder (and/or store locally within the extension)

## Possible Future Improvements
1. Points system similar to 'Fetch' or 'Pogo'

