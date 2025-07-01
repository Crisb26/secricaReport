import { verificarPassword } from './crypto-utils.js';
import { usuarios as usuariosBase } from '../usuarios.js';

let usuarios = [];
try {
  const usuariosLocales = JSON.parse(localStorage.getItem('secrica_usuarios')) || [];
  usuarios = [...usuariosBase];

  usuariosLocales.forEach(nuevo => {
    if (!usuarios.some(u => u.email === nuevo.email)) {
      usuarios.push(nuevo);
    }
  });
} catch {
  usuarios = [...usuariosBase];
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔐 Sistema de login cargado');
  initLoginForm();
  cargarUltimoEmail();
  verificarSesionActiva();
});

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await procesarLogin();
  });

  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      guardarEmailTemporal(emailInput.value);
    });
  }
}

async function procesarLogin() {
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    mostrarMensaje('Por favor ingresa email y contraseña', 'error');
    return;
  }

  if (!window.utilidadessecrica?.validaremail?.(email)) {
    mostrarMensaje('Email inválido', 'error');
    return;
  }

  try {
    const usuario = usuarios.find(u =>
      (u.email && u.email.toLowerCase() === email) ||
      (u.username && u.username.toLowerCase() === email)
    );

    if (!usuario) {
      mostrarMensaje('Usuario no encontrado', 'error');
      return;
    }

    if (!usuario.activo) {
      mostrarMensaje('Cuenta desactivada. Contacta al administrador', 'error');
      return;
    }

    const passwordValida = verificarPassword(password, usuario.password);
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
    console.error('Error en login:', error);
    mostrarMensaje('Error del sistema. Intenta de nuevo', 'error');
  }
}

async function obtenerTodosLosUsuarios() {
  return usuarios;
}

function guardarSesionUsuario(usuario) {
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
  console.log('Sesión guardada para:', usuario.username);
}

function guardarUltimoEmail(email) {
  localStorage.setItem('secrica_ultimo_email', email);
}

function cargarUltimoEmail() {
  const emailInput = document.getElementById('email');
  const ultimoEmail = localStorage.getItem('secrica_ultimo_email');
  if (emailInput && ultimoEmail) emailInput.value = ultimoEmail;
}

function guardarEmailTemporal(email) {
  if (email?.length > 3) {
    sessionStorage.setItem('secrica_email_temp', email);
  }
}

function verificarSesionActiva() {
  const sesion = localStorage.getItem('secrica_sesion');
  if (!sesion) return;

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
        <button type="button" class="btn btn-small" onclick="continuarSesion()">Continuar Sesión</button>
        <button type="button" class="btn btn-small btn-secondary" onclick="cerrarSesionAnterior()">Nueva Sesión</button>
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
  if (divSesion) divSesion.remove();

  mostrarMensaje('Sesión anterior cerrada', 'info');
}

function mostrarMensaje(texto, tipo = 'info') {
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

  mensajeElement.textContent = texto;
  mensajeElement.className = `mensaje mensaje--${tipo}`;
  mensajeElement.classList.remove('hidden');

  setTimeout(() => {
    mensajeElement.classList.add('hidden');
  }, 5000);
}

window.continuarSesion = continuarSesion;
window.cerrarSesionAnterior = cerrarSesionAnterior;
