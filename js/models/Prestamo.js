import { fechaLocalISO } from "../fecha.js";

export class Prestamo {
  #id;
  #libro;
  #usuario;
  #fechaPrestamo;
  #fechaDevolucion;
  #estado;
  #fechaDevuelto;

  constructor({ id, libro, usuario, fechaPrestamo, fechaDevolucion, estado = "Activo", fechaDevuelto = null }) {
    this.#id = id;
    this.#libro = libro;
    this.#usuario = usuario;
    this.#fechaPrestamo = fechaPrestamo;
    this.#fechaDevolucion = fechaDevolucion;
    this.#estado = estado;
    this.#fechaDevuelto = fechaDevuelto;
  }

  get id() { return this.#id; }
  get libro() { return this.#libro; }
  get usuario() { return this.#usuario; }
  get fechaPrestamo() { return this.#fechaPrestamo; }
  get fechaDevolucion() { return this.#fechaDevolucion; }
  get estado() { return this.#estado; }
  get fechaDevuelto() { return this.#fechaDevuelto; }

  registrarPrestamo() {
    if (this.#estado !== "Activo") throw new Error("El préstamo no está activo.");
    this.#libro.prestar();
  }

  devolverLibro(fecha = fechaLocalISO()) {
    if (this.#estado !== "Activo") throw new Error("Este préstamo ya fue devuelto.");
    this.#libro.devolver();
    this.#estado = "Devuelto";
    this.#fechaDevuelto = fecha;
  }

  calcularDiasRestantes() {
    if (this.#estado !== "Activo") return 0;
    const hoy = new Date(`${fechaLocalISO()}T00:00:00`);
    const vencimiento = new Date(`${this.#fechaDevolucion}T00:00:00`);
    return Math.ceil((vencimiento - hoy) / 86400000);
  }

  toJSON() {
    return {
      id: this.#id,
      libroId: this.#libro.id,
      usuarioId: this.#usuario.id,
      fechaPrestamo: this.#fechaPrestamo,
      fechaDevolucion: this.#fechaDevolucion,
      estado: this.#estado,
      fechaDevuelto: this.#fechaDevuelto
    };
  }
}
