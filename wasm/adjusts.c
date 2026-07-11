#include "operations.h"
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void brightness(Pixel *image, int width, int height, int amount) {}

EMSCRIPTEN_KEEPALIVE
void contrast(Pixel *image, int width, int height, int amount) {}
