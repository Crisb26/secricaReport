// incluimos localStorage y cifrado de contraseñas

import { verificarContrasena } from '../utils/crypto-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('sistema de login cargado');
    initLoginForm();
    cargarUltimoEmail();
    verificarSesionActiva();
});

function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('formulario de login no encontrado');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarLogin();
    });

    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        guardarEmailTemporal(this.value);
    });
}

async function procesarLogin() {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        mostrarMensaje('Por favor ingresa email y contraseña', 'error');
        return;
    }

    if (!validarEmail(email)) {
        mostrarMensaje('Formato de email inválido', 'error');
        return;
    }

    try {
        const usuarios = await obtenerTodosLosUsuarios();
        console.log('usuarios disponibles:', usuarios.length);

        const usuario = usuarios.find(u => 
            (u.email && u.email.toLowerCase() === email) || 
            (u.username && u.username.toLowerCase() === email)
        );

        if (!usuario) {
            mostrarMensaje('Usuario no encontrado', 'error');
            return;
        }

        if (usuario.activo === false) {
            mostrarMensaje('Cuenta desactivada. Contacta al administrador', 'error');
            return;
        }

        const passwordValida = await verificarPasswordUsuario(password, usuario.password);

        if (!passwordValida) {
            mostrarMensaje('Contraseña incorrecta', 'error');
            return;
        }

        mostrarMensaje('Login exitoso. Redirigiendo...', 'exito');
        guardarSesionUsuario(usuario);
        guardarUltimoEmail(email);

        setTimeout(() => {
            window.location.href = 'sistema.html';
        }, 1500);

    } catch (error) {
        console.error('error en login:', error);
        mostrarMensaje('Error del sistema. Intenta de nuevo', 'error');
    }
}

async function obtenerTodosLosUsuarios() {
    try {
        const response = await fetch("http://localhost:3000/api/usuarios");
        const data = await response.json();
        return data.usuarios || [];
    } catch (error) {
        console.error('error al cargar usuarios desde servidor:', error);
        return [];
    }
}

async function verificarPasswordUsuario(passwordPlano, passwordAlmacenado) {
    if (typeof verificarContrasena === 'function') {
        return verificarContrasena(passwordPlano, passwordAlmacenado);
    } else {
        return passwordPlano === passwordAlmacenado;
    }
}

function guardarSesionUsuario(usuario) {
    try {
        const sesion = {
            id: usuario.id,
            username: usuario.username,
            email: usuario.email,
            fullName: usuario.fullName,
            rol: usuario.rol,
            fechaLogin: new Date().toISOString(),
            activo: true
        };

        localStorage.setItem('secrica_sesion', JSON.stringify(sesion));
        sessionStorage.setItem('secrica_sesion_temp', JSON.stringify(sesion));

        console.log('sesion guardada para:', usuario.username);

    } catch (error) {
        console.error('error al guardar sesion:', error);
    }
}

function cargarUltimoEmail() {
    try {
        const ultimoEmail = localStorage.getItem('secrica_ultimo_email');
        const emailInput = document.getElementById('email');

        if (ultimoEmail && emailInput) {
            emailInput.value = ultimoEmail;
        }
    } catch (error) {
        console.error('error al cargar ultimo email:', error);
    }
}

function guardarUltimoEmail(email) {
    try {
        localStorage.setItem('secrica_ultimo_email', email);
    } catch (error) {
        console.error('error al guardar email:', error);
    }
}

function guardarEmailTemporal(email) {
    try {
        if (email && email.length > 3) {
            sessionStorage.setItem('secrica_email_temp', email);
        }
    } catch (error) {
        console.error('error al guardar email temporal:', error);
    }
}

function verificarSesionActiva() {
    try {
        const sesion = localStorage.getItem('secrica_sesion');
        if (sesion) {
            const datosSession = JSON.parse(sesion);
            const fechaLogin = new Date(datosSession.fechaLogin);
            const ahora = new Date();
            const diferenciaDias = (ahora - fechaLogin) / (1000 * 60 * 60 * 24);

            if (diferenciaDias < 7) {
                mostrarOpcionContinuarSesion(datosSession);
            } else {
                localStorage.removeItem('secrica_sesion');
            }
        }
    } catch (error) {
        console.error('error al verificar sesion:', error);
    }
}

function mostrarOpcionContinuarSesion(sesion) {
    const contenedor = document.querySelector('.login-card');
    if (!contenedor) return;

    const divSesion = document.createElement('div');
    divSesion.className = 'sesion-activa';
    divSesion.innerHTML = `
        <div class="sesion-info">
            <p>Sesión activa encontrada:</p>
            <strong>${sesion.fullName} (${sesion.email})</strong>
            <div class="sesion-botones">
                <button type="button" class="btn btn-small" onclick="continuarSesion()">
                    Continuar Sesión
                </button>
                <button type="button" class="btn btn-small btn-secondary" onclick="cerrarSesionAnterior()">
                    Nueva Sesión
                </button>
            </div>
        </div>
    `;

    const form = document.getElementById('loginForm');
    contenedor.insertBefore(divSesion, form);
}

function continuarSesion() {
    mostrarMensaje('Continuando sesión...', 'exito');
    setTimeout(() => {
        window.location.href = 'sistema.html';
    }, 1000);
}

function cerrarSesionAnterior() {
    localStorage.removeItem('secrica_sesion');
    sessionStorage.removeItem('secrica_sesion_temp');

    const divSesion = document.querySelector('.sesion-activa');
    if (divSesion) {
        divSesion.remove();
    }

    mostrarMensaje('Sesión anterior cerrada', 'info');
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function mostrarMensaje(mensaje, tipo = 'info') {
    let mensajeElement = document.getElementById('mensajeLogin');

    if (!mensajeElement) {
        mensajeElement = document.createElement('div');
        mensajeElement.id = 'mensajeLogin';
        mensajeElement.className = 'mensaje hidden';

        const form = document.getElementById('loginForm');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(mensajeElement, form);
        }
    }

    mensajeElement.textContent = mensaje;
    mensajeElement.className = `mensaje mensaje--${tipo}`;
    mensajeElement.classList.remove('hidden');

    setTimeout(() => {
        mensajeElement.classList.add('hidden');
    }, 5000);
}

window.continuarSesion = continuarSesion;
window.cerrarSesionAnterior = cerrarSesionAnterior;

console.log('sistema de login inicializado correctamente');

document.addEventListener('DOMContentLoaded', () => {
    console.log('sistema de login cargado');
    initLoginForm();
});

function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('formulario de login no encontrado');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await procesarLogin();
    });
}

async function procesarLogin() {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensajeLogin');

    if (!email || !password) {
        mostrarMensaje('Por favor ingresa email y contraseña', 'error');
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/usuarios");
        const data = await response.json();
        const usuarios = data.usuarios || [];

        const usuario = usuarios.find(u =>
            u.email.toLowerCase() === email || u.username.toLowerCase() === email
        );

        if (!usuario) {
            mostrarMensaje('Usuario no encontrado', 'error');
            return;
        }

        if (!usuario.activo) {
            mostrarMensaje('Cuenta desactivada', 'error');
            return;
        }

        if (usuario.password !== password) {
            mostrarMensaje('Contraseña incorrecta', 'error');
            return;
        }

        // Guardar sesión
        const sesion = {
            id: usuario.id,
            username: usuario.username,
            email: usuario.email,
            fullName: usuario.fullName,
            rol: usuario.rol,
            fechaLogin: new Date().toISOString(),
        };

        localStorage.setItem('secrica_sesion', JSON.stringify(sesion));

        mostrarMensaje('Login exitoso. Redirigiendo...', 'exito');

        setTimeout(() => {
            window.location.href = 'sistema.html';
        }, 1500);

    } catch (error) {
        console.error('error en login:', error);
        mostrarMensaje('Error al conectar con el servidor', 'error');
    }
}

function mostrarMensaje(texto, tipo = 'info') {
    let mensajeElement = document.getElementById('mensajeLogin');

    if (!mensajeElement) {
        mensajeElement = document.createElement('div');
        mensajeElement.id = 'mensajeLogin';
        mensajeElement.className = 'mensaje';
        document.body.appendChild(mensajeElement);
    }

    mensajeElement.textContent = texto;
    mensajeElement.className = `mensaje mensaje--${tipo}`;
}
