export function transform(ctx, transform) {
    const transforms = { reflect, resize };
    const transformFunc = transforms[transform];

    if (transformFunc === resize) {
        const ratio = ctx.canvas.width / ctx.canvas.height;
        const inputDialog = document.getElementById('resize-dialog');
        const widthInput = document.getElementById('resize-width-input');
        const heightText = document.getElementById('resize-height-text');
        const dialogForm = document.getElementById('resize-form');
        let width;
        let height;

        inputDialog.showModal();

        widthInput.addEventListener('input', function(event) {
            heightText.textContent = Math.round(Number(event.target.value) / ratio);
        });

        dialogForm.addEventListener('submit', function() {
            width = Number(widthInput.value);
            height = Number(heightText.textContent);

            widthInput.value = '';
            heightText.textContent = '';

            if (width > 0 && height > 0) {
                transformFunc(ctx, width, height);
            }
        });
    }
    else {
        transformFunc(ctx);
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

export function resize(ctx, width, height) {
}

export function crop(ctx) {

}

