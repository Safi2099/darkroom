#include "operations.h"
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void reflect(Pixel *image, int width, int height) {}

EMSCRIPTEN_KEEPALIVE
void resize(Pixel *image, int width, int height) {}

EMSCRIPTEN_KEEPALIVE
void crop(Pixel *image, int width, int height) {}
