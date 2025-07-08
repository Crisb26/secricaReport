// --- Unidades radiales por municipio ---
const unidadesRadiales = {
  "Salento": [
    {"codigo": "Salento 1", "responsable": "Alba Lucia Galvis", "telefono": ""}
  ],
  "Circasia": [
    {"codigo": "Circasia 1", "responsable": "Julian Arnobi Rodriguez", "telefono": ""},
    {"codigo": "Circasia 2", "responsable": "Cristopher Bueno", "telefono": ""},
    {"codigo": "Circasia 3", "responsable": "José Deivys Angel", "telefono": ""}
  ],
  "Quimbaya": [
    {"codigo": "Quimbaya 1", "responsable": "Julian Gomez", "telefono": ""},
    {"codigo": "Quimbaya 2", "responsable": "Jose Benjamin Patiño", "telefono": ""},
    {"codigo": "Quimbaya 3", "responsable": "Jorge Eliecer Castaño", "telefono": ""}
  ],
  "Montenegro": [
    {"codigo": "Montenegro 1", "responsable": "Orlando Toro Leiva", "telefono": ""},
    {"codigo": "Montenegro 2", "responsable": "Israel Rodriguez Gomez", "telefono": ""},
    {"codigo": "Montenegro 3", "responsable": "Martha Ramirez", "telefono": ""}
  ],
  "La Tebaida": [
    {"codigo": "La Tebaida 1", "responsable": "Juan Esteban Cuellar", "telefono": ""},
    {"codigo": "La Tebaida 2", "responsable": "Jorge Mejia", "telefono": ""},
    {"codigo": "La Tebaida 3", "responsable": "(Sin asignación)", "telefono": ""}
  ],
  "Tigreros": [
    {"codigo": "Tigreros 1", "responsable": "Carlos Hernandez", "telefono": ""},
    {"codigo": "Tigreros 2", "responsable": "Jhony Alejandro Giraldo", "telefono": ""},
    {"codigo": "Tigreros 3", "responsable": "Leidy Correa", "telefono": ""}
  ],
  "Comité Regional": [
    {"codigo": "Comité Regional 1", "responsable": "Luis Felipe Cadena", "telefono": ""},
    {"codigo": "Comité Regional 2", "responsable": "Andrés Fernando Sosa", "telefono": ""},
    {"codigo": "Comité Regional 3", "responsable": "Rodrigo Rodriguez", "telefono": ""}
  ],
  "Comité Central": [
    {"codigo": "Comité Central 1", "responsable": "Cesar Andres Pinada Ochado", "telefono": ""},
    {"codigo": "Comité Central 2", "responsable": "Fabio Augusto Largo", "telefono": ""},
    {"codigo": "Comité Central 3", "responsable": "Carlos Andres Puentes", "telefono": ""}
  ],
  "Calarcá": [
    {"codigo": "Calarcá 1", "responsable": "Henry Hernandez", "telefono": ""},
    {"codigo": "Calarcá 2", "responsable": "Luis Londoño", "telefono": ""},
    {"codigo": "Calarcá 3", "responsable": "Gloria Milena Restrepo", "telefono": ""}
  ],
  "Córdoba": [
    {"codigo": "Córdoba", "responsable": "Lida Ines Poveda", "telefono": "314 7509697"}
  ],
  "Pijao": [
    {"codigo": "Pijao", "responsable": "Stefhanie Herrera Gil", "telefono": "311 8737803"}
  ],
  "Génova": [
    {"codigo": "Génova", "responsable": "Ruben Dario Gomez", "telefono": "313 7636264"}
  ]
};

// Cargar municipios en el select del modal de reporte
function cargarMunicipios() {
    const municipios = Object.keys(unidadesRadiales);
    const municipioSelect = document.getElementById('municipioReporte');
    if (!municipioSelect) return;
    municipioSelect.innerHTML = '<option value="">Seleccionar municipio</option>';
    municipios.forEach(municipio => {
        const option = document.createElement('option');
        option.value = municipio;
        option.textContent = municipio;
        municipioSelect.appendChild(option);
    });
}

// Actualizar unidades radiales según municipio seleccionado
function actualizarUnidadesRadiales() {
    const municipioSelect = document.getElementById('municipioReporte');
    const unidadesContainer = document.getElementById('unidadesRadialesContainer');
    const responsableInput = document.getElementById('responsableReporte');
    if (!municipioSelect || !unidadesContainer || !responsableInput) return;
    const municipioSeleccionado = municipioSelect.value;
    unidadesContainer.innerHTML = '';
    responsableInput.value = '';
    if (!municipioSeleccionado) return;
    const unidades = unidadesRadiales[municipioSeleccionado];
    unidades.forEach(unidad => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `unidad_${unidad.codigo.replace(/\s+/g, '_')}`;
        checkbox.value = unidad.codigo;
        checkbox.addEventListener('change', actualizarResponsables);
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = `${unidad.codigo} - ${unidad.responsable}`;
        div.appendChild(checkbox);
        div.appendChild(label);
        unidadesContainer.appendChild(div);
    });
}

// Autocompletar responsables según unidades seleccionadas
function actualizarResponsables() {
    const municipioSelect = document.getElementById('municipioReporte');
    const unidadesContainer = document.getElementById('unidadesRadialesContainer');
    const responsableInput = document.getElementById('responsableReporte');
    if (!municipioSelect || !unidadesContainer || !responsableInput) return;
    const checkboxes = unidadesContainer.querySelectorAll('input[type="checkbox"]:checked');
    const responsables = [];
    checkboxes.forEach(checkbox => {
        const municipioSeleccionado = municipioSelect.value;
        const unidades = unidadesRadiales[municipioSeleccionado];
        const unidad = unidades.find(u => u.codigo === checkbox.value);
        unidad && unidad.responsable !== '(Sin asignación)' ?
            responsables.push(unidad.responsable) : null;
    });
    responsableInput.value = responsables.join(', ');
}

// --- Utilidades de storage ---
function guardarEnStorage(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        console.error('error al guardar en localStorage:', error);
        return false;
    }
}
function leerDelStorage(clave) {
    try {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : null;
    } catch (error) {
        console.error('error al leer del localStorage:', error);
        return null;
    }
}

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
                <button class="btn btn-primary" onclick="abrirModalNuevoReporte()">+ Nuevo Reporte</button>
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

function exportarBitacora() {
    const reportes = JSON.parse(localStorage.getItem('secrica_reportes') || '[]');
    if (reportes.length === 0) {
        alert('No hay reportes para exportar');
        return;
    }
    const csvContent = [
        'Fecha,Tipo,Municipio,Prioridad,Descripción,Responsable,Usuario',
        ...reportes.map(r =>
            `"${r.fecha}","${r.tipo}","${r.municipio}","${r.prioridad}","${r.descripcion}","${r.responsable}","${r.usuario}"`
        )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bitacora_secrica_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
window.exportarBitacora = exportarBitacora;

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

function abrirModalNuevoReporte() {
    console.log('abrirModalNuevoReporte llamado');
    const modal = document.getElementById('modalNuevoReporte');
    if (!modal) return;
    modal.classList.remove('hidden');
    cargarMunicipios();
    // Establecer fecha y hora actual
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    const hours = String(ahora.getHours()).padStart(2, '0');
    const minutes = String(ahora.getMinutes()).padStart(2, '0');
    const fechaHoraActual = `${year}-${month}-${day}T${hours}:${minutes}`;
    const fechaInput = document.getElementById('fechaHoraReporte');
    if (fechaInput) fechaInput.value = fechaHoraActual;
}

function cerrarModalNuevoReporte() {
    const modal = document.getElementById('modalNuevoReporte');
    if (!modal) return;
    modal.classList.add('hidden');
    const form = document.getElementById('formNuevoReporte');
    if (form) form.reset();
    const unidadesContainer = document.getElementById('unidadesRadialesContainer');
    if (unidadesContainer) unidadesContainer.innerHTML = '';
    const responsableInput = document.getElementById('responsableReporte');
    if (responsableInput) responsableInput.value = '';
}

// Manejar el submit del formulario de nuevo reporte
function manejarSubmitNuevoReporte(event) {
    event.preventDefault();
    // Obtener valores del formulario
    const fechaHora = document.getElementById('fechaHoraReporte').value;
    const tipoEmergencia = document.getElementById('tipoEmergencia').value;
    const municipio = document.getElementById('municipioReporte').value;
    const prioridad = document.getElementById('prioridadReporte').value;
    const descripcion = document.getElementById('descripcionReporte').value;
    const ubicacion = document.getElementById('ubicacionReporte').value;
    const responsable = document.getElementById('responsableReporte').value;
    const unidadesContainer = document.getElementById('unidadesRadialesContainer');
    // Unidades seleccionadas
    const unidadesSeleccionadas = [];
    if (unidadesContainer) {
        const checkboxes = unidadesContainer.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(cb => unidadesSeleccionadas.push(cb.value));
    }
    if (unidadesSeleccionadas.length === 0) {
        alert('Debe seleccionar al menos una unidad radial');
        return;
    }
    // Crear nuevo reporte
    const sesion = JSON.parse(localStorage.getItem('secrica_sesion'));
    const nuevoReporte = {
        id: Date.now(),
        fecha: fechaHora,
        tipo: tipoEmergencia,
        municipio: municipio,
        prioridad: prioridad,
        descripcion: descripcion,
        ubicacion: ubicacion,
        responsable: responsable,
        unidadesRadiales: unidadesSeleccionadas,
        fechaCreacion: new Date().toISOString(),
        usuario: sesion ? sesion.fullName : 'Desconocido',
        estado: 'abierto'
    };
    // Guardar reporte
    const reportes = JSON.parse(localStorage.getItem('secrica_reportes') || '[]');
    reportes.push(nuevoReporte);
    localStorage.setItem('secrica_reportes', JSON.stringify(reportes));
    cerrarModalNuevoReporte();
    cargarReportes();
    actualizarDashboard && actualizarDashboard();
    alert('Reporte guardado exitosamente');
}

function cerrarSesion() {
    // Mostrar el modal
    document.getElementById('modalCerrarSesion').style.display = 'flex';
}

// Manejo del modal de cerrar sesión
document.addEventListener('DOMContentLoaded', function() {
    console.log('sistema principal cargado');
    verificarAutenticacion();
    initSistema();
    cargarDatosUsuario();
    initNavegacion();

    // Manejo de botones del modal de cerrar sesión
    const modalCerrar = document.getElementById('modalCerrarSesion');
    const btnConfirmar = document.getElementById('btnConfirmarCerrar');
    const btnCancelar = document.getElementById('btnCancelarCerrar');
    if (btnConfirmar && btnCancelar && modalCerrar) {
        btnConfirmar.onclick = function() {
            localStorage.removeItem('secrica_sesion');
            sessionStorage.removeItem('secrica_sesion_temp');
            window.location.href = 'login.html';
        };
        btnCancelar.onclick = function() {
            modalCerrar.style.display = 'none';
        };
    }

    // Listeners para el modal de nuevo reporte
    const formNuevoReporte = document.getElementById('formNuevoReporte');
    if (formNuevoReporte) {
        formNuevoReporte.addEventListener('submit', manejarSubmitNuevoReporte);
    }
    const municipioSelect = document.getElementById('municipioReporte');
    if (municipioSelect) {
        municipioSelect.addEventListener('change', actualizarUnidadesRadiales);
    }
});

window.abrirModalNuevoReporte = abrirModalNuevoReporte;
window.cerrarModalNuevoReporte = cerrarModalNuevoReporte;
window.cerrarSesion = cerrarSesion;
window.mostrarSeccion = mostrarSeccion;

console.log('sistema principal inicializado correctamente');