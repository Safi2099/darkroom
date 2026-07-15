import { runResizeDialog, runCropMode } from './transform_ui.js';
import { updateCanvas } from './helpers.js';

let fliph = null;
let flipv = null;
let initedTransforms = false;

export function transform(state, transform) {
    if (!initedTransforms) {
        initTransforms(state.Module);
    }

    const transforms = { fliph, flipv, resize, crop };
    const transformFunc = transforms[transform];

    switch (transformFunc) {
        case resize:
            runResizeDialog(state.ctx, transformFunc);
            break;
        case crop:
            runCropMode(state.ctx, transformFunc);
            break;
        case fliph:
        case flipv:
            transformFunc(
                state.currentImagePtr,
                state.ctx.canvas.width,
                state.ctx.canvas.height,
            );
            updateCanvas(state);
            break;
    }
}

function initTransforms(Module) {
    fliph = Module.cwrap('flip_h', null, [...Array(3).fill('number')]);
    flipv = Module.cwrap('flip_v', null, [...Array(3).fill('number')]);

    initedTransforms = true;
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
