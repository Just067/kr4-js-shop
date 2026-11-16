const callbackDialog = document.getElementById('callback-dialog');
const openCallbackButton = document.getElementById('open-callback-dialog');
const closeCallbackButton = document.getElementById('close-callback-dialog');
const callbackForm = document.getElementById('callback-form');
const callbackSuccess = document.getElementById('callback-success');

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

/* ===============================
   Мобильное меню (гамбургер)
   =============================== */

const navToggle = document.getElementById('site-nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  function setNavExpanded(isOpen) {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    siteNav.classList.toggle('site-nav--open', isOpen);
  }

  // Открыть / закрыть по клику на кнопку.
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setNavExpanded(!isOpen);
  });

  // Закрыть по Escape.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavExpanded(false);
      navToggle.focus();
    }
  });

  // Закрыть при клике по ссылке меню (пользователь выбрал пункт).
  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setNavExpanded(false);
    }
  });

  // Закрыть при клике вне меню.
  document.addEventListener('click', (event) => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;
    if (event.target.closest('#site-nav') || event.target.closest('#site-nav-toggle')) return;
    setNavExpanded(false);
  });

  // Закрыть при переходе на десктопную ширину (поворот экрана, ресайз).
  const desktopQuery = window.matchMedia('(min-width: 768px)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setNavExpanded(false);
  });
}