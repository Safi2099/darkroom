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

export function reset(ctx, originalImageData) {
    ctx.canvas.width = originalImageData.width;
    ctx.canvas.height = originalImageData.height;
    ctx.putImageData(originalImageData, 0, 0);
}

export function loadImageToC(state) {
    if (!state.Module) {
        return;
    }

    const imageData = state.ctx.getImageData(
        0,
        0,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
    );

    const num_bytes = imageData.data.length;
    const originalBuffPtr = state.Module.ccall(
        'init_original',
        'number',
        ['number'],
        [num_bytes],
    );

    state.Module.HEAPU8.set(imageData.data, originalBuffPtr);

    const currentBuffPtr = state.Module.ccall(
        'init_current',
        'number',
        ['number', 'number'],
        [num_bytes, originalBuffPtr],
    );

    return [originalBuffPtr, currentBuffPtr];
}
