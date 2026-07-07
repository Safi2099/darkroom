export function filter(ctx, filter) {
    const filters = { greyscale, sepia, invert, blur, edges, sharpen };
    const filterFunc = filters[filter];

    if (filterFunc) {
        filterFunc(ctx);
    }
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
        const pixelIndex = i / 4;
        const x = pixelIndex % oldImageData.width;
        const y = (pixelIndex / oldImageData.width) | 0;

        let sumR = 0, sumG = 0, sumB = 0;

        let divisor = 0;

        for (let row = y - 1; row <= y + 1; row++) {
            if (row < 0) {
                continue;
            }
            else if (row >= oldImageData.height) {
                break;
            }

            for (let col = x - 1; col <= x + 1; col++) {
                if (col < 0) {
                    continue;
                }
                else if (col >= oldImageData.width) {
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

export function edges(ctx) {
    const oldImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
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
    ]

    for (let i = 0; i < oldData.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % oldImageData.width;
        const y = (pixelIndex / oldImageData.width) | 0;

        let sumRX = 0, sumGX = 0, sumBX = 0;
        let sumRY = 0, sumGY = 0, sumBY = 0;

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

export function sharpen(ctx) {
    const oldImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const newImageData = ctx.createImageData(oldImageData);

    const oldData = oldImageData.data;
    const newData = newImageData.data;

    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ]

    for (let i = 0; i < oldData.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % oldImageData.width;
        const y = (pixelIndex / oldImageData.width) | 0;

        let newR = 0, newG = 0, newB = 0;

        for (let row = y - 1; row <= y + 1; row++) {
            if (row < 0) {
                continue;
            }
            else if (row >= oldImageData.height) {
                break;
            }

            const kRow = row - (y - 1);

            for (let col = x - 1; col <= x + 1; col++) {
                if (col < 0) {
                    continue;
                }
                else if (col >= oldImageData.width) {
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

