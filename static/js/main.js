import createModule from '../wasm/wasm.js';
import { imageOK, triggerDownload, loadImageToC } from './helpers.js';
import { filter } from './filters.js';
import { adjust } from './adjusts.js';
import { transform } from './transforms.js';

async function main() {
    const Module = await createModule();
    const state = createState(Module);

    setupImageInput(state);
    setupOperations(state);
    setupExport(state);
}

function createState(Module) {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    return {
        Module,
        canvas,
        ctx,
        numBytes: null,
        image: null,
        originalWidth: null,
        originalHeight: null,
        originalImagePtr: null,
        currentImagePtr: null,
    };
}

function setupImageInput(state) {
    const imageInput = document.getElementById('image-input');
    const canvasStack = document.querySelector('.canvas-stack');
    let currentObjectURL;

    imageInput.addEventListener('change', () => {
        const imageFile = imageInput.files[0];
        if (imageFile) {
            canvasStack.appendChild(state.canvas);
            state.image = new Image();

            if (currentObjectURL) {
                URL.revokeObjectURL(currentObjectURL);
            }

            state.image.src = URL.createObjectURL(imageFile);
            currentObjectURL = state.image.src;

            state.image.onload = function () {
                canvas.width = state.image.naturalWidth;
                canvas.height = state.image.naturalHeight;
                state.originalWidth = canvas.width;
                state.originalHeight = canvas.height;

                state.ctx.drawImage(state.image, 0, 0);

                loadImageToC(state);
            };
        }
    });
}

function setupOperations(state) {
    document.querySelectorAll('.operation-btn').forEach((button) => {
        button.addEventListener('click', () => {
            if (!imageOK(state.image)) {
                return;
            }

            const type = button.dataset.type;
            if (type === 'filter') {
                filter(state, button.dataset.name);
            } else if (type === 'adjust') {
                adjust(state, button.dataset.name, button.dataset.amount);
            } else if (type === 'transform') {
                transform(state, button.dataset.name);
            }
        });
    });
}

function setupExport(state) {
    const exportButton = document.getElementById('export-button');
    const exportDropdown = document.getElementById('export-dropdown');

    exportButton.addEventListener('click', () => {
        if (!imageOK(state.image, state.originalImageData)) {
            return;
        } else if (!exportDropdown.value) {
            return;
        }

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            triggerDownload(url);
        }, exportDropdown.value);
    });
}

main().catch(console.error);
