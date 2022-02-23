var currentTeam = "blu"
var scale = 0.075
var objectSelected = false
var itemCreated = false
var itemCount = 1
var movedObject = new fabric.Rect({})
var loading = true
var drawing = false
var map = new Image()
map.src = "process.png"
let canvas = new fabric.Canvas("canvas", { backgroundImage: map.src });
canvas.selection = false;
canvas.backgroundColor = 'rgba(0,0,0,1)';
canvas.hoverCursor = 'pointer'

// this will run on load once
canvas.on('after:render', function (opt) {
  if(loading) {
    loading = false // ends loading screen
    var vpt = this.viewportTransform;
    // change center point for each map
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
  if (objectSelected == false) {
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

// create an object and remove it out of sight
function spawn(cl) {
  fabric.Image.fromURL('icons/' + cl + currentTeam + '.png', function (oImg) {
    movedObject.set('opacity', 1) // keep here, will reset others when more are selected
    movedObject = oImg
    canvas.add(movedObject);
    movedObject.scale(scale)
    movedObject.set('opacity', 1)
    movedObject.left = -9999999999;
    movedObject.top = -9999999999;
    itemCreated = true;
    itemCount++
  });
}
// move created object to cursor and change opacity
canvas.on('mouse:move', function (opt) {
  if (itemCreated) {
    movedObject.set('opacity', 0.5)
    movedObject.left = (opt.absolutePointer.x - (scale * (movedObject.width / 2)));
    movedObject.top = (opt.absolutePointer.y - (scale *(movedObject.height / 2)));
    movedObject.setCoords();
    canvas.renderAll();
  }
});
// "place" the object down and restore opacity
canvas.on('mouse:down', function (opt) {
  if (itemCreated) {
    canvas.setActiveObject(movedObject);
    movedObject.set('opacity', 1)
    itemCreated = false;
  }
});

// create listeners for each button
document.getElementById('switch').addEventListener('click', function() {
  if (document.getElementById('switch').checked) {
    currentTeam = "red"
  } else {
    currentTeam = "blu"
  }
});
document.getElementById("pscout").addEventListener("click", function () { spawn("pscout") });
document.getElementById("fscout").addEventListener("click", function () { spawn("fscout") });
document.getElementById("psoldier").addEventListener("click", function () { spawn("psoldier") });
document.getElementById("rsoldier").addEventListener("click", function () { spawn("rsoldier") });
document.getElementById("pyro").addEventListener("click", function () { spawn("pyro") });
document.getElementById("demoman").addEventListener("click", function () { spawn("demoman") });
document.getElementById("heavy").addEventListener("click", function () { spawn("heavy") });
document.getElementById("engineer").addEventListener("click", function () { spawn("engineer") });
document.getElementById("medic").addEventListener("click", function () { spawn("medic") });
document.getElementById("sniper").addEventListener("click", function () { spawn("sniper") });
document.getElementById("spy").addEventListener("click", function () { spawn("spy") });
document.getElementById("delete").addEventListener("click", function () {
  canvas.remove(canvas.getActiveObject());
});

//Drawing
var drawingModeEl = document.getElementById('drawing-mode'),
drawingOptionsEl = document.getElementById('drawing-mode-options'),
drawingColorEl = document.getElementById('drawing-color'),
drawingLineWidthEl = document.getElementById('drawing-line-width')
//Toggle Drawing
drawingModeEl.onclick = function() {
  canvas.discardActiveObject();
  canvas.isDrawingMode = !canvas.isDrawingMode;
  if (canvas.isDrawingMode) {
    objectSelected = true
    drawing = true
    drawingModeEl.innerHTML = 'Cancel drawing mode';
    drawingOptionsEl.style.display = '';
  }
  else {
    objectSelected = false
    drawing = false
    drawingModeEl.innerHTML = 'Enter drawing mode';
    drawingOptionsEl.style.display = 'none';
  }
};

drawingColorEl.onchange = function() {
  canvas.freeDrawingBrush.color = drawingColorEl.value;
};
drawingLineWidthEl.onchange = function() {
  canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
};

if (canvas.freeDrawingBrush) {
  canvas.freeDrawingBrush.color = drawingColorEl.value;
  canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
}