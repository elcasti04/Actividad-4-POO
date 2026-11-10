import { Libro } from "./Libro.js";

export class LibroDigital extends Libro {
  #formato;
  #tamanoArchivo;

  constructor({ formato = "EPUB", tamanoArchivo = 1.2, ...datos }) {
    super(datos);
    this.#formato = formato;
    this.#tamanoArchivo = Number(tamanoArchivo);
  }

  get formato() { return this.#formato; }
  get tamanoArchivo() { return this.#tamanoArchivo; }
  get tipo() { return "digital"; }

  actualizar(datos) {
    super.actualizar(datos);
    if (datos.formato) this.#formato = datos.formato.trim().toUpperCase();
    if (datos.tamanoArchivo) this.#tamanoArchivo = Number(datos.tamanoArchivo);
  }

  mostrarInformacion() {
    return `${super.mostrarInformacion()} · ${this.#formato}, ${this.#tamanoArchivo} MB`;
  }
}
