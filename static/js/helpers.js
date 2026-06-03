export function greyScale(ctx, imageData) {
    const newImageData = ctx.createImageData(imageData.width, imageData.height);
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

export function sepia(ctx, imageData) {
    const newImageData = ctx.createImageData(imageData.width, imageData.height);
    const origPixels = imageData.data;
    const newPixels = newImageData.data;

    for (let i = 0; i < origPixels.length; i += 4) {
        const sepiaRed = (.393 * origPixels[i] + .769 * origPixels[i + 1] + .189 * origPixels[i + 2]) | 0;
        const sepiaGreen = (.349 * origPixels[i] + .686 * origPixels[i + 1] + .168 * origPixels[i + 2]) | 0;
        const sepiaBlue = (.272 * origPixels[i] + .534 * origPixels[i + 1] + .131 * origPixels[i + 2]) | 0;

        newPixels[i] = sepiaRed;
        newPixels[i + 1] = sepiaGreen;
        newPixels[i + 2] = sepiaBlue;
        newPixels[i + 3] = origPixels[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
}

export function invert(ctx, imageData) {
    const newImageData = ctx.createImageData(imageData.width, imageData.height);
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

export function reset(ctx, originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
}

export function imageOK(image, originalImageData) {
    return image !== undefined && originalImageData !== undefined && image.complete && image.naturalWidth !== 0;
}

export function filter(ctx, image, originalImageData, filterFunc) {
    if (imageOK(image, originalImageData)) {
        filterFunc(ctx, originalImageData);
    }
    else {
        console.log('image not loaded yet');
    }
}

export function triggerDownload(blobURL) {
    const link = document.createElement('a');
    link.download = "image";
    link.href = blobURL;
    link.click();
    URL.revokeObjectURL(blobURL);
}
