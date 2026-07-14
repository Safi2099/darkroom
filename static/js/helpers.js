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

export function loadImageToC(state) {
    if (!state.Module || !imageOK(state.image)) {
        return;
    }

    const imageData = state.ctx.getImageData(
        0,
        0,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
    );

    state.numBytes = imageData.data.length;
    state.originalImagePtr = state.Module.ccall(
        'init_original',
        'number',
        ['number'],
        [state.numBytes],
    );

    state.Module.HEAPU8.set(imageData.data, state.originalImagePtr);

    state.currentImagePtr = state.Module.ccall(
        'init_current',
        'number',
        ['number', 'number'],
        [state.numBytes, state.originalImagePtr],
    );
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
