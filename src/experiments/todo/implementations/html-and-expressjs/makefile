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

.PHONY: start
start:
	@DEBUG=html-and-expressjs:* & pnpm start
