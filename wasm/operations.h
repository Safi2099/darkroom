#ifndef OPERATIONS_H
#define OPERATIONS_H

#include <stdint.h>

// Clamp an RGB value
static inline int clamp(int x)
{
    return (x > 255) ? 255 : ((x < 0) ? 0 : x);
}

// Pixel struct
typedef struct
{
    uint8_t r, g, b, a;
} Pixel;

// Improves readability when accessing pixels
#define PIXEL(image, i, j, width) ((image)[((i) * (width)) + (j)])

#endif
