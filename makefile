# This is a convenience file.
# Using `pnpm` commands is preferred and is a prerequisite.

.DEFAULT_GOAL:=all

all: check

.PHONY: init
init:
	@pnpm install --frozen-lockfile

.PHONY: check
check: init
	@pnpm check

.PHONY: format
format: init
	@pnpm format
