---
status: accepted
date: 2023-09-21
deciders: Ourchitecture
---

# Choose server-side state management

## Context and Problem Statement

The first web applications were built with server-side state rather than
client-side state. Richer client-side application use cases have brought
improved client-side state solutions, but server-side state remains the
traditional solution for "trusted" and shared state.

## Considered Options

-   ExpressJS "cookie-session"
-   ExpressJS "express-session"
-   Other ExpressJS middleware

## Decision Outcome

Chose "express-session" for rich support for multiple backend storage options.
The "cookie-session" has storage limitations.

## Pros and Cons of the Options

-   Good, because it is a fairly ubiquitous selection for ExpressJS apps

## More Information

-   The ["express-session" middleware](https://github.com/expressjs/session#readme)
-   Related decision ["Choose server-side state storage"](./choose-server-side-state-storage.md)
