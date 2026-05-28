class Caminante {
  // --- MODIFICADO: Ahora recibe la capa como tercer parámetro ---
  constructor(paleta, velocidadInicial, capaGrafica) {
    this.paleta = paleta;
    this.capa = capaGrafica; // Guardamos la referencia a la capa
    
    this.x = random(width);
    this.y = random(height);
    this.px = this.x; 
    this.py = this.y;   
    this.t = 4.5;       
    this.vel = 2.5; 
    
    this.vidaMax = 400; 
    this.vidaActual = this.vidaMax;
    this.colorBase = this.paleta.darColor();

    this.anguloOnda = random(TWO_PI);
    this.velocidadOnda = velocidadInicial;
    this.grosorObjetivo = this.t; 
    
    this.dir = random(TWO_PI);
    this.estadoEje = "LIBRE"; 
  }

  dibujar() {
    if (brightness(this.colorBase) < 7) {
       this.colorBase = this.paleta.darColor();
    }
    let alpha = map(this.vidaActual, 0, this.vidaMax, 0, 255);
    let c = color(red(this.colorBase), green(this.colorBase), blue(this.colorBase), alpha);
    
    // --- MODIFICADO: Todo lo que es color y línea ahora va precedido por 'this.capa.' ---
    this.capa.stroke(c);
    this.capa.strokeWeight(this.t); 
    this.capa.line(this.px, this.py, this.x, this.y); // Dibuja en la capa
    
    this.px = this.x;
    this.py = this.y;
  }

  mover(caos) {
    this.t = lerp(this.t, this.grosorObjetivo, 0.05);
    this.vidaActual -= 1;

    let fuerzaGiro;

    if (this.velocidadOnda === 0.01) {
      fuerzaGiro = sin(this.anguloOnda) * 0.025; 
    } else {
      fuerzaGiro = sin(this.anguloOnda) * lerp(0.01, 0.03, caos);
    }
    
    this.dir += fuerzaGiro;
    this.anguloOnda += this.velocidadOnda;

    this.x += this.vel * cos(this.dir);
    this.y += this.vel * sin(this.dir);

    if (this.vidaActual <= 0 || this.x > width + 80 || this.x < -80 || this.y > height + 80 || this.y < -80) {
      this.resetear();
    }
  }

  resetear() {
    let margen = 50; 
    this.colorBase = this.paleta.darColor();
    this.anguloOnda = random(TWO_PI);
    this.vidaActual = this.vidaMax; 

    if (modoSistema !== "LIBRE") {
      let suerte = random(1);
      
      if (suerte < 0.70) {
        if (modoSistema === "VERTICAL") {
          this.estadoEje = "VERTICAL";
          this.x = random(margen, width - margen);
          if (random(1) < 0.5) {
            this.y = -20;
            this.dir = HALF_PI;       
          } else {
            this.y = height + 20;
            this.dir = HALF_PI * 3;   
          }
        } else if (modoSistema === "HORIZONTAL") {
          this.estadoEje = "HORIZONTAL";
          this.y = random(margen, height - margen);
          if (random(1) < 0.5) {
            this.x = -20;
            this.dir = 0;             
          } else {
            this.x = width + 20;
            this.dir = PI;            
          }
        }
      } else {
        this.estadoEje = "ALEATORIO";
        if (random(1) < 0.5) {
          this.x = random(1) < 0.5 ? -20 : width + 20;
          this.y = random(height);
        } else {
          this.x = random(width);
          this.y = random(1) < 0.5 ? -20 : height + 20;
        }
        this.dir = random(TWO_PI); 
      }
    } else {
      this.estadoEje = "LIBRE";
      this.x = random(width);
      this.y = random(height);
      this.dir = random(TWO_PI);
    }

    this.px = this.x;
    this.py = this.y;
  }

  cambiarGrosor(g) {
    this.grosorObjetivo = g;
  }
  
  cambiarCurvatura(nuevaVelocidad) {
    this.velocidadOnda = nuevaVelocidad;
  }
}