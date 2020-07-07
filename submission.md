## Correct by Construction: APIs That Are Easy to Use and Hard to Misuse

#### Talk abstract
C++ gives us an awful lot of powerful constructs to use when designing APIs: strong types, RAII, templates, virtual functions and more. Some are easier to use than others, and some might be easy to use but easy to misuse. In this talk, Matt will cover some of the techniques you can use in your API and code in general to make it more difficult for users to make mistakes. You'll leave the talk with some new ideas to try out in your code bases: your future users (maybe yourself the very next day...) will thank you!

#### Notes
* Use of strong types to avoid parameter order mistakes
* Parameter holder objects/ "named" parameters
* RAII to manage resources. Including some more interesting examples like complex invariant checking
* Passing lambdas to mutation APIs to temporarily grant access to private data to preserve invariants (e.g. locking discipline)
* Builder patterns for constructing complex objects and maintaining invariants, or for ease of downstream users.
* Overload sets for user convenience
* Good APIs are more testable
* And of course... because it's my passion, the performance impact of these choices, and how to gauge it.
