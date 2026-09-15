/* Individual product details */
(function () {
  "use strict";

  const products = {
    "cotton-crewneck-tee": { name: "Cotton Crewneck Tee", category: "Tops", description: "Soft everyday cotton tee with a classic crewneck fit.", price: 28, image: "images/cotton-crewneck-tee.svg" },
    "relaxed-linen-shirt": { name: "Relaxed Linen Shirt", category: "Tops", description: "Lightweight linen shirt designed for a relaxed, comfortable fit.", price: 54, image: "images/relaxed-linen-shirt.svg" },
    "straight-leg-trousers": { name: "Straight Leg Trousers", category: "Bottoms", description: "Clean, versatile trousers with a timeless straight-leg silhouette.", price: 68, image: "images/straight-leg-trousers.svg" },
    "washed-denim-jeans": { name: "Washed Denim Jeans", category: "Bottoms", description: "Classic denim jeans with a comfortable everyday fit and washed finish.", price: 74, image: "images/washed-denim-jeans.svg" },
    "wool-blend-overcoat": { name: "Wool Blend Overcoat", category: "Outerwear", description: "Polished wool-blend overcoat for cold-weather layering.", price: 180, image: "images/wool-blend-overcoat.svg" },
    "quilted-bomber-jacket": { name: "Quilted Bomber Jacket", category: "Outerwear", description: "Lightly quilted bomber jacket with a modern casual look.", price: 120, image: "images/quilted-bomber-jacket.svg" },
    "canvas-tote-bag": { name: "Canvas Tote Bag", category: "Accessories", description: "Durable canvas tote for carrying everyday essentials.", price: 32, image: "images/canvas-tote-bag.svg" },
    "ribbed-beanie": { name: "Ribbed Beanie", category: "Accessories", description: "Warm ribbed knit beanie designed for comfortable cold-weather wear.", price: 22, image: "images/ribbed-beanie.svg" }
  };

  function slugify(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  function addToCart(product) {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem("freshPressCart") || "[]"); } catch (e) {}
    const existing = cart.find(item => item.name === product.name);
    if (existing) existing.quantity += 1;
    else cart.push({ name: product.name, price: product.price, image: product.image, quantity: 1 });
    localStorage.setItem("freshPressCart", JSON.stringify(cart));
    window.location.href = "products.html";
  }

  const key = new URLSearchParams(window.location.search).get("product");
  const product = products[key] || products["cotton-crewneck-tee"];
  document.title = `${product.name} | FreshPress Dry Cleaning`;

  const card = document.getElementById("product-detail-card");
  card.innerHTML = `
    <div class="detail-image"><img src="${product.image}" alt="${product.name}" /></div>
    <div class="detail-info">
      <span class="detail-category">${product.category}</span>
      <h1>${product.name}</h1>
      <p class="detail-description">${product.description}</p>
      <div class="detail-price">$${product.price.toFixed(2)}</div>
      <button class="detail-add" type="button">Add to Cart</button>
    </div>`;

  card.querySelector(".detail-add").addEventListener("click", function () {
    addToCart(product);
  });
})();
