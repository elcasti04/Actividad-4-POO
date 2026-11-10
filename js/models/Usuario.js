export class Usuario {
  #id;
  #nombre;
  #correo;
  #telefono;
  #fechaRegistro;

  constructor({ id, nombre, correo, telefono, fechaRegistro }) {
    this.#id = id;
    this.#nombre = nombre.trim();
    this.#correo = correo.trim().toLowerCase();
    this.#telefono = telefono.trim();
    this.#fechaRegistro = fechaRegistro;
  }

  get id() { return this.#id; }
  get nombre() { return this.#nombre; }
  get correo() { return this.#correo; }
  get telefono() { return this.#telefono; }
  get fechaRegistro() { return this.#fechaRegistro; }

  mostrarDatos() {
    return { id: this.#id, nombre: this.#nombre, correo: this.#correo, telefono: this.#telefono, fechaRegistro: this.#fechaRegistro };
  }

  actualizarDatos(datos) {
    this.#nombre = datos.nombre.trim();
    this.#correo = datos.correo.trim().toLowerCase();
    this.#telefono = datos.telefono.trim();
  }

  toJSON() {
    return this.mostrarDatos();
  }
}
