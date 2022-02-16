let canvas = new fabric.Canvas("canvas", { backgroundImage: 'process.png' });
var objectSelected = false
canvas.selection = false;
canvas.backgroundColor = 'rgba(0,0,0,1)';

// resize canvas upon window resize
resize();
function resize() {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);
  canvas.calcOffset();
}
window.addEventListener('resize', resize, false);

// zoom
canvas.on('mouse:wheel', function (opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.1) zoom = 0.1;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

// pan
canvas.on('mouse:down', function (opt) {
  var evt = opt.e;
  if (objectSelected === false) {
    this.isDragging = true;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
});
canvas.on('mouse:move', function (opt) {
  if (this.isDragging) {
    var e = opt.e;
    var vpt = this.viewportTransform;
    vpt[4] += e.clientX - this.lastPosX;
    vpt[5] += e.clientY - this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
});
canvas.on('mouse:up', function (opt) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
});
// prevent panning while object is selected
canvas.on('selection:created', function () {
  objectSelected = true;
});
canvas.on('selection:cleared', function () {
  objectSelected = false;
});

// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20,
});
canvas.add(rect);

function spawn(cl) {
  fabric.Image.fromURL('https://parteehat.github.io/LoadN/droo-lt46hn.jpg', function(oImg) {
    canvas.add(oImg);
  });
}

document.getElementById("pscout").addEventListener("click", function() {spawn("pscout") });
document.getElementById("fscout").addEventListener("click", function() {spawn("fscout") });
document.getElementById("psoldier").addEventListener("click", function() {spawn("psoldier") });
document.getElementById("rsoldier").addEventListener("click", function() {spawn("rsoldier") });
document.getElementById("pyro").addEventListener("click", function() {spawn("pyro") });
document.getElementById("demo").addEventListener("click", function() {spawn("demo") });
document.getElementById("heavy").addEventListener("click", function() {spawn("heavy") });
document.getElementById("engineer").addEventListener("click", function() {spawn("engineer") });
document.getElementById("medic").addEventListener("click", function() {spawn("medic") });
document.getElementById("sniper").addEventListener("click", function() {spawn("sniper") });
document.getElementById("spy").addEventListener("click", function() {spawn("spy") });
