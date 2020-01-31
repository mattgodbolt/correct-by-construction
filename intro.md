Story time

```cpp
void sendOrder(
    const char *symbol,
    bool buy,
    int shares,
    double price);
```

---

<pre><code class="cpp" data-line-numbers="|1|2|3" data-trim>
/* Buy 100 shares of Microsoft at a limit of $165 */
sendOrder("MSFT", true, 100, 165); 
/* Sell 165 shares of Microsoft at a limit of $100 */
sendOrder("MSFT", false, 165, 160); 
</code></pre>

---

### Overview
- Intro
  - C++ is powerful. Lots of choices
    - strong types
    - RAII
    - templates
    - virtual functions
  - What does it mean for users of your API?
    - You are your own user
- Story time (maybe)
  - strong types ftw
- Bank example
  - Simple version, no encaps. list<tx> and balance
  - Class invariants! sum(tx) == balance! Add functions
  - Hide data: encapsulation
  - Withdraw function -> `bool`.
    - `[[nodiscard]]`
  - `Money` type to get rid of `balanceInPennies`
    - show it has no overhead over `long`
    - maybe `[[nodiscard]]` can be shored up
  - Auditing...hiding `Transaction`, return const ref
    - discuss tradeoffs
  - Transfers between accounts
  - Threading!!
    - show mutex is easy to add! Yay thread safe
    - boo though:
      - (potential) deadlock between accounts
        - show how to get locks in order (is there a new thing for this?)
      - `const &` no longer good: approaches:
        - return a copy of Vector
          - what about the balanceInPennies?
        - return a snapshot of the class
        - `runUnderLock()`
  - Final version
- Other techniques
  - builder pattern/named paramters
  - Type gymnastics ; returning proxy objects which only allow "next" thing to be done? (Jordan's idea from below)
- Review and Conclusion
  - Strong types
  - RAII
  - Encapsulation
  - Lambdas/passing in mutation functions
  - `static_assert`

---

* TODO come up with motivating example:
  - atomic updates required
  - probably read-modify-update
  - more complex than just += or -=
  - NO `Foo` or `Bar`, all must be real things
  - gonna be shown in UK and france, so amusing theme?
  - could be protecting a `map` or something more complex
  
---

# Case study?

struct Account {
  vector<Tx> transaction;
  long balanceInPennies;
  // overdraft?
};

thread safe!

struct Account {
  mutex lock;
  vector<Tx> transaction_; // must have lock!
  long balanceInPennies_; // must have lock
};

MAYBE?
* account and txes
* data hiding
* give behaviour, "credit" and "debit"
* `long` -> `Money` class? Show ratio class? types/dimensions?
* maybe-->
  * apply transaction (pointer?) could show lifetime there
* add a `const` reference to transactions.. it's `const`!!!!
  * show that threading will be a problem! what if it changes under us
* "Audit" long-lived thread?
  * add lock/unlock, show it's a problem
  * return `unique_lock`, show what if we look at the transactions
* Actual transfers between accounts?
  * consistent locking behaviour?

<pre><code class="cpp" data-trim>
class Account
{
  std::mutex lock_;
  std::vector&lt;Transactions> transactions_;
  long balanceInPennies_;

public:
  void deposit(long pennies);
  bool withdraw(long pennies); // here's another one...? `[[nodiscard]]` ? Some type that has to be explicitly zeroed?
  const vector&lt;Tx> transactions() const; // uh oh  
};
</code></pre>

---

* NB apologetic comment smell
* atomic update function
* RAII return unique_lock
* withLock()/forEach() type thing

---

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
  * "commit" pattern
  * Using types (concepts?)
  
Thoughts from Ben:
* Clojure's "actor pattern" means you have to pass functions to mutate state (like lambda thing)
* strings are a common source of things that could be more constrained by construction:
  * GUIDs
  * URLs
  
Also:
* linting tools
* sanitizers?

More thoughts:
* SignedQty vs (non-signed) Quantity?


* jordan mentioned "call doX then doY" -> instead doX return object with only "doY"
  - "commit" mutation? (commit pattern above)