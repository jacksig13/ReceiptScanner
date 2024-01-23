export async function processCheckoutPage() {
  try {
    const sessionToken = await getSessionToken();
    return new Promise((resolve, reject) => {
      let bodyText = document.body.innerText.toLowerCase();
      var gpt_prompt = 'I would like you to parse this data from a checkout page for me. The data I want is the following: \n\n';
      gpt_prompt += '1. Each individual item in the order, including the name, quantity, and price. (Formatted as "Name:", "Quantity:" and "Price:" in your response) \n';
      gpt_prompt += '2. The total price of the order. (Please refer to this as: "Total Price:" in your response)\n';
      gpt_prompt += '3. The name of the store. (Please refer to this as: "Store Name:" in your response)\n';
      const minifiedPrompt = minifyString(bodyText);
      gpt_prompt += minifiedPrompt;
      console.log(gpt_prompt);

      fetch('https://kcihcpi7if.execute-api.us-east-2.amazonaws.com/default/OpenAI_APIHandler', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionToken
          },
          body: JSON.stringify({
              request: 'openai',
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
                  console.log("Parsed content:", items);
                  saveReceiptDataBrowser(items);

                  handleServerStoreRequest(items);
                  //const csvData = convertDataToCSV(items);
                  //downloadCSV(csvData, 'checkout_data.csv');
              } else {
                  throw new Error('Content data not found in response');
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
              throw new Error('Error parsing JSON: ' + error.message);
            }
          resolve();
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error getting session token:', error);
  }
}

function minifyString(str) {
  return str.replace(/\s+/g, ' ').trim();
}

function parseContentData(contentData) {
  const items = [];
  const itemRegex = /- Item \d+:\s+- Name: ([\s\S]+?)\s+- Quantity: (\d+)\s+- Price: \$([\d.]+)/g;
  const totalRegex = /Total Price: \$(\d+\.\d+)/;
  const storeRegex = /Store Name: (.+)/;
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

function saveReceiptDataBrowser(parsedData) {
  const key = 'receipts';
  browser.storage.local.get([key], function(result) {
      const receipts = result[key] ? result[key] : [];
      receipts.push(parsedData);
      browser.storage.local.set({[key]: receipts}, function() {
          console.log('Receipt data saved locally.');
      });
  });
}

async function getSessionToken() {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(['sessionToken'], function(result) {
      if (result.sessionToken) {
        resolve(result.sessionToken);
      } else {
        reject(new Error('Session token not found'));
      }
    });
  });
}

async function sendReceiptToServer(receipt) {
  try {
    const sessionToken = await getSessionToken();
    return new Promise((resolve, reject) => {
      fetch('https://kcihcpi7if.execute-api.us-east-2.amazonaws.com/default/OpenAI_APIHandler', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionToken
          },
          body: JSON.stringify({
              request: 'storeReceipt',
              receipt: receipt  // Replace with the actual prompt
          })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.text(); // Get the response as text first
      })
      .then(data => {
          console.log("Raw response text:", data);
          try {
              const jsonResponse = JSON.parse(data);
              if (jsonResponse.message === "Receipts stored successfully") {
                  console.log("Successfully saved receipt to server.");
              } else {
                  // Handle any other server response appropriately
                  console.error('Server returned an unexpected message:', jsonResponse.message);
              }
          } catch (error) {
              console.error('Error parsing JSON:', error);
              throw new Error('Error parsing JSON: ' + error.message);
          }
          resolve();
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error getting session token:', error);
  }
}

async function handleServerStoreRequest(receipt) {
  try {
      await sendReceiptToServer(receipt);
  } catch (error) {
    console.error('Error during receipt saving:', error);
    showNotification(error.message);
    return;
  }
}

function showNotification(message) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/icon.png"),
    "title": "Login Status",
    "message": message
  });
}