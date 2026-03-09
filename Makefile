.PHONY: serve build clean

VENV := .venv
export NO_MKDOCS_2_WARNING := 1
MKDOCS := $(VENV)/bin/mkdocs


build: $(VENV)
	@echo "==> Building documentation..."
	$(MKDOCS) build

$(VENV):
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install 'mkdocs<2' mkdocs-material pymdown-extensions

serve: $(VENV)
	@echo "==> Serving documentation at http://localhost:8000"
	@$(MKDOCS) serve & PID=$$!; trap 'kill $$PID 2>/dev/null; exit 0' INT TERM; wait $$PID

clean:
	@echo "==> Cleaning documentation build..."
	rm -rf site $(VENV)
