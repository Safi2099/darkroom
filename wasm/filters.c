#include "operations.h"
#include <emscripten.h>
#include <math.h>

// Prototype
static inline int clamp(int x);

// Apply greyscale filter to image
EMSCRIPTEN_KEEPALIVE
void greyscale(Pixel *image, int width, int height)
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            Pixel p = PIXEL(image, j, i, width);

            int average = round((p.r + p.g + p.b) / 3.0);
            p.r = average;
            p.g = average;
            p.b = average;

            PIXEL(image, j, i, width) = p;
        }
    }
}

// Apply Sepia filter to image
EMSCRIPTEN_KEEPALIVE
void sepia(Pixel *image, int width, int height)
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            Pixel p = PIXEL(image, j, i, width);

            int orig_r = p.r;
            int orig_g = p.g;
            int orig_b = p.b;

            p.r = clamp(round(.393 * orig_r + .769 * orig_g + .189 * orig_b));
            p.g = clamp(round(.349 * orig_r + .686 * orig_g + .168 * orig_b));
            p.b = clamp(round(.272 * orig_r + .534 * orig_g + .131 * orig_b));

            PIXEL(image, j, i, width) = p;
        }
    }
}

// Clamp Sepia values
static inline int clamp(int x)
{
    return (x > 255) ? 255 : x;
}

// Apply invert filter to image
EMSCRIPTEN_KEEPALIVE
void invert(Pixel *image, int width, int height)
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            Pixel p = PIXEL(image, j, i, width);

            p.r = 255 - p.r;
            p.g = 255 - p.g;
            p.b = 255 - p.b;

            PIXEL(image, j, i, width) = p;
        }
    }
}

// Apply blur filter to image
EMSCRIPTEN_KEEPALIVE
void blur(Pixel *image, int width, int height) {}

// Apply Sobel edge detection filter to image
EMSCRIPTEN_KEEPALIVE
void edges(Pixel *image, int width, int height) {}

// Apply sharpen filter to image
EMSCRIPTEN_KEEPALIVE
void sharpen(Pixel *image, int width, int height) {}
