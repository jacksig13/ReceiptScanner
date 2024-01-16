document.addEventListener("DOMContentLoaded", function () {
  // Add click event listener to the settings gear icon
  const settingsIcon = document.getElementById("settings-icon");
  settingsIcon.addEventListener("click", openMenu);
  
  // Function to open the menu (you can customize this)
  function openMenu() {
    // Add your menu logic here
    // You can create a menu using HTML/CSS or use a library like Bootstrap
    // For example:
    const menuContainer = document.createElement("div");
    menuContainer.style.position = "absolute";
    menuContainer.style.top = "30px";
    menuContainer.style.right = "10px";
    menuContainer.style.background = "white";
    menuContainer.style.padding = "10px";
    menuContainer.style.border = "1px solid #ccc";
    menuContainer.innerHTML = 
      <ul>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
      </ul>
    ;
    document.body.appendChild(menuContainer);
    
    // Add a click event listener to close the menu when clicked outside
    document.addEventListener("click", function (event) {
      if (!menuContainer.contains(event.target)) {
        menuContainer.remove();
      }
    });
  }
});
