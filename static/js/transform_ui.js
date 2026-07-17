import { updateCanvas } from './helpers.js';

function callTransformWithReAlloc(state, transformFunc, width, height) {
    const tmp = transformFunc(
        state.currentImagePtr,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
        width,
        height,
    );

    if (!tmp) {
        return;
    }

    state.numBytes = width * height * 4;
    state.ctx.canvas.width = width;
    state.ctx.canvas.height = height;
    state.currentImagePtr = tmp;

    updateCanvas(state);
}

export function runResizeDialog(state, resize) {
    const ratio = state.ctx.canvas.width / state.ctx.canvas.height;
    const inputDialog = document.getElementById('resize-dialog');
    const widthInput = document.getElementById('resize-width-input');
    const heightText = document.getElementById('resize-height-text');
    const dialogForm = document.getElementById('resize-form');
    let width;
    let height;

    inputDialog.showModal();

    widthInput.addEventListener('input', showHeight);
    dialogForm.addEventListener('submit', onSubmit, { once: true });

    function showHeight(event) {
        heightText.textContent = Math.round(Number(event.target.value) / ratio);
    }

    function onSubmit() {
        widthInput.removeEventListener('input', showHeight);

        width = Number(widthInput.value);
        height = Number(heightText.textContent);

        widthInput.value = '';
        heightText.textContent = '';

        // 4K image is the cap
        if (width > 0 && width <= 3840 && height > 0 && height <= 2160) {
            callTransformWithReAlloc(state, resize, width, height);
        }
    }
}

export function runCropMode(ctx, crop) {
    const dialog = document.getElementById('crop-dialog');
    const canvas = document.getElementById('canvas');
    const canvasStack = document.querySelector('.canvas-stack');

    const overlay = document.createElement('canvas');
    overlay.id = 'overlay';
    canvasStack.appendChild(overlay);

    const overlayCtx = overlay.getContext('2d');
    overlay.width = ctx.canvas.width;
    overlay.height = ctx.canvas.height;
    overlayCtx.strokeStyle = 'red';
    overlayCtx.lineWidth = 2;

    let mousePressed = false;
    let startX;
    let startY;
    let currentX;
    let currentY;
    let cropRect;
    document.body.style.cursor = 'crosshair';

    function onMouseDown(event) {
        startX = event.offsetX;
        startY = event.offsetY;
        mousePressed = true;
    }

    function onMouseMove(event) {
        if (!mousePressed) {
            return;
        }

        currentX = event.offsetX;
        currentY = event.offsetY;

        const x = Math.min(startX, currentX);
        const y = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        cropRect = { x, y, width, height };

        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        overlayCtx.strokeRect(x, y, width, height);
    }

    function onMouseUp() {
        if (!cropRect) {
            return;
        }

        mousePressed = false;
        dialog.showModal();
        dialog.addEventListener('close', dialogFunc, { once: true });
    }

    function dialogFunc() {
        if (dialog.returnValue === 'apply' && cropRect) {
            crop(ctx, cropRect.x, cropRect.y, cropRect.width, cropRect.height);
        }

        document.body.style.cursor = 'default';
        overlay.remove();

        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}
