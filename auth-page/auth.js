// Получаем Supabase клиент
const supabase = window.supabaseClient;

// Form elements
const registrationForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const switchToLogin = document.getElementById('switchToLogin');
const switchToRegister = document.getElementById('switchToRegister');

// Registration form inputs
const emailInput = document.getElementById('emailInput');
const referralInput = document.getElementById('referralInput');
const emailError = document.getElementById('emailError');
const registerBtn = document.getElementById('registerBtn');

// Login form inputs
const loginEmailInput = document.getElementById('loginEmailInput');
const passwordInput = document.getElementById('passwordInput');
const loginEmailError = document.getElementById('loginEmailError');
const passwordError = document.getElementById('passwordError');
const loginBtn = document.getElementById('loginBtn');

// Google auth buttons
const googleSignUp = document.getElementById('googleSignUp');
const googleSignIn = document.getElementById('googleSignIn');

// Validation functions
function validateEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
}

function validateRequired(value) {
  return value.trim() !== '';
}

// Show error message
function showError(input, errorElement, message) {
  input.classList.add('error');
  errorElement.textContent = message;
}

// Clear error message
function clearError(input, errorElement) {
  input.classList.remove('error');
  errorElement.textContent = '';
}

// Show success message
function showSuccessMessage(message) {
  alert(message); // Можно заменить на более красивое уведомление
}

// Show error alert
function showErrorMessage(message) {
  alert('Error: ' + message);
}

// Validate email field
function validateEmailField(input, errorElement) {
  const value = input.value.trim();
  
  if (!validateRequired(value)) {
    showError(input, errorElement, 'This field is required');
    return false;
  }
  
  if (!validateEmail(value)) {
    showError(input, errorElement, 'Please enter a valid email');
    return false;
  }
  
  clearError(input, errorElement);
  return true;
}

// Validate password field
function validatePasswordField(input, errorElement) {
  const value = input.value.trim();
  
  if (!validateRequired(value)) {
    showError(input, errorElement, 'This field is required');
    return false;
  }
  
  if (value.length < 8) {
    showError(input, errorElement, 'Password must be at least 8 characters');
    return false;
  }
  
  clearError(input, errorElement);
  return true;
}

// Check if registration form is valid
function isRegistrationFormValid() {
  return validateEmailField(emailInput, emailError);
}

// Check if login form is valid
function isLoginFormValid() {
  const emailValid = validateEmailField(loginEmailInput, loginEmailError);
  const passwordValid = validatePasswordField(passwordInput, passwordError);
  return emailValid && passwordValid;
}

// Update button state
function updateRegisterButtonState() {
  registerBtn.disabled = !isRegistrationFormValid();
}

function updateLoginButtonState() {
  loginBtn.disabled = !isLoginFormValid();
}

// Clear form data
function clearForm(form) {
  const inputs = form.querySelectorAll('.auth-input');
  inputs.forEach(input => {
    input.value = '';
    const errorElement = input.parentElement.querySelector('.auth-error-message');
    if (errorElement) {
      clearError(input, errorElement);
    }
  });
}

// Set loading state
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Loading...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

// Switch to login form
switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  clearForm(registrationForm);
  registrationForm.style.display = 'none';
  loginForm.style.display = 'block';
  updateLoginButtonState();
});

// Switch to registration form
switchToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  clearForm(loginForm);
  loginForm.style.display = 'none';
  registrationForm.style.display = 'block';
  updateRegisterButtonState();
});

// Registration form validation
emailInput.addEventListener('input', () => {
  if (emailInput.value.trim() !== '') {
    validateEmailField(emailInput, emailError);
  }
  updateRegisterButtonState();
});

emailInput.addEventListener('blur', () => {
  validateEmailField(emailInput, emailError);
  updateRegisterButtonState();
});

// Login form validation
loginEmailInput.addEventListener('input', () => {
  if (loginEmailInput.value.trim() !== '') {
    validateEmailField(loginEmailInput, loginEmailError);
  }
  updateLoginButtonState();
});

loginEmailInput.addEventListener('blur', () => {
  validateEmailField(loginEmailInput, loginEmailError);
  updateLoginButtonState();
});

passwordInput.addEventListener('input', () => {
  if (passwordInput.value.trim() !== '') {
    validatePasswordField(passwordInput, passwordError);
  }
  updateLoginButtonState();
});

passwordInput.addEventListener('blur', () => {
  validatePasswordField(passwordInput, passwordError);
  updateLoginButtonState();
});

// Handle registration form submission (Magic Link)
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!isRegistrationFormValid()) {
    validateEmailField(emailInput, emailError);
    return;
  }
  
  const email = emailInput.value.trim();
  const referralCode = referralInput.value.trim();
  
  setButtonLoading(registerBtn, true);
  
  try {
    // Отправка Magic Link на email
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin + '/auth-page/auth.html',
        data: {
          referral_code: referralCode || null
        }
      }
    });
    
    if (error) throw error;
    
    showSuccessMessage('Check your email for the confirmation link!');
    clearForm(registrationForm);
    
  } catch (error) {
    console.error('Registration error:', error);
    showErrorMessage(error.message);
  } finally {
    setButtonLoading(registerBtn, false);
    updateRegisterButtonState();
  }
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!isLoginFormValid()) {
    validateEmailField(loginEmailInput, loginEmailError);
    validatePasswordField(passwordInput, passwordError);
    return;
  }
  
  const email = loginEmailInput.value.trim();
  const password = passwordInput.value;
  
  setButtonLoading(loginBtn, true);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) throw error;
    
    showSuccessMessage('Login successful!');
    
    // Перенаправление на главную страницу или dashboard
    setTimeout(() => {
      window.location.href = '../first-page/main.html';
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    showErrorMessage(error.message);
  } finally {
    setButtonLoading(loginBtn, false);
    updateLoginButtonState();
  }
});

// Handle Google Sign Up
googleSignUp.addEventListener('click', async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth-page/auth.html`
      }
    });
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Google sign up error:', error);
    showErrorMessage(error.message);
  }
});

// Handle Google Sign In
googleSignIn.addEventListener('click', async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth-page/auth.html`
      }
    });
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Google sign in error:', error);
    showErrorMessage(error.message);
  }
});

// Check for existing session on page load
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    console.log('User is logged in:', session.user);
    // Можно перенаправить на главную страницу
    // window.location.href = '../first-page/main.html';
  }
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  
  if (event === 'SIGNED_IN') {
    showSuccessMessage('Successfully signed in!');
    setTimeout(() => {
      window.location.href = '../first-page/main.html';
    }, 1000);
  }
  
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

// Initialize button states
updateRegisterButtonState();
updateLoginButtonState();

// Check session on load
checkSession();
