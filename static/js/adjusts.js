export function adjust(ctx, adjust, amount) {
    const adjusts = { brightness, contrast };
    const adjustFunc = adjusts[adjust];

    if (adjustFunc) {
        adjustFunc(ctx, amount);
    }
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
