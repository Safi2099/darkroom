import { reset, imageOK, triggerDownload } from './helpers.js';
import { filter } from './filters.js';
import { adjust } from './adjusts.js';

const imageInput = document.getElementById('image-input');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
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

const operationButtons = document.querySelectorAll('.operation-btn');
for (const operationButton of operationButtons) {
    operationButton.addEventListener('click', function() {
        if (!imageOK(image)) {
            return;
        }

        const type = operationButton.dataset.type;
        if (type === 'filter') {
            filter(ctx, operationButton.dataset.name);
        }
        else if (type === 'adjust') {
            adjust(ctx, operationButton.dataset.name, operationButton.dataset.amount);
        }
        else {
            reset(ctx, originalImageData);
        }
    });
}

const exportButton = document.getElementById('export-button');
const exportDropdown = document.getElementById('export-dropdown');

exportButton.addEventListener('click', function() {
    if (!imageOK(image, originalImageData)) {
        console.log('image not loaded yet');
        return;
    }
    else if (!exportDropdown.value) {
        console.log('format not selected');
        return;
    }

    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        triggerDownload(url);
    }, exportDropdown.value);
});
