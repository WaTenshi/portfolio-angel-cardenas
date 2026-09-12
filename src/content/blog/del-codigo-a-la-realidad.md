Cuando uno comienza a desarrollar software, es fácil concentrarse principalmente en el código: que una función haga lo que corresponde, que la base de datos responda correctamente o que una pantalla se vea como fue diseñada. Sin embargo, trabajar con sistemas utilizados por personas reales cambia por completo esa perspectiva.

A lo largo de mi experiencia he participado en distintos proyectos, pero uno de los que más disfruto es el desarrollo y soporte de un software educativo contable. Es también el sistema en el que he tenido mayor interacción con los usuarios finales.

Esa cercanía me ha permitido entender algo importante: una aplicación puede funcionar correctamente desde el punto de vista técnico y, aun así, presentar dificultades cuando se enfrenta a situaciones reales.

## Los detalles pequeños pueden afectar procesos completos

En una ocasión trabajábamos con un proceso que utilizaba hojas escaneadas. Mientras los documentos se procesaban de una determinada manera, el sistema funcionaba correctamente. El problema apareció cuando comenzaron a utilizarse escaneos a color.

A simple vista parecía un cambio menor. Después de todo, seguían siendo las mismas hojas, solo que ahora contenían más información visual. Sin embargo, ese detalle provocó que algunos procesos se volvieran más lentos y dejaran de funcionar de manera óptima.

Necesitábamos transformar los escaneos antes de continuar con el procesamiento. En ese momento no encontré una librería que resolviera exactamente lo que necesitábamos, por lo que desarrollé desde cero una función en JavaScript capaz de convertir las imágenes a blanco y negro.

Esa experiencia me enseñó que, en producción, una característica aparentemente simple puede cambiar el comportamiento de todo un proceso. También me recordó que desarrollar no siempre consiste en instalar una nueva dependencia: en ocasiones hay que comprender el problema y construir una solución adaptada al contexto.

> En producción, una característica aparentemente simple puede cambiar el comportamiento de todo un proceso.

## Los usuarios explican lo que observan

Trabajar directamente con usuarios también me enseñó a escuchar los reportes con atención, pero sin asumir inmediatamente que la causa técnica es la que ellos mencionan.

En más de una ocasión alguien me ha dicho algo similar a:

> "El problema está fallando en el INSERT de la imagen".

La explicación apuntaba directamente a una falla en la base de datos. Sin embargo, al revisar el proceso, descubríamos que el INSERT nunca había sido el problema. En realidad, el campo de carga no estaba capturando correctamente la imagen, por lo que esta nunca llegaba a la etapa en que debía guardarse.

Puede parecer una anécdota pequeña, pero representa muy bien una situación habitual en soporte: el usuario describe el problema utilizando las palabras y conocimientos que tiene disponibles.

No siempre está informando la causa exacta; está intentando explicar lo que experimenta.

Por eso, antes de modificar código o revisar una consulta de base de datos, es importante reconstruir el proceso completo:

- ¿Qué estaba intentando hacer la persona?
- ¿En qué momento apareció el problema?
- ¿Qué resultado esperaba?
- ¿Qué ocurrió realmente?
- ¿La información llegó a la siguiente etapa del sistema?

Escuchar al usuario es el comienzo de la investigación, no necesariamente el diagnóstico final.

## Dar soporte al mismo sistema que desarrollo

Combinar desarrollo de software con soporte técnico ha sido una de las experiencias que más ha influido en mi manera de trabajar.

Cuando das soporte al mismo sistema que estás desarrollando, recibes retroalimentación casi inmediata. Puedes observar cuáles son las dudas más frecuentes, qué instrucciones no están suficientemente claras y qué partes del sistema podrían simplificarse.

Una consulta repetida puede revelar que una interfaz no es tan intuitiva como parecía. Un error frecuente puede demostrar que falta una validación. Una explicación demasiado extensa puede indicar que el flujo necesita ser rediseñado.

Muchas veces, las mejoras más útiles no nacen de una gran reunión ni de una funcionalidad completamente nueva. Nacen de pequeñas dificultades que los usuarios encuentran en su trabajo diario.

Por eso considero que el soporte no es solamente una actividad posterior al desarrollo. También es una fuente directa de información para seguir mejorando el producto.

## La importancia de organizar lo pendiente

Otro aprendizaje que considero importante para quienes comienzan a trabajar con sistemas en producción es mantener un registro de las tareas.

No tiene que ser una plataforma compleja. Puede ser una hoja de Excel, un documento, una aplicación de notas o incluso un bloc de notas. Lo importante es que sea una herramienta suficientemente simple como para utilizarla todos los días.

Una herramienta muy completa no sirve de mucho si su complejidad hace que terminemos abandonándola.

Personalmente, considero útil organizar las tareas considerando al menos dos aspectos:

1. La prioridad o impacto que tienen para los usuarios.
2. La dificultad y el tiempo necesario para resolverlas.

Esto ayuda a evitar que pequeños detalles queden olvidados entre solicitudes más grandes. No elimina por completo los errores, pero reduce considerablemente la posibilidad de que una tarea importante se pierda.

## Más que escribir código

Trabajar con usuarios reales me ha enseñado que desarrollar software no consiste solamente en lograr que una funcionalidad opere.

También significa comprender el proceso en el que será utilizada, escuchar a las personas, analizar los problemas más allá de su primera explicación y reconocer que incluso una pequeña decisión técnica puede afectar el trabajo de alguien.

Hoy, cuando desarrollo una funcionalidad, intento preguntarme no solo si funciona, sino también:

- ¿Será clara para el usuario?
- ¿Qué ocurrirá si ingresa información inesperada?
- ¿Cómo sabremos dónde está el problema si algo falla?
- ¿Será posible mantenerla y mejorarla más adelante?
- ¿Resuelve realmente la necesidad que originó su desarrollo?

> Porque cuando el código llega a la realidad, deja de ser solamente un proyecto.
>
> Se convierte en una herramienta que otras personas utilizan y, muchas veces, necesitan para realizar su trabajo.
