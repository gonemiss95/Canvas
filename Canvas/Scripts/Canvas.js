var inputBrightness = document.getElementById("inBrightness");
var inputSaturation = document.getElementById("inSaturation");
var inputContrast = document.getElementById("inContrast");
var inputGrayscale = document.getElementById("inGrayscale");
var inputInversion = document.getElementById("inInversion");

let image = new Image();
let canvas = document.getElementById("canvas");
let canvasCtx= canvas.getContext("2d");


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

function resetFilter() {
    canvas.width = image.width;
    canvas.height = image.height;

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

    applyFilter();
}

function applyFilter() {
    canvasCtx.filter = `brightness(${inputBrightness.value}%) saturate(${inputSaturation.value}%) contrast(${inputContrast.value}%) grayscale(${inputGrayscale.value}%) invert(${inputInversion.value}%)`;
    canvasCtx.drawImage(image, 0, 0);
};
