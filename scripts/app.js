const usuariosAutorizados = [
  {
    email: "buenocris02@gmail.com",
    password: "1234",
    nombre: "Cristopher Bueno",
    rol: "Administrador"
  },
  {
    email: "sebas@gmail.com", 
    password: "4321",
    nombre: "Sebastian Pinilla",
    rol: "Funcionario"
  }
];

// Datos de las unidades radiales por municipio (del documento oficial)
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

// Tipos de emergencia disponibles
const tiposEmergencia = [
  "Incendio Forestal", "Incendio Estructural", "Deslizamiento", "Inundación",
  "Rescate Animal", "Rescate Persona", "Emergencia Médica", "Accidente de Tránsito",
  "Árbol Caído", "Avalancha", "Derrame de Combustible", "Emergencia Tecnológica", "Otra"
];

// Datos de estadísticas del sistema
const estadisticasData = {
  reportesActivos: 15,
  emergenciasResueltas: 142,
  recursosDisponibles: 28,
  alertasTempranas: 3
};

// Regex para validar formato de email
const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Variable global para usuario actual
let usuarioActual = null;

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mensajeLogin = document.getElementById('mensajeLogin');
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const nombreUsuarioElement = document.getElementById('nombreUsuario');
const horaActualElement = document.getElementById('horaActual');
const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');

// Elementos del modal de nuevo reporte
const modalNuevoReporte = document.getElementById('modalNuevoReporte');
const formNuevoReporte = document.getElementById('formNuevoReporte');
const municipioSelect = document.getElementById('municipioReporte');
const unidadesContainer = document.getElementById('unidadesRadialesContainer');
const responsableInput = document.getElementById('responsableReporte');

// Función para guardar datos en localStorage (requerida por instructor)
function guardarEnStorage(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        console.error('error al guardar en localStorage:', error);
        return false;
    }
}

// Función para leer datos del localStorage (requerida por instructor)
function leerDelStorage(clave) {
    try {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : null;
    } catch (error) {
        console.error('error al leer del localStorage:', error);
        return null;
    }
}

// Función para mostrar el último email guardado (requerida por instructor)
function displaySavedEmail() {
    const ultimoEmail = leerDelStorage('ultimoEmailUsado');
    
    // Operador ternario para mostrar el email o dejar vacío (requerido por instructor)
    emailInput.value = ultimoEmail ? ultimoEmail : '';
    
    // Si hay email guardado, poner foco en el campo de contraseña
    ultimoEmail ? passwordInput.focus() : emailInput.focus();
}

// Función para validar formato de email con regex (requerida por instructor)
function validarEmail(email) {
    return regexEmail.test(email);
}

// Función para verificar si las credenciales son válidas
function verificarCredenciales(email, password) {
    return usuariosAutorizados.find(usuario => 
        usuario.email === email && usuario.password === password
    );
}

// Función para mostrar mensajes temporales con setTimeout y función flecha (requerida por instructor)
function mostrarMensajeLogin(mensaje, esError = false) {
    const messageElement = mensajeLogin;
    
    // Operador ternario para el tipo de mensaje (requerido por instructor)
    const tipoClase = esError ? 'mensaje--error' : 'mensaje--exito';
    
    messageElement.textContent = mensaje;
    messageElement.className = `mensaje ${tipoClase}`;
    messageElement.classList.remove('hidden');
    
    // setTimeout con función flecha (requerido por instructor)
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 3000);
}

// Función principal de validación usando operadores ternarios (requerida por instructor)
function procesarLogin(email, password) {
    // Validación con operadores ternarios encadenados (requerida por instructor)
    return !email || !password ? 
        { exito: false, mensaje: 'por favor complete todos los campos' } :
        !validarEmail(email) ? 
        { exito: false, mensaje: 'formato de email inválido' } :
        procesarCredenciales(email, password);
}

// Función para procesar las credenciales del usuario
function procesarCredenciales(email, password) {
    const usuario = verificarCredenciales(email, password);
    
    // Operador ternario para verificar si el usuario existe (requerido por instructor)
    return usuario ? 
        { exito: true, usuario: usuario } :
        { exito: false, mensaje: 'credenciales incorrectas' };
}

// Función para manejar el evento de submit del formulario
function manejarSubmitLogin(evento) {
    evento.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    const resultado = procesarLogin(email, password);
    
    // Usar operador ternario para manejar el resultado (requerido por instructor)
    resultado.exito ? 
        iniciarSesion(resultado.usuario, email) :
        mostrarMensajeLogin(resultado.mensaje, true);
}

// Función para iniciar sesión exitosa
function iniciarSesion(usuario, email) {
    // Guardar el último email usado (no la contraseña por seguridad)
    guardarEnStorage('ultimoEmailUsado', email);
    
    // Establecer usuario actual
    usuarioActual = usuario;
    
    // Mostrar mensaje de éxito
    mostrarMensajeLogin(`¡bienvenido ${usuario.nombre}!`, false);
    
    // setTimeout con función flecha para cambiar a dashboard (requerido por instructor)
    setTimeout(() => {
        mostrarDashboard();
    }, 1500);
}

// Función para mostrar el dashboard
function mostrarDashboard() {
    // Ocultar login y mostrar dashboard
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    
    // Inicializar el dashboard
    inicializarDashboard();
}

// Función para mostrar el login
function mostrarLogin() {
    // Ocultar dashboard y mostrar login
    dashboardPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    
    // Limpiar campos
    passwordInput.value = '';
    
    // Mostrar último email guardado
    displaySavedEmail();
}

// Función para inicializar el dashboard
function inicializarDashboard() {
    // Actualizar nombre del usuario usando operador ternario (requerido por instructor)
    nombreUsuarioElement.textContent = usuarioActual ? 
        `${usuarioActual.nombre} (${usuarioActual.rol})` : 
        'Usuario';
    
    // Cargar municipios en el select
    cargarMunicipios();
    
    // Cargar reportes existentes
    cargarReportesExistentes();
    
    // Actualizar estadísticas
    actualizarEstadisticas();
    
    // Iniciar el reloj en tiempo real
    iniciarReloj();
}

// Función para cargar municipios en el select
function cargarMunicipios() {
    const municipios = Object.keys(unidadesRadiales);
    municipioSelect.innerHTML = '<option value="">Seleccionar municipio</option>';
    
    municipios.forEach(municipio => {
        const option = document.createElement('option');
        option.value = municipio;
        option.textContent = municipio;
        municipioSelect.appendChild(option);
    });
}

// Función para actualizar unidades radiales según municipio seleccionado
function actualizarUnidadesRadiales() {
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

// Función para actualizar responsables según unidades seleccionadas
function actualizarResponsables() {
    const checkboxes = unidadesContainer.querySelectorAll('input[type="checkbox"]:checked');
    const responsables = [];
    
    checkboxes.forEach(checkbox => {
        const municipioSeleccionado = municipioSelect.value;
        const unidades = unidadesRadiales[municipioSeleccionado];
        const unidad = unidades.find(u => u.codigo === checkbox.value);
        
        // Usar operador ternario para verificar si existe responsable
        unidad && unidad.responsable !== '(Sin asignación)' ? 
            responsables.push(unidad.responsable) : null;
    });
    
    responsableInput.value = responsables.join(', ');
}

// Función para abrir modal de nuevo reporte
function abrirModalNuevoReporte() {
    modalNuevoReporte.classList.remove('hidden');
    
    // Establecer fecha y hora actual
    const ahora = new Date();
    const fechaHoraActual = ahora.toISOString().slice(0, 16);
    document.getElementById('fechaHoraReporte').value = fechaHoraActual;
}

// Función para cerrar modal de nuevo reporte
function cerrarModalNuevoReporte() {
    modalNuevoReporte.classList.add('hidden');
    formNuevoReporte.reset();
    unidadesContainer.innerHTML = '';
    responsableInput.value = '';
}

// Función para manejar submit del formulario de nuevo reporte
function manejarSubmitNuevoReporte(evento) {
    evento.preventDefault();
    
    // Obtener valores del formulario
    const fechaHora = document.getElementById('fechaHoraReporte').value;
    const tipoEmergencia = document.getElementById('tipoEmergencia').value;
    const municipio = document.getElementById('municipioReporte').value;
    const prioridad = document.getElementById('prioridadReporte').value;
    const descripcion = document.getElementById('descripcionReporte').value;
    const ubicacion = document.getElementById('ubicacionReporte').value;
    const responsable = document.getElementById('responsableReporte').value;
    
    // Obtener unidades seleccionadas
    const unidadesSeleccionadas = [];
    const checkboxes = unidadesContainer.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => unidadesSeleccionadas.push(cb.value));
    
    // Validar que haya al menos una unidad seleccionada
    if (unidadesSeleccionadas.length === 0) {
        alert('Debe seleccionar al menos una unidad radial');
        return;
    }
    
    // Crear nuevo reporte
    const nuevoReporte = {
        id: Date.now(),
        fechaHora: fechaHora,
        tipoEmergencia: tipoEmergencia,
        municipio: municipio,
        prioridad: prioridad,
        descripcion: descripcion,
        ubicacion: ubicacion,
        responsable: responsable,
        unidadesRadiales: unidadesSeleccionadas,
        fechaCreacion: new Date().toISOString(),
        usuario: usuarioActual.nombre,
        estado: 'ACTIVO'
    };
    
    // Guardar reporte en localStorage
    const reportesExistentes = leerDelStorage('reportesDefensaCivil') || [];
    reportesExistentes.push(nuevoReporte);
    guardarEnStorage('reportesDefensaCivil', reportesExistentes);
    
    // Actualizar estadísticas
    estadisticasData.reportesActivos++;
    actualizarEstadisticas();
    
    // Cerrar modal y recargar reportes
    cerrarModalNuevoReporte();
    cargarReportesExistentes();
    
    // Mostrar mensaje de éxito
    alert('Reporte guardado exitosamente');
}

// Función para cargar reportes existentes
function cargarReportesExistentes() {
    const reportes = leerDelStorage('reportesDefensaCivil') || [];
    const reportesList = document.getElementById('reportesList');
    
    if (reportes.length === 0) {
        reportesList.innerHTML = '<p class="no-reports">No hay reportes registrados</p>';
        return;
    }
    
    // Ordenar reportes por fecha (más recientes primero)
    reportes.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    
    reportesList.innerHTML = '';
    
    reportes.slice(0, 5).forEach(reporte => {
        const reporteDiv = document.createElement('div');
        reporteDiv.className = 'report-item';
        
        const fecha = new Date(reporte.fechaHora);
        const fechaFormateada = fecha.toLocaleDateString('es-CO');
        
        // Usar operador ternario para clase de prioridad
        const clasePrioridad = reporte.prioridad === 'ALTA' ? 'status--alta' :
                             reporte.prioridad === 'MEDIA' ? 'status--media' : 'status--baja';
        
        reporteDiv.innerHTML = `
            <div class="report-status ${clasePrioridad}">${reporte.prioridad}</div>
            <div class="report-content">
                <h4>${reporte.tipoEmergencia}</h4>
                <p>${reporte.municipio} - ${reporte.ubicacion || 'Sin ubicación específica'}</p>
                <p class="report-description">${reporte.descripcion.substring(0, 100)}...</p>
                <span class="report-time">${fechaFormateada} - ${reporte.responsable}</span>
            </div>
        `;
        
        reportesList.appendChild(reporteDiv);
    });
}

// Función para actualizar las estadísticas del dashboard
function actualizarEstadisticas() {
    const reportesActivosEl = document.getElementById('reportesActivos');
    const emergenciasResueltasEl = document.getElementById('emergenciasResueltas');
    const recursosDisponiblesEl = document.getElementById('recursosDisponibles');
    const alertasTemplanasEl = document.getElementById('alertasTempranas');
    
    // Usar operadores ternarios para verificar elementos (requerido por instructor)
    reportesActivosEl ? reportesActivosEl.textContent = estadisticasData.reportesActivos : null;
    emergenciasResueltasEl ? emergenciasResueltasEl.textContent = estadisticasData.emergenciasResueltas : null;
    recursosDisponiblesEl ? recursosDisponiblesEl.textContent = estadisticasData.recursosDisponibles : null;
    alertasTemplanasEl ? alertasTemplanasEl.textContent = estadisticasData.alertasTempranas : null;
}

// Función para iniciar el reloj con setTimeout y función flecha (requerida por instructor)
function iniciarReloj() {
    function actualizarHora() {
        const ahora = new Date();
        const horaFormateada = ahora.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Bogota'
        });
        
        // Operador ternario para verificar si el elemento existe (requerido por instructor)
        horaActualElement ? horaActualElement.textContent = horaFormateada : null;
        
        // setTimeout con función flecha para actualizar cada segundo (requerido por instructor)
        setTimeout(() => {
            actualizarHora();
        }, 1000);
    }
    
    // Iniciar el reloj inmediatamente
    actualizarHora();
}

// Función para cerrar sesión
function cerrarSesion() {
    usuarioActual = null;
    mostrarLogin();
}

// Funciones para las acciones del dashboard (ahora con funcionalidad real)

// Función para ver emergencias activas
function verEmergenciasActivas() {
    const reportes = leerDelStorage('reportesDefensaCivil') || [];
    const emergenciasActivas = reportes.filter(r => r.estado === 'ACTIVO');
    
    const mensaje = emergenciasActivas.length > 0 ? 
        `Emergencias Activas: ${emergenciasActivas.length}\n\n` +
        emergenciasActivas.map(r => `• ${r.tipoEmergencia} en ${r.municipio} (${r.prioridad})`).join('\n') :
        'No hay emergencias activas en este momento';
    
    alert(mensaje);
}

// Función para ver alertas tempranas
function verAlertasTempranas() {
    alert(`Sistema de Alertas Tempranas\n\nAlertas activas: ${estadisticasData.alertasTempranas}\n\n• Riesgo de deslizamiento en zona montañosa\n• Nivel de ríos en observación\n• Condiciones meteorológicas adversas`);
}

// Función para gestionar recursos
function gestionarRecursos() {
    const totalUnidades = Object.values(unidadesRadiales).reduce((total, unidades) => total + unidades.length, 0);
    alert(`Gestión de Recursos\n\nRecursos disponibles: ${estadisticasData.recursosDisponibles}\nUnidades radiales: ${totalUnidades}\nPersonal activo: ${totalUnidades} responsables\n\nTodos los recursos están operativos y listos para respuesta inmediata.`);
}

// Función para exportar bitácora
function exportarBitacora() {
    const reportes = leerDelStorage('reportesDefensaCivil') || [];
    
    if (reportes.length === 0) {
        alert('No hay reportes para exportar');
        return;
    }
    
    // Crear CSV con los datos
    const csvContent = [
        'Fecha,Tipo,Municipio,Prioridad,Descripción,Responsable,Usuario',
        ...reportes.map(r => 
            `"${r.fechaHora}","${r.tipoEmergencia}","${r.municipio}","${r.prioridad}","${r.descripcion}","${r.responsable}","${r.usuario}"`
        )
    ].join('\n');
    
    // Crear archivo para descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bitacora_defensa_civil_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Función para ver detalles de municipios
function verDetallesMunicipios() {
    const modalDetalles = document.getElementById('modalDetallesMunicipios');
    const contenido = document.getElementById('detallesMunicipiosContent');
    
    let html = '';
    
    Object.entries(unidadesRadiales).forEach(([municipio, unidades]) => {
        html += `
            <div class="municipio-detalle">
                <h3>${municipio}</h3>
                <div class="unidades-list">
                    ${unidades.map(unidad => `
                        <div class="unidad-item">
                            <strong>${unidad.codigo}</strong><br>
                            Responsable: ${unidad.responsable}<br>
                            ${unidad.telefono ? `Teléfono: ${unidad.telefono}` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    contenido.innerHTML = html;
    modalDetalles.classList.remove('hidden');
}

// Función para cerrar modal de detalles de municipios
function cerrarModalDetallesMunicipios() {
    document.getElementById('modalDetallesMunicipios').classList.add('hidden');
}

// Función que se ejecuta cuando se carga el DOM (requerida por instructor)
function inicializarSistema() {
    // Agregar event listener al formulario de login
    loginForm.addEventListener('submit', manejarSubmitLogin);
    
    // Agregar event listener al botón de cerrar sesión
    cerrarSesionBtn.addEventListener('click', cerrarSesion);
    
    // Agregar event listener al formulario de nuevo reporte
    formNuevoReporte.addEventListener('submit', manejarSubmitNuevoReporte);
    
    // Mostrar el último email guardado
    displaySavedEmail();
    
    // Simular actualizaciones periódicas de estadísticas
    iniciarActualizacionesEstadisticas();
}

// Función para simular actualizaciones de estadísticas en tiempo real
function iniciarActualizacionesEstadisticas() {
    // Función con setTimeout y arrow function para actualizar estadísticas cada 45 segundos
    setTimeout(() => {
        // Usar operadores ternarios para incrementar estadísticas aleatoriamente (requerido por instructor)
        estadisticasData.reportesActivos = Math.random() > 0.8 ? 
            estadisticasData.reportesActivos + 1 : 
            estadisticasData.reportesActivos;
        
        estadisticasData.emergenciasResueltas = Math.random() > 0.9 ? 
            estadisticasData.emergenciasResueltas + 1 : 
            estadisticasData.emergenciasResueltas;
        
        // Si el usuario está logueado, actualizar las estadísticas en pantalla
        usuarioActual && !dashboardPage.classList.contains('hidden') ? 
            actualizarEstadisticas() : null;
        
        // Programar la siguiente actualización
        iniciarActualizacionesEstadisticas();
    }, 45000); // cada 45 segundos
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', inicializarSistema);

// Función adicional para debug del sistema (opcional)
function mostrarEstadoSistema() {
    console.log('=== estado del sistema ===');
    console.log('usuario actual:', usuarioActual);
    console.log('estadísticas:', estadisticasData);
    console.log('último email guardado:', leerDelStorage('ultimoEmailUsado'));
    console.log('reportes guardados:', leerDelStorage('reportesDefensaCivil'));
    console.log('unidades radiales registradas:', Object.keys(unidadesRadiales).length);
}

// Función para limpiar datos del storage (para testing)
function limpiarStorage() {
    try {
        localStorage.removeItem('ultimoEmailUsado');
        localStorage.removeItem('reportesDefensaCivil');
        console.log('storage limpiado correctamente');
    } catch (error) {
        console.error('error al limpiar storage:', error);
    }
}

// Hacer disponibles algunas funciones globalmente para debug
window.debugDefensaCivil = {
    mostrarEstado: mostrarEstadoSistema,
    limpiarStorage: limpiarStorage,
    usuarioActual: () => usuarioActual,
    estadisticas: () => estadisticasData,
    reportes: () => leerDelStorage('reportesDefensaCivil')
};