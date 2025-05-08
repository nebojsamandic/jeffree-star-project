document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("header-container");
  
    fetch("header.html")
      .then(res => res.text())
      .then(html => {
        container.innerHTML = html;
  
        const toggle = document.getElementById("menu-toggle");
        const navMenu = document.getElementById("nav-menu");
  
        if (toggle && navMenu) {
          toggle.addEventListener("click", () => {
            navMenu.classList.toggle("mobile-hidden");
          });
        }
      });
  });
  