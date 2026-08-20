# Enrigraphics: Briefing Brillante

Crea una aplicación web mobile-first llamada “Enrigraphics — Briefing de cliente” para usar durante reuniones con clientes. Estilo visual: limpio, editorial, profesional, cálido y minimalista; mucho espacio en blanco, fondo marfil/blanco cálido, tipografía sans moderna y un amarillo mostaza como color de acento. Debe sentirse como una herramienta de estudio de diseño, no como un formulario genérico.

Objetivo principal: que desde un móvil se pueda rellenar cómodamente toda la ficha del cliente y, especialmente, hacer una foto con la cámara o elegir una imagen/archivo del teléfono para añadir referencias visuales.

Estructura:
1) Cabecera con ENRIGRAPHICS, título “Nuevo proyecto” y una breve frase “Cuéntame lo necesario para empezar bien el proyecto”.
2) Datos del cliente: nombre, empresa/marca, teléfono, email, persona de contacto.
3) Tipo de proyecto mediante tarjetas seleccionables: Logo / Branding, Web, App, Automatización. Permitir seleccionar uno o varios.
4) Información general: descripción del proyecto, objetivo principal, público objetivo, fecha límite real, presupuesto aproximado (rangos), quién toma la decisión final.
5) Dirección creativa: colores que gustan, colores a evitar, tipografías que gustan, tipografías a evitar, estilo visual (minimalista, elegante, artesanal, moderno, premium, divertido, industrial, retro) y campo libre.
6) Referencias visuales: al menos 3 bloques. Cada bloque debe permitir desde móvil “Hacer foto” o “Elegir imagen/archivo”; usar input de archivo compatible con cámara móvil (accept image/* y capture cuando corresponda) y mostrar previsualización de la imagen. Permitir eliminar/reemplazar cada referencia. Debajo: URL de referencia y “¿Qué te gusta de esta referencia?”. También aceptar PDF u otros archivos en un botón separado “Adjuntar archivo”.
7) Secciones condicionales según tipo de proyecto:
- Logo/Branding: nombre exacto, eslogan, símbolos que quiere, cosas que NO quiere, usos del logo (web, redes, rótulo, vehículo, textil, packaging, impresión).
- Web: web actual, dominio, hosting, objetivo, tipo de web, páginas aproximadas, textos, fotos, idiomas, formulario, WhatsApp, newsletter, pagos, reservas, área privada, quién actualizará la web.
- App: problema que resuelve, usuarios, flujo principal en 3-4 pasos, login, perfiles, pagos, notificaciones, cámara, GPS, archivos, chat, panel admin, plataformas.
- Automatización: tarea a automatizar, cómo se hace actualmente, tiempo que ocupa, frecuencia, quién la realiza, herramientas usadas y frase “Cuando ocurre X, quiero que ocurra Y automáticamente”.
8) Campo final de notas y botón grande “Guardar briefing”.

UX móvil:
- Campos grandes y cómodos, mínimo 44px de alto.
- Barra de progreso o secciones claras para no hacer una página interminable.
- Guardado automático local mientras se rellena para no perder datos si se cierra accidentalmente.
- Validaciones suaves, no molestas.
- Mensaje de éxito al guardar.
- Debe funcionar perfectamente en iPhone y Android.

De momento, implementa el formulario completo, la carga/previsualización de imágenes/archivos y el guardado local en el navegador. No requieras login. Añade una vista final de resumen del briefing que se pueda revisar después de guardar. Todo el contenido de interfaz en castellano.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://enri-brief-capture.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/95f720c1-9926-415e-8717-64d546f8f3f7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
