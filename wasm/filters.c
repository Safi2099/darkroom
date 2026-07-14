#include "operations.h"
#include <emscripten.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

// Clamp an RGB value
static inline int clamp(int x)
{
    return (x > 255) ? 255 : ((x < 0) ? 0 : x);
}

// Apply greyscale filter to image
EMSCRIPTEN_KEEPALIVE
void greyscale(Pixel *image, int width, int height)
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            Pixel *p = &PIXEL(image, i, j, width);

            int average = round((p->r + p->g + p->b) / 3.0);
            p->r = average;
            p->g = average;
            p->b = average;
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
            Pixel *p = &PIXEL(image, i, j, width);

            int orig_r = p->r;
            int orig_g = p->g;
            int orig_b = p->b;

            p->r = clamp(round(.393 * orig_r + .769 * orig_g + .189 * orig_b));
            p->g = clamp(round(.349 * orig_r + .686 * orig_g + .168 * orig_b));
            p->b = clamp(round(.272 * orig_r + .534 * orig_g + .131 * orig_b));
        }
    }
}

// Apply invert filter to image
EMSCRIPTEN_KEEPALIVE
void invert(Pixel *image, int width, int height)
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            Pixel *p = &PIXEL(image, i, j, width);

            p->r = 255 - p->r;
            p->g = 255 - p->g;
            p->b = 255 - p->b;
        }
    }
}

// Apply blur filter to image
EMSCRIPTEN_KEEPALIVE
void blur(Pixel *image, int width, int height)
{
    size_t num_bytes = width * height * 4;
    Pixel *copy = malloc(num_bytes);
    if (copy == NULL)
    {
        return;
    }

    memcpy(copy, image, num_bytes);

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int sum_red = 0;
            int sum_green = 0;
            int sum_blue = 0;

            float divisor = 0;

            for (int row = i - 1; row <= i + 1; row++)
            {
                if (row < 0)
                    continue;
                if (row >= height)
                    break;

                for (int col = j - 1; col <= j + 1; col++)
                {
                    if (col < 0)
                        continue;
                    if (col >= width)
                        break;

                    Pixel p = PIXEL(copy, row, col, width);

                    sum_red += p.r;
                    sum_green += p.g;
                    sum_blue += p.b;

                    divisor++;
                }
            }

            Pixel *p = &PIXEL(image, i, j, width);

            p->r = round(sum_red / divisor);
            p->g = round(sum_green / divisor);
            p->b = round(sum_blue / divisor);
        }
    }

    free(copy);
}

// Apply Sobel edge detection filter to image
EMSCRIPTEN_KEEPALIVE
void edges(Pixel *image, int width, int height)
{
    size_t num_bytes = width * height * 4;
    Pixel *copy = malloc(num_bytes);
    if (copy == NULL)
    {
        return;
    }

    memcpy(copy, image, num_bytes);

    int gx[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
    int gy[3][3] = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int sum_redx = 0;
            int sum_greenx = 0;
            int sum_bluex = 0;

            int sum_redy = 0;
            int sum_greeny = 0;
            int sum_bluey = 0;

            for (int row = i - 1; row <= i + 1; row++)
            {
                if (row < 0)
                    continue;
                if (row >= height)
                    break;

                int gx_row = row - (i - 1);

                for (int col = j - 1; col <= j + 1; col++)
                {
                    if (col < 0)
                        continue;
                    if (col >= width)
                        break;

                    int gx_col = col - (j - 1);

                    Pixel p = PIXEL(copy, row, col, width);

                    sum_redx += p.r * gx[gx_row][gx_col];
                    sum_greenx += p.g * gx[gx_row][gx_col];
                    sum_bluex += p.b * gx[gx_row][gx_col];

                    sum_redy += p.r * gy[gx_row][gx_col];
                    sum_greeny += p.g * gy[gx_row][gx_col];
                    sum_bluey += p.b * gy[gx_row][gx_col];
                }
            }

            Pixel *p = &PIXEL(image, i, j, width);

            p->r = clamp(round(sqrt(sum_redx * sum_redx + sum_redy * sum_redy)));
            p->g = clamp(round(sqrt(sum_greenx * sum_greenx + sum_greeny * sum_greeny)));
            p->b = clamp(round(sqrt(sum_bluex * sum_bluex + sum_bluey * sum_bluey)));
        }
    }

    free(copy);
}

// Apply Laplacian Sharpen filter to image
EMSCRIPTEN_KEEPALIVE
void sharpen(Pixel *image, int width, int height)
{
    size_t num_bytes = width * height * 4;
    Pixel *copy = malloc(num_bytes);
    if (copy == NULL)
    {
        return;
    }

    memcpy(copy, image, num_bytes);

    int kernel[3][3] = {{0, -1, 0}, {-1, 5, -1}, {0, -1, 0}};

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int new_r = 0;
            int new_g = 0;
            int new_b = 0;

            for (int row = i - 1; row <= i + 1; row++)
            {
                if (row < 0)
                    continue;
                if (row >= height)
                    break;

                int k_row = row - (i - 1);

                for (int col = j - 1; col <= j + 1; col++)
                {
                    if (col < 0)
                        continue;
                    if (col >= width)
                        break;

                    int k_col = col - (j - 1);

                    Pixel p = PIXEL(copy, row, col, width);

                    new_r += p.r * kernel[k_row][k_col];
                    new_g += p.g * kernel[k_row][k_col];
                    new_b += p.b * kernel[k_row][k_col];
                }
            }

            Pixel *p = &PIXEL(image, i, j, width);

            p->r = clamp(new_r);
            p->g = clamp(new_g);
            p->b = clamp(new_b);
        }
    }

    free(copy);
}
