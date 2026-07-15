#include "operations.h"
#include <emscripten.h>

static inline void swap(Pixel *p1, Pixel *p2)
{
    Pixel tmp = *p1;
    *p1 = *p2;
    *p2 = tmp;
}

// Flip an image horizontally
EMSCRIPTEN_KEEPALIVE
void flip_h(Pixel *image, int width, int height)
{
    int half_width = width / 2;
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < half_width; j++)
        {
            swap(&PIXEL(image, i, j, width), &PIXEL(image, i, width - j - 1, width));
        }
    }
}

// Flip an image vertically
EMSCRIPTEN_KEEPALIVE
void flip_v(Pixel *image, int width, int height)
{
    int half_height = height / 2;
    for (int i = 0; i < half_height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            swap(&PIXEL(image, i, j, width), &PIXEL(image, height - i - 1, j, width));
        }
    }
}

// Resize an image (Nearest Neighbour)
EMSCRIPTEN_KEEPALIVE
void resize(Pixel *image, int width, int height) {}

// Crop an image
EMSCRIPTEN_KEEPALIVE
void crop(Pixel *image, int width, int height) {}
