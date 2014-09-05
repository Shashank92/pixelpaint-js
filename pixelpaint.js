function getImage(src) {
    var img = document.createElement("img");
    img.src = src;
    return img;
}

function getBase64ImageURL(img, w, h) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    return canvas.toDataURL("image/png");
}

function drawLine(ctx, x1, y1, x2, y2, color) {
    ctx.strokeStyle = color || "#000000";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
}

function drawGridNxN(n) {
    dx = w / n;
    dy = h / n;
    for (var i = 1; i < n; i++) {
        drawLine(ctx, dx * i, 0, dx * i, h);
        drawLine(ctx, 0, dy * i, w, dy * i);
    }
}

function saveImg() {
    //window.open(canvas.toDataURL("image/png"));
    saveImg = document.createElement("img");
    saveImg.src = canvas.toDataURL("image/png");
    document.body.appendChild(saveImg);
}

function globalInit() {
    cw = "320";
    ch = "320";
    w = "320";
    h = "320";
    canvas = document.getElementById("pixelpaint"),
    canvas.width = cw;
    canvas.height = ch;
    canvas.style = "border:1px solid";
    ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;
    img = getImage("tree.png");
    ctx.drawImage(img, 0, 0, w, h);
    drawGridNxN(16);
}

globalInit();
saveImg();

// Extras
function fillTransparent() {
    var imgData = ctx.getImageData(0, 0, w, h);
    var data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
        data[i + 3] = 0;
    }

    ctx.putImageData(imgData, 0, 0);
}
