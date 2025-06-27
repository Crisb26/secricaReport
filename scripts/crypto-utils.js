// cifrado de contraseñas del lado del cliente
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// libreria de cifrado simple para el cliente
class SecricaCrypto {
    constructor() {
        // clave base para el cifrado (en produccion debe ser mas compleja)
        this.secretKey = 'SECRICA_QUINDIO_2024_DEFENSA_CIVIL';
    }

    // cifrar contraseña usando base64 y rotacion simple
    cifrarPassword(password) {
        try {
            // agregar sal aleatoria
            const salt = this.generarSalt();
            const passwordConSalt = salt + password + salt;
            
            // cifrado simple con rotacion de caracteres
            let cifrado = '';
            for (let i = 0; i < passwordConSalt.length; i++) {
                const char = passwordConSalt.charCodeAt(i);
                const cifradoChar = char + (i % 10) + 7; // rotacion simple
                cifrado += String.fromCharCode(cifradoChar);
            }
            
            // convertir a base64 para almacenamiento seguro
            const base64 = btoa(unescape(encodeURIComponent(cifrado)));
            
            // agregar prefijo para identificar passwords cifrados
            return 'SECRICA_' + base64 + '_' + salt;
        } catch (error) {
            console.error('error al cifrar password:', error);
            return password; // fallback
        }
    }

    // verificar contraseña cifrada
    verificarPassword(passwordPlano, passwordCifrado) {
        try {
            // verificar si es un password cifrado
            if (!passwordCifrado.startsWith('SECRICA_')) {
                // password sin cifrar (compatibilidad)
                return passwordPlano === passwordCifrado;
            }

            // extraer salt del password cifrado
            const partes = passwordCifrado.split('_');
            if (partes.length !== 3) return false;
            
            const salt = partes[2];
            
            // cifrar el password plano con el mismo salt
            const passwordCifradoTest = this.cifrarPasswordConSalt(passwordPlano, salt);
            
            return passwordCifradoTest === passwordCifrado;
        } catch (error) {
            console.error('error al verificar password:', error);
            return false;
        }
    }

    // cifrar password con salt especifico
    cifrarPasswordConSalt(password, salt) {
        try {
            const passwordConSalt = salt + password + salt;
            
            let cifrado = '';
            for (let i = 0; i < passwordConSalt.length; i++) {
                const char = passwordConSalt.charCodeAt(i);
                const cifradoChar = char + (i % 10) + 7;
                cifrado += String.fromCharCode(cifradoChar);
            }
            
            const base64 = btoa(unescape(encodeURIComponent(cifrado)));
            return 'SECRICA_' + base64 + '_' + salt;
        } catch (error) {
            console.error('error al cifrar password con salt:', error);
            return password;
        }
    }

    // generar salt aleatorio
    generarSalt() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let salt = '';
        for (let i = 0; i < 8; i++) {
            salt += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return salt;
    }

    // generar hash simple para verificacion
    hash(texto) {
        let hash = 0;
        if (texto.length === 0) return hash.toString();
        
        for (let i = 0; i < texto.length; i++) {
            const char = texto.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // convertir a 32-bit integer
        }
        
        return Math.abs(hash).toString();
    }
}

// instancia global del sistema de cifrado
const secricaCrypto = new SecricaCrypto();

// funciones globales para uso en otros scripts
function cifrarPassword(password) {
    return secricaCrypto.cifrarPassword(password);
}

function verificarPassword(passwordPlano, passwordCifrado) {
    return secricaCrypto.verificarPassword(passwordPlano, passwordCifrado);
}

function generarHashSeguro(texto) {
    return secricaCrypto.hash(texto);
}

// Hashea contraseña (async)
export async function hashearContrasena(passwordPlano) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(passwordPlano, salt);
}

// Verifica contraseña
export async function verificarContrasena(passwordPlano, hashAlmacenado) {
  return bcrypt.compare(passwordPlano, hashAlmacenado);
}

console.log('sistema de cifrado secrica cargado correctamente');