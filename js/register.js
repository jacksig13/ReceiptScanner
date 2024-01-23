document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  handleSubmitButton(loginForm);
});

function handleSubmitButton(loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email-box").value;
    const username = document.getElementById("username-box").value;
    const password = document.getElementById("password-box").value;
    try {
      await validateCredentials(username, email, password);
      window.location.href = "../popup.html";
      browser.storage.local.set({'needLogin': false});
      browser.storage.local.set({'firstInstall': false});
    } catch (error) {
      console.error('Error during login:', error);
      showNotification(error.message);
      return;
    }
  });
}

function showNotification(message) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/icon.png"),
    "title": "Login Status",
    "message": message
  });
}


function validateCredentials(username, email, password) {
  return new Promise((resolve, reject) => {
    fetch('https://kcihcpi7if.execute-api.us-east-2.amazonaws.com/default/OpenAI_APIHandler', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request: 'register',
            username: username,
            email: email,
            password: password
        })
    })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json(); // Parse the response as JSON
  })
  .then(data => {
      if (data.success) {
          // Extract the token from the response
          const token = data.token;
          // Store token in local storage
          browser.storage.local.set({ 'sessionToken': token }).then(() => {
              // Continue with your logic after successful token storage
              resolve();
          }, error => {
              throw error;
          });
      } else {
          // Handle unsuccessful login
          throw new Error(data.message || 'Login failed');
      }
  })
    .catch(error => {
      console.error('Error:', error);
      reject(error);
    });
  });
}
