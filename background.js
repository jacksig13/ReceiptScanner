// background.js

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("This is a first install!");
    browser.storage.local.set({'firstInstall': true });
    // Additional actions on first install (e.g., opening a welcome page)
  }
});

// Check on startup if this is the first run after installation
browser.runtime.onStartup.addListener(() => {
  browser.storage.local.get('sessionToken', function(data) {
    if(!data.sessionToken) {
      console.log("Session token missing or expired.");
      browser.storage.local.set({'needLogin': true});
      //browser.tabs.create({ url: browser.runtime.getURL("./html/login.html") });
    }
  });
});

// Check for session token on extension startup
browser.runtime.onStartup.addListener(() => {
  browser.storage.local.get('sessionToken', function(data) {
    if(data.sessionToken) {
      // User is logged in, proceed with session token
    } else {
      // Prompt for login
    }
  });
});
