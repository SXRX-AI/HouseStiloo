// Función para mostrar/ocultar contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Función para mostrar/ocultar confirmación de contraseña
function toggleConfirmPassword() {
    const confirmPasswordInput = document.getElementById('confirm-password');
    const toggleBtn = document.querySelectorAll('.toggle-password i')[1];
    
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        toggleBtn.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        confirmPasswordInput.type = 'password';
        toggleBtn.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Validación de fortaleza de contraseña
document.getElementById('password').addEventListener('input', function(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strength-level');
    let strength = 'weak';
    
    // Reset
    strengthBar.parentElement.removeAttribute('data-strength');
    
    if (password.length === 0) {
        strengthText.textContent = '';
        return;
    }
    
    // Medir fortaleza
    if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        strength = 'strong';
    } else if (password.length > 6) {
        strength = 'medium';
    }
    
    // Aplicar cambios
    strengthBar.parentElement.setAttribute('data-strength', strength);
    strengthText.textContent = strength === 'strong' ? 'Fuerte' : strength === 'medium' ? 'Moderada' : 'Débil';
});

// Validación de coincidencia de contraseñas
document.getElementById('confirm-password').addEventListener('input', function(e) {
    const password = document.getElementById('password').value;
    const confirmPassword = e.target.value;
    const feedback = document.getElementById('password-match');
    
    if (confirmPassword.length === 0) {
        feedback.textContent = '';
        feedback.className = 'password-feedback';
        return;
    }
    
    if (password === confirmPassword) {
        feedback.textContent = 'Las contraseñas coinciden';
        feedback.className = 'password-feedback password-match';
    } else {
        feedback.textContent = 'Las contraseñas no coinciden';
        feedback.className = 'password-feedback password-mismatch';
    }
});