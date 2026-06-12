export function filter(ctx, filter) {
    const filters = { greyscale, sepia, invert };
    const filterFunc = filters[filter];

    if (filterFunc) {
        filterFunc(ctx);
    }
}

export function adjust(ctx, adjust, amount) {
    const adjusts = { brightness, contrast };
    const adjustFunc = adjusts[adjust];

    if (adjustFunc) {
        adjustFunc(ctx, amount);
    }
}

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

export function greyscale(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const average = ((data[i] + data[i + 1] + data[i + 2]) / 3) | 0;

        data[i] = average;
        data[i + 1] = average;
        data[i + 2] = average;
    }

    ctx.putImageData(imageData, 0, 0);
}

export function sepia(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const sepiaRed = (.393 * data[i] + .769 * data[i + 1] + .189 * data[i + 2]) | 0;
        const sepiaGreen = (.349 * data[i] + .686 * data[i + 1] + .168 * data[i + 2]) | 0;
        const sepiaBlue = (.272 * data[i] + .534 * data[i + 1] + .131 * data[i + 2]) | 0;

        data[i] = sepiaRed;
        data[i + 1] = sepiaGreen;
        data[i + 2] = sepiaBlue;
    }

    ctx.putImageData(imageData, 0, 0);
}

export function invert(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        for (let j = i; j < i + 3; j++) {
            data[j] = 255 - data[j];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export function brightness(ctx, amount) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    amount = Number(amount);

    for (let i = 0; i < data.length; i += 4) {
        for (let j = i; j < i + 3; j++) {
            data[j] = data[j] + amount;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export function contrast(ctx, amount) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const mid = 128;
    amount = Number(amount);

    for (let i = 0; i < data.length; i += 4) {
        for (let j = i; j < i + 3; j++) {
            data[j] = ((data[j] - mid) * amount + mid) | 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}
