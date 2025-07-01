const SALT_ROUNDS = 10;

class SecricaCrypto {
    hash(texto) {
        let hash = 0;
        for (let i = 0; i < texto.length; i++) {
            const char = texto.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    cifrarPassword(password) {
        const salt = this.hash(Date.now().toString());
        return `${salt}-${this.hash(password + salt)}`;
    }

    verificarPassword(passwordPlano, passwordCifrado) {
        const [salt, hashOriginal] = passwordCifrado.split('-');
        return this.hash(passwordPlano + salt) === hashOriginal;
    }

    generarTokenSesion(datosUsuario) {
        const timestamp = Date.now();
        const datosToken = {
            id: datosUsuario.id,
            correo: datosUsuario.correo,
            rol: datosUsuario.rol,
            timestamp,
            expiracion: timestamp + (24 * 60 * 60 * 1000)
        };
        const tokenString = JSON.stringify(datosToken);
        const hash = this.hash(tokenString + 'SECRICA_QUINDIO_2025_DEFENSA_CIVIL_COLOMBIA');
        return btoa(tokenString) + '.' + hash;
    }

    validarTokenSesion(token) {
        try {
            const [datosEncoded, hashToken] = token.split('.');
            const datosString = atob(datosEncoded);
            const hashEsperado = this.hash(datosString + 'SECRICA_QUINDIO_2025_DEFENSA_CIVIL_COLOMBIA');
            if (hashToken !== hashEsperado) return null;
            const datos = JSON.parse(datosString);
            if (Date.now() > datos.expiracion) return null;
            return datos;
        } catch {
            return null;
        }
    }

    cifrarDatos(datos) {
        const datosString = JSON.stringify(datos);
        const salt = this.hash(Date.now().toString());
        let cifrado = '';
        for (let i = 0; i < datosString.length; i++) {
            const char = datosString.charCodeAt(i);
            const key = salt.charCodeAt(i % salt.length);
            cifrado += String.fromCharCode(char ^ key);
        }
        return btoa(cifrado) + '.' + salt;
    }

    descifrarDatos(datosCifrados) {
        const [encoded, salt] = datosCifrados.split('.');
        const cifrado = atob(encoded);
        let original = '';
        for (let i = 0; i < cifrado.length; i++) {
            const char = cifrado.charCodeAt(i);
            const key = salt.charCodeAt(i % salt.length);
            original += String.fromCharCode(char ^ key);
        }
        return JSON.parse(original);
    }

    verificarContrasenaAvanzada(contrasenaPlana, hashAlmacenado) {
        if (!hashAlmacenado.startsWith('SECRICA_')) {
            return contrasenaPlana === hashAlmacenado;
        }
        const partes = hashAlmacenado.split('_');
        if (partes.length !== 4) return false;
        const [_, hashOriginal, salt, timestamp] = partes;
        const datos = salt + contrasenaPlana + timestamp + 'SECRICA_QUINDIO_2025_DEFENSA_CIVIL_COLOMBIA';
        let hashRecreado = this.hash(datos);
        for (let i = 0; i < 1000; i++) {
            hashRecreado = this.hash(hashRecreado + salt + i);
        }
        return hashRecreado === hashOriginal;
    }
}

const secricaCrypto = new SecricaCrypto();

export const cifrarPassword = secricaCrypto.cifrarPassword.bind(secricaCrypto);
export const verificarPassword = secricaCrypto.verificarPassword.bind(secricaCrypto);
export const generarHashSeguro = secricaCrypto.hash.bind(secricaCrypto);
export const verificarContrasenaAvanzada = secricaCrypto.verificarContrasenaAvanzada.bind(secricaCrypto);
export const generarTokenSesion = secricaCrypto.generarTokenSesion.bind(secricaCrypto);
export const validarTokenSesion = secricaCrypto.validarTokenSesion.bind(secricaCrypto);
export const cifrarDatosLocales = secricaCrypto.cifrarDatos.bind(secricaCrypto);
export const descifrarDatosLocales = secricaCrypto.descifrarDatos.bind(secricaCrypto);

console.log('🔐 Sistema de cifrado SECRICA cargado correctamente');
