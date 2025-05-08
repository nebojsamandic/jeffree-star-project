// Mobile menu toggle
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('mobile-hidden');
});

// Modal setup
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

// DOM references
const productGrid = document.getElementById("product-grid");
const sectionTitle = document.getElementById("product-section-title");
const searchInput = document.getElementById("search-input");

let allProducts = [];

// Create a product card
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" />
    <p><strong>${product.name}</strong></p>
    <p>${product.approved ? "✔ Approved" : "❌ Not Approved"}</p>
    <p class="quote">${product.description || "No description yet."}</p>
  `;

  card.addEventListener("click", () => openModal(product));
  return card;
}

// Render recommended products
function renderRecommended() {
  sectionTitle.textContent = "Recommended This Week";
  productGrid.innerHTML = "";

  const recommended = allProducts.filter(p => p.recommended);

  recommended.forEach(product => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

// Search logic
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();

  if (term.length < 2) {
    renderRecommended();
    return;
  }

  const regex = new RegExp(`\\b${term}\\b`, "i");

  const filtered = allProducts.filter(product => {
    return (
      regex.test(product.name || "") ||
      regex.test(product.brand || "") ||
      regex.test(product.description || "")
    );
  });

  productGrid.innerHTML = "";

  if (filtered.length > 0) {
    sectionTitle.textContent = "Search Results";
    filtered.forEach(product => {
      const card = createProductCard(product);
      productGrid.appendChild(card);
    });
  } else {
    sectionTitle.textContent = "Search Results";
    productGrid.innerHTML = "<p style='text-align:center; color:#999;'>No results found.</p>";
  }
});

// Fetch products once
async function loadHomeProducts() {
  try {
    const res = await fetch("https://jeffree-api-sky.fly.dev/products");
    allProducts = await res.json();
    renderRecommended();
  } catch (err) {
    productGrid.innerHTML = "<p>Failed to load products.</p>";
    console.error(err);
  }
}

loadHomeProducts();
