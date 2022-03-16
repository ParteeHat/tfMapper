var currentTeam = "blu"
var scale = 0.075
var objectSelected = false
var itemCreated = false
var movedObject = new fabric.Rect({})
var loading = true
var drawing = false
var typing = false
var map = new Image()
map.src = "process.png"
let canvas = new fabric.Canvas("canvas", { backgroundImage: map.src });
canvas.selection = false;
canvas.backgroundColor = 'rgba(0,0,0,1)';
canvas.hoverCursor = 'pointer'

canvas.backgroundImage.left = -(canvas.backgroundImage.width / 2)
canvas.backgroundImage.top = -(canvas.backgroundImage.height / 2)

// this will run on load once
canvas.on('after:render', function (opt) {
  if(loading) {
    loading = false // ends loading screen
    canvas.backgroundImage.left = -(canvas.backgroundImage.width / 2)
    canvas.backgroundImage.top = -(canvas.backgroundImage.height / 2)
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
  movedObject.set('opacity', 1) // keep here, will reset others when more are selected
  if(drawing) {
    toggleDraw()
  }
  fabric.Image.fromURL('icons/' + cl + currentTeam + '.png',   function (oImg) {
  movedObject = oImg
  canvas.add(movedObject);
  movedObject.scale(scale)
  movedObject.set('opacity', 1)
  movedObject.left = -9999999999;
  movedObject.top = -9999999999;
  itemCreated = true;
  })
}
//Text
function spawnText() {
  movedObject.set('opacity', 1) // keep here, will reset others when more are selected
  if(drawing) {
    toggleDraw()
  }
  var text = new fabric.Textbox('Click to edit text', {
    fill: '#000000',
    fontSize: 200,
    fontFamily: 'arial'
  });
  movedObject = text
  canvas.add(movedObject);
  movedObject.scale(scale)
  movedObject.set('opacity', 1)
  movedObject.left = -9999999999;
  movedObject.top = -9999999999;
  itemCreated = true;
}
canvas.on('text:changed', function () {typing = true})
// move created object to cursor and change opacity
canvas.on('mouse:move', function (opt) {
  if (itemCreated) {
    movedObject.set('opacity', 0.5)
    movedObject.left = (opt.absolutePointer.x - (scale * (movedObject.width / 2)));
    movedObject.top = (opt.absolutePointer.y - (scale * (movedObject.height / 2)));
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
document.getElementById("fscout").addEventListener("click", function () { spawn("fscout") });
document.getElementById("pscout").addEventListener("click", function () { spawnText() });
document.getElementById("rsoldier").addEventListener("click", function () { spawn("rsoldier") });
document.getElementById("psoldier").addEventListener("click", function () { spawn("psoldier") });
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
document.getElementById("text").addEventListener("click", function () { spawnText() });
document.addEventListener('keyup', (e) => {
  if (e.code === "Delete" || e.code === "Backspace"){
    if (this.canvas.getActiveObject().isEditing) {
      return
    }
    canvas.remove(canvas.getActiveObject())
  }
});


//Drawing
var drawingModeEl = document.getElementById('drawing-mode'),
drawingOptionsEl = document.getElementById('drawing-mode-options'),
drawingColorEl = document.getElementById('drawing-color'),
drawingLineWidthEl = document.getElementById('drawing-line-width')
//Toggle Drawing
drawingModeEl.onclick = function() { toggleDraw() }
function toggleDraw() {
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