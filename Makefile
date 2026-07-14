EMCC = emcc
WASM_SRC_DIR = wasm
WASM_OUT_DIR = static/wasm

TARGET_JS = $(WASM_OUT_DIR)/wasm.js
SRCS = $(wildcard $(WASM_SRC_DIR)/*.c)

OPT_FLAGS = -O3
EXPORT_FLAGS = -s EXPORTED_RUNTIME_METHODS=ccall,cwrap,HEAPU8 -s EXPORT_ES6=1

all: $(TARGET_JS)

$(TARGET_JS): $(SRCS)
	$(EMCC) $(SRCS) \
		-o $(TARGET_JS) \
		$(EXPORT_FLAGS) \
		$(OPT_FLAGS)

clean:
	rm -f $(WASM_OUT_DIR)/*

.PHONY: all clean
