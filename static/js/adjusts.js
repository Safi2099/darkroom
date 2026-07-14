import { updateCanvas } from './helpers.js';

let brightness = null;
let contrast = null;

let initedAdjusts = false;

export function adjust(state, adjust, amount) {
    if (!initedAdjusts) {
        initAdjusts(state.Module);
    }

    const adjusts = { brightness, contrast };
    const adjustFunc = adjusts[adjust];

    if (adjustFunc) {
        adjustFunc(
            state.currentImagePtr,
            state.ctx.canvas.width,
            state.ctx.canvas.height,
            Number(amount),
        );
        updateCanvas(state);
    }
}

function initAdjusts(Module) {
    brightness = Module.cwrap('brightness', null, [...Array(4).fill('number')]);
    contrast = Module.cwrap('contrast', null, [...Array(4).fill('number')]);

    initedAdjusts = true;
}
