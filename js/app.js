import { Biblioteca } from "./Biblioteca.js";
import { fechaLocalISO } from "./fecha.js";

const biblioteca = new Biblioteca();
const contenido = document.querySelector("#content");
const dialogo = document.querySelector("#app-dialog");
const contenidoDialogo = document.querySelector("#dialog-content");
const zonaAvisos = document.querySelector("#toast-region");
const nombresSeccion = {
  dashboard: "Panel principal",
  catalogo: "Catálogo de libros",
  usuarios: "Usuarios",
  prestamos: "Préstamos",
  configuracion: "Configuración"
};
let seccionActual = "dashboard";
let filtroBusqueda = "";
let filtroCategoria = "";
let filtroDisponibilidad = "todos";

const escapar = (valor = "") => String(valor).replace(/[&<>"']/g, (caracter) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[caracter]));
const fecha = (valor) => valor ? new Date(`${valor}T00:00:00`).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const formatoMoneda = (numero) => Number(numero).toLocaleString("es-MX");
const iniciales = (nombre) => nombre.split(/\s+/).slice(0, 2).map((parte) => parte[0] || "").join("").toUpperCase();

function renderizar() {
  document.querySelector("#breadcrumb-current").textContent = nombresSeccion[seccionActual];
  document.querySelectorAll(".nav-link").forEach((boton) => boton.classList.toggle("active", boton.dataset.section === seccionActual));
  const vistas = {
    dashboard: renderizarPanel,
    catalogo: renderizarCatalogo,
    usuarios: renderizarUsuarios,
    prestamos: renderizarPrestamos,
    configuracion: renderizarConfiguracion
  };
  contenido.innerHTML = vistas[seccionActual]();
}

function renderizarPanel() {
  const datos = biblioteca.obtenerEstadisticas();
  const recientes = [...biblioteca.libros].slice(-4).reverse();
  const prestamosRecientes = biblioteca.prestamos.slice(0, 4);
  const porcentajeDisponible = datos.totalLibros ? Math.round((datos.disponibles / datos.totalLibros) * 100) : 0;
  return `
    <section class="page-heading">
      <div><p class="eyebrow">${new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase()}</p><h1>¡Buenos días, María! <span class="wave">✦</span></h1><p class="subtitle">Aquí tienes el resumen de tu biblioteca hoy.</p></div>
      <button class="button button-primary" data-action="nuevo-prestamo"><span class="button-plus">＋</span> Registrar préstamo</button>
    </section>
    <section class="stats-grid">
      ${tarjetaEstadistica("Libros registrados", datos.totalLibros, "▤", "icon-blue", "En el catálogo", null)}
      ${tarjetaEstadistica("Libros disponibles", datos.disponibles, "✓", "icon-green", `${porcentajeDisponible}% del catálogo`, porcentajeDisponible)}
      ${tarjetaEstadistica("Libros prestados", datos.prestados, "⇄", "icon-orange", "Actualmente en circulación", null)}
      ${tarjetaEstadistica("Usuarios registrados", datos.usuarios, "♙", "icon-purple", "Miembros de la biblioteca", null)}
    </section>
    <section class="dashboard-grid">
      <article class="panel-card circulation-card">
        <div class="panel-heading"><div><h2>Estado de circulación</h2><p>Disponibilidad actual de tu colección</p></div><span class="period-pill">En tiempo real <i></i></span></div>
        <div class="circulation-content"><div class="donut" style="--available:${porcentajeDisponible}%"><div><strong>${datos.totalLibros ? `${porcentajeDisponible}%` : "0%"}</strong><span>disponibles</span></div></div><div class="legend"><div><span class="legend-dot blue-dot"></span><span>Disponibles</span><strong>${datos.disponibles}</strong></div><div><span class="legend-dot pale-dot"></span><span>Prestados</span><strong>${datos.prestados}</strong></div><div class="legend-note">Total de ejemplares <b>${datos.totalLibros}</b></div></div></div>
      </article>
      <article class="panel-card">
        <div class="panel-heading"><div><h2>Accesos rápidos</h2><p>Atajos para las tareas frecuentes</p></div></div>
        <div class="quick-actions"><button data-action="nuevo-libro"><span class="quick-icon quick-blue">＋</span><span><strong>Agregar un libro</strong><small>Incorpora un nuevo título</small></span><b>→</b></button><button data-action="nuevo-usuario"><span class="quick-icon quick-purple">♙</span><span><strong>Registrar usuario</strong><small>Da de alta un miembro</small></span><b>→</b></button></div>
      </article>
      <article class="panel-card recent-loans">
        <div class="panel-heading"><div><h2>Préstamos recientes</h2><p>Actividad más reciente</p></div><button class="text-button" data-section="prestamos">Ver todos <span>→</span></button></div>
        ${prestamosRecientes.length ? `<div class="compact-list">${prestamosRecientes.map((prestamo) => `<div class="compact-row"><span class="mini-cover">${escapar(iniciales(prestamo.libro.titulo))}</span><span class="compact-main"><strong>${escapar(prestamo.libro.titulo)}</strong><small>${escapar(prestamo.usuario.nombre)}</small></span><span class="compact-date">${fecha(prestamo.fechaPrestamo)}</span></div>`).join("")}</div>` : estadoVacio("Aún no hay préstamos", "Cuando registres un préstamo, aparecerá aquí.")}</article>
      <article class="panel-card recent-books">
        <div class="panel-heading"><div><h2>Agregados recientemente</h2><p>Últimos títulos en el catálogo</p></div><button class="text-button" data-section="catalogo">Ver catálogo <span>→</span></button></div>
        ${recientes.length ? `<div class="recent-book-grid">${recientes.map((libro) => `<div class="recent-book"><div class="recent-book-cover">${portada(libro)}</div><strong>${escapar(libro.titulo)}</strong><small>${escapar(libro.autor)}</small></div>`).join("")}</div>` : estadoVacio("Tu catálogo está vacío", "Agrega el primer libro para comenzar.")}</article>
    </section>`;
}

function tarjetaEstadistica(titulo, valor, icono, clase, nota, progreso) {
  return `<article class="stat-card"><div class="stat-top"><span>${titulo}</span><span class="stat-icon ${clase}">${icono}</span></div><strong class="stat-value">${formatoMoneda(valor)}</strong><div class="stat-bottom"><span>${nota}</span>${progreso === null ? "" : `<span class="stat-progress">${progreso}%</span>`}</div>${progreso === null ? "" : `<div class="progress-track"><span style="width:${progreso}%"></span></div>`}</article>`;
}

function renderizarCatalogo() {
  const categorias = [...new Set(biblioteca.libros.map((libro) => libro.categoria))].sort((a, b) => a.localeCompare(b, "es"));
  const libros = biblioteca.buscarLibro(filtroBusqueda).filter((libro) => (!filtroCategoria || libro.categoria === filtroCategoria) && (filtroDisponibilidad === "todos" || (filtroDisponibilidad === "disponibles" ? libro.disponible : !libro.disponible)));
  return `<section class="page-heading section-heading"><div><p class="eyebrow">COLECCIÓN</p><h1>Catálogo de libros</h1><p class="subtitle">Explora y administra todos los títulos de tu biblioteca.</p></div><button class="button button-primary" data-action="nuevo-libro"><span class="button-plus">＋</span> Agregar libro</button></section>
  <section class="toolbar"><label class="section-search"><span>⌕</span><input id="catalog-search" value="${escapar(filtroBusqueda)}" type="search" placeholder="Buscar por título o autor..."></label><select id="category-filter" aria-label="Filtrar por categoría"><option value="">Todas las categorías</option>${categorias.map((categoria) => `<option ${filtroCategoria === categoria ? "selected" : ""} value="${escapar(categoria)}">${escapar(categoria)}</option>`).join("")}</select><select id="availability-filter" aria-label="Filtrar por disponibilidad"><option value="todos" ${filtroDisponibilidad === "todos" ? "selected" : ""}>Cualquier estado</option><option value="disponibles" ${filtroDisponibilidad === "disponibles" ? "selected" : ""}>Disponibles</option><option value="prestados" ${filtroDisponibilidad === "prestados" ? "selected" : ""}>Prestados</option></select><span class="results-count">${libros.length} ${libros.length === 1 ? "libro" : "libros"}</span></section>
  ${libros.length ? `<section class="book-grid">${libros.map(tarjetaLibro).join("")}</section>` : estadoVacio("No encontramos libros", "Prueba con otros filtros o agrega un nuevo título.", "＋ Agregar libro", "nuevo-libro")}`;
}

function portada(libro) {
  return `<img class="book-cover-image" data-cover src="${escapar(libro.portada)}" alt="Portada de ${escapar(libro.titulo)}" loading="lazy"><span class="cover-fallback" hidden>${escapar(libro.titulo)}</span>`;
}

function tarjetaLibro(libro) {
  return `<article class="book-card"><div class="book-cover">${portada(libro)}<span class="availability ${libro.disponible ? "status-available" : "status-loaned"}"><i></i>${libro.disponible ? "Disponible" : "Prestado"}</span><button class="card-menu" aria-label="Acciones de ${escapar(libro.titulo)}" data-action="menu-libro" data-id="${escapar(libro.id)}">···</button></div><div class="book-details"><span class="book-category">${escapar(libro.categoria)}${libro.tipo === "digital" ? " · Digital" : ""}</span><h3 title="${escapar(libro.titulo)}">${escapar(libro.titulo)}</h3><p>${escapar(libro.autor)}</p><div class="book-meta"><span>${libro.anio}</span><span>${libro.tipo === "digital" ? `${escapar(libro.formato)} · ${libro.tamanoArchivo} MB` : "Edición impresa"}</span></div><div class="book-actions"><button data-action="editar-libro" data-id="${escapar(libro.id)}">Editar</button><button class="danger-text" data-action="eliminar-libro" data-id="${escapar(libro.id)}">Eliminar</button></div></div></article>`;
}

function renderizarUsuarios() {
  const consulta = filtroBusqueda.toLocaleLowerCase("es");
  const usuarios = biblioteca.usuarios.filter((usuario) => `${usuario.nombre} ${usuario.correo} ${usuario.telefono}`.toLocaleLowerCase("es").includes(consulta));
  return `<section class="page-heading section-heading"><div><p class="eyebrow">COMUNIDAD</p><h1>Usuarios</h1><p class="subtitle">Administra los miembros y consulta su actividad.</p></div><button class="button button-primary" data-action="nuevo-usuario"><span class="button-plus">＋</span> Registrar usuario</button></section>
  <section class="toolbar"><label class="section-search"><span>⌕</span><input id="user-search" type="search" value="${escapar(filtroBusqueda)}" placeholder="Buscar nombre, correo o teléfono..."></label><span class="results-count">${usuarios.length} ${usuarios.length === 1 ? "usuario" : "usuarios"} registrados</span></section>
  ${usuarios.length ? `<div class="table-wrap"><table><thead><tr><th>USUARIO</th><th>CONTACTO</th><th>FECHA DE REGISTRO</th><th>PRÉSTAMOS ACTIVOS</th><th></th></tr></thead><tbody>${usuarios.map((usuario) => {
    const activos = biblioteca.historialUsuario(usuario.id).filter((item) => item.estado === "Activo").length;
    return `<tr><td><div class="user-cell"><span class="avatar user-avatar">${escapar(iniciales(usuario.nombre))}</span><span><strong>${escapar(usuario.nombre)}</strong><small>ID: ${escapar(usuario.id.slice(0, 8))}</small></span></div></td><td><strong class="contact-main">${escapar(usuario.correo)}</strong><small class="contact-sub">${escapar(usuario.telefono)}</small></td><td>${fecha(usuario.fechaRegistro)}</td><td><span class="count-pill">${activos} ${activos === 1 ? "préstamo" : "préstamos"}</span></td><td><div class="row-actions"><button data-action="historial-usuario" data-id="${escapar(usuario.id)}">Historial</button><button aria-label="Editar ${escapar(usuario.nombre)}" data-action="editar-usuario" data-id="${escapar(usuario.id)}">✎</button><button class="danger-text" aria-label="Eliminar ${escapar(usuario.nombre)}" data-action="eliminar-usuario" data-id="${escapar(usuario.id)}">×</button></div></td></tr>`;
  }).join("")}</tbody></table></div>` : estadoVacio("No hay usuarios para mostrar", "Registra un miembro o ajusta la búsqueda.", "＋ Registrar usuario", "nuevo-usuario")}`;
}

function renderizarPrestamos() {
  const prestamos = biblioteca.prestamos;
  return `<section class="page-heading section-heading"><div><p class="eyebrow">CIRCULACIÓN</p><h1>Préstamos</h1><p class="subtitle">Controla los préstamos, fechas de devolución y el historial.</p></div><button class="button button-primary" data-action="nuevo-prestamo"><span class="button-plus">＋</span> Registrar préstamo</button></section>
  <section class="loan-summary"><div><span class="summary-icon icon-orange">⇄</span><span><small>Préstamos activos</small><strong>${biblioteca.obtenerEstadisticas().prestamosActivos}</strong></span></div><div><span class="summary-icon icon-green">✓</span><span><small>Devoluciones registradas</small><strong>${prestamos.filter((item) => item.estado === "Devuelto").length}</strong></span></div><p>El inventario se actualiza automáticamente en cada movimiento.</p></section>
  ${prestamos.length ? `<div class="table-wrap"><table><thead><tr><th>USUARIO</th><th>LIBRO</th><th>FECHA DE PRÉSTAMO</th><th>DEVOLUCIÓN PREVISTA</th><th>ESTADO</th><th></th></tr></thead><tbody>${prestamos.map((prestamo) => {
    const dias = prestamo.calcularDiasRestantes();
    const estadoTexto = prestamo.estado === "Devuelto" ? "Devuelto" : dias < 0 ? "Vencido" : "Activo";
    return `<tr><td><div class="user-cell"><span class="avatar user-avatar">${escapar(iniciales(prestamo.usuario.nombre))}</span><span><strong>${escapar(prestamo.usuario.nombre)}</strong><small>${escapar(prestamo.usuario.correo)}</small></span></div></td><td><div class="loan-book"><strong>${escapar(prestamo.libro.titulo)}</strong><small>${escapar(prestamo.libro.autor)}</small></div></td><td>${fecha(prestamo.fechaPrestamo)}</td><td><span>${fecha(prestamo.fechaDevolucion)}</span>${prestamo.estado === "Activo" ? `<small class="due-note ${dias < 0 ? "overdue" : ""}">${dias < 0 ? `Vencido hace ${Math.abs(dias)} días` : dias === 0 ? "Vence hoy" : `${dias} días restantes`}</small>` : prestamo.fechaDevuelto ? `<small class="due-note">Devuelto ${fecha(prestamo.fechaDevuelto)}</small>` : ""}</td><td><span class="loan-status ${estadoTexto === "Devuelto" ? "loan-returned" : estadoTexto === "Vencido" ? "loan-overdue" : "loan-active"}"><i></i>${estadoTexto}</span></td><td>${prestamo.estado === "Activo" ? `<button class="button button-small button-outline" data-action="devolver-libro" data-id="${escapar(prestamo.id)}">Registrar devolución</button>` : `<span class="muted">—</span>`}</td></tr>`;
  }).join("")}</tbody></table></div>` : estadoVacio("Todavía no hay préstamos", "Registra el primer préstamo para comenzar a controlar la circulación.", "＋ Registrar préstamo", "nuevo-prestamo")}`;
}

function renderizarConfiguracion() {
  return `<section class="page-heading section-heading"><div><p class="eyebrow">PREFERENCIAS</p><h1>Configuración</h1><p class="subtitle">Información de la aplicación y administración de datos.</p></div></section>
  <div class="settings-grid"><article class="panel-card settings-card"><span class="settings-icon icon-blue">▤</span><div><h2>Biblioteca Nórdica</h2><p>Sistema de gestión de biblioteca construido con JavaScript moderno y Programación Orientada a Objetos.</p><div class="settings-facts"><span>Libros <b>${biblioteca.libros.length}</b></span><span>Usuarios <b>${biblioteca.usuarios.length}</b></span><span>Préstamos <b>${biblioteca.prestamos.length}</b></span></div></div></article><article class="panel-card settings-card"><span class="settings-icon icon-purple">◉</span><div><h2>Datos y privacidad</h2><p>La información se guarda en el almacenamiento local de este navegador. No se envían datos a ningún servidor.</p><button class="button button-outline" data-action="exportar-datos">Descargar copia de seguridad</button></div></article><article class="panel-card settings-card settings-warning"><span class="settings-icon icon-orange">↻</span><div><h2>Restablecer datos de ejemplo</h2><p>Elimina los cambios locales y restaura el catálogo y usuarios iniciales. Esta acción no se puede deshacer.</p><button class="button button-danger" data-action="restablecer">Restaurar datos de ejemplo</button></div></article></div>`;
}

function estadoVacio(titulo, mensaje, accion, accionId) {
  return `<div class="empty-state"><span class="empty-icon">▤</span><h2>${titulo}</h2><p>${mensaje}</p>${accion ? `<button class="button button-primary" data-action="${accionId}">${accion}</button>` : ""}</div>`;
}

function abrirDialogo(titulo, cuerpo, descripcion = "") {
  contenidoDialogo.innerHTML = `<form method="dialog" class="modal-card" id="modal-form"><header class="modal-header"><div><h2>${titulo}</h2>${descripcion ? `<p>${descripcion}</p>` : ""}</div><button class="modal-close" type="button" data-action="cerrar-dialogo" aria-label="Cerrar">×</button></header>${cuerpo}</form>`;
  dialogo.showModal();
}

function modalLibro(id = null) {
  const libro = id ? biblioteca.libros.find((item) => item.id === id) : null;
  abrirDialogo(libro ? "Editar libro" : "Agregar libro", `<div class="form-grid"><label class="field field-full">Título<input name="titulo" required maxlength="120" value="${escapar(libro?.titulo || "")}" placeholder="Ej. El principito"></label><label class="field">Autor<input name="autor" required maxlength="100" value="${escapar(libro?.autor || "")}" placeholder="Nombre del autor"></label><label class="field">Categoría<select name="categoria" required>${["Clásicos", "Aventuras", "Ciencia ficción", "Fantasía", "Misterio", "Romance", "Terror", "Historia", "Ensayo", "Otro"].map((item) => `<option ${libro?.categoria === item ? "selected" : ""} value="${item}">${item}</option>`).join("")}</select></label><label class="field">Año de publicación<input name="anio" type="number" min="1" max="${new Date().getFullYear()}" required value="${escapar(libro?.anio || "")}" placeholder="2024"></label><label class="field">URL de portada<input name="portada" type="url" required value="${escapar(libro?.portada || "")}" placeholder="https://..."></label><label class="field field-full">Tipo de ejemplar<select name="tipo" ${libro ? "disabled" : ""}><option value="fisico" ${libro?.tipo !== "digital" ? "selected" : ""}>Edición impresa</option><option value="digital" ${libro?.tipo === "digital" ? "selected" : ""}>Libro digital</option></select></label><label class="field digital-field" ${libro?.tipo !== "digital" ? "hidden" : ""}>Formato<input name="formato" value="${escapar(libro?.formato || "EPUB")}" maxlength="12"></label><label class="field digital-field" ${libro?.tipo !== "digital" ? "hidden" : ""}>Tamaño (MB)<input name="tamanoArchivo" type="number" min="0.1" step="0.1" value="${libro?.tamanoArchivo || 1}"></label></div><footer class="modal-footer"><button type="button" class="button button-outline" data-action="cerrar-dialogo">Cancelar</button><button type="submit" class="button button-primary">Guardar libro</button></footer>`, "Completa los datos para mantener actualizado el catálogo.");
  contenidoDialogo.querySelector('[name="tipo"]').addEventListener("change", (evento) => {
    contenidoDialogo.querySelectorAll(".digital-field").forEach((campo) => { campo.hidden = evento.target.value !== "digital"; });
  });
  document.querySelector("#modal-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    try {
      if (libro) biblioteca.editarLibro(id, datos);
      else biblioteca.agregarLibro({ ...datos, id: crypto.randomUUID(), disponible: true });
      cerrarDialogo();
      notificar(libro ? "Libro actualizado correctamente." : "Libro agregado al catálogo.", "success");
      renderizar();
    } catch (error) { notificar(error.message, "error"); }
  });
}

function modalUsuario(id = null) {
  const usuario = id ? biblioteca.usuarios.find((item) => item.id === id) : null;
  abrirDialogo(usuario ? "Editar usuario" : "Registrar usuario", `<div class="form-grid"><label class="field field-full">Nombre completo<input name="nombre" required maxlength="100" value="${escapar(usuario?.nombre || "")}" placeholder="Nombre y apellidos"></label><label class="field field-full">Correo electrónico<input name="correo" type="email" required maxlength="150" value="${escapar(usuario?.correo || "")}" placeholder="nombre@correo.com"></label><label class="field field-full">Teléfono<input name="telefono" type="tel" required maxlength="30" value="${escapar(usuario?.telefono || "")}" placeholder="+52 55 1234 5678"></label></div><footer class="modal-footer"><button type="button" class="button button-outline" data-action="cerrar-dialogo">Cancelar</button><button type="submit" class="button button-primary">${usuario ? "Guardar cambios" : "Registrar usuario"}</button></footer>`, "Los datos de contacto se guardan de forma privada en este navegador.");
  document.querySelector("#modal-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    try {
      if (usuario) biblioteca.editarUsuario(id, datos);
      else biblioteca.registrarUsuario({ ...datos, id: crypto.randomUUID(), fechaRegistro: fechaLocalISO() });
      cerrarDialogo();
      notificar(usuario ? "Información del usuario actualizada." : "Usuario registrado correctamente.", "success");
      renderizar();
    } catch (error) { notificar(error.message, "error"); }
  });
}

function modalPrestamo() {
  const usuarios = biblioteca.usuarios;
  const libros = biblioteca.libros.filter((libro) => libro.disponible);
  if (!usuarios.length || !libros.length) {
    notificar(!usuarios.length ? "Registra un usuario antes de crear un préstamo." : "No hay libros disponibles para prestar.", "error");
    return;
  }
  const hoy = fechaLocalISO();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + 14);
  const devolucion = fechaLocalISO(fechaLimite);
  abrirDialogo("Registrar préstamo", `<div class="form-grid"><label class="field field-full">Usuario<select name="usuarioId" required>${usuarios.map((usuario) => `<option value="${escapar(usuario.id)}">${escapar(usuario.nombre)} · ${escapar(usuario.correo)}</option>`).join("")}</select></label><label class="field field-full">Libro disponible<select name="libroId" required>${libros.map((libro) => `<option value="${escapar(libro.id)}">${escapar(libro.titulo)} · ${escapar(libro.autor)}</option>`).join("")}</select></label><label class="field">Fecha del préstamo<input name="fechaPrestamo" type="date" required value="${hoy}"></label><label class="field">Fecha de devolución<input name="fechaDevolucion" type="date" required min="${hoy}" value="${devolucion}"></label></div><div class="notice-box"><span>ⓘ</span>El libro cambiará automáticamente a estado prestado.</div><footer class="modal-footer"><button type="button" class="button button-outline" data-action="cerrar-dialogo">Cancelar</button><button type="submit" class="button button-primary">Confirmar préstamo</button></footer>`, "Selecciona un usuario, un libro disponible y las fechas.");
  document.querySelector("#modal-form").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    try {
      biblioteca.prestarLibro(datos);
      cerrarDialogo();
      notificar("Préstamo registrado. El libro ya aparece como prestado.", "success");
      renderizar();
    } catch (error) { notificar(error.message, "error"); }
  });
}

function mostrarHistorial(id) {
  const usuario = biblioteca.usuarios.find((item) => item.id === id);
  const historial = biblioteca.historialUsuario(id);
  if (!usuario) return;
  abrirDialogo(`Historial de ${escapar(usuario.nombre)}`, historial.length ? `<div class="history-list">${historial.map((item) => `<div class="history-item"><span class="history-icon">${item.estado === "Activo" ? "⇄" : "✓"}</span><span><strong>${escapar(item.libro.titulo)}</strong><small>${fecha(item.fechaPrestamo)} – ${fecha(item.fechaDevolucion)}</small></span><span class="loan-status ${item.estado === "Activo" ? "loan-active" : "loan-returned"}">${item.estado}</span></div>`).join("")}</div>` : `<div class="history-empty">Este usuario aún no tiene préstamos registrados.</div><footer class="modal-footer"><button type="button" class="button button-primary" data-action="cerrar-dialogo">Listo</button></footer>`, "Actividad de préstamos del usuario.");
}

function cerrarDialogo() {
  if (dialogo.open) dialogo.close();
}

function notificar(mensaje, tipo = "success") {
  const aviso = document.createElement("div");
  aviso.className = `toast toast-${tipo}`;
  aviso.innerHTML = `<span>${tipo === "success" ? "✓" : "!"}</span><p>${escapar(mensaje)}</p><button aria-label="Cerrar notificación">×</button>`;
  zonaAvisos.append(aviso);
  aviso.querySelector("button").addEventListener("click", () => aviso.remove());
  window.setTimeout(() => aviso.remove(), 4000);
}

function confirmarEliminar(tipo, id) {
  const libro = tipo === "libro";
  const registro = (libro ? biblioteca.libros : biblioteca.usuarios).find((item) => item.id === id);
  if (!registro || !window.confirm(`¿Seguro que deseas eliminar ${libro ? `el libro "${registro.titulo}"` : `al usuario "${registro.nombre}"`}?`)) return;
  try {
    if (libro) biblioteca.eliminarLibro(id);
    else biblioteca.eliminarUsuario(id);
    notificar(`${libro ? "Libro" : "Usuario"} eliminado correctamente.`, "success");
    renderizar();
  } catch (error) { notificar(error.message, "error"); }
}

function manejarAccion(accion, id) {
  switch (accion) {
    case "nuevo-libro": modalLibro(); break;
    case "editar-libro": modalLibro(id); break;
    case "eliminar-libro": confirmarEliminar("libro", id); break;
    case "nuevo-usuario": modalUsuario(); break;
    case "editar-usuario": modalUsuario(id); break;
    case "eliminar-usuario": confirmarEliminar("usuario", id); break;
    case "nuevo-prestamo": modalPrestamo(); break;
    case "historial-usuario": mostrarHistorial(id); break;
    case "devolver-libro": {
      const prestamo = biblioteca.prestamos.find((item) => item.id === id);
      if (prestamo && window.confirm(`¿Confirmas la devolución de "${prestamo.libro.titulo}" por ${prestamo.usuario.nombre}?`)) {
        try {
          biblioteca.devolverLibro(id);
          notificar("Devolución registrada. El libro está disponible nuevamente.", "success");
          renderizar();
        } catch (error) { notificar(error.message, "error"); }
      }
      break;
    }
    case "cerrar-dialogo": cerrarDialogo(); break;
    case "restablecer":
      if (window.confirm("Se eliminarán los cambios guardados y se restaurarán los datos de ejemplo. ¿Continuar?")) {
        localStorage.removeItem("biblioteca-nordica-v1");
        window.location.reload();
      }
      break;
    case "exportar-datos": {
      const archivo = new Blob([JSON.stringify({ libros: biblioteca.libros.map((item) => item.toJSON()), usuarios: biblioteca.usuarios.map((item) => item.toJSON()), prestamos: biblioteca.prestamos.map((item) => item.toJSON()) }, null, 2)], { type: "application/json" });
      const enlace = document.createElement("a");
      enlace.href = URL.createObjectURL(archivo);
      enlace.download = "copia-biblioteca-nordica.json";
      enlace.click();
      URL.revokeObjectURL(enlace.href);
      notificar("Copia de seguridad descargada.", "success");
      break;
    }
    case "menu-libro": {
      const libro = biblioteca.libros.find((item) => item.id === id);
      notificar(libro?.mostrarInformacion() || "Libro no encontrado.", "success");
      break;
    }
  }
}

document.querySelectorAll(".nav-link").forEach((boton) => boton.addEventListener("click", () => {
  seccionActual = boton.dataset.section;
  filtroBusqueda = "";
  document.querySelector("#global-search").value = "";
  document.querySelector("#sidebar").classList.remove("sidebar-open");
  renderizar();
}));

contenido.addEventListener("click", (evento) => {
  const accion = evento.target.closest("[data-action]");
  const navegacion = evento.target.closest("[data-section]");
  if (accion) manejarAccion(accion.dataset.action, accion.dataset.id);
  else if (navegacion) {
    seccionActual = navegacion.dataset.section;
    filtroBusqueda = "";
    document.querySelector("#global-search").value = "";
    renderizar();
  }
});

contenido.addEventListener("input", (evento) => {
  if (evento.target.id === "catalog-search" || evento.target.id === "user-search") {
    filtroBusqueda = evento.target.value;
    const inicio = evento.target.selectionStart;
    renderizar();
    const nuevoCampo = document.querySelector(`#${evento.target.id}`);
    nuevoCampo.focus();
    nuevoCampo.setSelectionRange(inicio, inicio);
  }
});
contenido.addEventListener("change", (evento) => {
  if (evento.target.id === "category-filter") filtroCategoria = evento.target.value;
  if (evento.target.id === "availability-filter") filtroDisponibilidad = evento.target.value;
  if (evento.target.id === "category-filter" || evento.target.id === "availability-filter") renderizar();
});

document.querySelector("#global-search").addEventListener("input", (evento) => {
  filtroBusqueda = evento.target.value;
  seccionActual = "catalogo";
  renderizar();
  document.querySelector("#catalog-search").focus();
});
document.querySelector("#notification-button").addEventListener("click", () => notificar("No tienes notificaciones pendientes.", "success"));
document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("sidebar-open"));
document.querySelector(".brand").addEventListener("click", (evento) => {
  evento.preventDefault();
  seccionActual = "dashboard";
  filtroBusqueda = "";
  document.querySelector("#global-search").value = "";
  renderizar();
});
document.querySelector(".sidebar-profile button").addEventListener("click", () => notificar("Sesión activa: María, administradora de la biblioteca.", "success"));
document.querySelector("#help-button").addEventListener("click", () => {
  abrirDialogo("Guía rápida", `<div class="guide-list"><p><b>1.</b> Agrega tus títulos desde Catálogo de libros.</p><p><b>2.</b> Registra a los miembros en la sección Usuarios.</p><p><b>3.</b> Crea préstamos con un usuario y un libro disponible.</p><p><b>4.</b> Registra la devolución desde la tabla de Préstamos.</p></div><footer class="modal-footer"><button type="button" class="button button-primary" data-action="cerrar-dialogo">Entendido</button></footer>`, "Gestiona tu colección en unos sencillos pasos.");
});
dialogo.addEventListener("click", (evento) => { if (evento.target === dialogo) cerrarDialogo(); });
document.addEventListener("keydown", (evento) => {
  if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === "k") {
    evento.preventDefault();
    document.querySelector("#global-search").focus();
  }
});
contenido.addEventListener("error", (evento) => {
  if (!evento.target.matches("img[data-cover]")) return;
  evento.target.hidden = true;
  const alternativa = evento.target.nextElementSibling;
  alternativa.hidden = false;
}, true);

renderizar();
