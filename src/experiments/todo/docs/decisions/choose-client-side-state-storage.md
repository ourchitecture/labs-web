---
status: accepted
date: 2023-09-21
deciders: Ourchitecture
---

# Choose client-side state storage

## Context and Problem Statement

Web browsers have evolved to support rich, client-side storage options.
Libraries exist as abstractions to improve the API to these capabilities.

## Considered Options

-   Custom code against native browser capabilities
-   Ionic Framework's "@ionic/storage"
-   Other JavaScript packages

## Decision Outcome

Use "@ionic/storage".

## Pros and Cons of the Options

-   Good, because the team is already familiar with "@ionic/storage"

## More Information

-   ["@ionic/storage"](https://github.com/ionic-team/ionic-storage)
