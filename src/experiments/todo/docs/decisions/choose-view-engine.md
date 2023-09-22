---
status: accepted
date: 2023-09-21
deciders: Ourchitecture
---

# Choose view engine

## Context and Problem Statement

ExpressJS applications require a "template engine" for rendering HTML on the
server. The previous default of "Jade" has been replaced by "Pug" and is the
new, default recommendation. However, there are several supported template
engines available.

## Considered Options

-   Old default Jade
-   New default Pug
-   Other template engines

## Decision Outcome

Keeping things simple, this project will use the new default "Pug" template
engine.

## Pros and Cons of the Options

-   Good, because it will be the default choice for future applications

## More Information

-   ExpressJS ["template engines"](https://expressjs.com/en/guide/using-template-engines.html)
-   ["Pug" template engine](https://pugjs.org/api/getting-started.html)
