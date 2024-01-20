export function processCheckoutPage() {
  return new Promise((resolve, reject) => {
    let bodyText = document.body.innerText.toLowerCase();
    var gpt_prompt = 'I would like you to parse this data from a checkout page for me. The data I want is the following: \n\n';
    gpt_prompt += '1. Each individual item in the order, including the name, quantity, and price. \n';
    gpt_prompt += '2. The total price of the order. (Please refer to this as: Total Price)\n';
    gpt_prompt += '3. The name of the store. (Please refer to this as: Store Name)\n';
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

    fetch('https://kcihcpi7if.execute-api.us-east-2.amazonaws.com/default/OpenAI_APIHandler', {
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
                console.log("Parsed content:", items);
                saveReceiptDataBrowser(items);
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
}

function minifyString(str) {
  return str.replace(/\s+/g, ' ').trim();
}

function parseContentData(contentData) {
  const items = [];
  const itemRegex = /- Name: (.+?)\n\s+- Quantity: (\d+)\n\s+- Price: \$(\d+\.\d+)/g;
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