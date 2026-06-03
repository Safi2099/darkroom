const imageInput = document.getElementById('image');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let originalImageData;
let image;

imageInput.addEventListener('change', function() {
    const imageFile = imageInput.files[0];
    if (imageFile) {
        canvasContainer.appendChild(canvas);
        image = new Image();

        image.src = URL.createObjectURL(imageFile);

        image.onload = function() {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx.drawImage(image, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }
});

function greyScale(ctx, imageData) {
    const newImageData = ctx.createImageData(canvas.width, canvas.height);
    const origPixels = imageData.data;
    const newPixels = newImageData.data;

    for (let i = 0; i < origPixels.length; i += 4) {
        const average = ((origPixels[i] + origPixels[i + 1] + origPixels[i + 2]) / 3) | 0;

        newPixels[i] = average;
        newPixels[i + 1] = average;
        newPixels[i + 2] = average;
        newPixels[i + 3] = origPixels[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
}

function sepia(ctx, imageData) {
    const newImageData = ctx.createImageData(canvas.width, canvas.height);
    const origPixels = imageData.data;
    const newPixels = newImageData.data;

    for (let i = 0; i < origPixels.length; i += 4) {
        const sepiaRed = Math.round(.393 * origPixels[i] + .769 * origPixels[i + 1] + .189 * origPixels[i + 2]);
        const sepiaGreen = Math.round(.349 * origPixels[i] + .686 * origPixels[i + 1] + .168 * origPixels[i + 2]);
        const sepiaBlue = Math.round(.272 * origPixels[i] + .534 * origPixels[i + 1] + .131 * origPixels[i + 2]);

        newPixels[i] = sepiaRed;
        newPixels[i + 1] = sepiaGreen;
        newPixels[i + 2] = sepiaBlue;
        newPixels[i + 3] = origPixels[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
}

function invert(ctx, imageData) {
    const newImageData = ctx.createImageData(canvas.width, canvas.height);
    const origPixels = imageData.data;
    const newPixels = newImageData.data;

    for (let i = 0; i < origPixels.length; i += 4) {
        newPixels[i] = 255 - origPixels[i];
        newPixels[i + 1] = 255 - origPixels[i + 1];
        newPixels[i + 2] = 255 - origPixels[i + 2];
        newPixels[i + 3] = origPixels[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
}

function reset(ctx, originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
}

function imageOK() {
    return image !== undefined && originalImageData !== undefined && image.complete && image.naturalWidth !== 0;
}

const greyScaleButton = document.getElementById('grey-scale-button');
greyScaleButton.addEventListener('click', function() {
    if (imageOK()) {
        greyScale(ctx, originalImageData);
    }
    else {
        console.log('image not loaded yet');
    }
});

const sepiaButton = document.getElementById('sepia-button');
sepiaButton.addEventListener('click', function() {
    if (imageOK()) {
        sepia(ctx, originalImageData);
    }
    else {
        console.log('image not loaded yet');
    }
});

const invertButton = document.getElementById('invert-button');
invertButton.addEventListener('click', function() {
    if (imageOK) {
        invert(ctx, originalImageData);
    }
    else {
        console.log('image not loaded yet');
    }
});

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', function() {
    if (imageOK()) {
        reset(ctx, originalImageData);
    }
    else {
        console.log('image not loaded yet');
    }
});

const exportButton = document.getElementById('export-button');
const exportDropdown = document.getElementById('export-dropdown');
exportButton.addEventListener('click', function() {
    if (imageOK() && exportDropdown.value) {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = "image";
            link.href = url;
            link.click();
        }, exportDropdown.value);
    }
    else {
        console.log('image not loaded yet');
    }
});
