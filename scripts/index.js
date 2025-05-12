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
const expandBtn = document.getElementById('expand-info');
const optionalInfo = document.getElementById('modal-optional-info');



// Function to open modal with product data
function openModal(product) {
  modalImage.src = product.image_url || "default-image.jpg";
  modalName.textContent = product.name || "N/A";
  modalBrand.textContent = product.brand || "N/A";
  document.getElementById("modal-description").textContent = product.full_description || "No description available.";
  document.getElementById("modal-approved").textContent = product.js_approved ? "✔ Yes" : "❌ No";

  // Optional fields
  document.getElementById("modal-category").textContent = product.category || "";
  document.getElementById("modal-subcategory").textContent = product.sub_category || "";
  document.getElementById("modal-release-date").textContent = product.release_date ? new Date(product.release_date).toLocaleDateString() : "";
  document.getElementById("modal-finish").textContent = product.finish || "";
  document.getElementById("modal-coverage").textContent = product.coverage || "";
  document.getElementById("modal-formula").textContent = product.formula || "";
  document.getElementById("modal-spf").textContent = product.spf || "";
  document.getElementById("modal-vegan").textContent = product.vegan ? "Yes" : product.vegan === false ? "No" : "";
  document.getElementById("modal-shades").textContent = product.shades?.join(', ') || "";
  document.getElementById("modal-ingredients").textContent = product.ingredients?.join(', ') || "";

  // Reset expandable section
  optionalInfo.classList.remove("expand");
  expandBtn.textContent = "Show More";

  modal.classList.remove("hidden");
}





// Close Modal
function closeModal() {
  modal.classList.add("hidden");
}

// Expand/Collapse the optional info
expandBtn.addEventListener('click', () => {
  optionalInfo.classList.toggle('expand');
  expandBtn.textContent = optionalInfo.classList.contains('expand') ? "Show Less" : "Show More";
});


// Close modal when clicking the close button or outside the modal
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


function closeModal() {
  modal.classList.add("hidden");
}


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
    <img src="${product.image_url}" alt="${product.name}" />
    <p><strong>${product.name}</strong></p>
    <p>${product.js_approved ? "✔ JS Approved" : "❌ Not Approved"}</p>
    <p class="quote">${product.bio_description || "No description yet."}</p>
  `;

  card.addEventListener("click", () => openModal(product));
  return card;
}

// Render highlighted products
function renderHighlighted() {
  sectionTitle.textContent = "Highlighted Products";
  productGrid.innerHTML = "";

  const highlighted = allProducts.filter(p => p.highlighted);

  highlighted.forEach(product => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

// Search logic
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();

  if (term.length < 2) {
    renderHighlighted();
    return;
  }

  const filtered = allProducts.filter(product => {
    const name = product.name?.toLowerCase() || "";
    const brand = product.brand?.toLowerCase() || "";
    const desc = product.bio_description?.toLowerCase() || "";

    return (
      name.includes(term) ||
      brand.includes(term) ||
      desc.includes(term)
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
    renderHighlighted();
  } catch (err) {
    productGrid.innerHTML = "<p>Failed to load products.</p>";
    console.error(err);
  }
}

loadHomeProducts();
