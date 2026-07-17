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
Pixel *resize(Pixel *image, int old_width, int old_height, int new_width, int new_height)
{
    size_t num_bytes = new_width * new_height * sizeof(Pixel);
    Pixel *new = malloc(num_bytes);
    if (new == NULL)
    {
        return NULL;
    }

    for (int i = 0; i < new_height; i++)
    {
        for (int j = 0; j < new_width; j++)
        {
            int old_x = (j * old_width) / new_width;
            int old_y = (i * old_height) / new_height;

            PIXEL(new, i, j, new_width) = PIXEL(image, old_y, old_x, old_width);
        }
    }

    free(image);
    return new;
}

// Crop an image
EMSCRIPTEN_KEEPALIVE
Pixel *crop(Pixel *image, int ow, int oh, int nw, int nh, int cx, int cy)
{
    size_t num_bytes = nw * nh * sizeof(Pixel);
    Pixel *new = malloc(num_bytes);
    if (new == NULL)
    {
        return NULL;
    }

    for (int i = 0; i < nh; i++)
    {
        for (int j = 0; j < nw; j++)
        {
            int old_x = cx + j;
            int old_y = cy + i;

            PIXEL(new, i, j, nw) = PIXEL(image, old_y, old_x, ow);
        }
    }

    free(image);
    return new;
}
