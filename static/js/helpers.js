let initCurrent = null;
let initOriginal = null;
let freePrev = null;
let initedCHelpers = false;

function initCHelpers(state) {
    initOriginal = state.Module.cwrap('init_original', 'number', ['number']);
    initCurrent = state.Module.cwrap('init_current', 'number', [
        'number',
        'number',
    ]);

    freePrev = state.Module.cwrap('free_prev', null, ['number']);
    initedCHelpers = true;
}

export function loadImageToC(state) {
    if (!state.Module || !imageOK(state.image)) {
        return;
    }

    if (!initedCHelpers) {
        initCHelpers(state);
    }

    if (state.originalImagePtr) {
        freePrev(state.originalImagePtr);
    }

    if (state.currentImagePtr) {
        freePrev(state.currentImagePtr);
    }

    const imageData = state.ctx.getImageData(
        0,
        0,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
    );

    state.numBytes = imageData.data.length;
    state.originalImagePtr = initOriginal(state.numBytes);
    state.Module.HEAPU8.set(imageData.data, state.originalImagePtr);

    state.currentImagePtr = initCurrent(state.numBytes, state.originalImagePtr);
}

export function updateCanvas(state) {
    const imageData = state.ctx.getImageData(
        0,
        0,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
    );

    const newData = new Uint8ClampedArray(
        state.Module.HEAPU8.buffer,
        state.currentImagePtr,
        state.numBytes,
    );

    imageData.data.set(newData);

    state.ctx.putImageData(imageData, 0, 0);
}

export function imageOK(image) {
    return image && image.complete && image.naturalWidth;
}

export function triggerDownload(blobURL) {
    const link = document.createElement('a');
    link.download = 'image';
    link.href = blobURL;
    link.click();
    URL.revokeObjectURL(blobURL);
}
