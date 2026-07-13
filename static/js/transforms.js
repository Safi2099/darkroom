import { runResizeDialog, runCropMode } from './transform_ui.js';

export function transform(ctx, transform) {
    const transforms = { reflect, resize, crop };
    const transformFunc = transforms[transform];

    if (transformFunc === resize) {
        runResizeDialog(ctx, transformFunc);
    } else if (transformFunc === crop) {
        runCropMode(ctx, transformFunc);
    } else {
        transformFunc(ctx);
    }
}

export function reflect(ctx) {
    const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
    );
    const data = imageData.data;

    const width = imageData.width;
    const halfWidth = (width / 2) | 0;

    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = (pixelIndex / width) | 0;

        if (x >= halfWidth) {
            continue;
        }

        const oppositeX = width - x - 1;
        const oppositeIndex = (y * width + oppositeX) * 4;

        const leftR = data[i];
        const leftG = data[i + 1];
        const leftB = data[i + 2];
        const leftA = data[i + 3];

        data[i] = data[oppositeIndex];
        data[i + 1] = data[oppositeIndex + 1];
        data[i + 2] = data[oppositeIndex + 2];
        data[i + 3] = data[oppositeIndex + 3];

        data[oppositeIndex] = leftR;
        data[oppositeIndex + 1] = leftG;
        data[oppositeIndex + 2] = leftB;
        data[oppositeIndex + 3] = leftA;
    }

    ctx.putImageData(imageData, 0, 0);
}

export function resize(ctx, newWidth, newHeight) {
    const oldImageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
    );
    const oldData = oldImageData.data;
    const oldWidth = oldImageData.width;
    const oldHeight = oldImageData.height;

    const newImageData = ctx.createImageData(newWidth, newHeight);
    const newData = newImageData.data;

    for (let i = 0; i < newData.length; i += 4) {
        const pixelIndex = i / 4;
        const newX = pixelIndex % newWidth;
        const newY = (pixelIndex / newWidth) | 0;

        const oldX = ((newX / newWidth) * oldWidth) | 0;
        const oldY = ((newY / newHeight) * oldHeight) | 0;
        const oldIndex = (oldY * oldWidth + oldX) * 4;

        newData[i] = oldData[oldIndex];
        newData[i + 1] = oldData[oldIndex + 1];
        newData[i + 2] = oldData[oldIndex + 2];
        newData[i + 3] = oldData[oldIndex + 3];
    }

    ctx.canvas.width = newWidth;
    ctx.canvas.height = newHeight;
    ctx.putImageData(newImageData, 0, 0);
}

export function crop(ctx, cropX, cropY, width, height) {
    const oldImageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
    );
    const oldData = oldImageData.data;

    const newImageData = ctx.createImageData(width, height);
    const newData = newImageData.data;

    for (let i = 0; i < newData.length; i += 4) {
        const pixelIndex = i / 4;
        const newX = pixelIndex % width;
        const newY = (pixelIndex / width) | 0;

        const oldX = cropX + newX;
        const oldY = cropY + newY;
        const oldIndex = (oldY * oldImageData.width + oldX) * 4;

        newData[i] = oldData[oldIndex];
        newData[i + 1] = oldData[oldIndex + 1];
        newData[i + 2] = oldData[oldIndex + 2];
        newData[i + 3] = oldData[oldIndex + 3];
    }

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.putImageData(newImageData, 0, 0);
}
