const CART_STORAGE_KEY = 'kr4-js-shop:cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = loadCart();
  const item = cart.find((entry) => entry.id === productId);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  refreshCartUI();
}

function removeFromCart(productId) {
  saveCart(loadCart().filter((entry) => entry.id !== productId));
  refreshCartUI();
}

function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = loadCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity = quantity;
  saveCart(cart);
  refreshCartUI();
}

function clearCart() {
  saveCart([]);
  refreshCartUI();
}

function getCartItemCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal(cart) {
  return cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function refreshCartUI() {
  const cart = loadCart();

  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(getCartItemCount(cart));
  });

  renderCartPage(cart);
}

function renderCartPage(cart) {
  const container = document.querySelector('#cart-items');
  if (!container) return;

  const emptyBlock = document.querySelector('#cart-empty');
  const contentBlock = document.querySelector('#cart-content');

  if (cart.length === 0) {
    container.textContent = '';
    if (emptyBlock) emptyBlock.hidden = false;
    if (contentBlock) contentBlock.hidden = true;
    return;
  }

  if (emptyBlock) emptyBlock.hidden = true;
  if (contentBlock) contentBlock.hidden = false;

  container.textContent = '';

  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return;

    const li = document.createElement('li');
    li.classList.add('cart-item');

    const title = document.createElement('h3');
    title.classList.add('cart-item__title');
    title.textContent = product.title;

    const price = document.createElement('p');
    price.classList.add('cart-item__price');
    price.textContent = `${product.price.toLocaleString('ru-RU')} руб. × ${item.quantity}`;

    const sum = document.createElement('p');
    sum.classList.add('cart-item__sum');
    sum.textContent = `${(product.price * item.quantity).toLocaleString('ru-RU')} руб.`;

    // Кнопки +, −, удалить — через делегирование ниже.
    const controls = document.createElement('div');
    controls.classList.add('cart-item__controls');

    const decBtn = document.createElement('button');
    decBtn.type = 'button';
    decBtn.dataset.action = 'decrease';
    decBtn.dataset.id = String(item.id);
    decBtn.textContent = '−';

    const incBtn = document.createElement('button');
    incBtn.type = 'button';
    incBtn.dataset.action = 'increase';
    incBtn.dataset.id = String(item.id);
    incBtn.textContent = '+';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.dataset.action = 'remove';
    removeBtn.dataset.id = String(item.id);
    removeBtn.textContent = 'Удалить';

    controls.append(decBtn, incBtn, removeBtn);
    li.append(title, price, sum, controls);
    container.append(li);
  });

  const totalCount = document.querySelector('#cart-total-count');
  const totalPrice = document.querySelector('#cart-total-price');
  if (totalCount) totalCount.textContent = String(getCartItemCount(cart));
  if (totalPrice) totalPrice.textContent = getCartTotal(cart).toLocaleString('ru-RU');
}

const cartContainer = document.querySelector('#cart-items');

if (cartContainer) {
  cartContainer.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;

    const cart = loadCart();
    const item = cart.find((entry) => entry.id === productId);
    if (!item) return;

    if (action === 'increase') updateQuantity(productId, item.quantity + 1);
    if (action === 'decrease') updateQuantity(productId, item.quantity - 1);
    if (action === 'remove') removeFromCart(productId);
  });
}

const clearButton = document.querySelector('#cart-clear');
if (clearButton) {
  clearButton.addEventListener('click', clearCart);
}

refreshCartUI();