Story time

```cpp
void sendOrder(
    const char *symbol,
    bool buy,
    int shares,
    double price);
```

---

```cpp
void sendOrder(
    const Symbol &symbol,
    BuyOrSell buyOrSell,
    Quantity shares,
    Price price);
```


---

Notes!

* Smells
  * naked `new` or `delete`
  * apologetic comments: `// Must have the lock held`
* Techniques
  * Strong types
  * Parameter holder objects/ "named" parameters (see builders)
  * RAII
  * Lambdas (`runUnderLock(...)`)
  * Builder patterns
    * testing of same
* Testability
* Performance (!)

How to arrange?

* Initialisation and calling
  * types
  * parameter holders
  * builder patterns
* Lifetimes
  * RAII?
* Preserving Invariants
  * Locking
  * Using types (concepts?)