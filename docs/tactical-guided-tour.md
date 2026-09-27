# Tactical Guided Tour

## Objetivo

El tour presenta el portfolio mediante una comunicación táctica original entre Ángel y Chimuelo y, a continuación, un recorrido con spotlight por catorce puntos concretos del sitio. La dirección visual toma como referencia las interfaces de comunicación de videojuegos tácticos de la era PS1, pero los retratos, textos, gráficos y sonidos pertenecen al portfolio; no se incluyen marcas, diálogos, samples ni recursos de terceros.

## Activación por gesto

El tour debe iniciarse desde una acción explícita del visitante. El manejador del launcher crea `createTacticalAudio()`, ejecuta `audio.ring()` y recién entonces monta `TacticalTour`. Esto mantiene la creación y reanudación de `AudioContext` dentro de un gesto válido para las políticas de autoplay del navegador.

El launcher compacto del header permanece visible en escritorio. El CTA amplio del hero está oculto temporalmente por CSS, pero sigue implementado para poder reactivarlo sin reconstruir la integración.

No se debe prometer sonido automático al cargar la página. Se puede mostrar una invitación visual, pero el primer sonido siempre depende de pulsar el launcher. Si Web Audio no está disponible, la experiencia continúa completa y el control de audio informa `Audio no disponible`.

Al cerrar el recorrido, el host debe ejecutar `audio.destroy()` y devolver el foco al launcher. La preferencia de silencio se conserva en `localStorage` con la clave `tour-sound-muted`.

## Estados

El host mantiene el estado exterior `idle/open`; dentro de `TacticalTour` existen cuatro fases:

1. `ringing`: llamada entrante, señal PTT, frecuencia y animación de conexión. Se puede omitir la comunicación y entrar directamente al recorrido.
2. `dialogue`: seis intervenciones alternadas entre Ángel y Chimuelo. La escritura progresiva es únicamente visual; una versión completa se anuncia mediante `aria-live`.
3. `tour`: spotlight, tarjeta contextual y navegación anterior/siguiente por los catorce objetivos.
4. `complete`: confirmación final y salida libre al portfolio.

La llamada y el diálogo bloquean el scroll de fondo. La fase `tour` lo habilita para desplazar cada objetivo al centro del viewport. `ResizeObserver`, `scroll` y `resize` recalculan el recorte y la posición de la tarjeta.

## Targets

Los targets se resuelven mediante atributos estables `data-tour-id`; no deben depender de clases de presentación.

| Orden | `data-tour-id` | Código | Contenido |
| --- | --- | --- | --- |
| 1 | `hero` | `INSERTION` | Presentación y propuesta profesional |
| 2 | `projects` | `MISSION INDEX` | Estructura general de proyectos |
| 3 | `projects-production` | `LIVE SYSTEMS` | Proyectos de clientes en producción |
| 4 | `projects-personal` | `R&D ARCHIVE` | Proyectos personales |
| 5 | `experience` | `FIELD LOG` | Trayectoria profesional y referencia a LinkedIn |
| 6 | `about` | `OPERATOR` | Perfil, formación y método |
| 7 | `stack` | `TECH GRAPH` | Resumen de tecnologías principales y Skill Map |
| 8 | `certificate-mobile` | `TRAINING 01` | Desarrollo de aplicaciones móviles |
| 9 | `certificate-ai` | `TRAINING 02` | IA aplicada a industria y negocios |
| 10 | `certificate-data` | `TRAINING 03` | Bootcamp de ciencia de datos |
| 11 | `blog` | `FIELD NOTES` | Blog y proceso de construcción |
| 12 | `lab` | `EXPERIMENTAL OPS` | Sección propia de Tenshi Lab |
| 13 | `contact-form` | `OPEN CHANNEL` | Uso del formulario de contacto |
| 14 | `linkedin` | `PROFESSIONAL LINK` | Contexto profesional completo en LinkedIn |

El target `stack` debe apuntar al contenedor estable de la sección, no exigir que el grafo diferido haya terminado de cargar. Si un target no existe, la integración debe cerrar o saltar el paso de forma segura, nunca dejar un overlay sin controles.

## Teclado y cierre

- `Flecha derecha`: completa primero la línea tipeada; después avanza el diálogo o el paso activo.
- `Flecha izquierda`: retrocede durante el recorrido, salvo en el primer objetivo.
- `Escape`: dispara `onCancel`, aborta el tour y ejecuta la misma limpieza que el botón de cierre.
- `Tab` y `Shift+Tab`: permanecen dentro del `<dialog>` modal nativo.
- Todos los flujos tienen botones equivalentes; el teclado no es el único medio de navegación.

El foco entra en la acción principal al cambiar de fase o paso. Al finalizar o abortar, vuelve al control que abrió el tour. La tarjeta expone el número de objetivo y el texto vigente mediante semántica y anuncios accesibles.

## Motion reducido

`TacticalTour` recibe `motionEnabled` desde la instancia global de `useMotion`; no debe crear una segunda preferencia independiente.

Con motion desactivado o `prefers-reduced-motion: reduce`:

- el texto aparece completo, sin efecto de escritura;
- el desplazamiento entre targets es instantáneo;
- se eliminan glitch, barridos, pulsos, ruido animado y movimientos de retratos;
- la fase de conexión se acorta;
- selección, navegación, audio, cierre y anuncios siguen funcionando.

Las reglas globales de `src/styles/motion.css` son la última garantía y deben mantener el contenido visible. No se usan destellos rápidos como fuente de “juice”.

## Audio original sintetizado

`tourAudio.js` genera toda la señal mediante Web Audio, sin archivos de audio ni muestras externas:

- llamada: pulsos cuadrados propios en 784 Hz y 1046 Hz;
- navegación: blips triangulares ascendentes o descendentes;
- finalización: acorde breve de tres notas;
- ganancia maestra conservadora de `0.055`.

El control mute actualiza la ganancia y detiene fuentes activas. Al ocultarse la pestaña se suspenden osciladores; al cerrar se detienen las fuentes y se cierra el contexto. La frecuencia visual `141.27` es parte de la ficción original del portfolio y no representa una grabación ni conexión real.

## Archivos relevantes

- `src/components/tour/TacticalTour.jsx`: diálogo modal, fases, spotlight, foco y teclado.
- `src/components/tour/tourContent.js`: seis líneas bilingües, catorce pasos, copy y cálculo geométrico.
- `src/components/tour/tourAudio.js`: Web Audio, mute, suspensión y limpieza.
- `src/components/tour/tacticalTour.css`: estética codec, spotlight, responsive y reducción de motion.
- `src/App.jsx`: launcher, ciclo de vida del audio, targets y restauración de foco.
- `src/hooks/useMotion.js`: preferencia global de animación.
- `src/hooks/useSitePreferences.js`: idioma y tema compartidos.
- `src/styles/motion.css`: desactivación global de movimiento.
- `src/assets/dom/angel-dialogue-pixel.webp`: retrato original de Ángel.
- `src/assets/lab/chimuelo-debug-examiner.png`: retrato original de Chimuelo.

La activación automática debe evitar deep links y overlays activos —Architecture Explorer, Skill Map expandido, certificados, terminal o juego— para no competir con otro modal de capa superior.
