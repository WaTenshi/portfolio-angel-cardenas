# Publicar en el blog

El portfolio, el índice del blog y los artículos son vistas independientes de la
misma aplicación React/Vite. La navegación usa enlaces nativos y cada URL publicada
tiene su propio archivo HTML en `dist`, compatible con GitHub Pages.

## Añadir un artículo

1. Crear `src/content/blog/mi-articulo.md`. Escribir solo el cuerpo: el título,
   resumen, autor y fecha se muestran desde los metadatos. Usar `##` y `###` para
   los apartados que deben aparecer en el índice. Se admiten párrafos, enlaces,
   citas, listas, imágenes, código en línea y bloques de código con triple acento.
2. Agregar una entrada a `src/content/blog/articles.json`:

```json
{
  "slug": "mi-articulo",
  "title": "El título del artículo",
  "description": "Un resumen breve y fiel al contenido.",
  "author": "Ángel Cárdenas",
  "date": "2026-07-14",
  "category": "Desarrollo de software",
  "tags": ["Producción", "JavaScript"],
  "language": "es",
  "featured": false,
  "contentFile": "mi-articulo.md"
}
```

3. Opcionalmente colocar una portada en `public/blog/assets/` y añadir:

```json
"coverImage": {
  "src": "blog/assets/mi-portada.webp",
  "alt": "Descripción del contenido de la portada.",
  "width": 1200,
  "height": 780
}
```

Sin portada se usa el gráfico editorial compartido. Las imágenes dentro del
Markdown pueden usar `/blog/assets/imagen.webp`; el renderizador añade la base del
sitio. Conservar dimensiones y optimizar las imágenes antes de publicarlas.

4. Ejecutar `npm run lint`, `npm run build` y `node --test tests/blog.test.mjs`.
   Revisar la nueva URL antes de publicar. Un push a `main` activa el despliegue
   existente de GitHub Pages; el build local no publica el sitio.

El tiempo de lectura se calcula a 200 palabras/minuto, redondeando hacia arriba.
Los artículos se ordenan por fecha descendente. Se destaca la primera entrada
marcada `featured`; si ninguna lo está, se destaca la más reciente. Los relacionados
comparten al menos una etiqueta, excluyen el artículo actual y se limitan a dos.
La navegación anterior/siguiente solo aparece cuando existen otros artículos.

## Rutas y compilación

- Base de Vite: `/portfolio-angel-cardenas/`.
- Índice: `/portfolio-angel-cardenas/blog/`.
- Artículo: `/portfolio-angel-cardenas/blog/<slug>/`.
- El plugin `scripts/blog-plugin.mjs` prepara metadatos y tiempo de lectura sin
  enviar el cuerpo de todos los artículos al índice. Actualiza el desarrollo
  cuando cambia un Markdown o el registro.
- `scripts/build-blog-pages.mjs` genera los HTML después de Vite, incluidos sus
  títulos, descripciones, canónicas y `404.html`. Para cambiar de dominio, actualizar
  el origen canónico de ese script además de la configuración de despliegue.
- Los slugs deben ser únicos y usar letras minúsculas ASCII, números y guiones.
  El nombre del Markdown debe coincidir con el slug. El build falla si falta el
  contenido o la portada, o si los metadatos no son válidos.
- Los HTML generados son entradas de la aplicación cliente, no páginas con todo
  el artículo prerenderizado. La lectura necesita JavaScript.

## Idiomas, movimiento y estilos

Los controles comparten `language`, `theme` y `motion-paused` con el portfolio.
La interfaz es ES/EN y el artículo original conserva `lang="es"`. La fecha se
formatea en UTC para mostrar siempre el día publicado, incluso en Chile.

`react-markdown` se carga solo con la vista del artículo. No se interpreta HTML
crudo dentro del Markdown. El portfolio no carga ni el renderizador ni el cuerpo
del artículo.

Los estilos base y de movimiento están en `src/styles/`. Los estilos del portfolio
están delimitados por `.portfolio-shell`; el blog tiene clases propias. `useMotion`
admite una clave de contenido opcional para observar elementos nuevos tras cargar
un artículo. La barra de lectura escribe en una referencia DOM, sin renderizar
React durante el scroll, y se recalcula al cambiar dimensiones o cargar imágenes.

## Verificación en un servidor estático real

```bash
npm run build
node tests/static-server.mjs
```

Abrir `http://127.0.0.1:4175/portfolio-angel-cardenas/`. Este servidor no utiliza
fallback de SPA: las rutas existentes responden 200 y las desconocidas responden
404 con la pantalla de recuperación. Verificar navegación, recarga, Atrás/Adelante,
fragmentos a subtítulos y las rutas con y sin barra final.

`tests/blog-browser.cjs` contiene la comprobación de navegador. Requiere Playwright
como herramienta de desarrollo externa; no es una dependencia del portfolio. En
Linux/macOS se puede preparar un entorno temporal:

```bash
npm install --prefix /tmp/portfolio-validation playwright
/tmp/portfolio-validation/node_modules/.bin/playwright install chromium --only-shell
NODE_PATH=/tmp/portfolio-validation/node_modules node tests/blog-browser.cjs
```

El servidor estático debe estar ejecutándose. Las capturas y el resultado se guardan
en la carpeta temporal `portfolio-blog-checks`; se puede cambiar con
`PORTFOLIO_ARTIFACTS`. La URL se configura con `PORTFOLIO_TEST_URL`.

## Artículo inicial

«Del código a la realidad: lo que aprendí trabajando con usuarios reales» se
transcribió de las tres páginas del PDF proporcionado. La comparación automática
confirmó la misma secuencia de 950 tokens de palabras/números, después de retirar
cabeceras, paginación y metadatos mostrados por separado. La fecha del 14 de julio
de 2026 fue indicada por el autor. La lectura estimada es de 5 minutos.
