let paleta;
let caos = 0;
let caminantes = [];
let cantidad = 5; 
let velocidadOndaGlobal = 0.04;
let modoSistema = "LIBRE"; 

// --- VARIABLES PARA LAS CAPAS Y EL TIEMPO ---
let capaLineas; 
let tiempoUltimoBorrado = 0;
let intervaloBorrado = 50000; // Tiempo en milisegundos (8000 ms = 8 segundos)

function preload() {
  let imagenPaleta = loadImage('img/paleta.png');
  paleta = new Paleta(imagenPaleta);
}

function setup() {
  createCanvas(800, 600);
  background(255);
  
  // 1. Creamos la capa secundaria (transparente) del mismo tamaño que el lienzo
  capaLineas = createGraphics(800, 600);
  capaLineas.strokeWeight(3); // El grosor inicial se lo aplicamos a la capa
  
  // 2. Le pasamos la capa a los caminantes al nacer
  for (let i = 0; i < cantidad; i++) {
    caminantes.push(new Caminante(paleta, velocidadOndaGlobal, capaLineas));
  }
  
  tiempoUltimoBorrado = millis(); // Inicializamos el contador de tiempo
}

function draw() {
  // En cada frame pintamos el fondo blanco en el lienzo principal
  background(255); 
  
  // --- CONTROL DEL TIEMPO PARA BORRAR LA CAPA ---
  // millis() te da el tiempo transcurrido desde que arrancó el sketch
  if (millis() - tiempoUltimoBorrado > intervaloBorrado) {
    capaLineas.clear(); // Borra por completo todo lo que se dibujó en la capa (vuelve a ser transparente)
    tiempoUltimoBorrado = millis(); // Resetea el cronómetro
  }

  let caos = random(1); 
  for (let c of caminantes) {
    c.mover(caos);
    c.dibujar(); // Ahora dibuja dentro de la capa secundaria
  }
  
  // 3. Dibujamos la capa encima del fondo blanco principal
  image(capaLineas, 0, 0);
}

function mousePressed() {
  let nuevoGrosor = random(1, 7);
  // El grosor ahora se le cambia a la capa
  capaLineas.strokeWeight(nuevoGrosor);
  for (let c of caminantes) {
    c.cambiarGrosor(nuevoGrosor);
  }
}

function doubleClicked() {
  // Limpiamos tanto el fondo como la capa
  background(255); 
  capaLineas.clear();

  if (modoSistema === "LIBRE" || modoSistema === "HORIZONTAL") {
    modoSistema = "VERTICAL";
  } else {
    modoSistema = "HORIZONTAL";
  }

  for (let c of caminantes) {
    c.resetear();
  }
}

function keyPressed() {
  if (key === ' ') { 
    if (velocidadOndaGlobal === 0.04) {
      velocidadOndaGlobal = 0.01; 
    } else {
      velocidadOndaGlobal = 0.04; 
    }
    
    for (let c of caminantes) {
      c.cambiarCurvatura(velocidadOndaGlobal);
    }
  }
}

class Paleta {
  constructor(imagen) {
    this.imagen = imagen;
  }
  darColor() {
    let x = int(random(this.imagen.width));
    let y = int(random(this.imagen.height));
    return this.imagen.get(x, y);
  }
}