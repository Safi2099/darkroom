export function filter(ctx, filter) {
    const filters = { greyscale, sepia, invert, blur };
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

export function blur(ctx) {
    const oldImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const newImageData = ctx.createImageData(oldImageData);

    const oldData = oldImageData.data;
    const newData = newImageData.data;

    for (let i = 0; i < oldData.length; i += 4) {
        const pixelIndex = (i / 4) | 0;
        const x = pixelIndex % oldImageData.width;
        const y = (pixelIndex / oldImageData.width) | 0;

        let sumR = 0;
        let sumG = 0;
        let sumB = 0;

        let divisor = 0;

        for (let dy = -1; dy <= 1; dy++) {
            const row = y + dy;
            if (row < 0) {
                continue;
            }
            else if (row > oldImageData.height - 1) {
                break;
            }

            for (let dx = -1; dx <= 1; dx++) {
                const column = x + dx;
                if (column < 0) {
                    continue;
                }
                else if (column > oldImageData.width - 1) {
                    break;
                }

                const index = (row * oldImageData.width + column) * 4;
                sumR += oldData[index];
                sumG += oldData[index + 1];
                sumB += oldData[index + 2];
                divisor++;
            }
        }

        newData[i] = (sumR / divisor) | 0;
        newData[i + 1] = (sumG / divisor) | 0;
        newData[i + 2] = (sumB / divisor) | 0;
        newData[i + 3] = oldData[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
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
