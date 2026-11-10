# Biblioteca Nórdica

Aplicación de gestión de biblioteca hecha con HTML, CSS y módulos JavaScript nativos. Los datos se guardan en `localStorage` del navegador.

## Ejecutar

Abre la carpeta en VS Code y ejecuta `index.html` con una extensión de servidor estático, por ejemplo **Live Server**. También puedes alojar la carpeta en cualquier servidor web estático. No requiere Node.js ni un proceso de compilación. Los navegadores bloquean la carga de módulos ES6 desde direcciones `file://`, por lo que la aplicación debe abrirse desde `http://localhost` o desde un sitio web.

Las portadas se cargan desde Open Library y los iconos desde Font Awesome CDN; se requiere conexión a Internet para ver esos recursos.

## Estructura

- `index.html`: estructura y navegación de la aplicación.
- `css/estilos.css`: estilos y diseño responsive.
- `js/models/`: clases `Libro`, `LibroDigital`, `Usuario` y `Prestamo`.
- `js/Biblioteca.js`: operaciones de dominio, reconstrucción de instancias y persistencia.
- `js/app.js`: vistas, formularios, eventos y notificaciones.

El catálogo y los usuarios de ejemplo se crean la primera vez; los préstamos comienzan vacíos. Para regresar a esos datos, usa **Configuración → Restaurar datos de ejemplo**.

## POO aplicada

- **Encapsulamiento:** los modelos guardan sus atributos en campos privados.
- **Abstracción:** `Biblioteca` centraliza las reglas del catálogo, usuarios y circulación.
- **Herencia y polimorfismo:** `LibroDigital` extiende `Libro` y redefine `mostrarInformacion()`.
- **Persistencia:** se serializan identificadores y al cargar se reconstruyen instancias y referencias entre libros, usuarios y préstamos.
