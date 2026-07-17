import { runResizeDialog, runCropMode } from './transform_ui.js';
import { updateCanvas } from './helpers.js';

let fliph = null;
let flipv = null;
let resize = null;
let crop = null;

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
            runCropMode(state, transformFunc);
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
    crop = Module.cwrap('crop', 'number', [...Array(7).fill('number')]);

    initedTransforms = true;
}
