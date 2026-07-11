#include "operations.h"
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void greyscale(Pixel *image, int width, int height) {}

EMSCRIPTEN_KEEPALIVE
void sepia(Pixel *image, int width, int height) {}

EMSCRIPTEN_KEEPALIVE
void invert(Pixel *image, int width, int height) {}

EMSCRIPTEN_KEEPALIVE
void blur(Pixel *image, int width, int height) {}

EMSCRIPTEN_KEEPALIVE
void edges(Pixel *image, int width, int height) {}

EMSCRIPTEN_KEEPALIVE
void sharpen(Pixel *image, int width, int height) {}
