export function transform(ctx, transform) {
    console.log('bananas');
    const transforms = { reflect };
    const tranformFunc = transforms[transform];

    if (tranformFunc) {
        tranformFunc(ctx);
        console.log('reflect called');
    }
}

export function reflect(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    const width = imageData.width;
    const halfWidth = (width / 2) | 0;

    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = (i / 4) | 0;
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

export function resize(ctx) {

}

export function crop(ctx) {

}

