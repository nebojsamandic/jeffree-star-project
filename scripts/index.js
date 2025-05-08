  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('mobile-hidden');
  });

// Search/ grid feature
const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const productsSection = document.getElementById("recommended-products");

function renderRecommended(products) {
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" />
      <p><strong>${product.name}</strong></p>
      <p>${product.approved ? "✔ Approved by Jeffree Star" : "❌ Not Approved"}</p>
      <p class="quote">${product.description || "No description yet."}</p>
    `;

    // 🔥 This line adds the click behavior to open the modal
    card.addEventListener("click", () => openModal(product));

    grid.appendChild(card);
  });
}

fetch("https://jeffree-api-sky.fly.dev/products")
  .then(res => res.json())
  .then(data => {
    const recommended = data.filter(p => String(p.recommended) === "true");
    console.log("Recommended products:", recommended);   // ✅ Then log
    renderRecommended(recommended);                      // ✅ Then render
  })
  .catch(err => {
    grid.innerHTML = "<p>Failed to load recommended products.</p>";
    console.error(err);
  });


// Hide recommendations on typing
searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  productsSection.style.display = value ? "none" : "block";
});


const modal = document.getElementById("product-modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalBrand = document.getElementById("modal-brand");
const modalDescription = document.getElementById("modal-description");
const modalClose = document.getElementById("modal-close");

function openModal(product) {
  modalImage.src = product.imageUrl;
  modalName.textContent = product.name;
  modalBrand.textContent = product.brand;
  modalDescription.textContent = product.description || "No description yet.";
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
