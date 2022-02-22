var objectSelected = false
var itemCreated = false
var itemCount = 1
var movedObject
var loading = true
var map = new Image()
map.src = "process.png"
let canvas = new fabric.Canvas("canvas", { backgroundImage: map.src });
canvas.selection = false;
canvas.backgroundColor = 'rgba(0,0,0,1)';


canvas.on('after:render', function (opt) {
  if(loading) {
    loading = false
    var vpt = this.viewportTransform;
    //CHange center point for each map
    vpt[4] = -(map.width/2.87)
    vpt[5] = -(map.height/2.87)
    this.requestRenderAll();
  }
})

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
  hasControls: false,
});
canvas.add(rect);

function spawn(cl) {
  fabric.Image.fromURL('https://parteehat.github.io/LoadN/droo-lt46hn.jpg', function (oImg) {
    canvas.setActiveObject(oImg);
    canvas.add(oImg);
    oImg.id = itemCount
    movedObject = oImg
    movedObject.left = -9999999999;
    movedObject.top = -9999999999;
    itemCreated = true;
    itemCount++
  });
}
canvas.on('mouse:move', function (opt) {
  if (itemCreated) {
    canvas.discardActiveObject();
    movedObject.set('opacity', 0.5)
    movedObject.left = (opt.absolutePointer.x - movedObject.width / 2);
    movedObject.top = (opt.absolutePointer.y - movedObject.height / 2);
    movedObject.setCoords();
    canvas.renderAll();
  }
});
canvas.on('mouse:down', function (opt) {
  if (itemCreated) {
    // movedObject.set('selectable', true)
    canvas.setActiveObject(movedObject);
    movedObject.set('opacity', 1)
    itemCreated = false;
  }
});

// function drag() {
//   var obt = canvas.item(itemCount)
//   console.log(obt.get('left'))
//   while (canvas.getActiveObject().get(itemCount).get('selected') == true) {
//     canvas.getActiveObject().get(itemCount).set('left', String(getMouse(options)))
//     console.log(getMouse(options));
//   }
// }

// function getMouse(options) {
//   return (options.absolutePointer.x);
//   // console.log(options.e.clientX);
// }

document.getElementById("pscout").addEventListener("click", function () { spawn("pscout") });
document.getElementById("fscout").addEventListener("click", function () { spawn("fscout") });
document.getElementById("psoldier").addEventListener("click", function () { spawn("psoldier") });
document.getElementById("rsoldier").addEventListener("click", function () { spawn("rsoldier") });
document.getElementById("pyro").addEventListener("click", function () { spawn("pyro") });
document.getElementById("demo").addEventListener("click", function () { spawn("demo") });
document.getElementById("heavy").addEventListener("click", function () { spawn("heavy") });
document.getElementById("engineer").addEventListener("click", function () { spawn("engineer") });
document.getElementById("medic").addEventListener("click", function () { spawn("medic") });
document.getElementById("sniper").addEventListener("click", function () { spawn("sniper") });
document.getElementById("spy").addEventListener("click", function () { spawn("spy") });