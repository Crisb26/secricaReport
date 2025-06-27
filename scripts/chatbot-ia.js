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
                '¿Qué tipo de emergencia necesitas reportar? Puedo guiarte paso a paso.'
            ],
            'emergencia': [
                '🚨 Para emergencias inmediatas llama al 123.',
                'Si es una emergencia real, contacta inmediatamente a los servicios de emergencia.'
            ],
            'usuario': [
                'Puedes gestionar usuarios en la sección correspondiente del sistema.',
                'Los usuarios se pueden crear desde el formulario de registro.'
            ],
            'ayuda': [
                'Estoy aquí para ayudarte con SECRICA REPORT.',
                'Puedo asistirte con clima, reportes, emergencias y gestión de usuarios.'
            ],
            'saludo': [
                '¡Hola! Soy el asistente IA de SECRICA REPORT. ¿En qué puedo ayudarte?',
                'Bienvenido al sistema de la Defensa Civil del Quindío. ¿Cómo te puedo asistir?'
            ]
        };
        this.contexto = [];
        this.activo = false;
    }

    procesarMensaje(mensaje) {
        const mensajeLimpio = mensaje.toLowerCase().trim();
        this.contexto.push({ usuario: mensaje, timestamp: Date.now() });
        
        // analisis simple de intencion
        const intencion = this.detectarIntencion(mensajeLimpio);
        const respuesta = this.generarRespuesta(intencion, mensajeLimpio);
        
        this.contexto.push({ bot: respuesta, timestamp: Date.now() });
        
        return respuesta;
    }

    detectarIntencion(mensaje) {
        const palabrasClave = {
            'clima': ['clima', 'tiempo', 'temperatura', 'lluvia', 'meteorologico'],
            'reporte': ['reporte', 'reportar', 'emergencia', 'incidente', 'crear'],
            'emergencia': ['urgente', 'emergencia', 'ayuda inmediata', 'socorro'],
            'usuario': ['usuario', 'cuenta', 'registrar', 'login'],
            'saludo': ['hola', 'buenos dias', 'buenas tardes', 'hey', 'saludos']
        };
        
        for (const [categoria, palabras] of Object.entries(palabrasClave)) {
            if (palabras.some(palabra => mensaje.includes(palabra))) {
                return categoria;
            }
        }
        
        return 'ayuda';
    }

    generarRespuesta(intencion, mensaje) {
        const respuestas = this.respuestas[intencion] || this.respuestas['ayuda'];
        let respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
        
        // personalizar respuesta con datos dinamicos
        if (intencion === 'clima') {
            const clima = this.obtenerClimaActual();
            respuesta = respuesta.replace('{clima}', clima);
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
        messageDiv.textContent = texto;
        
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