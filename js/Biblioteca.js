import { Libro } from "./models/Libro.js";
import { LibroDigital } from "./models/LibroDigital.js";
import { Usuario } from "./models/Usuario.js";
import { Prestamo } from "./models/Prestamo.js";
import { fechaLocalISO } from "./fecha.js";

const CLAVE_ALMACENAMIENTO = "biblioteca-nordica-v1";

export class Biblioteca {
  #libros = [];
  #usuarios = [];
  #prestamos = [];

  get libros() { return [...this.#libros]; }
  get usuarios() { return [...this.#usuarios]; }
  get prestamos() { return [...this.#prestamos]; }

  constructor() {
    this.cargarDatos();
  }

  agregarLibro(datos) {
    const libro = datos instanceof Libro ? datos : datos.tipo === "digital" ? new LibroDigital(datos) : new Libro(datos);
    if (this.#libros.some((existente) => existente.id === libro.id)) throw new Error("Ya existe un libro con ese identificador.");
    this.#libros.push(libro);
    this.guardarDatos();
    return libro;
  }

  editarLibro(id, datos) {
    const libro = this.#libros.find((item) => item.id === id);
    if (!libro) throw new Error("No se encontró el libro.");
    libro.actualizar(datos);
    this.guardarDatos();
    return libro;
  }

  eliminarLibro(id) {
    if (this.#prestamos.some((prestamo) => prestamo.libro.id === id && prestamo.estado === "Activo")) {
      throw new Error("No se puede eliminar un libro con un préstamo activo.");
    }
    this.#libros = this.#libros.filter((libro) => libro.id !== id);
    this.guardarDatos();
  }

  buscarLibro(consulta = "") {
    const normalizada = consulta.trim().toLocaleLowerCase("es");
    return this.#libros.filter((libro) => `${libro.titulo} ${libro.autor}`.toLocaleLowerCase("es").includes(normalizada));
  }

  registrarUsuario(datos) {
    const usuario = datos instanceof Usuario ? datos : new Usuario(datos);
    if (this.#usuarios.some((existente) => existente.id === usuario.id)) throw new Error("Ya existe un usuario con ese identificador.");
    if (this.#usuarios.some((existente) => existente.correo === usuario.correo)) throw new Error("Ya existe un usuario con ese correo electrónico.");
    this.#usuarios.push(usuario);
    this.guardarDatos();
    return usuario;
  }

  editarUsuario(id, datos) {
    const usuario = this.#usuarios.find((item) => item.id === id);
    if (!usuario) throw new Error("No se encontró el usuario.");
    if (this.#usuarios.some((item) => item.id !== id && item.correo === datos.correo.trim().toLowerCase())) {
      throw new Error("Ya existe un usuario con ese correo electrónico.");
    }
    usuario.actualizarDatos(datos);
    this.guardarDatos();
    return usuario;
  }

  eliminarUsuario(id) {
    if (this.#prestamos.some((prestamo) => prestamo.usuario.id === id && prestamo.estado === "Activo")) {
      throw new Error("No se puede eliminar un usuario con préstamos activos.");
    }
    this.#usuarios = this.#usuarios.filter((usuario) => usuario.id !== id);
    this.guardarDatos();
  }

  prestarLibro({ libroId, usuarioId, fechaPrestamo, fechaDevolucion }) {
    const libro = this.#libros.find((item) => item.id === libroId);
    const usuario = this.#usuarios.find((item) => item.id === usuarioId);
    if (!usuario) throw new Error("Selecciona un usuario registrado.");
    if (!libro) throw new Error("Selecciona un libro registrado.");
    if (!libro.disponible) throw new Error("Este libro ya está prestado.");
    if (!fechaPrestamo || !fechaDevolucion || fechaDevolucion < fechaPrestamo) throw new Error("La fecha de devolución debe ser igual o posterior al préstamo.");
    const prestamo = new Prestamo({
      id: crypto.randomUUID(),
      libro,
      usuario,
      fechaPrestamo,
      fechaDevolucion
    });
    prestamo.registrarPrestamo();
    this.#prestamos.unshift(prestamo);
    this.guardarDatos();
    return prestamo;
  }

  devolverLibro(id) {
    const prestamo = this.#prestamos.find((item) => item.id === id);
    if (!prestamo) throw new Error("No se encontró el préstamo.");
    prestamo.devolverLibro();
    this.guardarDatos();
    return prestamo;
  }

  obtenerEstadisticas() {
    return {
      totalLibros: this.#libros.length,
      disponibles: this.#libros.filter((libro) => libro.disponible).length,
      prestados: this.#libros.filter((libro) => !libro.disponible).length,
      usuarios: this.#usuarios.length,
      prestamosActivos: this.#prestamos.filter((prestamo) => prestamo.estado === "Activo").length
    };
  }

  historialUsuario(id) {
    return this.#prestamos.filter((prestamo) => prestamo.usuario.id === id);
  }

  guardarDatos() {
    const datos = {
      libros: this.#libros.map((libro) => libro.toJSON()),
      usuarios: this.#usuarios.map((usuario) => usuario.toJSON()),
      prestamos: this.#prestamos.map((prestamo) => prestamo.toJSON())
    };
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datos));
  }

  cargarDatos() {
    const almacenado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!almacenado) {
      this.#libros = crearLibrosIniciales();
      this.#usuarios = crearUsuariosIniciales();
      this.#prestamos = [];
      this.guardarDatos();
      return;
    }
    try {
      const datos = JSON.parse(almacenado);
      this.#libros = (datos.libros || []).map((item) => item.tipo === "digital" ? new LibroDigital(item) : new Libro(item));
      this.#usuarios = (datos.usuarios || []).map((item) => new Usuario(item));
      const librosPorId = new Map(this.#libros.map((libro) => [libro.id, libro]));
      const usuariosPorId = new Map(this.#usuarios.map((usuario) => [usuario.id, usuario]));
      this.#prestamos = (datos.prestamos || []).flatMap((item) => {
        const libro = librosPorId.get(item.libroId);
        const usuario = usuariosPorId.get(item.usuarioId);
        return libro && usuario ? [new Prestamo({ ...item, libro, usuario })] : [];
      });
    } catch (error) {
      console.error("No se pudieron cargar los datos de la biblioteca:", error);
      throw new Error("Los datos guardados están dañados. Borra el almacenamiento local para iniciar de nuevo.");
    }
  }
}

function crearLibrosIniciales() {
  const registros = [
    ["don-quijote", "Don Quijote de la Mancha", "Miguel de Cervantes", "Clásicos", 1605, "id-14428305"],
    ["orgullo-prejuicio", "Orgullo y prejuicio", "Jane Austen", "Romance", 1813, "9780141439518"],
    ["frankenstein", "Frankenstein", "Mary Shelley", "Ciencia ficción", 1818, "9780141439471"],
    ["dracula", "Drácula", "Bram Stoker", "Terror", 1897, "9780141439846"],
    ["alicia", "Alicia en el país de las maravillas", "Lewis Carroll", "Fantasía", 1865, "9780141321073"],
    ["sherlock", "Las aventuras de Sherlock Holmes", "Arthur Conan Doyle", "Misterio", 1892, "9780140439083"],
    ["dorian-gray", "El retrato de Dorian Gray", "Oscar Wilde", "Clásicos", 1890, "9780141439570"],
    ["isla-tesoro", "La isla del tesoro", "Robert Louis Stevenson", "Aventuras", 1883, "9780141321004"],
    ["moby-dick", "Moby Dick", "Herman Melville", "Aventuras", 1851, "9780142437247"],
    ["mujercitas", "Mujercitas", "Louisa May Alcott", "Clásicos", 1868, "9780147514011"],
    ["jane-eyre", "Jane Eyre", "Charlotte Brontë", "Romance", 1847, "9780141441146"],
    ["el-conde", "El conde de Montecristo", "Alexandre Dumas", "Aventuras", 1844, "9780140449266"],
    ["guerra-paz", "Guerra y paz", "León Tolstói", "Clásicos", 1869, "9780199232765"],
    ["carmilla", "Carmilla", "Sheridan Le Fanu", "Terror", 1872, "9780141441351"]
  ];
  return registros.map(([id, titulo, autor, categoria, anio, isbn], indice) => {
    const portada = isbn.startsWith("id-")
      ? `https://covers.openlibrary.org/b/id/${isbn.slice(3)}-M.jpg?default=false`
      : `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`;
    const datos = { id, titulo, autor, categoria, anio, portada, disponible: true };
    return indice === 13 ? new LibroDigital({ ...datos, formato: "EPUB", tamanoArchivo: 0.8 }) : new Libro(datos);
  });
}

function crearUsuariosIniciales() {
  const hoy = fechaLocalISO();
  return [
    new Usuario({ id: "usr-001", nombre: "Sofía Ramírez", correo: "sofia.ramirez@email.com", telefono: "+52 55 1234 5678", fechaRegistro: hoy }),
    new Usuario({ id: "usr-002", nombre: "Diego Hernández", correo: "diego.hernandez@email.com", telefono: "+52 55 9876 5432", fechaRegistro: hoy }),
    new Usuario({ id: "usr-003", nombre: "Valentina Cruz", correo: "valentina.cruz@email.com", telefono: "+52 55 2468 1357", fechaRegistro: hoy })
  ];
}
