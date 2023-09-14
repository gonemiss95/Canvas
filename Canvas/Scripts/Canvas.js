let canvas = new fabric.Canvas("canvas");
let image = null;

let canvasWidth = 0;
let canvasHeight = 0;

let rotateDegree = 0;

let isCropClick = false;
let isEraserClick = false;

let startX = 0;
let startY = 0;

$(document).ready(function () {
    resetFilter();
    $("#lblFilter").click();
});

function resetFilter() {
    $("#sliderBrightness").val(100);
    $("#lblBrightnessValue").text("100%");

    $("#sliderSaturation").val(100);
    $("#lblSaturationValue").text("100%");

    $("#sliderContrast").val(100);
    $("#lblContrastValue").text("100%");

    $("#chkBoxGrayscale").prop("checked", false);
    $("#chkBoxInversion").prop("checked", false);

    rotateDegree = 0;
    canvas.setZoom(1);

    $.ajax({
        type: "POST",
        url: "/Home/GetImage",
        success: function (data) {
            fabric.Object.prototype.selectable = false; //Make the all objects in canvas selectable

            fabric.Image.fromURL(data, function (img) {
                img.set({
                    left: img.width / 2, //Set the initial left position
                    top: img.height / 2, //Set the initial top position
                    originX: "center", //Set the origin X to the center
                    originY: "center", //Set the origin Y to the center
                });

                canvas.clear();
                canvas.add(img);
                canvas.setWidth(img.width);
                canvas.setHeight(img.height);
                canvas.renderAll();

                image = img;
                canvasWidth = img.width;
                canvasHeight = img.height;
            });
        }
    });
}

function saveImage() {
    let imgDataURL = canvas.toDataURL({
        format: "jpeg",
        quality: 0.8
    });

    $.ajax({
        type: "POST",
        url: "/Home/SaveImage",
        data: { imgDataURL: imgDataURL }
    });
}


//Filter functions
function filterValueChanged(filterKey) {
    const filter = window[`slider${filterKey}`];
    const filterValue = (filter.value / 100) - 1;
    $(`#lbl${filterKey}Value`).text(`${filter.value}%`);

    if (filterKey === "Brightness") {
        image.filters[0] = new fabric.Image.filters.Brightness({ brightness: filterValue });
    }
    else if (filterKey === "Saturation") {
        image.filters[1] = new fabric.Image.filters.Saturation({ saturation: filterValue });
    }
    else if (filterKey === "Contrast") {
        image.filters[2] = new fabric.Image.filters.Contrast({ contrast: filterValue });
    }

    image.applyFilters();
    canvas.renderAll();
}

function filterCheckChanged() {
    const isGrayscaleChecked = $("#chkBoxGrayscale").is(":checked");
    const isInversionChecked = $("#chkBoxInversion").is(":checked");
    image.filters[3] = null;
    image.filters[4] = null;

    if (isGrayscaleChecked === true) {
        image.filters[3] = new fabric.Image.filters.Grayscale();
    }
    if (isInversionChecked === true) {
        image.filters[4] = new fabric.Image.filters.Invert();
    }

    image.applyFilters();
    canvas.renderAll();
}

function rotate(rotateAngle) {
    let canvasImg = new Image();
    canvasImg.src = canvas.toDataURL();

    if (rotateAngle === "Left") {
        rotateDegree = 90;
    }
    else if (rotateAngle === "Right") {
        rotateDegree = -90;
    }

    canvasWidth = canvas.height;
    canvasHeight = canvas.width;

    canvasImg.onload = function () {
        image = new fabric.Image(canvasImg);
        image.left = canvasWidth / 2;
        image.top = canvasHeight / 2;
        image.originX = "center";
        image.originY = "center";
        image.rotate(rotateDegree);

        canvas.clear();
        canvas.add(image);
        canvas.setWidth(canvasWidth);
        canvas.setHeight(canvasHeight);
        canvas.setZoom(1);
        canvas.renderAll();

        $("#sliderBrightness").val(parseInt($("#lblBrightnessValue").text().slice(0, -1)));
        filterValueChanged("Brightness");

        $("#sliderSaturation").val(parseInt($("#lblSaturationValue").text().slice(0, -1)));
        filterValueChanged("Saturation");

        $("#sliderContrast").val(parseInt($("#lblContrastValue").text().slice(0, -1)));
        filterValueChanged("Contrast");

        filterCheckChanged();
    };
}

function zoom(zoomKey) {
    if (zoomKey === "In") {
        canvas.setZoom(canvas.getZoom() + 0.1);
    }
    else if (zoomKey === "Out") {
        canvas.setZoom(canvas.getZoom() - 0.1);
    }

    canvas.setWidth(canvasWidth * canvas.getZoom());
    canvas.setHeight(canvasHeight * canvas.getZoom());
    canvas.renderAll();
}


//Editor functions
function crop() {
    isCropClick = true;
    isEraserClick = false;

    canvas.isDrawingMode = false;
    canvas.discardActiveObject();
    canvas.renderAll();

    canvas.forEachObject(function (object) {
        object.selectable = false;
    });
}

function eraser() {
    isCropClick = false;
    isEraserClick = true;

    canvas.isDrawingMode = true; //Enable drawing mode
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas); //Use PencilBrush for drawing
    canvas.freeDrawingBrush.color = "white";
    canvas.freeDrawingBrush.width = parseInt($("#eraserSize").val());
}

function eraserSizeChanged(size) {
    if ($(size).val() < 1) {
        $(size).val(1);
    }
    else if ($(size).val() > 50) {
        $(size).val(50);
    }

    if (isEraserClick === true) {
        canvas.freeDrawingBrush.width = parseInt($(size).val());
    }
}

function text() {
    isCropClick = false;
    isEraserClick = false;

    let textBox = new fabric.Textbox("Enter Text", {
        selectable: true,
        fontSize: 16,
        fontFamily: "Arial",
        textAlign: "left",
        width: 80,
        top: 20,
        left: 20,
        fill: $("#textColor").val()
    });

    canvas.isDrawingMode = false;
    canvas.add(textBox);
    canvas.renderAll();
}

canvas.on("mouse:down", (e) => {
    const pointer = canvas.getPointer(e.e);
    startX = pointer.x;
    startY = pointer.y;
});

canvas.on("mouse:up", (e) => {
    if (isCropClick === true) {
        const pointer = canvas.getPointer(e.e);
        canvasWidth = Math.abs(pointer.x - startX) * canvas.getZoom();
        canvasHeight = Math.abs(pointer.y - startY) * canvas.getZoom();

        if (startX > pointer.x) {
            startX = pointer.x * canvas.getZoom();
        }
        if (startY > pointer.y) {
            startY = pointer.y * canvas.getZoom();
        }

        $("#sliderBrightness").val(100);
        $("#lblBrightnessValue").text("100%");
        filterValueChanged("Brightness");

        $("#sliderSaturation").val(100);
        $("#lblSaturationValue").text("100%");
        filterValueChanged("Saturation");

        $("#sliderContrast").val(100);
        $("#lblContrastValue").text("100%");
        filterValueChanged("Contrast");

        $("#chkBoxGrayscale").prop("checked", false);
        $("#chkBoxInversion").prop("checked", false);
        filterCheckChanged();

        rotateDegree = 0;

        let cropImg = new Image();
        cropImg.src = canvas.toDataURL({
            left: startX * canvas.getZoom(),
            top: startY * canvas.getZoom(),
            width: canvasWidth,
            height: canvasHeight
        });

        cropImg.onload = function () {
            image = new fabric.Image(cropImg);
            image.left = canvasWidth / 2;
            image.top = canvasHeight / 2;
            image.originX = "center";
            image.originY = "center";

            canvas.clear();
            canvas.add(image);
            canvas.setWidth(canvasWidth);
            canvas.setHeight(canvasHeight);
            canvas.setZoom(1);
            canvas.renderAll();
        };
    }
});

document.onkeydown = function (e) {
    if (e.key === "Delete") {
        canvas.getActiveObjects().forEach((obj) => {
            canvas.remove(obj);
        });

        canvas.discardActiveObject();
    }
}
