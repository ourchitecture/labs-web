---
status: accepted
date: 2023-09-21
deciders: Ourchitecture
---

# Choose server-side state storage

## Context and Problem Statement

Building on the decision to use "express-session", the technology for backend
storage must be selected.

## Considered Options

-   Default in-memory storage
-   Redis storage
-   Other storage e.g. database, file system, etc.

## Decision Outcome

Keeping it simple, in-memory storage was selected.

## Pros and Cons of the Options

-   Good, it is the default of the "express-session" middleware
-   Bad, because it would not scale across a multi-server environment

## More Information

-   [Store options for "express-session"](https://github.com/expressjs/session#store)
-   Related decision ["Choose server-side state management"](./choose-server-side-state-management.md)
