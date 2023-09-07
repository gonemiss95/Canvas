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


$(document).ready(function () {
    getImage();
    $("#lblFilter").click();
});

function getImage() {
    $.ajax({
        cache: false,
        type: "POST",
        url: GetImageURL,
        success: function (data) {
            image.src = data;

            image.addEventListener("load", function () {
                resetFilter();
            });
        }
    });
}


//Tab functions
function filterClick() {
    $('.divTabDetailFilter').css("display", "block");

    $('#lblFilter').css({ "font-size": "18px", "text-decoration": "underline", "text-underline-offset": "8px" });
    $('#lblEditor').css({ "font-size": "16px", "text-decoration": "none" });
}

function editorClick() {
    $('.divTabDetailFilter').css("display", "none");

    $('#lblFilter').css({ "font-size": "16px", "text-decoration": "none" });
    $('#lblEditor').css({ "font-size": "18px", "text-decoration": "underline", "text-underline-offset": "8px" });
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

    applyFilter();
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
};
