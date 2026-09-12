# Portfolio: diseño y movimiento

El orden visible es Inicio, Proyectos, Experiencia, Sobre mí, Tecnologías,
Certificados y Contacto. Los IDs de las secciones y el parámetro `?view=` siguen
funcionando. Figma se conserva detrás de `showFigma = false` en `src/App.jsx`.

## Movimiento

`useMotion` centraliza la preferencia persistida `motion-paused`, la preferencia
del sistema y la visibilidad de la pestaña. La preferencia de movimiento reducido
del sistema tiene prioridad. El botón de pausa está en la cabecera.

- Un `IntersectionObserver` compartido observa `[data-reveal]` y
  `[data-motion-region]`. El observador de navegación sigue siendo independiente.
- `Reveal` anima un envoltorio, mientras las interacciones animan su contenido:
  no compiten por la misma propiedad `transform`.
- Las entradas duran 500 ms, recorren 16 px y admiten retrasos hasta 240 ms.
- Los bucles `.ambient-loop` solo se ejecutan con la pestaña visible y su región
  en pantalla. El fondo fijo permanece activo mientras la pestaña sea visible.
- En pantallas de hasta 780 px queda una forma ambiental y se reducen los
  desplazamientos a la mitad. La rotación no cambia la posición del texto.
- Pausar o reducir movimiento muestra todo el contenido inmediatamente. Los
  elementos con foco tampoco permanecen ocultos esperando al observador.
- No se actualiza estado de React por fotograma. Solo se animan transformaciones
  y opacidad; las sombras, fondos y filtros son estáticos.

Referencia técnica: [animaciones eficientes, web.dev](https://web.dev/articles/animations-guide).
El control global sigue la orientación de
[W3C sobre pausar movimiento continuo](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

## Recursos

`src/assets/optimized/images.js` reúne las URLs, `srcSet` y dimensiones intrínsecas.
Los WebP del retrato tienen anchos de 400 y 800 px; los proyectos, 640 y 1280 px.
Se generaron a calidad 80 conservando proporciones. Los originales permanecen en
`src/assets` para futuras exportaciones, pero no se importan en la interfaz.
Al reemplazar una imagen, actualizar sus dos variantes y dimensiones del manifiesto.

Las fuentes locales son DM Sans (variable, pesos 400–600), IBM Plex Mono (400/500)
e Instrument Serif (normal/cursiva). Sus licencias OFL acompañan los archivos en
`src/assets/fonts`. Se usa `font-display: swap` y se precargan las fuentes de portada.

Los certificados se importan como URLs. La imagen o el PDF se solicita al montar
el diálogo; la importación de la URL no descarga el documento. El diálogo nativo
maneja el foco, Escape y el fondo inerte, y restaura el foco al cerrarse.

## Validación

```bash
npm run lint
npm run build
npm run preview
```

Las mediciones se hacen sobre producción local con Lighthouse móvil, tres veces
por versión, sin otros navegadores de prueba ejecutándose. Objetivos: mediana de
rendimiento ≥90, LCP ≤2500 ms, CLS ≤0,1 y TBT ≤200 ms. Estas medidas de laboratorio
no sustituyen datos de dispositivos reales.

Comprobar ambos idiomas y temas en 320, 390, 600, 780, 900, 1024 y 1440 px;
preferencias persistidas; movimiento reducido en vivo; pausa fuera de pantalla;
menú móvil; teclado; apertura/cierre y foco de los seis certificados; enlaces
profundos; y envío del formulario mediante `mailto:`.

El despliegue sigue utilizando GitHub Pages con la base
`/portfolio-angel-cardenas/`. No requiere servicios ni dependencias de producción
adicionales.
