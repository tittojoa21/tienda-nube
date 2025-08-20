class AplicacionTiendaNube {
    constructor() {
        this.iniciar();
    }

    iniciar() {
        this.cachearElementos();
        this.configurarEventos();
        this.configurarRotacionAutomaticaTestimonios();
    }

    cachearElementos() {
        this.elementos = {
            encabezado: document.querySelector('.encabezado'),
            testimonios: document.querySelectorAll('.testimonio'),
            botonAnterior: document.querySelector('.boton-deslizador--anterior'),
            botonSiguiente: document.querySelector('.boton-deslizador--siguiente')
        };

        this.estado = {
            testimonioActual: 0,
            intervaloTestimonios: null
        };
    }

    configurarEventos() {
        window.addEventListener('scroll', this.manejarScroll.bind(this), { passive: true });

        if (this.elementos.botonAnterior && this.elementos.botonSiguiente) {
            this.elementos.botonAnterior.addEventListener('click', this.testimonioAnterior.bind(this));
            this.elementos.botonSiguiente.addEventListener('click', this.testimonioSiguiente.bind(this));
        }

        const formulario = document.querySelector('.formulario');
        if (formulario) {
            formulario.addEventListener('submit', this.validarFormulario.bind(this));
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.manejarDesplazamientoSuave.bind(this));
        });

        
        document.querySelectorAll('.item-pregunta').forEach(item => {
            item.addEventListener('toggle', this.manejarAperturaPregunta.bind(this));
        });
    }

    manejarScroll() {
        const posicionScrollActual = window.scrollY;
        const encabezado = this.elementos.encabezado;
        
        if (encabezado) {
            if (posicionScrollActual > 100) {
                encabezado.classList.add('desplazado');
            } else {
                encabezado.classList.remove('desplazado');
            }
        }
    }

    mostrarTestimonio(indice) {
        this.elementos.testimonios.forEach(testimonio => {
            testimonio.classList.remove('testimonio--activo');
        });
        
        this.estado.testimonioActual = indice;
        this.elementos.testimonios[this.estado.testimonioActual].classList.add('testimonio--activo');
    }

    testimonioAnterior() {
        const nuevoIndice = (this.estado.testimonioActual - 1 + this.elementos.testimonios.length) % this.elementos.testimonios.length;
        this.mostrarTestimonio(nuevoIndice);
        this.reiniciarIntervaloTestimonios();
    }

    testimonioSiguiente() {
        const nuevoIndice = (this.estado.testimonioActual + 1) % this.elementos.testimonios.length;
        this.mostrarTestimonio(nuevoIndice);
        this.reiniciarIntervaloTestimonios();
    }

    configurarRotacionAutomaticaTestimonios() {
        if (this.elementos.testimonios.length > 1) {
            this.estado.intervaloTestimonios = setInterval(() => {
                this.testimonioSiguiente();
            }, 5000);
        }
    }

    reiniciarIntervaloTestimonios() {
        if (this.estado.intervaloTestimonios) {
            clearInterval(this.estado.intervaloTestimonios);
            this.estado.intervaloTestimonios = setInterval(() => {
                this.testimonioSiguiente();
            }, 5000);
        }
    }

    validarFormulario(e) {
        e.preventDefault();
        const entradaEmail = document.querySelector('input[type="email"]');
        const email = entradaEmail.value.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || !regexEmail.test(email)) {
            entradaEmail.classList.add('invalido');
            setTimeout(() => {
                entradaEmail.classList.remove('invalido');
            }, 2000);
            entradaEmail.focus();
            return false;
        }
        
        
        this.mostrarMensajeExito();
        e.target.reset();
    }

    mostrarMensajeExito() {
        const formulario = document.querySelector('.formulario');
        const mensajeExistente = document.querySelector('.mensaje-exito');
        
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
        
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-exito';
        mensaje.textContent = '¡Gracias! Te hemos enviado un correo para continuar con el proceso.';
        mensaje.style.cssText = `
            background-color: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
        `;
        
        formulario.appendChild(mensaje);
        
        setTimeout(() => {
            mensaje.remove();
        }, 5000);
    }

    manejarDesplazamientoSuave(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const elementoObjetivo = document.querySelector(targetId);
        if (elementoObjetivo) {
            const alturaEncabezado = document.querySelector('.encabezado')?.offsetHeight || 0;
            const posicionObjetivo = elementoObjetivo.getBoundingClientRect().top + window.pageYOffset - alturaEncabezado;
            
            window.scrollTo({
                top: posicionObjetivo,
                behavior: 'smooth'
            });
        }
    }

    manejarAperturaPregunta(e) {
        
        if (this.open) {
            document.querySelectorAll('.item-pregunta').forEach(item => {
                if (item !== this) {
                    item.removeAttribute('open');
                }
            });
        }
    }

    
    pausarRotacionTestimonios() {
        if (this.estado.intervaloTestimonios) {
            clearInterval(this.estado.intervaloTestimonios);
        }
    }

    
    reanudarRotacionTestimonios() {
        this.configurarRotacionAutomaticaTestimonios();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new AplicacionTiendaNube();
});


if (typeof module !== 'undefined' && module.exports) {
    module.exports = AplicacionTiendaNube;
}