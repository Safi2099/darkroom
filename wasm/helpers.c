#include "operations.h"
#include <emscripten/em_macros.h>
#include <stdlib.h>
#include <string.h>

EMSCRIPTEN_KEEPALIVE
Pixel *init_original(size_t num_bytes)
{
    Pixel *original_buffer = malloc(num_bytes);
    if (original_buffer == NULL)
    {
        return NULL;
    }

    return original_buffer;
}

EMSCRIPTEN_KEEPALIVE
Pixel *init_current(size_t num_bytes, Pixel *original_buffer)
{
    Pixel *current_buffer = malloc(num_bytes);
    if (current_buffer && original_buffer)
    {
        memcpy(original_buffer, current_buffer, num_bytes);
    }
    else
    {
        return NULL;
    }

    return current_buffer;
}

EMSCRIPTEN_KEEPALIVE
void reset_c(Pixel *original_buffer, Pixel *current_buffer, size_t num_bytes)
{
    if (original_buffer && current_buffer)
    {
        memcpy(original_buffer, current_buffer, num_bytes);
    }
}
