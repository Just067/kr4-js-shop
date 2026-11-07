const callbackDialog = document.getElementById('callback-dialog');
const openCallbackButton = document.getElementById('open-callback-dialog');
const closeCallbackButton = document.getElementById('close-callback-dialog');
const callbackForm = document.getElementById('callback-form');
const callbackSuccess = document.getElementById('callback-success');
const pageForm = document.getElementById('order-form-page');
const pageSuccess = document.getElementById('success-message-page');

function formatPrice(price) {
  return `${price} руб.`;
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

function getProductStatus(product) {
  if (product.isAvailable) {
    return 'В наличии';
  }

  return 'Нет в наличии';
}

function createProductSummary(product) {
  const finalPrice = calculateFinalPrice(product.price, product.discountPercent);
  const status = getProductStatus(product);

  return `${product.title}: ${formatPrice(finalPrice)}. Статус: ${status}.`;
}

function getProductTitles(products) {
  return products.map((product) => product.title);
}

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return products;
  }

  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }

  return products.filter((product) => {
    return product.category === category;
  });
}

function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];

  if (direction === 'desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }

  return productsCopy.sort((a, b) => a.price - b.price);
}

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

function calculateTotalPrice(products) {
  return products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);
}

function countAvailableProducts(products) {
  return products.filter((product) => product.isAvailable).length;
}

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}

function getPreparedProducts(products, query, category, sortDirection) {
  let result = [...products];

  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);

  return result;
}

if (pageForm) {
  pageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const elements = Array.from(pageForm.elements);

    elements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!pageForm.checkValidity()) {
      elements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      pageForm.reportValidity();
      return;
    }

    if (pageSuccess) {
      pageSuccess.hidden = false;
      pageSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    pageForm.reset();

    setTimeout(() => {
      if (pageSuccess) {
        pageSuccess.hidden = true;
      }
    }, 2000);
  });
}

if (openCallbackButton && callbackDialog) {
  openCallbackButton.addEventListener('click', () => {
    if (callbackSuccess) {
      callbackSuccess.hidden = true;
    }
    callbackDialog.showModal();
  });
}

if (closeCallbackButton && callbackDialog) {
  closeCallbackButton.addEventListener('click', () => {
    callbackDialog.close();
  });
}

if (callbackDialog) {
  callbackDialog.addEventListener('click', (event) => {
    if (event.target === callbackDialog) {
      callbackDialog.close();
    }
  });
}

// Обработка отправки формы обратного звонка.
if (callbackForm && callbackDialog) {
  callbackForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Сбрасываем предыдущие ошибки.
    const elements = Array.from(callbackForm.elements);

    elements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверяем HTML-валидацию.
    if (!callbackForm.checkValidity()) {
      elements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      callbackForm.reportValidity();
      return;
    }

    callbackSuccess.hidden = false;
    callbackForm.reset();

    setTimeout(() => {
      callbackDialog.close();
      callbackSuccess.hidden = true;
    }, 1500);

  });
}