// Convenience
function removeElementById(id) {
    var element = document.getElementById(id);
    if (element !== null) element.parentNode.removeChild(element);
    //element.parentNode.removeChild(element);
}

// Compute
function randRgbHexStr() {
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
}

function randRgbaBind() {
    return [randRgbHexStr(), 1];
}

function randRgbaArray(n) {
    return Array(n).fill(null).map(randRgbaBind);
}

function transparentArray(n) {
    return Array(n).fill(["#000000", 0]);
}

function convertCanvasToImage(canvas, callback) {
    var image = new Image();
    image.id = "converted";
    image.src = canvas.toDataURL("image/png");
    return image;
}

// Draw
function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawGrid(ctx, size, N) {
    var delta = size / N;
    ctx.strokeStyle = "#000000";
    ctx.globalAlpha = 1;
    for (var i = 1; i < N; i++) {
        for (var j = 0; j < 3; j++) {
            drawLine(ctx, delta * i, 0, delta * i, size);
            drawLine(ctx, 0, delta * i, size, delta * i);
        }
    }
}

function drawVerticals(ctx, size, N) {
    var delta = size / N;
    for (var i = 1; i < N; i++) {
        drawLine(ctx, delta * i, 0, delta * i, size);
    }
}

function c1FillSqr(x, y) {
    var rgba = c1Arr[x][y];
    ctx1.fillStyle = rgba[0];
    ctx1.globalAlpha = rgba[1];
    ctx1.fillRect(c1SqrSize * x, c1SqrSize * y, c1SqrSize, c1SqrSize);
}

function c1FillAll() {
    ctx1.clearRect(0, 0, c1.width, c1.height);
    for (var x = 0; x < c1Arr.length; x++) {
        for (var y = 0; y < c1Arr[x].length; y++) {
            c1FillSqr(x, y);
        }
    }
    drawGrid(ctx1, c1.width, pixelRes);
}

function c1PrettyRender() {
    ctx1.clearRect(0, 0, c1.width, c1.height);
    for (var x = 0; x < c1Arr.length; x++) {
        for (var y = 0; y < c1Arr[x].length; y++) {
            c1FillSqr(x, y);
        }
    }
}

function c2FillSqr(idx) {
    var rgba = c2Arr[idx];
    ctx2.fillStyle = rgba[0];
    ctx2.globalAlpha = rgba[1];
    ctx2.fillRect(c2SqrSize * idx, 0, c2SqrSize, c2SqrSize);
}

function c2FillAll() {
    ctx2.clearRect(0, 0, c2.width, c2.height);
    for (var i = 0; i < c2Arr.length; i++) {
        c2FillSqr(i);
    }
    drawVerticals(ctx2, c2.width, 8);
}

// Listen
function captureClick(event) {
    var rect = this.getBoundingClientRect();
    mx = event.clientX - rect.left;
    my = event.clientY - rect.top;
    this.clickHandler();
}

function c1ClickHandler() {
    c1Arr[Math.floor(mx / c1SqrSize)][Math.floor(my / c1SqrSize)] = selectedColor;
    c1FillAll();
}

function c2ClickHandler() {
    selectedColor = c2Arr[Math.floor(mx / c2SqrSize)];
}

function generateImage() {
    removeElementById("converted");
    c1PrettyRender();
    var image = convertCanvasToImage(c1);
    var c3 = document.createElement("canvas"),
        ctx3 = c3.getContext("2d");
    c3.width = imgSize;
    c3.height = imgSize;
    setTimeout(function () {
        ctx3.drawImage(image, 0, 0, imgSize, imgSize);
        image = convertCanvasToImage(c3);
        document.body.appendChild(image);
    }, 1000);
}

// Initialize
var pixelRes = 16,
    pltSize = 8,
    imgSize = 64,
    c1 = document.getElementById("c1"),
    c2 = document.getElementById("c2"),
    gib = document.getElementById("genImgButton"),
    ctx1 = c1.getContext("2d"),
    ctx2 = c2.getContext("2d"),
    c1Arr = Array(pixelRes).fill(pixelRes).map(transparentArray),
    c2Arr = randRgbaArray(pltSize),
    c1SqrSize = c1.width / pixelRes,
    c2SqrSize = c2.width / c2Arr.length,
    mx = 0,
    my = 0,
    selectedColor = ["#000000", 1];
c2Arr[0] = ["#000000", 1];
c2Arr[1] = ["#000000", 0];
c1FillAll();
c2FillAll();
c1.clickHandler = c1ClickHandler;
c2.clickHandler = c2ClickHandler;
c1.addEventListener("click", captureClick);
c2.addEventListener("click", captureClick);
gib.addEventListener("click", generateImage);
