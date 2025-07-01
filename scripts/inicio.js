document.addEventListener('DOMContentLoaded', function() {
    console.log('secrica report - pagina de inicio cargada');
    
    initNavigation();
    initScrollEffects();
    initMobileMenu();
    initContactForm();
    initParticleEffects();
});

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // efecto transparencia navbar al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // navegacion suave entre secciones
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // animacion especial para contadores
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // observar elementos para animacion
    const animateElements = document.querySelectorAll(`
        .municipio-card,
        .cultura-item,
        .servicio-card,
        .feature,
        .stat-number
    `);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // animar las lineas del hamburguesa
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (menuToggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contactoForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarFormularioContacto();
        });
    }
}

function procesarFormularioContacto() {
    const nombre = document.getElementById('nombreContacto').value.trim();
    const email = document.getElementById('emailContacto').value.trim();
    const telefono = document.getElementById('telefonoContacto').value.trim();
    const municipio = document.getElementById('municipioContacto').value;
    const mensaje = document.getElementById('mensajeContacto').value.trim();
    
    // validaciones
    if (!nombre || !email || !municipio || !mensaje) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (!window.utilidadessecrica.validaremail(email)) { // ✅ Esto sí funciona
  mostrarMensaje('Email inválido', 'error');
  return;
    }

    
    // crear objeto de contacto
    const contacto = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        telefono: telefono,
        municipio: municipio,
        mensaje: mensaje,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
    };
    
    // guardar en localstorage
    try {
        const contactos = JSON.parse(localStorage.getItem('secrica_contactos') || '[]');
        contactos.push(contacto);
        localStorage.setItem('secrica_contactos', JSON.stringify(contactos));
        
        // limpiar formulario
        document.getElementById('contactoForm').reset();
        
        mostrarNotificacion('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'exito');
        
    } catch (error) {
        console.error('error al guardar contacto:', error);
        mostrarNotificacion('Error al enviar mensaje. Intenta de nuevo.', 'error');
    }
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000; // 2 segundos
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function initParticleEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // crear particulas flotantes tema cafetero
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createParticle(hero);
        }, i * 200);
    }
    
    // crear nuevas particulas cada 3 segundos
    setInterval(() => {
        createParticle(hero);
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: rgba(218, 165, 32, 0.8);
        border-radius: 50%;
        pointer-events: none;
        animation: float ${8 + Math.random() * 4}s infinite linear;
        z-index: 1;
    `;
    
    // posicion aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    
    container.appendChild(particle);
    
    // remover particula despues de la animacion
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 12000);
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.textContent = mensaje;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${tipo === 'exito' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInFromRight 0.3s ease;
        max-width: 350px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// agregar estilos de animacion
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* menu movil responsive */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(15px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-link {
            font-size: 1.2rem;
            padding: 1rem 0;
            width: 100%;
            text-align: center;
        }
        
        .btn-login {
            margin-top: 1rem;
        }
    }
`;

document.head.appendChild(particleStyle);

console.log('pagina de inicio inicializada correctamente');