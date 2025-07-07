document.addEventListener('DOMContentLoaded', function() {
    console.log('sistema principal cargado');
    verificarAutenticacion();
    initSistema();
    cargarDatosUsuario();
    initNavegacion();
});

function verificarAutenticacion() {
    const sesion = localStorage.getItem('secrica_sesion');
    
    if (!sesion) {
        // no hay sesion activa, redirigir a login
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const datosSession = JSON.parse(sesion);
        const fechaLogin = new Date(datosSession.fechaLogin);
        const ahora = new Date();
        const diferenciaDias = (ahora - fechaLogin) / (1000 * 60 * 60 * 24);
        
        // verificar si la sesion ha expirado
        if (diferenciaDias > 7) {
            localStorage.removeItem('secrica_sesion');
            sessionStorage.removeItem('secrica_sesion_temp');
            window.location.href = 'login.html';
            return;
        }
        
        // sesion valida
        return datosSession;
        
    } catch (error) {
        console.error('error al verificar autenticacion:', error);
        window.location.href = 'login.html';
    }
}

function initSistema() {
    // inicializar todos los sistemas
    initDashboard();
    initReportes();
    initClima();
    initSeguimiento();
    initUsuarios();
    
    // cargar seccion inicial
    mostrarSeccion('dashboard');
}

function cargarDatosUsuario() {
    try {
        const sesion = JSON.parse(localStorage.getItem('secrica_sesion'));
        if (sesion) {
            document.getElementById('usuarioActual').textContent = 
                `${sesion.fullName} (${sesion.rol})`;
        }
    } catch (error) {
        console.error('error al cargar datos usuario:', error);
    }
}

function initNavegacion() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const seccion = this.getAttribute('data-section');
            mostrarSeccion(seccion);
            
            // actualizar botones activos
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function mostrarSeccion(seccionId) {
    // ocultar todas las secciones
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    // mostrar seccion seleccionada
    const seccionActiva = document.getElementById(seccionId);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
    
    // cargar datos especificos de la seccion
    switch(seccionId) {
        case 'dashboard':
            actualizarDashboard();
            break;
        case 'reportes':
            cargarReportes();
            break;
        case 'clima':
            if (typeof actualizarClimaIA === 'function') {
                actualizarClimaIA();
            }
            break;
        case 'seguimiento':
            if (typeof actualizarDashboardSeguimiento === 'function') {
                actualizarDashboardSeguimiento();
            }
            break;
        case 'usuarios':
            cargarUsuarios();
            break;
    }
}

function initDashboard() {
    // inicializar dashboard con datos basicos
    console.log('dashboard inicializado');
}

function actualizarDashboard() {
    try {
        // obtener datos de reportes
        const reportes = JSON.parse(localStorage.getItem('secrica_reportes') || '[]');
        const usuarios = JSON.parse(localStorage.getItem('secrica_users') || '[]');
        
        // reportes de hoy
        const hoy = new Date().toDateString();
        const reportesHoy = reportes.filter(r => 
            new Date(r.fecha).toDateString() === hoy
        );
        
        // emergencias abiertas
        const emergenciasAbiertas = reportes.filter(r => 
            r.estado === 'abierto' || r.estado === 'en_proceso'
        );
        
        // actualizar contadores
        document.getElementById('reportesHoy').textContent = reportesHoy.length;
        document.getElementById('usuariosActivos').textContent = usuarios.length + 2; // +2 por usuarios predefinidos
        document.getElementById('emergenciasAbiertas').textContent = emergenciasAbiertas.length;
        
        // clima basico
        document.getElementById('climaActual').textContent = '22°C ☀️';
        document.getElementById('ubicacionClima').textContent = 'Armenia, Quindío';
        
    } catch (error) {
        console.error('error al actualizar dashboard:', error);
    }
}

function initReportes() {
    console.log('sistema de reportes inicializado');
}

function cargarReportes() {
    try {
        const reportes = JSON.parse(localStorage.getItem('secrica_reportes') || '[]');
        const listaElement = document.getElementById('listaReportes');
        
        if (!listaElement) return;
        
        listaElement.innerHTML = `
            <div class="reportes-header">
                <h3>Reportes del Sistema</h3>
                <button class="btn btn-primary" onclick="nuevoReporte()">+ Nuevo Reporte</button>
            </div>
            <div class="reportes-grid">
                ${reportes.map(reporte => `
                    <div class="reporte-card">
                        <h4>${reporte.tipo}</h4>
                        <p><strong>Municipio:</strong> ${reporte.municipio}</p>
                        <p><strong>Fecha:</strong> ${new Date(reporte.fecha).toLocaleDateString()}</p>
                        <p><strong>Estado:</strong> <span class="estado-${reporte.estado}">${reporte.estado}</span></p>
                        <p>${reporte.descripcion}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        if (reportes.length === 0) {
            listaElement.innerHTML += '<p>No hay reportes registrados</p>';
        }
        
    } catch (error) {
        console.error('error al cargar reportes:', error);
    }
}

function initClima() {
    console.log('sistema de clima inicializado');
}

function initSeguimiento() {
    console.log('sistema de seguimiento inicializado');
}

function initUsuarios() {
    console.log('sistema de usuarios inicializado');
}

function cargarUsuarios() {
    try {
        const usuariosRegistrados = JSON.parse(localStorage.getItem('secrica_users') || '[]');
        const usuariosPredefinidos = [
            {
                id: 1,
                username: "cris",
                email: "buenocris02@gmail.com",
                fullName: "Cristopher Bueno",
                rol: "admin",
                activo: true,
                fechaRegistro: "2024-01-01"
            },
            {
                id: 2,
                username: "sebas",
                email: "sebas@gmail.com",
                fullName: "Sebastian Pinilla",
                rol: "funcionario",
                activo: true,
                fechaRegistro: "2024-01-01"
            }
        ];
        
        const todosUsuarios = [...usuariosPredefinidos, ...usuariosRegistrados];
        const listaElement = document.getElementById('listaUsuarios');
        
        if (!listaElement) return;
        
        listaElement.innerHTML = `
            <div class="usuarios-header">
                <h3>Usuarios del Sistema</h3>
                <p>Total: ${todosUsuarios.length} usuarios</p>
            </div>
            <div class="usuarios-grid">
                ${todosUsuarios.map(usuario => `
                    <div class="usuario-card">
                        <h4>${usuario.fullName}</h4>
                        <p><strong>Email:</strong> ${usuario.email}</p>
                        <p><strong>Rol:</strong> ${usuario.rol}</p>
                        <p><strong>Estado:</strong> <span class="estado-${usuario.activo ? 'activo' : 'inactivo'}">${usuario.activo ? 'Activo' : 'Inactivo'}</span></p>
                        <p><strong>Registro:</strong> ${new Date(usuario.fechaRegistro).toLocaleDateString()}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('error al cargar usuarios:', error);
    }
}

function nuevoReporte() {
    // crear nuevo reporte
    const tipo = prompt('Tipo de reporte:');
    const municipio = prompt('Municipio:');
    const descripcion = prompt('Descripción:');
    
    if (tipo && municipio && descripcion) {
        const nuevoReporte = {
            id: Date.now(),
            tipo: tipo,
            municipio: municipio,
            descripcion: descripcion,
            fecha: new Date().toISOString(),
            estado: 'abierto',
            usuario: JSON.parse(localStorage.getItem('secrica_sesion')).username
        };
        
        const reportes = JSON.parse(localStorage.getItem('secrica_reportes') || '[]');
        reportes.push(nuevoReporte);
        localStorage.setItem('secrica_reportes', JSON.stringify(reportes));
        
        cargarReportes();
        actualizarDashboard();
        
        alert('Reporte creado exitosamente');
    }
}

function cerrarSesion() {
    // Mostrar el modal
    document.getElementById('modalCerrarSesion').style.display = 'flex';
}

// Manejo de botones del modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalCerrarSesion');
    const btnConfirmar = document.getElementById('btnConfirmarCerrar');
    const btnCancelar = document.getElementById('btnCancelarCerrar');

    if (btnConfirmar && btnCancelar && modal) {
        btnConfirmar.onclick = function() {
            localStorage.removeItem('secrica_sesion');
            sessionStorage.removeItem('secrica_sesion_temp');
            window.location.href = 'login.html';
        };
        btnCancelar.onclick = function() {
            modal.style.display = 'none';
        };
    }
});

// funciones globales
window.nuevoReporte = nuevoReporte;
window.cerrarSesion = cerrarSesion;
window.mostrarSeccion = mostrarSeccion;

console.log('sistema principal inicializado correctamente');