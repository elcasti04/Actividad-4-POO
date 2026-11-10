export class Libro {
  #id;
  #titulo;
  #autor;
  #categoria;
  #anio;
  #portada;
  #disponible;

  constructor({ id, titulo, autor, categoria, anio, portada, disponible = true }) {
    this.#id = id;
    this.#titulo = titulo.trim();
    this.#autor = autor.trim();
    this.#categoria = categoria;
    this.#anio = Number(anio);
    this.#portada = portada;
    this.#disponible = Boolean(disponible);
  }

  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get autor() { return this.#autor; }
  get categoria() { return this.#categoria; }
  get anio() { return this.#anio; }
  get portada() { return this.#portada; }
  get disponible() { return this.#disponible; }
  get tipo() { return "fisico"; }

  actualizar(datos) {
    this.#titulo = datos.titulo.trim();
    this.#autor = datos.autor.trim();
    this.#categoria = datos.categoria;
    this.#anio = Number(datos.anio);
    this.#portada = datos.portada;
  }

  mostrarInformacion() {
    return `${this.#titulo} — ${this.#autor} (${this.#anio})`;
  }

  cambiarEstado(disponible) {
    this.#disponible = Boolean(disponible);
  }

  prestar() {
    if (!this.#disponible) throw new Error("Este libro ya está prestado.");
    this.#disponible = false;
  }

  devolver() {
    if (this.#disponible) throw new Error("Este libro ya figura como disponible.");
    this.#disponible = true;
  }

  toJSON() {
    return {
      tipo: this.tipo,
      id: this.#id,
      titulo: this.#titulo,
      autor: this.#autor,
      categoria: this.#categoria,
      anio: this.#anio,
      portada: this.#portada,
      disponible: this.#disponible,
      ...(this.tipo === "digital" ? { formato: this.formato, tamanoArchivo: this.tamanoArchivo } : {})
    };
  }
}
