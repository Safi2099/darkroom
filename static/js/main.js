const imageInput = document.getElementById('image');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
canvas.id = 'canvas';

imageInput.addEventListener('change', function() {
    const imageFile = imageInput.files[0];
    if (imageFile) {
        canvasContainer.appendChild(canvas);
        const image = new Image();

        image.src = URL.createObjectURL(imageFile);

        image.onload = function() {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx.drawImage(image, 0, 0);
        }
    }
});
