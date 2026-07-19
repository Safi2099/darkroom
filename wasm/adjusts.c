#include "operations.h"
#include <emscripten.h>

// Increase or decrease brightness of image
EMSCRIPTEN_KEEPALIVE
void brightness(Pixel *image, int width, int height, int amount)
{
    size_t total_pixels = (size_t) width * height;

    for (int i = 0; i < total_pixels; i++)
    {
        Pixel *p = &image[i];

        p->r = clamp(p->r + amount);
        p->g = clamp(p->g + amount);
        p->b = clamp(p->b + amount);
    }
}

// Increase or decrease contrast of image
EMSCRIPTEN_KEEPALIVE
void contrast(Pixel *image, int width, int height, float amount)
{
    size_t total_pixels = (size_t) width * height;
    int mid = 128;

    for (int i = 0; i < total_pixels; i++)
    {
        Pixel *p = &image[i];

        // Add 0.5 then truncate by casting to int, effectively
        // doing simple rounding; much faster than normal `round()`
        p->r = clamp((int) ((p->r - mid) * amount + mid + 0.5f));
        p->g = clamp((int) ((p->g - mid) * amount + mid + 0.5f));
        p->b = clamp((int) ((p->b - mid) * amount + mid + 0.5f));
    }
}
