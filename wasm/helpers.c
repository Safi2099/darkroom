#include "operations.h"
#include <emscripten/em_macros.h>
#include <stdlib.h>
#include <string.h>

EMSCRIPTEN_KEEPALIVE
Pixel *init_current(size_t num_bytes)
{
    Pixel *current_buffer = malloc(num_bytes);
    if (current_buffer == NULL)
    {
        return NULL;
    }

    return current_buffer;
}

EMSCRIPTEN_KEEPALIVE
void free_prev(Pixel *buffer)
{
    free(buffer);
}
