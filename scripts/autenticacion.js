const valido = verificarContrasenaAvanzada(password, hash);


class SistemaAutenticacion {
    constructor() {
        this.usuariosPredefinidos = [
            {
                id: 1,
                nombreUsuario: "cris",
                correo: "buenocris02@gmail.com",
                nombreCompleto: "Cristopher Bueno",
                rol: "administrador",
                activo: true,
                fechaRegistro: "2024-01-01T00:00:00.000Z",
                contrasena: "cris123"
            },
            {
                id: 2,
                nombreUsuario: "sebas",
                correo: "sebas@gmail.com",
                nombreCompleto: "Sebastian Pinilla",
                rol: "funcionario",
                activo: true,
                fechaRegistro: "2024-01-01T00:00:00.000Z",
                contrasena: "sebas123"
            }
        ];
        this.sesionActual = null;
        this.tiempoExpiracionSesion = 24 * 60 * 60 * 1000; // 24 horas
    }

    /**
     * Inicializa el sistema de autenticación
     */
    inicializar() {
        this.cargarSesionGuardada();
        this.configurarEventosFormulario();
        this.cargarUltimoCorreo();
    }

    /**
     * Configura los eventos del formulario de login
     */
    configurarEventosFormulario() {
        const formulario = document.getElementById('formularioIngreso');
        if (!formulario) return;

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            this.procesarIngreso();
        });

        // Auto-guardar correo mientras se escribe
        const campoCorreo = document.getElementById('correoUsuario');
        if (campoCorreo) {
            campoCorreo.addEventListener('input', () => {
                this.guardarCorreoTemporal(campoCorreo.value);
            });
        }
    }

    /**
     * Procesa el intento de ingreso
     */
    async procesarIngreso() {
        const correo = document.getElementById('correoUsuario').value.trim().toLowerCase();
        const contrasena = document.getElementById('contrasenaUsuario').value;
        const recordar = document.getElementById('recordarUsuario').checked;

        // Validaciones básicas
        if (!correo || !contrasena) {
            this.mostrarMensaje('Por favor ingresa correo y contraseña', 'error');
            return;
        }

        if (!this.validarFormatoCorreo(correo)) {
            this.mostrarMensaje('Formato de correo inválido', 'error');
            return;
        }

        try {
            this.mostrarMensaje('Verificando credenciales...', 'info');
            
            // Obtener todos los usuarios
            const todosUsuarios = await this.obtenerTodosUsuarios();
            
            // Buscar usuario
            const usuario = this.buscarUsuario(correo, todosUsuarios);
            if (!usuario) {
                this.mostrarMensaje('Usuario no encontrado', 'error');
                return;
            }

            // Verificar si está activo
            if (!usuario.activo) {
                this.mostrarMensaje('Cuenta desactivada. Contacta al administrador', 'error');
                return;
            }

            // Verificar contraseña
            const contrasenaValida = this.verificarCredenciales(contrasena, usuario.contrasena);
            if (!contrasenaValida) {
                this.mostrarMensaje('Contraseña incorrecta', 'error');
                return;
            }

            // Login exitoso
            this.mostrarMensaje('¡Ingreso exitoso! Redirigiendo...', 'exito');
            await this.crearSesion(usuario, recordar);
            this.guardarUltimoCorreo(correo);

            // Redireccionar después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'panel-principal.html';
            }, 1500);

        } catch (error) {
            console.error('Error en el proceso de ingreso:', error);
            this.mostrarMensaje('Error del sistema. Intenta de nuevo', 'error');
        }
    }

    /**
     * Obtiene todos los usuarios del sistema
     */
    async obtenerTodosUsuarios() {
        const usuaruiosLocales = JSON.parse(localStorage.getItem('secrica_usuarios') || '[]');
        console.log("Usuarios cargados desde LocalStorage:", usuaruiosLocales);
        return [...usuariosLocales];
    }

    /**
     * Busca un usuario por correo o nombre de usuario
     */
    buscarUsuario(identificador, listaUsuarios) {
        return listaUsuarios.find(usuario => 
            (usuario.correo && usuario.correo.toLowerCase() === identificador) ||
            (usuario.nombreUsuario && usuario.nombreUsuario.toLowerCase() === identificador)
        );
    }

    /**
     * Verifica las credenciales del usuario
     */
    verificarCredenciales(contrasenaIngresada, contrasenaAlmacenada) {
        try {
            return verificarContrasenaCifrada(contrasenaIngresada, contrasenaAlmacenada);
        } catch (error) {
            console.warn('⚠️ Fallo al usar verificación cifrada, usando fallback:', error);
            return contrasenaIngresada === contrasenaAlmacenada;
        }   

    }
    /**
     * Crea una nueva sesión de usuario
     */
    async crearSesion(usuario, recordar = false) {
        const datosSession = {
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            correo: usuario.correo,
            nombreCompleto: usuario.nombreCompleto,
            rol: usuario.rol,
            fechaIngreso: new Date().toISOString(),
            expiracion: new Date(Date.now() + this.tiempoExpiracionSesion).toISOString(),
            activo: true
        };

        // Generar token de sesión si hay función disponible
        if (typeof generarTokenSesion === 'function') {
            datosSession.token = generarTokenSesion(usuario);
        }

        // Guardar sesión
        const datosSessionCifrados = typeof cifrarDatosLocales === 'function' 
            ? cifrarDatosLocales(datosSession)
            : JSON.stringify(datosSession);

        localStorage.setItem('secrica_sesion', datosSessionCifrados);
        
        if (recordar) {
            sessionStorage.setItem('secrica_sesion_temporal', datosSessionCifrados);
        }

        this.sesionActual = datosSession;
        console.log('✅ Sesión creada para:', usuario.nombreCompleto);
    }

    /**
     * Carga sesión guardada si existe
     */
    cargarSesionGuardada() {
        try {
            const sesionGuardada = localStorage.getItem('secrica_sesion');
            if (!sesionGuardada) return;

            const datosSession = typeof descifrarDatosLocales === 'function'
                ? descifrarDatosLocales(sesionGuardada)
                : JSON.parse(sesionGuardada);

            // Verificar si la sesión no ha expirado
            if (new Date(datosSession.expiracion) > new Date()) {
                this.mostrarOpcionContinuarSesion(datosSession);
            } else {
                this.cerrarSesion();
            }
        } catch (error) {
            console.error('Error al cargar sesión guardada:', error);
            this.cerrarSesion();
        }
    }

    /**
     * Muestra opción para continuar sesión anterior
     */
    mostrarOpcionContinuarSesion(datosSession) {
        const contenedor = document.querySelector('.contenedor-ingreso');
        if (!contenedor) return;

        const divSesion = document.createElement('div');
        divSesion.className = 'sesion-anterior';
        divSesion.innerHTML = `
            <div class="info-sesion">
                <h3>Sesión Anterior Detectada</h3>
                <p><strong>${datosSession.nombreCompleto}</strong></p>
                <p>${datosSession.correo}</p>
                <small>Última conexión: ${new Date(datosSession.fechaIngreso).toLocaleString()}</small>
                <div class="botones-sesion">
                    <button type="button" class="boton boton-primario" onclick="autenticacion.continuarSesion()">
                        Continuar Sesión
                    </button>
                    <button type="button" class="boton boton-secundario" onclick="autenticacion.nuevaSesion()">
                        Nueva Sesión
                    </button>
                </div>
            </div>
        `;

        const tarjeta = document.querySelector('.tarjeta-ingreso');
        contenedor.insertBefore(divSesion, tarjeta);
    }

    /**
     * Continúa con la sesión anterior
     */
    continuarSesion() {
        this.mostrarMensaje('Continuando sesión anterior...', 'exito');
        setTimeout(() => {
            window.location.href = 'panel-principal.html';
        }, 1000);
    }

    /**
     * Inicia una nueva sesión
     */
    nuevaSesion() {
        this.cerrarSesion();
        const divSesion = document.querySelector('.sesion-anterior');
        if (divSesion) {
            divSesion.remove();
        }
        this.mostrarMensaje('Sesión anterior cerrada', 'info');
    }

    /**
     * Cierra la sesión actual
     */
    cerrarSesion() {
        localStorage.removeItem('secrica_sesion');
        sessionStorage.removeItem('secrica_sesion_temporal');
        this.sesionActual = null;
    }

    /**
     * Guarda el último correo ingresado
     */
    guardarUltimoCorreo(correo) {
        localStorage.setItem('secrica_ultimo_correo', correo);
    }

    /**
     * Carga el último correo guardado
     */
    cargarUltimoCorreo() {
        const ultimoCorreo = localStorage.getItem('secrica_ultimo_correo');
        const campoCorreo = document.getElementById('correoUsuario');
        
        if (ultimoCorreo && campoCorreo) {
            campoCorreo.value = ultimoCorreo;
        }
    }

    /**
     * Guarda correo temporal mientras se escribe
     */
    guardarCorreoTemporal(correo) {
        if (correo && correo.length > 3) {
            sessionStorage.setItem('secrica_correo_temporal', correo);
        }
    }

    /**
     * Valida formato de correo electrónico
     */
    validarFormatoCorreo(correo) {
        const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return patron.test(correo);
    }

    /**
     * Muestra mensaje al usuario
     */
    mostrarMensaje(mensaje, tipo = 'info') {
        let elementoMensaje = document.getElementById('mensajeIngreso');

        if (!elementoMensaje) {
            elementoMensaje = document.createElement('div');
            elementoMensaje.id = 'mensajeIngreso';
            elementoMensaje.className = 'mensaje-autenticacion';

            const formulario = document.getElementById('formularioIngreso');
            if (formulario && formulario.parentNode) {
                formulario.parentNode.insertBefore(elementoMensaje, formulario);
            }
        }

        elementoMensaje.textContent = mensaje;
        elementoMensaje.className = `mensaje-autenticacion mensaje-${tipo}`;
        elementoMensaje.style.display = 'block';

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            if (elementoMensaje) {
                elementoMensaje.style.display = 'none';
            }
        }, 5000);
    }

    /**
     * Obtiene la sesión actual
     */
    obtenerSesionActual() {
        return this.sesionActual;
    }

    /**
     * Verifica si hay una sesión activa
     */
    tieneSesionActiva() {
        return this.sesionActual !== null;
    }
}

// Instancia global del sistema de autenticación
const autenticacion = new SistemaAutenticacion();

// Funciones globales para uso en HTML
window.autenticacion = autenticacion;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    autenticacion.inicializar();
    console.log('🔑 Sistema de autenticación SECRICA inicializado');
});
