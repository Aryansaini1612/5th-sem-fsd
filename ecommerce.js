const productsContainer = document.getElementById("products-container");
const productsStatus = document.getElementById("products-status");

function ratingDescription(score) {
  if (score >= 4.5) return "Exceptional";
  if (score >= 4) return "Very well loved";
  if (score >= 3) return "Well liked";
  if (score >= 2) return "Mixed reviews";
  return "Needs more reviews";
}

function createProductCard(product, index) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.style.setProperty("--card-index", index);

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";
  const image = document.createElement("img");
  image.src = product.thumbnail;
  image.alt = product.title;
  image.loading = "lazy";
  imageWrap.appendChild(image);

  const category = document.createElement("span");
  category.className = "category-tag";
  category.textContent = product.category?.replaceAll("-", " ") || "THE EVERYDAY EDIT";
  imageWrap.appendChild(category);

  const details = document.createElement("div");
  details.className = "product-details";
  const title = document.createElement("h3");
  title.textContent = product.title;
  const description = document.createElement("p");
  description.className = "description";
  description.textContent = product.description;

  const rating = document.createElement("div");
  rating.className = "rating-row";
  const score = Number(product.rating);
  const validRating = Number.isFinite(score);
  const stars = document.createElement("span");
  stars.className = "stars";
  stars.textContent = validRating ? "★".repeat(Math.round(score)) + "☆".repeat(5 - Math.round(score)) : "☆☆☆☆☆";
  stars.setAttribute("aria-hidden", "true");
  const ratingText = document.createElement("span");
  ratingText.className = "rating-score";
  ratingText.textContent = validRating ? `${score.toFixed(1)} / 5` : "No rating";
  const ratingLabel = document.createElement("span");
  ratingLabel.className = "rating-label";
  ratingLabel.textContent = validRating ? ratingDescription(score) : "Not yet rated";
  rating.setAttribute("aria-label", validRating ? `Rated ${score.toFixed(1)} out of 5, ${ratingDescription(score)}` : "No rating available");
  rating.append(stars, ratingText, ratingLabel);

  const bottom = document.createElement("div");
  bottom.className = "product-bottom";
  const price = document.createElement("span");
  price.className = "price";
  price.textContent = `$${Number(product.price).toFixed(2)}`;
  const detailLink = document.createElement("span");
  detailLink.className = "detail-mark";
  detailLink.setAttribute("aria-hidden", "true");
  detailLink.textContent = "↗";
  bottom.append(price, detailLink);
  details.append(title, description, rating, bottom);
  card.append(imageWrap, details);
  return card;
}

async function loadProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=12");
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error("Invalid products response");
    const cards = document.createDocumentFragment();
    data.products.forEach((product, index) => cards.appendChild(createProductCard(product, index)));
    productsContainer.appendChild(cards);
    productsStatus.remove();
  } catch (error) {
    productsStatus.textContent = "We couldn't load the collection just now. Check your connection and refresh to try again.";
    productsStatus.classList.add("error");
    console.error("Could not load products:", error);
  }
}

loadProducts();
