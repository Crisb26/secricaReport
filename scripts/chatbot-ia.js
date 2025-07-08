// chatbot simple para asistencia en secrica report

class ChatbotSecrica {
    constructor() {
        this.respuestas = {
            'clima': [
                'El clima actual en Armenia es de {clima}°C. ¿Necesitas el pronóstico?',
                'Puedo ayudarte con información meteorológica del Quindío.'
            ],
            'reporte': [
                'Para crear un reporte, ve a la sección "Reportes" y haz clic en "Nuevo Reporte".',
                '¿Qué tipo de emergencia necesitas reportar? Puedes escribir: incendio, inundación, accidente, etc.'
            ],
            'emergencia': [
                '🚨 Para emergencias inmediatas llama al 123.',
                'Si es una emergencia real, contacta inmediatamente a los servicios de emergencia.'
            ],
            'incendio': [
                'Para reportar un incendio, selecciona "Incendio" en el tipo de emergencia y proporciona la ubicación y detalles en el formulario. ¿Quieres ayuda llenando algún campo?'
            ],
            'incendio forestal': [
                'Para reportar un incendio forestal, selecciona "Incendio Forestal" y describe la ubicación y magnitud del fuego. ¿Quieres que te ayude a llenar el reporte?'
            ],
            'inundacion': [
                'Para reportar una inundación, selecciona "Inundación" y proporciona detalles sobre el área afectada y si hay personas en riesgo.'
            ],
            'accidente': [
                'Para reportar un accidente, selecciona "Accidente" y describe el lugar, tipo de accidente y si hay heridos.'
            ],
            'usuario': [
                'Puedes gestionar usuarios en la sección correspondiente del sistema.',
                'Los usuarios se pueden crear desde el formulario de registro.'
            ],
            'ayuda': [
                'Estoy aquí para ayudarte con SECRICA REPORT. ¿Sobre qué tema necesitas información? Puedes preguntar por clima, reportes, emergencias, cultura, contacto, etc.',
                '¿En qué puedo ayudarte? Puedes escribir: clima, reportar emergencia, contacto, cultura, manual, etc.'
            ],
            'saludo': [
                '¡Hola! Soy el asistente IA de SECRICA REPORT. ¿En qué puedo ayudarte?',
                'Bienvenido al sistema de la Defensa Civil del Quindío. ¿Cómo te puedo asistir?'
            ],
            'contacto': [
                'Puedes contactarnos al correo: <a href="mailto:info@defensacivilquindio.org">info@defensacivilquindio.org</a>',
                'Teléfono de contacto: <a href="tel:1234567890">123-456-7890</a>',
                'Nuestra sede principal está en Armenia, Quindío. <a href="https://goo.gl/maps/..." target="_blank">Ver mapa</a>'
            ],
            'manual': [
                'Descarga el manual de usuario aquí: <a href="manual.pdf" target="_blank">Manual SECRICA</a>'
            ],
            'cultura': [
                'El Quindío es Patrimonio de la Humanidad por su cultura cafetera.',
                '¿Quieres saber más sobre la cultura cafetera?'
            ],
            'faq': [
                'Preguntas frecuentes:<br>- ¿Cómo hago un reporte?<br>- ¿Cuál es el teléfono de emergencia?<br>- ¿Dónde encuentro el manual?<br>- ¿Cómo contacto a la Defensa Civil?<br>- ¿Cómo reporto un incendio?'
            ],
            'despedida': [
                '¡Hasta luego! Si necesitas más ayuda, aquí estaré.',
                'Gracias por usar SECRICA REPORT. ¡Cuídate!'
            ],
            'quien eres': [
                'Soy el asistente virtual de SECRICA REPORT, creado para ayudarte con tus dudas sobre el sistema y la Defensa Civil.',
                '🤖 Soy un chatbot diseñado para guiarte en el uso del sistema y responder tus preguntas.'
            ],
            'agradecimiento': [
                '¡Con gusto! Si necesitas algo más, aquí estaré.',
                'Para eso estoy, ¡cuenta conmigo!'
            ],
            'nombre': [
                '¡Mucho gusto, {nombre}! ¿En qué puedo ayudarte hoy?',
                'Encantado de conocerte, {nombre}. ¿Cómo puedo asistirte?'
            ]
        };
        this.municipios = [
            'armenia', 'montenegro', 'filandia', 'salento', 'calarcá', 'cordoba', 'pijao', 'genova', 'quimbaya', 'la tebaida', 'circasia'
        ];
        this.contexto = [];
        this.activo = false;
        this.nombreUsuario = null;
    }

    procesarMensaje(mensaje) {
        const mensajeLimpio = mensaje.toLowerCase().trim();
        this.contexto.push({ usuario: mensaje, timestamp: Date.now() });

        // Comandos especiales
        if (mensajeLimpio === '/limpiar') {
            setTimeout(() => {
                document.getElementById('chat-messages').innerHTML = '';
            }, 100);
            return 'Chat limpiado. ¿En qué más puedo ayudarte?';
        }
        if (mensajeLimpio === '/faq' || mensajeLimpio.includes('preguntas frecuentes')) {
            return this.respuestas['faq'][0];
        }
        if (mensajeLimpio === '/contacto') {
            return this.respuestas['contacto'][0];
        }
        if (mensajeLimpio === '/manual') {
            return this.respuestas['manual'][0];
        }
        if (mensajeLimpio === '/ayuda') {
            return this.respuestas['ayuda'][0];
        }

        // Saludo con nombre
        if (mensajeLimpio.startsWith('me llamo ') || mensajeLimpio.startsWith('mi nombre es ')) {
            const nombre = mensajeLimpio.replace('me llamo ', '').replace('mi nombre es ', '').split(' ')[0];
            this.nombreUsuario = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            let respuesta = this.respuestas['nombre'][Math.floor(Math.random() * this.respuestas['nombre'].length)];
            respuesta = respuesta.replace('{nombre}', this.nombreUsuario);
            return respuesta;
        }

        // Detectar municipio para clima
        for (const municipio of this.municipios) {
            if (mensajeLimpio.includes('clima') && mensajeLimpio.includes(municipio)) {
                return `El clima actual en ${municipio.charAt(0).toUpperCase() + municipio.slice(1)} es de 22°C. ¿Necesitas el pronóstico?`;
            }
        }

        // Analisis de intención
        const intencion = this.detectarIntencion(mensajeLimpio);
        const respuesta = this.generarRespuesta(intencion, mensajeLimpio);

        this.contexto.push({ bot: respuesta, timestamp: Date.now() });

        return respuesta;
    }

    detectarIntencion(mensaje) {
        const palabrasClave = {
            'clima': ['clima', 'tiempo', 'temperatura', 'lluvia', 'llueve', 'hace calor', 'hace frío', 'pronóstico', 'meteorologico'],
            'reporte': ['reporte', 'reportar', 'emergencia', 'incidente', 'crear'],
            'emergencia': ['urgente', 'emergencia', 'ayuda inmediata', 'socorro'],
            'incendio forestal': ['incendio forestal', 'fuego forestal', 'quema de bosque'],
            'incendio': ['incendio', 'fuego', 'quema'],
            'inundacion': ['inundación', 'inundacion', 'agua', 'desbordamiento'],
            'accidente': ['accidente', 'choque', 'colisión', 'heridos'],
            'usuario': ['usuario', 'cuenta', 'registrar', 'login'],
            'saludo': ['hola', 'buenos dias', 'buenas tardes', 'hey', 'saludos'],
            'despedida': ['adios', 'hasta luego', 'gracias', 'bye'],
            'contacto': ['contacto', 'teléfono', 'correo', 'email'],
            'manual': ['manual', 'instrucciones', 'guía'],
            'cultura': ['cultura', 'cafetera', 'patrimonio', 'unesco'],
            'faq': ['faq', 'preguntas frecuentes'],
            'quien eres': ['quién eres', 'quien eres', 'asistente', 'bot'],
            'agradecimiento': ['gracias', 'muy amable', 'te agradezco', 'mil gracias'],
            'nombre': ['me llamo', 'mi nombre es']
        };

        for (const [categoria, palabras] of Object.entries(palabrasClave)) {
            if (palabras.some(palabra => mensaje.includes(palabra))) {
                return categoria;
            }
        }

        return 'ayuda';
    }

    generarRespuesta(intencion, mensaje) {
        const respuestas = this.respuestas[intencion] || [
            'No entendí tu mensaje, ¿puedes reformularlo o ser más específico?',
            '¿Podrías darme más detalles para poder ayudarte mejor?'
        ];
        let respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

        // Personalizar respuesta con datos dinámicos
        if (intencion === 'clima') {
            const clima = this.obtenerClimaActual();
            respuesta = respuesta.replace('{clima}', clima);
        }
        if (intencion === 'nombre' && this.nombreUsuario) {
            respuesta = respuesta.replace('{nombre}', this.nombreUsuario);
        }
        return respuesta;
    }

    obtenerClimaActual() {
        // obtener de la instancia de clima ia si esta disponible
        if (typeof climaIA !== 'undefined') {
            return '22'; // placeholder
        }
        return '22';
    }

    mostrarChat() {
        if (this.activo) return;

        this.activo = true;
        this.crearInterfazChat();
    }

    crearInterfazChat() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'secrica-chatbot';
        chatContainer.innerHTML = `
            <div class="chatbot-header">
                <span>🤖 Asistente IA SECRICA</span>
                <button onclick="chatbotSecrica.cerrarChat()" class="chat-close">&times;</button>
            </div>
            <div class="chatbot-messages" id="chat-messages">
                <div class="message bot-message">
                    ${this.respuestas.saludo[0]}
                </div>
            </div>
            <div class="chatbot-input">
                <input type="text" id="chat-input" placeholder="Escribe tu mensaje...">
                <button onclick="chatbotSecrica.enviarMensaje()" class="chat-send">Enviar</button>
            </div>
        `;

        document.body.appendChild(chatContainer);

        // agregar estilos
        this.agregarEstilosChat();

        // configurar eventos
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.enviarMensaje();
            }
        });
    }

    enviarMensaje() {
        const input = document.getElementById('chat-input');
        const mensaje = input.value.trim();

        if (!mensaje) return;

        // mostrar mensaje del usuario
        this.agregarMensaje(mensaje, 'usuario');

        // limpiar input
        input.value = '';

        // procesar y responder
        setTimeout(() => {
            const respuesta = this.procesarMensaje(mensaje);
            this.agregarMensaje(respuesta, 'bot');
        }, 500);
    }

    agregarMensaje(texto, tipo) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${tipo}-message`;
        // Permitir HTML en respuestas del bot
        if (tipo === 'bot') {
            messageDiv.innerHTML = texto;
        } else {
            messageDiv.textContent = texto;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    cerrarChat() {
        const chatElement = document.getElementById('secrica-chatbot');
        if (chatElement) {
            chatElement.remove();
            this.activo = false;
        }
    }

    agregarEstilosChat() {
        const styles = `
            #secrica-chatbot {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                height: 400px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                font-family: Arial, sans-serif;
            }
            .chatbot-header {
                background: var(--azul-dc, #003f7f);
                color: white;
                padding: 15px;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
            }
            .chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 25px;
                height: 25px;
            }
            .chatbot-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #f8f9fa;
            }
            .message {
                margin-bottom: 10px;
                padding: 8px 12px;
                border-radius: 15px;
                max-width: 80%;
                word-wrap: break-word;
            }
            .usuario-message {
                background: var(--naranja-dc, #ff6a00);
                color: white;
                margin-left: auto;
                border-bottom-right-radius: 5px;
            }
            .bot-message {
                background: #e9ecef;
                color: #333;
                border-bottom-left-radius: 5px;
            }
            .chatbot-input {
                display: flex;
                padding: 15px;
                border-top: 1px solid #ddd;
                border-radius: 0 0 10px 10px;
                background: white;
            }
            #chat-input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 20px;
                padding: 8px 15px;
                outline: none;
                margin-right: 10px;
            }
            .chat-send {
                background: var(--azul-dc, #003f7f);
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 15px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .chat-send:hover {
                background: var(--naranja-dc, #ff6a00);
            }
            @media (max-width: 480px) {
                #secrica-chatbot {
                    width: 280px;
                    height: 350px;
                    bottom: 10px;
                    right: 10px;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
}

// instancia global del chatbot
const chatbotSecrica = new ChatbotSecrica();

// boton flotante para activar chatbot
function crearBotonChatbot() {
    const boton = document.createElement('button');
    boton.id = 'boton-chatbot';
    boton.innerHTML = '🤖';
    boton.onclick = () => chatbotSecrica.mostrarChat();

    const estilos = `
        #boton-chatbot {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--azul-dc, #003f7f);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: all 0.3s ease;
        }
        #boton-chatbot:hover {
            background: var(--naranja-dc, #ff6a00);
            transform: scale(1.1);
        }
        @media (max-width: 480px) {
            #boton-chatbot {
                width: 50px;
                height: 50px;
                font-size: 20px;
                bottom: 15px;
                right: 15px;
            }
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = estilos;
    document.head.appendChild(styleElement);

    document.body.appendChild(boton);
}

// inicializar chatbot
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(crearBotonChatbot, 2000);
    });
}