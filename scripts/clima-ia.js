// sistema de clima con inteligencia artificial para defensa civil
import { generarContenidoIA } from '../services/ai-service.js';

async function mostrarPronosticoConIA(ciudad) {
  const pronos = await climaIA.obtenerPronostico5Dias(ciudad);
  const texto = `Pronóstico de ${ciudad}: ${pronos.map(p => p.descripcion).join(', ')}`;
  const alerta = await generarContenidoIA(texto);
  document.getElementById('alertaIA').textContent = alerta;
}

class ClimaIA {
    constructor() {
        this.apiKey = 'a526c94ff9288dd58d862bd55e814015'; 
        this.baseUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';
        this.locationQuindio = {
            armenia: { lat: 4.5389, lon: -75.6819 },
            salento: { lat: 4.6308, lon: -75.5683 },
            calarca: { lat: 4.5297, lon: -75.6469 }
        };
        this.datosHistoricos = [];
        this.prediccionesIA = [];
    }

    async obtenerClimaActual(ciudad = 'armenia') {
        try {
            const coords = this.locationQuindio[ciudad];
            const url = `${this.baseUrl}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric&lang=es`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            // guardar datos para analisis ia
            this.guardarDatoHistorico(data);
            
            return {
                temperatura: Math.round(data.main.temp),
                descripcion: data.weather[0].description,
                humedad: data.main.humidity,
                viento: data.wind.speed,
                presion: data.main.pressure,
                sensacion: Math.round(data.main.feels_like),
                visibilidad: data.visibility / 1000,
                ciudad: data.name
            };
        } catch (error) {
            console.error('error al obtener clima:', error);
            return this.getDatosMockClima();
        }
    }

    async obtenerPronostico5Dias(ciudad = 'armenia') {
        try {
            const coords = this.locationQuindio[ciudad];
            const url = `${this.baseUrl}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=metric&lang=es`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            // procesar datos para ia
            return this.procesarPronosticoConIA(data);
        } catch (error) {
            console.error('error al obtener pronostico:', error);
            return this.getPronosticoMock();
        }
    }

    procesarPronosticoConIA(data) {
        const pronos = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
        
        return pronos.map((item, index) => {
            const alertaIA = this.analizarRiesgoClimatico(item);
            
            return {
                fecha: new Date(item.dt * 1000).toLocaleDateString('es-CO'),
                temperatura: Math.round(item.main.temp),
                descripcion: item.weather[0].description,
                probabilidadLluvia: item.pop * 100,
                alertaDefensaCivil: alertaIA.nivel,
                recomendacion: alertaIA.recomendacion,
                iconoIA: this.getIconoClimaIA(item.weather[0].main)
            };
        });
    }

    analizarRiesgoClimatico(datosClima) {
        const temp = datosClima.main.temp;
        const lluvia = datosClima.pop;
        const viento = datosClima.wind?.speed || 0;
        
        // algoritmo ia simple para analisis de riesgo
        let riesgo = 0;
        let recomendaciones = [];
        
        // analisis temperatura
        if (temp > 35) {
            riesgo += 3;
            recomendaciones.push('alta temperatura - riesgo de deshidratacion');
        }
        if (temp < 10) {
            riesgo += 2;
            recomendaciones.push('baja temperatura - atencion hipotermia');
        }
        
        // analisis lluvia
        if (lluvia > 0.7) {
            riesgo += 4;
            recomendaciones.push('alta probabilidad lluvia - riesgo inundaciones');
        }
        
        // analisis viento
        if (viento > 15) {
            riesgo += 3;
            recomendaciones.push('vientos fuertes - riesgo caida arboles');
        }
        
        // determinar nivel de alerta
        let nivel = 'verde';
        if (riesgo >= 6) nivel = 'rojo';
        else if (riesgo >= 3) nivel = 'amarillo';
        
        return {
            nivel: nivel,
            puntuacion: riesgo,
            recomendacion: recomendaciones.join(' | ') || 'condiciones normales'
        };
    }

    getIconoClimaIA(condicion) {
        const iconos = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️'
        };
        return iconos[condicion] || '🌤️';
    }

    guardarDatoHistorico(data) {
        const registro = {
            timestamp: Date.now(),
            temperatura: data.main.temp,
            humedad: data.main.humidity,
            presion: data.main.pressure,
            condicion: data.weather[0].main
        };
        
        this.datosHistoricos.push(registro);
        
        // mantener solo ultimos 100 registros
        if (this.datosHistoricos.length > 100) {
            this.datosHistoricos = this.datosHistoricos.slice(-100);
        }
        
        // guardar en localstorage
        localStorage.setItem('secrica_clima_historico', JSON.stringify(this.datosHistoricos));
    }

    analizarTendenciasIA() {
        if (this.datosHistoricos.length < 10) {
            return {
                tendencia: 'datos insuficientes',
                prediccion: 'recolectando informacion...'
            };
        }
        
        // analisis simple de tendencias
        const ultimasTemps = this.datosHistoricos.slice(-10).map(d => d.temperatura);
        const promedio = ultimasTemps.reduce((a, b) => a + b, 0) / ultimasTemps.length;
        const tendencia = ultimasTemps[ultimasTemps.length - 1] > promedio ? 'subiendo' : 'bajando';
        
        return {
            tendencia: `temperatura ${tendencia}`,
            prediccion: this.generarPrediccionIA(promedio, tendencia),
            confianza: Math.min(this.datosHistoricos.length * 2, 95) + '%'
        };
    }

    generarPrediccionIA(promedio, tendencia) {
        const predicciones = {
            'subiendo': [
                'se espera incremento de temperatura en las proximas horas',
                'posible desarrollo de tormentas por calentamiento',
                'recomendado aumentar hidratacion'
            ],
            'bajando': [
                'descenso de temperatura previsto',
                'posible formacion de niebla matinal',
                'vigilar poblacion vulnerable al frio'
            ]
        };
        
        return predicciones[tendencia][Math.floor(Math.random() * 3)];
    }

    // datos mock para cuando no hay api key
    getDatosMockClima() {
        return {
            temperatura: 22 + Math.round(Math.random() * 8),
            descripcion: 'parcialmente nublado',
            humedad: 65 + Math.round(Math.random() * 20),
            viento: 5 + Math.round(Math.random() * 10),
            presion: 1013 + Math.round(Math.random() * 20),
            sensacion: 24,
            visibilidad: 10,
            ciudad: 'armenia'
        };
    }

    getPronosticoMock() {
        const condiciones = ['soleado', 'nublado', 'lluvia ligera', 'despejado'];
        const alertas = ['verde', 'amarillo', 'verde', 'verde', 'amarillo'];
        
        return Array.from({length: 5}, (_, i) => ({
            fecha: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO'),
            temperatura: 20 + Math.round(Math.random() * 10),
            descripcion: condiciones[Math.floor(Math.random() * condiciones.length)],
            probabilidadLluvia: Math.round(Math.random() * 100),
            alertaDefensaCivil: alertas[i],
            recomendacion: 'condiciones estables para operaciones',
            iconoIA: ['☀️', '☁️', '🌧️', '🌤️'][Math.floor(Math.random() * 4)]
        }));
    }
}

// instancia global del sistema de clima ia
const climaIA = new ClimaIA();

// funciones para el sistema
async function actualizarClimaIA() {
    try {
        const climaActual = await climaIA.obtenerClimaActual();
        const pronostico = await climaIA.obtenerPronostico5Dias();
        const tendencias = climaIA.analizarTendenciasIA();
        
        // actualizar dashboard
        document.getElementById('climaActual').innerHTML = `
            ${climaActual.iconoIA || '🌤️'} ${climaActual.temperatura}°C
        `;
        
        // actualizar seccion detallada
        document.getElementById('climaDetallado').innerHTML = `
            <div class="clima-info">
                <h4>${climaActual.ciudad}</h4>
                <p class="temp-principal">${climaActual.temperatura}°C</p>
                <p class="descripcion">${climaActual.descripcion}</p>
                <div class="detalles-clima">
                    <span>💧 Humedad: ${climaActual.humedad}%</span>
                    <span>💨 Viento: ${climaActual.viento} m/s</span>
                    <span>🔍 Visibilidad: ${climaActual.visibilidad} km</span>
                    <span>🌡️ Sensación: ${climaActual.sensacion}°C</span>
                </div>
            </div>
        `;
        
        // actualizar prediccion ia
        document.getElementById('prediccionIA').innerHTML = `
            <div class="prediccion-container">
                <h4>Análisis IA - Tendencias: ${tendencias.tendencia}</h4>
                <p class="prediccion-texto">${tendencias.prediccion}</p>
                <small>Confianza: ${tendencias.confianza}</small>
                <div class="pronostico-grid">
                    ${pronostico.map(dia => `
                        <div class="dia-pronostico ${dia.alertaDefensaCivil}">
                            <span class="fecha">${dia.fecha}</span>
                            <span class="icono">${dia.iconoIA}</span>
                            <span class="temp">${dia.temperatura}°C</span>
                            <span class="lluvia">${dia.probabilidadLluvia}%</span>
                            <span class="alerta">Alerta: ${dia.alertaDefensaCivil.toUpperCase()}</span>
                            <small class="recomendacion">${dia.recomendacion}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('error actualizando clima ia:', error);
    }
}

// inicializar cuando se carga la pagina
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        actualizarClimaIA();
        // actualizar cada 30 minutos
        setInterval(actualizarClimaIA, 30 * 60 * 1000);
    });
}