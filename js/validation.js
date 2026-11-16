const orderForm = document.querySelector('.order-form');

if (orderForm) {
  const nameInput = orderForm.querySelector('#order-name');
  const emailInput = orderForm.querySelector('#order-email');
  const phoneInput = orderForm.querySelector('#order-phone');
  const consentInput = orderForm.querySelector('#order-consent');

  const nameError = orderForm.querySelector('#order-name-error');
  const emailError = orderForm.querySelector('#order-email-error');
  const phoneError = orderForm.querySelector('#order-phone-error');
  const consentError = orderForm.querySelector('#order-consent-error');

  const formMessage = orderForm.querySelector('.form-message');
  const pageSuccess = document.querySelector('#success-message-page');

  function showError(input, errorElement, message) {
    if (!input || !errorElement) return;
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
  }

  function clearError(input, errorElement) {
    if (!input || !errorElement) return;
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (value.length < 2) {
      showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
      return false;
    }
    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, 'Введите корректный e-mail.');
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
      showError(phoneInput, phoneError, 'Введите корректный номер телефона.');
      return false;
    }
    clearError(phoneInput, phoneError);
    return true;
  }

  function validateConsent() {
    if (!consentInput.checked) {
      showError(consentInput, consentError, 'Подтвердите согласие на обработку данных.');
      return false;
    }
    clearError(consentInput, consentError);
    return true;
  }

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isConsentValid = validateConsent();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isConsentValid;

    if (!isFormValid) {
      if (formMessage) formMessage.textContent = 'Проверьте поля формы.';
      if (pageSuccess) pageSuccess.hidden = true;
      return;
    }

    if (formMessage) formMessage.textContent = '';
    if (pageSuccess) {
      pageSuccess.hidden = false;
      pageSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (typeof clearCart === 'function') {
      clearCart();
    }

    orderForm.reset();

    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(phoneInput, phoneError);
    clearError(consentInput, consentError);

    setTimeout(() => {
      if (pageSuccess) pageSuccess.hidden = true;
    }, 5000);
  });

  orderForm.addEventListener('reset', () => {
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(phoneInput, phoneError);
    clearError(consentInput, consentError);
    if (formMessage) formMessage.textContent = '';
    if (pageSuccess) pageSuccess.hidden = true;
  });

  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
  consentInput.addEventListener('change', validateConsent);
}