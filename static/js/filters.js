import { updateCanvas } from './helpers.js';

let greyscale = null;
let sepia = null;
let invert = null;
let blur = null;
let edges = null;
let sharpen = null;

let initedFilters = false;

export function filter(state, filter) {
    if (!initedFilters) {
        initFilters(state.Module);
    }

    const filters = { greyscale, sepia, invert, blur, edges, sharpen };
    const filterFunc = filters[filter];

    if (!filterFunc) {
        return;
    }

    filterFunc(
        state.currentImagePtr,
        state.ctx.canvas.width,
        state.ctx.canvas.height,
    );
    updateCanvas(state);
}

function initFilters(Module) {
    greyscale = Module.cwrap('greyscale', null, ['number', 'number', 'number']);
    sepia = Module.cwrap('sepia', null, ['number', 'number', 'number']);
    invert = Module.cwrap('invert', null, ['number', 'number', 'number']);
    blur = Module.cwrap('blur', null, ['number', 'number', 'number']);
    edges = Module.cwrap('edges', null, ['number', 'number', 'number']);
    sharpen = Module.cwrap('sharpen', null, ['number', 'number', 'number']);

    initedFilters = true;
}
