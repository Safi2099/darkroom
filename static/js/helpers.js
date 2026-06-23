export function imageOK(image) {
    return image && image.complete && image.naturalWidth;
}

export function triggerDownload(blobURL) {
    const link = document.createElement('a');
    link.download = "image";
    link.href = blobURL;
    link.click();
    URL.revokeObjectURL(blobURL);
}

export function reset(ctx, originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
}
