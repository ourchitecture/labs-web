# This is a convenience file.
# Using `pnpm` commands is preferred and is a prerequisite.

# ".DEFAULT_GOAL" instructs which target to use when just `make` is executed
.DEFAULT_GOAL:=all

# "all" is a standard make target
all: check

.PHONY: init
init:
	@pnpm install --recursive --frozen-lockfile

# "check" is a standard make target
.PHONY: check
check: init
	@pnpm test

.PHONY: test
test: check

.PHONY: format
format: init
	@pnpm format
