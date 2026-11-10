Sistema de gestión de biblioteca desarrollado con Programación Orientada a Objetos (POO)

Biblioteca Nórdica es una aplicación web que permite administrar los libros, usuarios y préstamos de una biblioteca mediante una interfaz gráfica moderna e intuitiva.

El proyecto fue desarrollado utilizando HTML5, CSS3 y JavaScript moderno (ES6+), aplicando los conceptos de Programación Orientada a Objetos (POO) estudiados en la unidad 4.

La aplicación permite registrar y consultar libros, administrar usuarios, realizar préstamos y gestionar devoluciones. También cuenta con almacenamiento local mediante localStorage, lo que permite conservar la información al actualizar o cerrar el navegador.

1. Objetivo del proyecto

Desarrollar una aplicación web funcional que permita poner en práctica los principios de Programación Orientada a Objetos mediante la creación de clases, objetos, atributos y métodos, implementando herencia, polimorfismo, encapsulamiento y abstracción.

2. Tecnologías utilizadas

HTML5: estructura de la aplicación.

CSS3: diseño visual y adaptación a diferentes dispositivos.

JavaScript ES6+: lógica y funcionalidades de la aplicación.

LocalStorage: almacenamiento de información en el navegador.

Módulos ES6: organización del código mediante import y export.

Open Library: obtención de portadas de libros.

Font Awesome: iconos utilizados en la interfaz.

3. Funcionalidades principales

La aplicación cuenta con los siguientes módulos:

Panel principal: muestra estadísticas de libros registrados, disponibles, prestados y usuarios.

Catálogo de libros: permite registrar, consultar, editar, eliminar y buscar libros.

Gestión de usuarios: permite registrar, consultar, actualizar y administrar los usuarios de la biblioteca.

Gestión de préstamos: permite asignar libros a usuarios registrados y establecer fechas de devolución.

Devoluciones: permite registrar la devolución de libros y actualizar automáticamente su disponibilidad.

Configuración: permite restaurar los datos de ejemplo iniciales.

4. Programación Orientada a Objetos aplicada

Para desarrollar la aplicación se implementaron cinco clases principales, cada una con responsabilidades específicas.

Clases implementadas

Clase

Responsabilidad

Libro

Representa los libros y administra su información y disponibilidad.

LibroDigital

Representa libros digitales y hereda las características de Libro.

Usuario

Administra la información de los usuarios registrados.

Prestamo

Gestiona los préstamos, las fechas y las devoluciones.

Biblioteca

Controla el funcionamiento general y coordina las operaciones del sistema.

Principios de POO implementados

Encapsulamiento: se utilizan campos privados en las clases para proteger los atributos y controlar el acceso a la información mediante métodos.

Abstracción: cada clase representa un elemento de la biblioteca y contiene únicamente los atributos y métodos necesarios para cumplir su función. La clase Biblioteca centraliza las operaciones generales del sistema.

Herencia: la clase LibroDigital utiliza extends para heredar los atributos y métodos de la clase Libro, incorporando características propias como el formato y el tamaño del archivo.

Polimorfismo: la clase LibroDigital sobrescribe el método mostrarInformacion() para presentar información adicional sobre los libros digitales, utilizando un comportamiento diferente al de la clase original.

Modularidad: las clases se encuentran distribuidas en archivos independientes mediante módulos nativos de JavaScript, facilitando la organización y el mantenimiento del código.

5. Estructura del proyecto

biblioteca-poo/
│
├── index.html
│
├── css/
│   └── estilos.css
│
└── js/
    ├── models/
    │   ├── Libro.js
    │   ├── LibroDigital.js
    │   ├── Usuario.js
    │   └── Prestamo.js
    │
    ├── Biblioteca.js
    └── app.js

Descripción de los archivos

index.html: contiene la estructura de la interfaz gráfica y la navegación.

css/estilos.css: contiene los estilos visuales y el diseño responsive.

js/models/: contiene las clases que representan los elementos principales de la biblioteca.

js/Biblioteca.js: contiene la clase principal, las operaciones de gestión y la persistencia de datos.

js/app.js: conecta la lógica de JavaScript con la interfaz gráfica, administra los eventos, formularios y notificaciones.

6. Almacenamiento de información

La aplicación utiliza localStorage para guardar los libros, usuarios y préstamos registrados.

Los datos se convierten a formato JSON para almacenarlos en el navegador. Al iniciar nuevamente la aplicación, se recupera la información y se reconstruyen los objetos mediante sus respectivas clases.

También se conservan las relaciones entre libros, usuarios y préstamos utilizando sus identificadores.

7. Requisitos para ejecutar el proyecto

Para ejecutar la aplicación se necesita:

Un navegador web actualizado, como Google Chrome, Microsoft Edge o Firefox.

Visual Studio Code (opcional, pero recomendado).

Extensión Live Server o cualquier servidor web estático.

Conexión a Internet para cargar las portadas de Open Library y los iconos de Font Awesome.

No requiere Node.js, instalación de dependencias ni procesos de compilación.

8. Instrucciones de ejecución

Descargar o clonar el repositorio del proyecto.

Abrir la carpeta biblioteca-poo en Visual Studio Code.

Instalar la extensión Live Server si aún no está instalada.

Abrir el archivo index.html.

Hacer clic derecho y seleccionar Open with Live Server.

La aplicación se abrirá automáticamente en el navegador.

Importante: no se debe abrir directamente el archivo mediante file://, ya que los módulos ES6 necesitan ejecutarse desde un servidor HTTP.

9. Datos de ejemplo

La primera vez que se inicia la aplicación se cargan libros y usuarios de ejemplo para facilitar las pruebas de funcionamiento.

Los préstamos comienzan vacíos y se generan a medida que se realizan operaciones desde la interfaz.

Para recuperar los datos iniciales, se puede utilizar la opción Configuración → Restaurar datos de ejemplo.

10. Conclusión

Biblioteca Nórdica permite demostrar la aplicación práctica de los conceptos de Programación Orientada a Objetos mediante el desarrollo de un sistema de gestión de biblioteca.

La utilización de clases, objetos, encapsulamiento, abstracción, herencia y polimorfismo permitió organizar el código y separar las responsabilidades de cada componente. De esta manera, se obtuvo una aplicación funcional que integra la lógica de JavaScript con una interfaz gráfica y almacenamiento local.

El proyecto cumple con el propósito académico de aplicar los conocimientos adquiridos en la unidad 4 mediante una solución práctica desarrollada en JavaScript.