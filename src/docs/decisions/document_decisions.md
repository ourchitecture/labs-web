---
# These are optional elements. Feel free to remove any of them.
status: accepted
date: 2023-09-19
deciders: Ourchitecture
---

# Document important decisions

## Context and Problem Statement

Important decisions have a context including a history, why a decision had to be made, and the details of how a decision was made. Understanding these decisions and their history can help others to understand the types of important decision considerations that have been made.

## Decision Drivers

-   Improve understanding of important decisions
-   Empower informed decision making

## Considered Options

-   Not documenting decisions
-   Documenting decisions
-   Which tools to use

## Decision Outcome

Document decisions with "Markdown Any Decision Records" (MADR); familiar with it and good enough.

Decisions will be stored in the "./src/docs/decisions/" directory with a conventionally formatted, lowercase, and hyphenated file name of "[verb]\_[the-nouns].md", where "[verb]" is the action the decision focus on and "[the-nouns"] are a hyphenated sequence of noun the decision takes action on.

-   The file name begins with a present tense imperative verb followed by a supporting phrase. This helps readability and matches our commit message format.
-   The file name uses lowercase with an underscore after the verb and before the phrase with hyphens / dashes separating the words in the phrase. This is a balance of readability and system usability.
-   The extension is markdown. This can be useful for easy formatting.

### Consequences

-   Good, because all current developers agree

## More Information

-   [MADR website](https://adr.github.io/madr/)
