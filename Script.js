// =======================
// ÁRBOL BINARIO DE BÚSQUEDA (BST)
// =======================
class NodoBST {
  constructor(album) {
    this.album = album;
    this.izquierda = null;
    this.derecha = null;
  }
}

class ArbolBinarioBusqueda {
  constructor() {
    this.raiz = null;
  }

  insertar(album) {
    const nuevo = new NodoBST(album);
    if (!this.raiz) {
      this.raiz = nuevo;
    } else {
      this._insertarRecursivo(this.raiz, nuevo);
    }
  }

  _insertarRecursivo(nodo, nuevo) {
    if (nuevo.album.titulo.toLowerCase() < nodo.album.titulo.toLowerCase()) {
      if (!nodo.izquierda) nodo.izquierda = nuevo;
      else this._insertarRecursivo(nodo.izquierda, nuevo);
    } else {
      if (!nodo.derecha) nodo.derecha = nuevo;
      else this._insertarRecursivo(nodo.derecha, nuevo);
    }
  }

  enOrden(nodo = this.raiz, resultado = []) {
    if (!nodo) return resultado;
    this.enOrden(nodo.izquierda, resultado);
    resultado.push(nodo.album);
    this.enOrden(nodo.derecha, resultado);
    return resultado;
  }
}

// =======================
// HASH TABLE por ARTISTA
// =======================
class HashTable {
  constructor() {
    this.tabla = {};
  }

  agregar(album) {
    const clave = album.artista.toLowerCase();
    if (!this.tabla[clave]) this.tabla[clave] = [];
    this.tabla[clave].push(album);
  }

  buscar(artista) {
    return this.tabla[artista.toLowerCase()] || [];
  }
}

// =======================
// LISTA ENLAZADA para el CARRITO
// =======================
class NodoLista {
  constructor(album) {
    this.album = album;
    this.siguiente = null;
  }
}

class ListaEnlazada {
  constructor() {
    this.cabeza = null;
  }

  agregar(album) {
    const nuevo = new NodoLista(album);
    if (!this.cabeza) {
      this.cabeza = nuevo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) actual = actual.siguiente;
      actual.siguiente = nuevo;
    }
  }

  eliminarPorTitulo(titulo) {
    if (!this.cabeza) return;

    // Caso especial: cabeza
    if (this.cabeza.album.titulo === titulo) {
      this.cabeza = this.cabeza.siguiente;
      return;
    }

    let actual = this.cabeza;
    while (actual.siguiente && actual.siguiente.album.titulo !== titulo) {
      actual = actual.siguiente;
    }

    if (actual.siguiente) {
      actual.siguiente = actual.siguiente.siguiente;
    }
  }

  recorrer() {
    const albums = [];
    let actual = this.cabeza;
    while (actual) {
      albums.push(actual.album);
      actual = actual.siguiente;
    }
    return albums;
  }

  vaciar() {
    this.cabeza = null;
  }
}

// =======================
// PILA (STACK) para historial de búsquedas
// =======================
class Pila {
  constructor() {
    this.elementos = [];
  }

  push(album) {
    this.elementos.push(album);
  }

  pop() {
    return this.elementos.pop();
  }

  top() {
    return this.elementos[this.elementos.length - 1];
  }

  estaVacia() {
    return this.elementos.length === 0;
  }
}

// =======================
// STOCK Y ESTRUCTURAS
// =======================
const stock = [
  { titulo: "Abbey Road", artista: "The Beatles", genero: "Rock", precio: 189.99, imagen: "imagenes/abbeyroad.webp" },
  { titulo: "Thriller", artista: "Michael Jackson", genero: "Pop", precio: 259.79, imagen: "imagenes/thriller.png" },
  { titulo: "Revolver", artista: "The Beatles", genero: "Rock", precio: 199.99, imagen: "imagenes/revolver.png"},
  { titulo: "Starboy", artista: "The Weeknd", genero: "R&B", precio: 449.99, imagen: "imagenes/starboy.png" },
  { titulo: "Folklore", artista: "Taylor Swift", genero: "Indie Folk", precio: 499.99, imagen: "imagenes/folklore.png" },
  { titulo: "Guts", artista: "Olivia Rodrigo", genero: "Pop", precio: 630.49, imagen: "imagenes/guts.webp" },
  { titulo: "21", artista: "Adele", genero: "Pop", precio: 520.00, imagen: "imagenes/21.png"},
  { titulo: "Beauty Behind the Madness", artista: "The Weeknd", genero: "R&B", precio: 359.99, imagen: "imagenes/beauty.png"},
  { titulo: "Sour", artista: "Olivia Rodrigo", genero: "Pop", precio: 479.99 , imagen: "imagenes/sour.png"},
  { titulo: "Lover", artista: "Taylor Swift", genero: "Pop", precio: 449.99, imagen: "imagenes/lover.png" },
  { titulo: "25", artista: "Adele", genero: "Soul", precio: 300.00, imagen: "imagenes/25.png" },
  { titulo: "Bad", artista: "Michael Jackson", genero: "Pop", precio: 289.99 ,imagen: "imagenes/bad.webp" }
];

const arbol = new ArbolBinarioBusqueda();
const tablaHash = new HashTable();
const carrito = new ListaEnlazada();
const historial = new Pila(); // NUEVA PILA para historial

stock.forEach(album => {
  arbol.insertar(album);
  tablaHash.agregar(album);
});

// =======================
// FUNCIONES DE INTERFAZ
// =======================
function mostrarStock() {
  const resultado = document.getElementById("resultado");
  const listaOrdenada = arbol.enOrden();
  resultado.innerHTML = "<h2>Stock de Álbumes</h2><div class='album-list'>" + listaOrdenada
    .map(album => `
      <div class="album">
        <img src="${album.imagen}" alt="${album.titulo}" class="album-img"><br>
        <strong>${album.titulo}</strong><br>
        Artista: ${album.artista}<br>
        Género: ${album.genero}<br>
        Precio: $${album.precio.toFixed(2)}<br>
        <button onclick="agregarACarrito(${stock.indexOf(album)})">Agregar</button>
      </div>
    `).join("") + "</div>";
}

function buscarPorArtista() {
  const nombre = prompt("Ingrese nombre del artista:");
  if (!nombre) return;
  const resultados = tablaHash.buscar(nombre);
  resultados.forEach(a => historial.push(a)); // Guardar en pila
  mostrarResultados(resultados, `Resultados para: ${nombre}`);
}

function buscarPorGenero() {
  const genero = prompt("Ingrese el género musical:");
  if (!genero) return;
  const resultados = stock.filter(album => album.genero.toLowerCase() === genero.toLowerCase());
  resultados.forEach(a => historial.push(a)); // Guardar en pila
  mostrarResultados(resultados, `Resultados de género: ${genero}`);
}

function mostrarResultados(resultados, titulo) {
  const resultado = document.getElementById("resultado");
  if (resultados.length === 0) {
    resultado.innerHTML = `<h2>${titulo}</h2><p>No se encontraron resultados.</p>`;
    return;
  }
  resultado.innerHTML = `<h2>${titulo}</h2><div class='album-list'>` + resultados
    .map(album => `
      <div class="album">
        <strong>${album.titulo}</strong><br>
        Artista: ${album.artista}<br>
        Género: ${album.genero}<br>
        Precio: $${album.precio.toFixed(2)}<br>
        <button onclick="agregarACarrito(${stock.indexOf(album)})">Agregar</button>
      </div>
    `).join("") + "</div>";
}

function agregarACarrito(index) {
  const album = stock[index];
  carrito.agregar(album);
  alert("Álbum agregado al carrito.");
}

function mostrarCarrito() {
  const resultado = document.getElementById("resultado");
  const albums = carrito.recorrer();
  if (albums.length === 0) {
    resultado.innerHTML = "<h2>Carrito vacío</h2>";
    return;
  }
  resultado.innerHTML = `<h2>Carrito de compras</h2><div class='album-list'>` + albums
    .map(album => `
      <div class="album">
        <strong>${album.titulo}</strong><br>
        Artista: ${album.artista}<br>
        Género: ${album.genero}<br>
        Precio: $${album.precio.toFixed(2)}<br>
        <button onclick="eliminarDelCarrito('${album.titulo}')">Eliminar</button>
      </div>
    `).join("") + 
    `</div>
    <div class="button-group" style="margin-top: 20px; text-align: center;">
      <button onclick="imprimirRecibo()">🧾 Imprimir Recibo</button>
    </div>`;
}


function eliminarDelCarrito(titulo) {
  carrito.eliminarPorTitulo(titulo);
  mostrarCarrito();
}

function imprimirRecibo() {
  if (!carrito.cabeza) {
    alert("Tu carrito está vacío.");
    return;
  }

  let recibo = "--- RECIBO DE COMPRA ---\n\n";
  // Agregar fecha y hora actual
  const fechaHora = new Date();
  recibo += `Fecha: ${fechaHora.toLocaleDateString()} ${fechaHora.toLocaleTimeString()}\n\n`;
  
  let total = 0;
  let actual = carrito.cabeza;
  let index = 1;
  

  while (actual) {
    const album = actual.album;
    recibo += `Álbum ${index}:\n`;
    recibo += `Título: ${album.titulo}\n`;
    recibo += `Artista: ${album.artista}\n`;
    recibo += `Género: ${album.genero}\n`;
    recibo += `Precio: $${album.precio.toFixed(2)}\n\n`;

    total += album.precio;
    actual = actual.siguiente;
    index++;
  }

  recibo += `TOTAL A PAGAR: $${total.toFixed(2)}\n`;
  recibo += "Gracias por su compra.";

  // Exportar como archivo .txt
  const blob = new Blob([recibo], { type: "text/plain" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "recibo.txt";
  enlace.click();
}



function verUltimoConsultado() {
  if (historial.estaVacia()) {
    alert("No hay historial de consultas aún.");
    return;
  }
  const album = historial.top();
  document.getElementById("resultado").innerHTML = `
    <h2>Último álbum consultado</h2>
    <div class="album-list">
      <div class="album">
        <strong>${album.titulo}</strong><br>
        Artista: ${album.artista}<br>
        Género: ${album.genero}<br>
        Precio: $${album.precio.toFixed(2)}<br>
        <button onclick="agregarACarrito(${stock.indexOf(album)})">Agregar</button>
      </div>
    </div>
  `;
}


