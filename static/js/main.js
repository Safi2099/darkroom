const imageInput = document.getElementById('image');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let originalImageData;
let image;

imageInput.addEventListener('change', function() {
    const imageFile = imageInput.files[0];
    if (imageFile) {
        canvasContainer.appendChild(canvas);
        image = new Image();

        image.src = URL.createObjectURL(imageFile);

        image.onload = function() {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx.drawImage(image, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }
});

function greyScale(ctx, imageData) {
    const newImageData = ctx.createImageData(canvas.width, canvas.height);
    const originalPixels = imageData.data;
    const newPixels = newImageData.data;

    for (let i = 0; i < originalPixels.length; i += 4) {
        const average = ((originalPixels[i] + originalPixels[i + 1] + originalPixels[i + 2]) / 3) | 0;

        newPixels[i] = average;
        newPixels[i + 1] = average;
        newPixels[i + 2] = average;
        newPixels[i + 3] = 255;
    }

    ctx.putImageData(newImageData, 0, 0);
}

function reset(ctx, originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
}

function imageOK() {
    return image !== undefined && originalImageData !== undefined && image.complete && image.naturalWidth !== 0;
}

const greyScaleButton = document.getElementById('grey-scale-button');
greyScaleButton.addEventListener('click', function() {
    if (imageOK()) {
        greyScale(ctx, originalImageData);
    }
    else {
        console.log('image not loaded yet');
    }
})

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', function() {
    if (imageOK()) {
        reset(ctx, originalImageData);
    }
    else {
        console.log('image not loaded yet');
    }
})

const exportButton = document.getElementById('export-button');
exportButton.addEventListener('click', function() {
    if (imageOK()) {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = "file.png";
            link.href = url;
            link.click();
        })
    }
})
