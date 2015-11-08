var puntos = [];
var cantidadDeObjetos = 20;
var tamanioObjetos = 20;
var background = [];
var distanciaDelPrimero = 100;
var display = {
  x : 400,
  y : 400
}
var camara = {
  posicion : {
    x : 0,
    y : 0,
    z : 0
  },
  orientacion : {
    x : 0,
    y : 0,
    z : 0
  }
};

function dibujarPunto(x, y, escala, canvasId){
  var canvas = document.getElementById(canvasId);
  var context = canvas.getContext('2d');
  var centerX = x;
  var centerY = y;
  var radius = tamanioObjetos/escala;

  var img=new Image();
  img.src = "img/1.png";
  img.onload=function(){
    context.drawImage(img,centerX,centerY,radius,radius*1.2);
  };
}

function generarPunto(x, y, z){
  puntos.push({x: x, y: y*distanciaDelPrimero, z: z});
}

function proyeccionOrtografica(){
  //los muestro
  puntos.forEach(function(object){
    var bx = object.x;
    var by = object.z;
    dibujarPunto(bx,by,1,"canvasOrtografica");
  });
}

function proyeccionPerspectivaDebil(){
  //los muestro
  puntos.forEach(function(object){
    var escala = object.y*0.0001;
    var bx = object.x;
    var by = object.z;
    dibujarPunto(bx,by,escala,"canvasPerspectivaDebil");
  });
}

function proyeccionPerspectiva(){
  //los muestro
  puntos.forEach(function(object){
    var escala = (object.y-camara.posicion.y)*0.0001;
    escala = (escala<0)? 0 : escala;
    var bx, by;
    var coeficiente = 100;
    bx = object.x - (camara.posicion.x/(camara.posicion.y-object.y)*coeficiente);
    by = object.z + (camara.posicion.z/(object.y-camara.posicion.y)*coeficiente);
    dibujarPunto(bx,by,escala,"canvasPerspectiva");
  });
}

function ordenarPuntosPorLejania(){
  //los ordeno por distancia de más lejana a más cercana
  puntos.sort(function(p1, p2){
    if(p1.y<p2.y)
      return 1;
    else if(p1.y>p2.y)
      return -1;
    return 0;
  });
}

function iniciarEntorno3d(){
  puntos = [];
  limpiarCanvas();
  var i;
  for(i=0;i<cantidadDeObjetos;i++){
    var x = Math.floor((Math.random() * 380) + 10);
    var y = Math.floor((Math.random() * 380) + 10);
    var z = Math.floor((Math.random() * 380) + 10);
    generarPunto(x, y, z);
  }

  //ordeno los puntos por lejanía -> determinada por eje y
  ordenarPuntosPorLejania();
  ejecutarProyecciones();
}

function ejecutarProyecciones(){
  proyeccionOrtografica();
  proyeccionPerspectivaDebil();
  proyeccionPerspectiva();
}

function limpiarCanvas(){
  var bg=new Image();
  bg.src = "img/bg.jpg";
  bg.onload=function(){
    var canvas = document.getElementsByTagName("canvas");
    for(var i=0;i<3;i++){
      var context = canvas[i].getContext("2d");
      context.clearRect(0, 0, 400, 400);
      //agrego fondo a los canvas
      context.drawImage(bg,-50,-10,500,400);
    }
  }
}

iniciarEntorno3d();

//Event listeners para controles de GUI
document.getElementById("tamanioObjetos").addEventListener("change", function(){
  tamanioObjetos = parseInt(this.value);
  limpiarCanvas();
  ejecutarProyecciones();
});
document.getElementById("cantidadObjetos").addEventListener("change", function(){
  cantidadDeObjetos = parseInt(this.value);
  iniciarEntorno3d();
});
document.getElementById("camaraX").addEventListener("change", function(){
  camara.posicion.x = parseInt(this.value);
  limpiarCanvas();
  ejecutarProyecciones();
});
document.getElementById("camaraY").addEventListener("change", function(){
  camara.posicion.y = parseInt(this.value)-1000;
  limpiarCanvas();
  ejecutarProyecciones();
});
document.getElementById("camaraZ").addEventListener("change", function(){
  camara.posicion.z = parseInt(this.value);
  limpiarCanvas();
  ejecutarProyecciones();
});
