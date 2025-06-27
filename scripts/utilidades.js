// funciones de utilidad para secrica report
// desarrollado por sebastian, cristopher y camila

// funciones de validacion
function validarcampo(valor, tipo) {
    if (!valor || valor.trim() === '') {
        return false;
    }
    
    switch (tipo) {
        case 'email':
            return validaremail(valor);
        case 'password':
            return validarpassword(valor);
        case 'texto':
            return validartexto(valor);
        default:
            return true;
    }
}

function validaremail(email) {
    const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patron.test(email);
}

function validarpassword(password) {
    // minimo 4 caracteres
    return password.length >= 4;
}

function validartexto(texto) {
    // solo letras, numeros y espacios
    const patron = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+$/;
    return patron.test(texto);
}

// funciones de formato
function formatearfecha(fecha, formato = 'dd/mm/yyyy') {
    const fechaobj = new Date(fecha);
    const dia = String(fechaobj.getDate()).padStart(2, '0');
    const mes = String(fechaobj.getMonth() + 1).padStart(2, '0');
    const año = fechaobj.getFullYear();
    
    switch (formato) {
        case 'dd/mm/yyyy':
            return `${dia}/${mes}/${año}`;
        case 'yyyy-mm-dd':
            return `${año}-${mes}-${dia}`;
        case 'texto':
            const meses = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];
            return `${dia} de ${meses[fechaobj.getMonth()]} de ${año}`;
        default:
            return `${dia}/${mes}/${año}`;
    }
}

function formatearchora(fecha) {
    const fechaobj = new Date(fecha);
    const horas = String(fechaobj.getHours()).padStart(2, '0');
    const minutos = String(fechaobj.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

function formatearnumero(numero, decimales = 0) {
    return Number(numero).toLocaleString('es-CO', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    });
}

// funciones de almacenamiento local
function guardardatolocal(clave, valor) {
    try {
        const datos = JSON.stringify(valor);
        localStorage.setItem(clave, datos);
        return true;
    } catch (error) {
        console.error('error al guardar datos locales:', error);
        return false;
    }
}

function cargardatolocal(clave) {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : null;
    } catch (error) {
        console.error('error al cargar datos locales:', error);
        return null;
    }
}

function eliminardatolocal(clave) {
    try {
        localStorage.removeItem(clave);
        return true;
    } catch (error) {
        console.error('error al eliminar datos locales:', error);
        return false;
    }
}

// funciones de interfaz de usuario
function mostrarnotificacion(mensaje, tipo = 'info', duracion = 3000) {
    // crear elemento de notificacion
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    // estilos inline para la notificacion
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 9999;
        animation: deslizarentrada 0.3s ease;
        max-width: 300px;
    `;
    
    // colores segun el tipo
    switch (tipo) {
        case 'exito':
            notificacion.style.background = '#10b981';
            break;
        case 'error':
            notificacion.style.background = '#ef4444';
            break;
        case 'advertencia':
            notificacion.style.background = '#f59e0b';
            break;
        default:
            notificacion.style.background = '#3b82f6';
    }
    
    // agregar al document
    document.body.appendChild(notificacion);
    
    // eliminar despues de la duracion
    setTimeout(() => {
        notificacion.style.animation = 'deslizarsalida 0.3s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, duracion);
}

function confirmaraccion(mensaje, callback) {
    if (confirm(mensaje)) {
        if (typeof callback === 'function') {
            callback();
        }
        return true;
    }
    return false;
}

// funciones de carga
function mostrarcargando(elemento, texto = 'cargando...') {
    if (elemento) {
        elemento.innerHTML = `
            <div class="indicador-carga">
                <div class="spinner"></div>
                <span>${texto}</span>
            </div>
        `;
        elemento.style.cssText += `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        `;
    }
}

function ocultarcargando(elemento, contenidooriginal) {
    if (elemento) {
        elemento.innerHTML = contenidooriginal || '';
        elemento.style.display = '';
    }
}

// funciones de manipulacion del dom
function crearelemento(tag, clases = '', contenido = '') {
    const elemento = document.createElement(tag);
    if (clases) {
        elemento.className = clases;
    }
    if (contenido) {
        elemento.textContent = contenido;
    }
    return elemento;
}

function agregarelemento(padre, hijo) {
    if (padre && hijo) {
        padre.appendChild(hijo);
    }
}

function eliminarelemento(elemento) {
    if (elemento && elemento.parentNode) {
        elemento.parentNode.removeChild(elemento);
    }
}

// funciones de eventos
function agregarevento(elemento, evento, funcion) {
    if (elemento && typeof funcion === 'function') {
        elemento.addEventListener(evento, funcion);
    }
}

function eliminarevento(elemento, evento, funcion) {
    if (elemento && typeof funcion === 'function') {
        elemento.removeEventListener(evento, funcion);
    }
}

// funciones de utilidad general
function generarid() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

function esperartiempo(milisegundos) {
    return new Promise(resolve => setTimeout(resolve, milisegundos));
}

function copiaraltexto(texto) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(texto);
    } else {
        // fallback para navegadores viejos
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        textarea.select();
        const resultado = document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve(resultado);
    }
}

// funciones especificas para secrica
function obtenercolorestabla(estado) {
    const colores = {
        'activo': '#10b981',
        'inactivo': '#ef4444',
        'pendiente': '#f59e0b',
        'procesando': '#3b82f6',
        'completado': '#10b981',
        'cancelado': '#6b7280'
    };
    return colores[estado.toLowerCase()] || '#6b7280';
}

function formatearestado(estado) {
    const estados = {
        'activo': 'Activo',
        'inactivo': 'Inactivo',
        'pendiente': 'Pendiente',
        'procesando': 'En Proceso',
        'completado': 'Completado',
        'cancelado': 'Cancelado'
    };
    return estados[estado.toLowerCase()] || estado;
}

// exportar funciones para uso global
window.utilidadessecrica = {
    validarcampo,
    validaremail,
    validarpassword,
    validartexto,
    formatearfecha,
    formatearchora,
    formatearnumero,
    guardardatolocal,
    cargardatolocal,
    eliminardatolocal,
    mostrarnotificacion,
    confirmaraccion,
    mostrarcargando,
    ocultarcargando,
    crearelemento,
    agregarelemento,
    eliminarelemento,
    agregarevento,
    eliminarevento,
    generarid,
    esperartiempo,
    copiaraltexto,
    obtenercolorestabla,
    formatearestado
};

console.log('utilidades de secrica report cargadas correctamente');