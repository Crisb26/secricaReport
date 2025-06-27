// sistema de seguimiento inteligente de reportes con machine learning

class SeguimientoIA {
    constructor() {
        this.reportes = [];
        this.patrones = [];
        this.alertas = [];
        this.modeloSimple = new ModeloMLSimple();
    }

    // analizar patrones en reportes usando ia simple
    analizarPatronesReportes() {
        if (this.reportes.length < 5) {
            return {
                patron: 'datos insuficientes',
                tendencia: 'recolectando informacion',
                prediccion: 'necesita mas reportes para analisis ia'
            };
        }

        // analisis de frecuencia temporal
        const reportesPorHora = this.agruparPorHora();
        const reportesPorTipo = this.agruparPorTipo();
        const reportesPorMunicipio = this.agruparPorMunicipio();

        // detectar picos de actividad
        const horasConMasReportes = this.detectarPicosActividad(reportesPorHora);
        
        // analizar gravedad promedio
        const gravedadPromedio = this.calcularGravedadPromedio();
        
        // generar prediccion con ia simple
        const prediccion = this.generarPrediccionIA({
            reportesPorHora,
            reportesPorTipo,
            gravedadPromedio,
            horasConMasReportes
        });

        return {
            patron: `${horasConMasReportes.join(', ')} son las horas con mas actividad`,
            tendencia: prediccion.tendencia,
            prediccion: prediccion.texto,
            confianza: prediccion.confianza,
            estadisticas: {
                totalReportes: this.reportes.length,
                gravedadPromedio: gravedadPromedio,
                tipoMasComun: this.getTipoMasComun(reportesPorTipo),
                municipioMasActivo: this.getMunicipioMasActivo(reportesPorMunicipio)
            }
        };
    }

    // machine learning simple para predicciones
    generarPrediccionIA(datos) {
        const { reportesPorHora, reportesPorTipo, gravedadPromedio } = datos;
        
        // algoritmo simple de clasificacion
        let riesgoFuturo = 0;
        let factores = [];
        
        // analizar incremento en reportes
        const ultimasHoras = Object.values(reportesPorHora).slice(-6);
        const tendenciaReportes = this.calcularTendencia(ultimasHoras);
        
        if (tendenciaReportes > 0.3) {
            riesgoFuturo += 3;
            factores.push('incremento sostenido en reportes');
        }
        
        // analizar gravedad
        if (gravedadPromedio > 7) {
            riesgoFuturo += 4;
            factores.push('gravedad promedio alta');
        }
        
        // analizar tipos de emergencia
        const tiposGraves = ['incendio', 'inundacion', 'deslizamiento'];
        const reportesGraves = Object.keys(reportesPorTipo).filter(tipo => 
            tiposGraves.includes(tipo.toLowerCase())
        );
        
        if (reportesGraves.length > 0) {
            riesgoFuturo += 5;
            factores.push('emergencias de alto riesgo detectadas');
        }
        
        // generar prediccion basada en riesgo
        let nivelRiesgo = 'bajo';
        let texto = '';
        let confianza = Math.min(this.reportes.length * 5, 95);
        
        if (riesgoFuturo >= 8) {
            nivelRiesgo = 'alto';
            texto = 'se prevé incremento significativo en emergencias';
        } else if (riesgoFuturo >= 4) {
            nivelRiesgo = 'medio';
            texto = 'actividad moderada esperada en las proximas horas';
        } else {
            nivelRiesgo = 'bajo';
            texto = 'condiciones estables para las proximas horas';
        }
        
        return {
            tendencia: nivelRiesgo,
            texto: texto,
            confianza: confianza + '%',
            factores: factores
        };
    }

    // funciones auxiliares para analisis
    agruparPorHora() {
        const grupos = {};
        this.reportes.forEach(reporte => {
            const hora = new Date(reporte.fecha).getHours();
            grupos[hora] = (grupos[hora] || 0) + 1;
        });
        return grupos;
    }

    agruparPorTipo() {
        const grupos = {};
        this.reportes.forEach(reporte => {
            grupos[reporte.tipo] = (grupos[reporte.tipo] || 0) + 1;
        });
        return grupos;
    }

    agruparPorMunicipio() {
        const grupos = {};
        this.reportes.forEach(reporte => {
            grupos[reporte.municipio] = (grupos[reporte.municipio] || 0) + 1;
        });
        return grupos;
    }

    detectarPicosActividad(reportesPorHora) {
        const promedio = Object.values(reportesPorHora).reduce((a, b) => a + b, 0) / 24;
        return Object.keys(reportesPorHora)
            .filter(hora => reportesPorHora[hora] > promedio * 1.5)
            .map(hora => `${hora}:00h`);
    }

    calcularGravedadPromedio() {
        if (this.reportes.length === 0) return 0;
        const suma = this.reportes.reduce((acc, r) => acc + (r.gravedad || 5), 0);
        return (suma / this.reportes.length).toFixed(1);
    }

    calcularTendencia(valores) {
        if (valores.length < 2) return 0;
        const inicio = valores.slice(0, Math.floor(valores.length / 2));
        const final = valores.slice(Math.floor(valores.length / 2));
        
        const promedioInicio = inicio.reduce((a, b) => a + b, 0) / inicio.length;
        const promedioFinal = final.reduce((a, b) => a + b, 0) / final.length;
        
        return (promedioFinal - promedioInicio) / promedioInicio;
    }

    getTipoMasComun(reportesPorTipo) {
        return Object.keys(reportesPorTipo).reduce((a, b) => 
            reportesPorTipo[a] > reportesPorTipo[b] ? a : b, 'ninguno');
    }

    getMunicipioMasActivo(reportesPorMunicipio) {
        return Object.keys(reportesPorMunicipio).reduce((a, b) => 
            reportesPorMunicipio[a] > reportesPorMunicipio[b] ? a : b, 'ninguno');
    }

    // generar recomendaciones ia
    generarRecomendacionesIA(analisis) {
        const recomendaciones = [];
        
        if (analisis.estadisticas.gravedadPromedio > 7) {
            recomendaciones.push('🚨 Activar protocolo de emergencia nivel 2');
            recomendaciones.push('📞 Notificar a coordinadores de zona');
        }
        
        if (analisis.tendencia === 'alto') {
            recomendaciones.push('⚡ Preparar equipos de respuesta rapida');
            recomendaciones.push('📊 Monitoreo continuo cada 15 minutos');
        }
        
        const municipioActivo = analisis.estadisticas.municipioMasActivo;
        if (municipioActivo !== 'ninguno') {
            recomendaciones.push(`🏘️ Reforzar atencion en ${municipioActivo}`);
        }
        
        if (recomendaciones.length === 0) {
            recomendaciones.push('✅ Mantener monitoreo rutinario');
            recomendaciones.push('📋 Revisar protocolos preventivos');
        }
        
        return recomendaciones;
    }

    // simular reportes para demo
    generarReportesMock() {
        const tipos = ['accidente_transito', 'incendio', 'inundacion', 'rescate', 'emergencia_medica'];
        const municipios = ['armenia', 'salento', 'calarca', 'circasia', 'montenegro'];
        
        for (let i = 0; i < 20; i++) {
            this.reportes.push({
                id: i + 1,
                fecha: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                tipo: tipos[Math.floor(Math.random() * tipos.length)],
                municipio: municipios[Math.floor(Math.random() * municipios.length)],
                gravedad: Math.floor(Math.random() * 10) + 1,
                estado: ['abierto', 'en_proceso', 'cerrado'][Math.floor(Math.random() * 3)]
            });
        }
    }
}

// modelo de machine learning simple
class ModeloMLSimple {
    constructor() {
        this.pesos = {
            frecuencia: 0.3,
            gravedad: 0.4,
            temporal: 0.2,
            geografico: 0.1
        };
    }
    
    predecir(caracteristicas) {
        // prediccion lineal simple
        const puntuacion = 
            caracteristicas.frecuencia * this.pesos.frecuencia +
            caracteristicas.gravedad * this.pesos.gravedad +
            caracteristicas.temporal * this.pesos.temporal +
            caracteristicas.geografico * this.pesos.geografico;
            
        return {
            puntuacion: puntuacion,
            categoria: puntuacion > 0.7 ? 'alto' : puntuacion > 0.4 ? 'medio' : 'bajo'
        };
    }
}

// instancia global
const seguimientoIA = new SeguimientoIA();

// funciones para el sistema
function inicializarSeguimientoIA() {
    // generar datos de demo
    seguimientoIA.generarReportesMock();
    actualizarDashboardSeguimiento();
}

function actualizarDashboardSeguimiento() {
    const analisis = seguimientoIA.analizarPatronesReportes();
    const recomendaciones = seguimientoIA.generarRecomendacionesIA(analisis);
    
    // actualizar estadisticas del dashboard
    document.getElementById('reportesHoy').textContent = 
        analisis.estadisticas?.totalReportes || 0;
    
    document.getElementById('emergenciasAbiertas').textContent = 
        seguimientoIA.reportes.filter(r => r.estado === 'abierto').length;
    
    // actualizar seccion de analisis ia
    const analisisElement = document.getElementById('analisisIA');
    if (analisisElement) {
        analisisElement.innerHTML = `
            <div class="analisis-ia-container">
                <h4>🤖 Análisis Inteligente de Patrones</h4>
                <div class="metricas-ia">
                    <div class="metrica">
                        <span class="label">Patrón Detectado:</span>
                        <span class="valor">${analisis.patron}</span>
                    </div>
                    <div class="metrica">
                        <span class="label">Tendencia IA:</span>
                        <span class="valor ${analisis.tendencia}">${analisis.tendencia.toUpperCase()}</span>
                    </div>
                    <div class="metrica">
                        <span class="label">Predicción:</span>
                        <span class="valor">${analisis.prediccion}</span>
                    </div>
                    <div class="metrica">
                        <span class="label">Confianza:</span>
                        <span class="valor">${analisis.confianza}</span>
                    </div>
                </div>
                <div class="recomendaciones-ia">
                    <h5>💡 Recomendaciones del Sistema IA:</h5>
                    ${recomendaciones.map(rec => `<p class="recomendacion">${rec}</p>`).join('')}
                </div>
            </div>
        `;
    }
}

// inicializar cuando se carga la pagina
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(inicializarSeguimientoIA, 1000);
        // actualizar cada 5 minutos
        setInterval(actualizarDashboardSeguimiento, 5 * 60 * 1000);
    });
}