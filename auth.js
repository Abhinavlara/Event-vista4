/* ============================================
   EVENT VISTA - Authentication JavaScript
   Login & Signup Form Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initLoginForm();
    initSignupForm();
    initPasswordToggle();
    initRoleSelection();
});

/* === Login Form Handler === */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) return;

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const role = document.querySelector('input[name="role"]:checked')?.value;

        // Reset errors
        clearErrors();

        // Validate
        let isValid = true;

        if (!email) {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            showError('password', 'Please enter your password');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!role) {
            showError('role', 'Please select your account type');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';

        // Simulate API call
        setTimeout(() => {
            // Store user data in localStorage (mock authentication)
            const userData = {
                email: email,
                role: role,
                name: email.split('@')[0],
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('eventVista_user', JSON.stringify(userData));

            // Show success message
            showSuccessMessage('Login successful! Redirecting...');

            // Redirect based on role
            setTimeout(() => {
                if (role === 'vendor') {
                    window.location.href = 'vendor-dashboard.html';
                } else {
                    window.location.href = 'customer-dashboard.html';
                }
            }, 1500);

        }, 1500);
    });
}

/* === Signup Form Handler === */
function initSignupForm() {
    const signupForm = document.getElementById('signupForm');

    if (!signupForm) return;

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.querySelector('input[name="role"]:checked')?.value;
        const terms = document.getElementById('terms')?.checked;

        // Reset errors
        clearErrors();

        // Validate
        let isValid = true;

        if (!fullName) {
            showError('fullName', 'Please enter your full name');
            isValid = false;
        } else if (fullName.length < 2) {
            showError('fullName', 'Name must be at least 2 characters');
            isValid = false;
        }

        if (!email) {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!phone) {
            showError('phone', 'Please enter your phone number');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        if (!password) {
            showError('password', 'Please create a password');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else if (!isStrongPassword(password)) {
            showError('password', 'Password must contain at least one letter and one number');
            isValid = false;
        }

        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        if (!role) {
            showError('role', 'Please select your account type');
            isValid = false;
        }

        if (!terms) {
            showError('terms', 'Please accept the Terms & Conditions');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Creating Account...';

        // Simulate API call
        setTimeout(() => {
            // Store user data in localStorage (mock registration)
            const userData = {
                fullName: fullName,
                email: email,
                phone: phone,
                role: role,
                isLoggedIn: true,
                registrationTime: new Date().toISOString()
            };

            localStorage.setItem('eventVista_user', JSON.stringify(userData));

            // Show success message
            showSuccessMessage('Account created successfully! Redirecting...');

            // Redirect based on role
            setTimeout(() => {
                if (role === 'vendor') {
                    window.location.href = 'vendor-dashboard.html';
                } else {
                    window.location.href = 'customer-dashboard.html';
                }
            }, 1500);

        }, 2000);
    });
}

/* === Password Visibility Toggle === */
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('span') || this;

            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '🙈';
            } else {
                input.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });
}

/* === Role Selection Visual Feedback === */
function initRoleSelection() {
    document.querySelectorAll('.role-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            // Remove active state from all role cards
            document.querySelectorAll('.role-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add active state to selected role card
            if (this.checked) {
                this.nextElementSibling.classList.add('selected');
            }
        });
    });
}

/* === Validation Helpers === */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function isStrongPassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
}

/* === Error Display === */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const wrapper = field.closest('.input-wrapper') || field.closest('.form-group') || field.closest('.role-selection') || field.closest('.terms-checkbox');

    if (wrapper) {
        wrapper.classList.add('error');

        // Create error message element
        let errorEl = wrapper.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            wrapper.appendChild(errorEl);
        }

        errorEl.textContent = message;
        errorEl.classList.add('show');

        // Add shake animation
        wrapper.style.animation = 'shake 0.4s ease';
        setTimeout(() => wrapper.style.animation = '', 400);
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });

    document.querySelectorAll('.input-wrapper, .form-group, .role-selection, .terms-checkbox').forEach(el => {
        el.classList.remove('error');
    });
}

/* === Success Message === */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
    <h4>✓ Success!</h4>
    <p>${message}</p>
  `;

    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
    }
}

/* === Check Authentication === */
function checkAuth() {
    const userData = localStorage.getItem('eventVista_user');
    return userData ? JSON.parse(userData) : null;
}

/* === Logout Function === */
function logout() {
    localStorage.removeItem('eventVista_user');
    window.location.href = 'login.html';
}

/* === Protect Dashboard Pages === */
function protectDashboard(requiredRole = null) {
    const user = checkAuth();

    if (!user || !user.isLoggedIn) {
        window.location.href = 'login.html';
        return null;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to correct dashboard
        if (user.role === 'vendor') {
            window.location.href = 'vendor-dashboard.html';
        } else {
            window.location.href = 'customer-dashboard.html';
        }
        return null;
    }

    return user;
}

// Add spinner styles
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

console.log('🔐 Event Vista - Auth JS Loaded Successfully!');
