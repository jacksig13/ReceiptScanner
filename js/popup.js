document.addEventListener("DOMContentLoaded", function () {
  browser.storage.local.get(['sessionToken', 'firstInstall'], function(data) {
    if(data.firstInstall || !data.sessionToken) {
      console.log("User needs to log in.");
      window.location.href = '../html/login.html';
    }
  });
  console.log("DOM content loaded.");

  const viewReceiptsButton = document.getElementById("view-receipts");
  viewReceiptsButton.addEventListener("click", function () {
    // Open the receipts page
    console.log("Opening receipts page...");
    window.location.href = "./html/receipts.html";
  });
  
  // Function to open the menu (you can customize this)


});
