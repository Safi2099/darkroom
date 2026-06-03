import { greyScale, sepia, invert, reset, imageOK, filter, triggerDownload } from './helpers.js';

const imageInput = document.getElementById('image-input');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let originalImageData;
let currentObjectURL;
let image;

imageInput.addEventListener('change', function() {
    const imageFile = imageInput.files[0];
    if (imageFile) {
        canvasContainer.appendChild(canvas);
        image = new Image();

        if (currentObjectURL) {
            URL.revokeObjectURL(currentObjectURL);
        }

        image.src = URL.createObjectURL(imageFile);
        currentObjectURL = image.src;

        image.onload = function() {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx.drawImage(image, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }
});

const filters = {
    "greyScale": greyScale,
    "sepia": sepia,
    "invert": invert,
    "reset": reset
}

const filterButtons = document.querySelectorAll('.filter-btn');
for (const filterButton of filterButtons) {
    filterButton.addEventListener('click', function() {
        const filterFunc = filters[filterButton.dataset.filter];
        filter(ctx, image, originalImageData, filterFunc);
    });
}

const exportButton = document.getElementById('export-button');
const exportDropdown = document.getElementById('export-dropdown');

exportButton.addEventListener('click', function() {
    if (!imageOK(image, originalImageData) || !exportDropdown.value) {
        console.log('image not loaded yet');
        return;
    }

    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        triggerDownload(url);
    }, exportDropdown.value);
});
