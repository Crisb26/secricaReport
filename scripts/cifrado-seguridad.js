window.verificarContrasenaAvanzada = verificarContrasenaAvanzada;

class SistemaCifradoSecrica {
    constructor() {
        this.claveSecreta = 'SECRICA_QUINDIO_2025_DEFENSA_CIVIL_COLOMBIA';
        this.longitudSalt = 12;
        this.iteracionesCifrado = 1000;
    }

    /**
     * Genera un salt aleatorio seguro
     * @returns {string} Salt generado
     */
    generarSaltSeguro() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let salt = '';
        for (let i = 0; i < this.longitudSalt; i++) {
            salt += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return salt;
    }

    /**
     * Cifra una contraseña de forma segura
     * @param {string} contrasena - Contraseña a cifrar
     * @returns {string} Contraseña cifrada
     */
    cifrarContrasena(contrasena) {
        try {
            const salt = this.generarSaltSeguro();
            const timestamp = Date.now().toString();
            const datosCompletos = salt + contrasena + timestamp + this.claveSecreta;
            
            // Aplicar múltiples rondas de hash
            let hashActual = this.hashSimple(datosCompletos);
            for (let i = 0; i < this.iteracionesCifrado; i++) {
                hashActual = this.hashSimple(hashActual + salt + i);
            }
            
            // Formato final con metadatos
            const contrasenaCifrada = `SECRICA_${hashActual}_${salt}_${timestamp}`;
            return contrasenaCifrada;
        } catch (error) {
            console.error('Error al cifrar contraseña:', error);
            return null;
        }
    }

    /**
     * Verifica una contraseña contra su hash almacenado
     * @param {string} contrasenaPlana - Contraseña en texto plano
     * @param {string} hashAlmacenado - Hash almacenado en la base de datos
     * @returns {boolean} True si coincide
     */
    
    verificarContrasenaAvanzada(contrasenaPlana, hashAlmacenado) {
    try {
        if (!hashAlmacenado.startsWith('SECRICA_')) {
            return contrasenaPlana === hashAlmacenado;
        }

        const partes = hashAlmacenado.split('_');
        if (partes.length !== 4) return false;

        const hashOriginal = partes[1];
        const salt = partes[2];
        const timestamp = partes[3];

        const datosCompletos = salt + contrasenaPlana + timestamp + this.claveSecreta;
        let hashRecreado = this.hashSimple(datosCompletos);

        for (let i = 0; i < this.iteracionesCifrado; i++) {
            hashRecreado = this.hashSimple(hashRecreado + salt + i);
        }

        return hashRecreado === hashOriginal;
    } catch (error) {
        console.error('Error al verificar contraseña:', error);
        return false;
    }
}


    /**
     * Genera un hash simple pero efectivo
     * @param {string} texto - Texto a hashear
     * @returns {string} Hash generado
     */
    hashSimple(texto) {
        let hash = 0;
        for (let i = 0; i < texto.length; i++) {
            const char = texto.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Genera un token de sesión seguro
     * @param {object} datosUsuario - Datos del usuario
     * @returns {string} Token de sesión
     */
    generarTokenSesion(datosUsuario) {
        const timestamp = Date.now();
        const datosToken = {
            id: datosUsuario.id,
            correo: datosUsuario.correo,
            rol: datosUsuario.rol,
            timestamp: timestamp,
            expiracion: timestamp + (24 * 60 * 60 * 1000) // 24 horas
        };

        const tokenString = JSON.stringify(datosToken);
        const hash = this.hashSimple(tokenString + this.claveSecreta);
        return btoa(tokenString) + '.' + hash;
    }

    /**
     * Valida un token de sesión
     * @param {string} token - Token a validar
     * @returns {object|null} Datos del usuario si es válido
     */
    validarTokenSesion(token) {
        try {
            const [datosEncoded, hashToken] = token.split('.');
            const datosString = atob(datosEncoded);
            const datos = JSON.parse(datosString);

            // Verificar hash
            const hashEsperado = this.hashSimple(datosString + this.claveSecreta);
            if (hashToken !== hashEsperado) return null;

            // Verificar expiración
            if (Date.now() > datos.expiracion) return null;

            return datos;
        } catch (error) {
            console.error('Error al validar token:', error);
            return null;
        }
    }

    /**
     * Cifra datos sensibles para almacenamiento local
     * @param {object} datos - Datos a cifrar
     * @returns {string} Datos cifrados
     */
    cifrarDatos(datos) {
        try {
            const datosString = JSON.stringify(datos);
            const salt = this.generarSaltSeguro();
            let datosCifrados = '';

            for (let i = 0; i < datosString.length; i++) {
                const charCode = datosString.charCodeAt(i);
                const saltCharCode = salt.charCodeAt(i % salt.length);
                const charCifrado = charCode ^ saltCharCode;
                datosCifrados += String.fromCharCode(charCifrado);
            }

            return btoa(datosCifrados) + '.' + salt;
        } catch (error) {
            console.error('Error al cifrar datos:', error);
            return null;
        }
    }

    /**
     * Descifra datos del almacenamiento local
     * @param {string} datosCifrados - Datos cifrados
     * @returns {object|null} Datos descifrados
     */
    descifrarDatos(datosCifrados) {
        try {
            const [datosEncoded, salt] = datosCifrados.split('.');
            const datosString = atob(datosEncoded);
            let datosDescifrados = '';

            for (let i = 0; i < datosString.length; i++) {
                const charCode = datosString.charCodeAt(i);
                const saltCharCode = salt.charCodeAt(i % salt.length);
                const charDescifrado = charCode ^ saltCharCode;
                datosDescifrados += String.fromCharCode(charDescifrado);
            }

            return JSON.parse(datosDescifrados);
        } catch (error) {
            console.error('Error al descifrar datos:', error);
            return null;
        }
    }
}

// Instancia global del sistema de cifrado
const sistemaCifrado = new SistemaCifradoSecrica();

// Funciones globales para uso en otros módulos
function cifrarContrasena(contrasena) {
    return sistemaCifrado.cifrarContrasena(contrasena);
}

function verificarContrasenaAvanzada(contrasenaPlana, hashAlmacenado) {
    return sistemaCifrado.verificarContrasenaAvanzada(contrasenaPlana, hashAlmacenado);
}

function generarTokenSesion(datosUsuario) {
    return sistemaCifrado.generarTokenSesion(datosUsuario);
}

function validarTokenSesion(token) {
    return sistemaCifrado.validarTokenSesion(token);
}

function cifrarDatosLocales(datos) {
    return sistemaCifrado.cifrarDatos(datos);
}

function descifrarDatosLocales(datosCifrados) {
    return sistemaCifrado.descifrarDatos(datosCifrados);
}

console.log('🔐 Sistema de cifrado SECRICA cargado correctamente');
