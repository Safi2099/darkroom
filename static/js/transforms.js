import { runResizeDialog, runCropMode } from './transform_ui.js';
import { updateCanvas } from './helpers.js';

let fliph = null;
let flipv = null;
let resize = null;
let initedTransforms = false;

export function transform(state, transform) {
    if (!initedTransforms) {
        initTransforms(state.Module);
    }

    const transforms = { fliph, flipv, resize, crop };
    const transformFunc = transforms[transform];

    switch (transformFunc) {
        case resize:
            runResizeDialog(state, transformFunc);
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
    resize = Module.cwrap('resize', 'number', [...Array(5).fill('number')]);

    initedTransforms = true;
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
