function cargarusuariossistema() {
    try {
        const usuarioslocal = localstorage.getitem('secrica_users');
        const usuariosregistrados = usuarioslocal ? json.parse(usuarioslocal) : [];
        
        // combinar con usuarios existentes
        const todoslosusuarios = [...usuariosautorizados, ...usuariosregistrados];
        
        console.log(`usuarios cargados: ${todoslosusuarios.length}`);
        return todoslosusuarios;
    } catch (error) {
        console.error('error al cargar usuarios del sistema:', error);
        return usuariosautorizados;
    }
}

// actualizar funcion de verificacion de credenciales
function verificarcredencialesactualizadas(email, password) {
    const todosusuarios = cargarusuariossistema();
    
    return todosusuarios.find(usuario => 
        (usuario.email === email || usuario.username === email) && 
        usuario.password === password &&
        usuario.activo === true
    );
}

// reemplazar la funcion verificarcredenciales original
const verificarcredencialesoriginal = verificarcredenciales;
verificarcredenciales = verificarcredencialesactualizadas;

console.log('integracion con sistema de registro completada');

// función para redirigir a páginas correctas
function redirigirAPagina(pagina) {
    window.location.href = pagina;
}

// actualizar las redirecciones en el sistema
function mostrarLogin() {
    redirigirAPagina('login.html');
}

function mostrarRegistro() {
    redirigirAPagina('registro.html');
}

function volverAlInicio() {
    redirigirAPagina('index.html');
}