let canvas = new fabric.Canvas("canvas", { backgroundImage: 'process.png' });
var map = new Image();
map.src = 'process.png';
console.log(map.width);
console.log(map.height);
var objectSelected = false
canvas.selection = false;
//canvas.backgroundColor = 'rgba(0,0,255,0.3)';

// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20,
});
resize();
// "add" rectangle onto canvas

canvas.add(rect);

function resize() {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);
  canvas.calcOffset();
}
window.addEventListener('resize', resize, false);

canvas.on('mouse:wheel', function (opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.1) zoom = 0.1;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
  // var vpt = this.viewportTransform;
  // if (zoom < 1 / 1000) {
  //   vpt[4] = 200 - (1000 * zoom) / 2;
  //   vpt[5] = 200 - (1000 * zoom) / 2;
  // } else {
  //   if (vpt[4] >= 0) {
  //     vpt[4] = 0;
  //   } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
  //     vpt[4] = canvas.getWidth() - 1000 * zoom;
  //   }
  //   if (vpt[5] >= 0) {
  //     vpt[5] = 0;
  //   } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
  //     vpt[5] = canvas.getHeight() - 1000 * zoom;
  //   }
  // }
});
canvas.on('selection:created', function () {
  objectSelected = true;
});
canvas.on('selection:cleared', function () {
  objectSelected = false;
});
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