import { verificarContrasena } from './crypto-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    initRegistroForm();
    cargarEmailTemporal();
});

function initRegistroForm() {
    const form = document.getElementById('registroform');
    form.addEventListener('submit', e => {
        e.preventDefault();
        procesarRegistro();
    });
}

function procesarRegistro() {
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const telefono = document.getElementById('telefono').value.trim();
    const municipio = document.getElementById('municipio').value;
    const rol = document.getElementById('rol').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmpassword').value;
    const terminos = document.getElementById('terminos').checked;

    // validaciones basicas
    if (!nombres || !apellidos || !email || !telefono || !municipio || !rol || !password) {
        mostrarMensajeRegistro('todos los campos son obligatorios','error');
        return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
        mostrarMensajeRegistro('formato de correo invalido','error');
        return;
    }
    if (password.length < 6) {
        mostrarMensajeRegistro('la contraseña debe tener minimo 6 caracteres','error');
        return;
    }
    if (password !== confirm) {
        mostrarMensajeRegistro('las contraseñas no coinciden','error');
        return;
    }
    if (!terminos) {
        mostrarMensajeRegistro('debes aceptar terminos y condiciones','error');
        return;
    }

    // verificar duplicado
    const usuarios = JSON.parse(localStorage.getItem('secrica_usuarios')||'[]');
    if (usuarios.some(u=>u.email===email)) {
        mostrarMensajeRegistro('este correo ya esta registrado','error');
        return;
    }

    // crear usuario
    const id = usuarios.length>0?Math.max(...usuarios.map(u=>u.id))+1:3;
    const username = (nombres.split(' ')[0]+apellidos.split(' ')[0]+Math.floor(Math.random()*999)).toLowerCase();
    const passwordCifrada = cifrarPassword(password);

    const nuevo = {
        id,
        username,
        email,
        password: passwordCifrada,
        fullName: `${nombres} ${apellidos}`,
        telefono,
        municipio,
        rol,
        activo: true,
        fechaRegistro: new Date().toISOString()
    };
    usuarios.push(nuevo);
    localStorage.setItem('secrica_usuarios', JSON.stringify(usuarios));

    mostrarMensajeRegistro('¡cuenta creada con exito! redirigiendo...','exito');
    setTimeout(()=> window.location.href='login.html?email='+encodeURIComponent(email),2000);
}

function mostrarMensajeRegistro(msg, tipo) {
    let div = document.getElementById('mensajeregistro');
    if (!div) {
        div = document.createElement('div');
        div.id='mensajeregistro';
        document.querySelector('.registro-card').appendChild(div);
    }
    div.textContent = msg;
    div.className=`mensaje mensaje--${tipo}`;
}

function cargarEmailTemporal() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email')||sessionStorage.getItem('secrica_email_temp');
    if (email) document.getElementById('email').value=email;
}

function cifrarPassword(p) {
    // usa funcion importada de crypto-utils.js
    return typeof window.cifrarPassword==='function'
        ? window.cifrarPassword(p)
        : btoa(p);
}