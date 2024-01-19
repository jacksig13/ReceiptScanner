document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded.");
  const iframe = document.getElementById('popup-frame');

  const viewReceiptsButton = document.getElementById("view-receipts");
  viewReceiptsButton.addEventListener("click", function () {
    // Open the receipts page
    console.log("Opening receipts page...");
    window.location.href = "../html/receipts.html";
  });
  
  // Function to open the menu (you can customize this)


});
