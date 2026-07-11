#ifndef OPERATIONS_H
#define OPERATIONS_H

#include <stdint.h>

typedef struct
{
    uint8_t r, g, b, a;
} Pixel;

#define PIXEL(image, x, y, width) ((image)[((y) * (width)) + (x)])

#endif
