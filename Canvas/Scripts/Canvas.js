let image = new Image();
let canvas = document.getElementById("canvas");
let canvasCtx = canvas.getContext("2d");

var inputBrightness = document.getElementById("inBrightness");
var inputSaturation = document.getElementById("inSaturation");
var inputContrast = document.getElementById("inContrast");
var inputGrayscale = document.getElementById("inGrayscale");
var inputInversion = document.getElementById("inInversion");

let rotateDegree = 0;
let scale = 1;

let isCropClick = false;
let isEraserClick = false;
let isTextClick = false;
let isDrawing = false;

let startX = 0;
let startY = 0;
let cropWidth = 0;
let cropHeight = 0;
let txtBoxText = document.getElementById("txtBoxText");

$(document).ready(function () {
    resetFilter();
    txtBoxText.style.display = "none";
    $("#lblFilter").click();
});


//Tab functions
function filterClick() {
    $("#tabDtlFilter").css("display", "block");
    $("#tabDtlEditor").css("display", "none");

    $("#lblFilter").css({ "font-size": "18px", "text-decoration": "underline", "text-underline-offset": "8px" });
    $("#lblEditor").css({ "font-size": "16px", "text-decoration": "none" });
}

function editorClick() {
    $("#tabDtlFilter").css("display", "none");
    $("#tabDtlEditor").css("display", "inline-grid");

    $("#lblFilter").css({ "font-size": "16px", "text-decoration": "none" });
    $("#lblEditor").css({ "font-size": "18px", "text-decoration": "underline", "text-underline-offset": "8px" });
}


//Filter functions
function sliderValueChanged(filterKey) {
    const filter = window[`input${filterKey}`];
    $(`#lbl${filterKey}Value`).text(`${filter.value}%`);
    applyFilter();
}

function rotateLeft() {
    rotateDegree += 90;

    if (rotateDegree >= 360) {
        rotateDegree = 0;
    }

    applyFilter();
}

function rotateRight() {
    rotateDegree -= 90;

    if (rotateDegree <= -360) {
        rotateDegree = 0;
    }

    applyFilter();
}

function zoomIn() {
    if (scale < 2.0) {
        scale += 0.1;
    }

    applyFilter();
}

function zoomOut() {
    if (scale > 0.1) {
        scale -= 0.1;
    }

    applyFilter();
}


//Editor functions
function crop() {
    isCropClick = true;
    isEraserClick = false;
    isTextClick = false;
    isDrawing = false;
    txtBoxText.style.display = "none";
}

function eraser() {
    isCropClick = false;
    isEraserClick = true;
    isTextClick = false;
    isDrawing = false;
    txtBoxText.style.display = "none";
}

function text() {
    isCropClick = false;
    isEraserClick = false;
    isTextClick = true;
    isDrawing = false;
    txtBoxText.style.display = "none";
}

canvas.addEventListener("mousedown", function (e) {
    startX = 0;
    startY = 0;
    cropWidth = 0;
    cropHeight = 0;
    txtBoxText.style.display = "none";

    if (isCropClick === false && isEraserClick === false && isTextClick === false) {
        return;
    }

    if (isTextClick === true) {
        txtBoxText.style.display = "block";
        txtBoxText.style.position = "absolute";
        txtBoxText.style.top = `${e.y}px`;
        txtBoxText.style.left = `${e.x}px`;
        txtBoxText.value = "";
    }

    startX = e.offsetX;
    startY = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener("mousemove", function (e) {
    if (isDrawing === false) {
        return;
    }

    if (isCropClick === true) {
        cropWidth = e.offsetX - startX;
        cropHeight = e.offsetY - startY;

        canvasCtx.clearRect(startX, startY, cropWidth, cropHeight);
        applyFilter();

        canvasCtx.strokeStyle = '#FF0000';
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(startX, startY, cropWidth, cropHeight);
    }
    else if (isEraserClick === true) {
        canvasCtx.strokeStyle = "white";
        canvasCtx.lineWidth = 15;
        canvasCtx.lineCap = "round";
        canvasCtx.beginPath();
        canvasCtx.moveTo(startX, startY);
        canvasCtx.lineTo(e.offsetX, e.offsetY);
        canvasCtx.stroke();
        canvasCtx.closePath();

        startX = e.offsetX;
        startY = e.offsetY;
    }
});

canvas.addEventListener("mouseup", function (e) {
    if (isDrawing === false) {
        return;
    }
    
    if (isCropClick === true) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        applyFilter();

        //let cropStartX = startX;
        //let cropStartY = startY;

        //if (cropStartX > e.offsetX) {
        //    cropStartX = e.offsetX
        //}
        //if (cropStartY > e.offsetY) {
        //    cropStartY = e.offsetY
        //}

        //cropWidth = Math.abs(cropWidth);
        //cropHeight = Math.abs(cropHeight);

        const hiddenCanvas = document.getElementById("hiddenCanvas");
        const hiddenCanvasCtx = hiddenCanvas.getContext("2d");
        hiddenCanvas.width = Math.abs(cropWidth);
        hiddenCanvas.height = Math.abs(cropHeight);
        hiddenCanvasCtx.drawImage(canvas, startX, startY, cropWidth, cropHeight, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

        inputBrightness.value = "100";
        inputSaturation.value = "100";
        inputContrast.value = "100";
        inputGrayscale.value = "0";
        inputInversion.value = "0";

        canvas.width = Math.abs(cropWidth);
        canvas.height = Math.abs(cropHeight);
        //canvasCtx.drawImage(hiddenCanvas, 0, 0);
        canvasCtx.drawImage(image, startX, startY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
        //image.onload = null;
        //image.src = canvas.toDataURL();
    }

    isDrawing = false;
});

txtBoxText.addEventListener("mouseenter", function (e) {
    txtBoxText.focus();
});

txtBoxText.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        canvasCtx.font = "30px Arial";
        canvasCtx.texBaseline = "middle";
        canvasCtx.fillStyle = "red";
        canvasCtx.fillText(txtBoxText.value, startX, startY);
        txtBoxText.style.display = "none";
        isDrawing = false;
    }
});


//Other functions
function resetFilter() {
    inputBrightness.value = "100";
    inputSaturation.value = "100";
    inputContrast.value = "100";
    inputGrayscale.value = "0";
    inputInversion.value = "0";

    $("#lblBrightnessValue").text(`${inputBrightness.value}%`);
    $("#lblSaturationValue").text(`${inputSaturation.value}%`);
    $("#lblContrastValue").text(`${inputContrast.value}%`);
    $("#lblGrayscaleValue").text(`${inputGrayscale.value}%`);
    $("#lblInversionValue").text(`${inputInversion.value}%`);

    rotateDegree = 0;
    scale = 1;

    $.ajax({
        type: "POST",
        url: "/Home/GetImage",
        success: function (data) {
            image.src = data;

            image.onload = function () {
                applyFilter();
            };
        }
    });
}

function applyFilter() {
    //Canvas width & height have to set before filter 
    if (rotateDegree === 90 || rotateDegree === -90 || rotateDegree === 270 || rotateDegree === -270) {
        canvas.width = image.height * scale;
        canvas.height = image.width * scale;
    }
    else {
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
    }

    canvasCtx.filter = `brightness(${inputBrightness.value}%) saturate(${inputSaturation.value}%) contrast(${inputContrast.value}%) grayscale(${inputGrayscale.value}%) invert(${inputInversion.value}%)`;
    canvasCtx.rotate(rotateDegree * Math.PI / 180);
    canvasCtx.scale(scale, scale);

    if (rotateDegree === 90 || rotateDegree === -270) {
        canvasCtx.drawImage(image, 0, -image.height);
    }
    else if (rotateDegree === -90 || rotateDegree === 270) {
        canvasCtx.drawImage(image, -image.width, 0);
    }
    else if (rotateDegree === 180 || rotateDegree === -180) {
        canvasCtx.drawImage(image, -image.width, -image.height);
    }
    else {
        canvasCtx.drawImage(image, 0, 0);
    }

    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
}
