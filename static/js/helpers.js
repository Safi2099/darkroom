let initCurrent = null;
let freePrev = null;
let initedCHelpers = false;

function initCHelpers(state) {
    initCurrent = state.Module.cwrap('init_current', 'number', ['number']);
    freePrev = state.Module.cwrap('free_prev', null, ['number']);

    initedCHelpers = true;
}

export function syncImage(state) {
    if (!state.Module || !imageOK(state.image)) {
        return;
    }

    if (!initedCHelpers) {
        initCHelpers(state);
    }

    state.originalImageData = state.ctx.getImageData(
        0,
        0,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
    );

    state.numBytes = state.originalImageData.data.length;

    if (state.currentImagePtr) {
        freePrev(state.currentImagePtr);
    }
    state.currentImagePtr = initCurrent(state.numBytes);
    state.Module.HEAPU8.set(
        state.originalImageData.data,
        state.currentImagePtr,
    );
}

export function updateCanvas(state) {
    const newData = new Uint8ClampedArray(
        state.Module.HEAPU8.buffer,
        state.currentImagePtr,
        state.numBytes,
    );

    const newImageData = new ImageData(
        newData,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
    );

    state.ctx.putImageData(newImageData, 0, 0);
}

export function reset(state) {
    if (!state.originalImageData || !state.currentImagePtr || !state.Module) {
        return;
    }

    state.ctx.canvas.width = state.originalImageData.width;
    state.ctx.canvas.height = state.originalImageData.height;

    state.numBytes = state.originalImageData.data.length;

    freePrev(state.currentImagePtr);
    state.currentImagePtr = initCurrent(state.numBytes);
    state.Module.HEAPU8.set(
        state.originalImageData.data,
        state.currentImagePtr,
    );

    state.ctx.putImageData(state.originalImageData, 0, 0);
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
