import { updateCanvas } from './helpers.js';

let inited = false;
let greyscale = null;
let sepia = null;
let invert = null;
let resetC = null;

export function filter(state, filter) {
    if (!inited) {
        initFilters(state.Module);
    }

    const filters = { greyscale, sepia, invert, reset, blur, edges, sharpen };
    const filterFunc = filters[filter];

    if (
        filterFunc === greyscale ||
        filterFunc === sepia ||
        filterFunc === invert
    ) {
        filterFunc(
            state.currentImagePtr,
            state.ctx.canvas.width,
            state.ctx.canvas.height,
        );
        updateCanvas(state);
    } else if (filterFunc === reset) {
        filterFunc(state);
    } else {
        filterFunc(state.ctx);
    }
}

function initFilters(Module) {
    greyscale = Module.cwrap('greyscale', 'null', [
        'number',
        'number',
        'number',
    ]);

    sepia = Module.cwrap('sepia', 'null', ['number', 'number', 'number']);
    invert = Module.cwrap('invert', 'null', ['number', 'number', 'number']);
    resetC = Module.cwrap('reset_c', 'null', ['number', 'number', 'number']);

    inited = true;
}

function reset(state) {
    resetC(state.originalImagePtr, state.currentImagePtr, state.numBytes);
    updateCanvas(state);
}

function blur(ctx) {
    const oldImageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
    );
    const newImageData = ctx.createImageData(oldImageData);

    const oldData = oldImageData.data;
    const newData = newImageData.data;

    for (let i = 0; i < oldData.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % oldImageData.width;
        const y = (pixelIndex / oldImageData.width) | 0;

        let sumR = 0,
            sumG = 0,
            sumB = 0;

        let divisor = 0;

        for (let row = y - 1; row <= y + 1; row++) {
            if (row < 0) {
                continue;
            } else if (row >= oldImageData.height) {
                break;
            }

            for (let col = x - 1; col <= x + 1; col++) {
                if (col < 0) {
                    continue;
                } else if (col >= oldImageData.width) {
                    break;
                }

                const index = (row * oldImageData.width + col) * 4;
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

function edges(ctx) {
    const oldImageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
    );
    const newImageData = ctx.createImageData(oldImageData);

    const oldData = oldImageData.data;
    const newData = newImageData.data;

    const gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
    ];

    const gy = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
    ];

    for (let i = 0; i < oldData.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % oldImageData.width;
        const y = (pixelIndex / oldImageData.width) | 0;

        let sumRX = 0,
            sumGX = 0,
            sumBX = 0;
        let sumRY = 0,
            sumGY = 0,
            sumBY = 0;

        for (let row = y - 1; row <= y + 1; row++) {
            if (row < 0) {
                continue;
            }
            if (row >= oldImageData.height) {
                break;
            }

            const gxRow = row - (y - 1);

            for (let col = x - 1; col <= x + 1; col++) {
                if (col < 0) {
                    continue;
                }
                if (col >= oldImageData.width) {
                    break;
                }

                const gxCol = col - (x - 1);
                const index = (row * oldImageData.width + col) * 4;

                sumRX += oldData[index] * gx[gxRow][gxCol];
                sumGX += oldData[index + 1] * gx[gxRow][gxCol];
                sumBX += oldData[index + 2] * gx[gxRow][gxCol];

                sumRY += oldData[index] * gy[gxRow][gxCol];
                sumGY += oldData[index + 1] * gy[gxRow][gxCol];
                sumBY += oldData[index + 2] * gy[gxRow][gxCol];
            }
        }

        newData[i] = Math.sqrt(sumRX * sumRX + sumRY * sumRY) | 0;
        newData[i + 1] = Math.sqrt(sumGX * sumGX + sumGY * sumGY) | 0;
        newData[i + 2] = Math.sqrt(sumBX * sumBX + sumBY * sumBY) | 0;
        newData[i + 3] = oldData[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
}

function sharpen(ctx) {
    const oldImageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
    );
    const newImageData = ctx.createImageData(oldImageData);

    const oldData = oldImageData.data;
    const newData = newImageData.data;

    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0],
    ];

    for (let i = 0; i < oldData.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % oldImageData.width;
        const y = (pixelIndex / oldImageData.width) | 0;

        let newR = 0,
            newG = 0,
            newB = 0;

        for (let row = y - 1; row <= y + 1; row++) {
            if (row < 0) {
                continue;
            } else if (row >= oldImageData.height) {
                break;
            }

            const kRow = row - (y - 1);

            for (let col = x - 1; col <= x + 1; col++) {
                if (col < 0) {
                    continue;
                } else if (col >= oldImageData.width) {
                    break;
                }

                const kCol = col - (x - 1);
                const index = (row * oldImageData.width + col) * 4;

                newR += oldData[index] * kernel[kRow][kCol];
                newG += oldData[index + 1] * kernel[kRow][kCol];
                newB += oldData[index + 2] * kernel[kRow][kCol];
            }
        }

        newData[i] = newR;
        newData[i + 1] = newG;
        newData[i + 2] = newB;
        newData[i + 3] = oldData[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
}
