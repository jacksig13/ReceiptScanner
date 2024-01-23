# ReceiptScanner
Browser extension for scanning online receipts automatically via the 'Checkout' page, and storing them in a designated folder.

## Features
1. User Accounts
    - Account Registration and Login: Users can easily create an account and log in, ensuring their receipt data is personalized and secure.
    - Secure Authentication: Utilizes secure authentication mechanisms (JWT) to protect user data along with the openAI endpoint.

2. Receipt Scanning and Processing
    - Automatic Receipt Extraction: Efficiently scans and extracts data from checkout pages.
    - Intelligent Parsing: Utilizes advanced algorithms to parse and interpret receipt information accurately.

3. Data Storage and Retrieval
    - Cloud-based Storage: Receipts are securely stored on the cloud, allowing users to access them from any device.
    - Local Storage Backup: Receipts are also stored locally for quick access and offline availability.

4. Receipt Management
    - Organized Display of Receipts: Users can view their saved receipts in an organized manner.
    - Easy Access to Receipt History: Provides quick access to historical receipt data.

5. Security and Privacy
    - Data Hasing: Implements data hashing on the server side to ensure the confidentiality and integrity of user information.
    - Privacy-focused: Designed with user privacy in mind, ensuring that sensitive data is handled responsibly.

6. Server-side Processing
    - AWS Integration: Leverages Amazon Web Services for robust and scalable backend processing.
    - Efficient Data Handling: Server-side architecture optimized for efficient handling of receipt data.

7. (COMING SOON) Customizable User Experience
    - User Preferences (COMING SOON): Allows users to customize settings according to their preferences.
    - Responsive Design: Crafted for a seamless experience across various browsers and devices.

8. Extension Updates
    - Regular Updates: The extension is regularly updated with new features and improvements.
    - Easy Update Process (COMING SOON): Users can easily update the extension to the latest version for an enhanced experience.

## Installation
1) Download the code in zip format or using 'git clone https://github.com/jacksig13/ReceiptScanner.git' in your desired directory
2) Install required dependencies with the command 'npm install'
3) Build the project with Webpack with the command 'npx webpack'
4) Use the 'bundle.js' file to load the extension as a temporary add-on in your desired browser

## Goals/TODO
1) Add functionality for scanning websites for the 'Checkout' page and log items/prices and total with tax.
    - Implement popup message asking users if they would like to save the detected receipt (DONE)
    - Implement functionality for parsing webpage and exporting all individual items/prices/quantities, as well as the total price, date, and seller. (DONE)
    - Implement 'Auto Log' checkbox to allow auto-saving of receipts without the popup message

2) Add functionality to menu buttons 
    - 'View Receipts': Opens view receipt menu, where data is loaded from the backend database (DONE)
    - 'Upload Receipts': Upload other receipts to extension (non-online receipts)
    - 'Settings': Open separate menu for choosing settings (possible settings TBD)
    - 'FAQ': Open FAQ menu with drop down menus for each question

3) Format received data to be outputted in CSV and PDF format. (CSV DONE)

4) Allow users to change the desired output folder (and/or store locally within the extension)

## Possible Future Improvements
1. Points system similar to 'Fetch' or 'Pogo'

