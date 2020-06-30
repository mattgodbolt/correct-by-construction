
---

### Overview
- Intro
  - C++ is powerful. Lots of choices
    - strong types
    - RAII
    - templates
    - virtual functions
  - What does it mean for users of your API?
    - why care? I just write apps?
    - You are your own user
    - Nobody is as dumb as "tomorrow-you"
    - Nobody's API design sucks as much as "yesterday you"
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
    - user-defined literals, good for tests!
  - Auditing...hiding `Transaction`, return const ref
    - discuss tradeoffs
  - Transfers between accounts
  - Threading!!
    - show mutex is easy to add! Yay thread safe
    - boo though:
      - (potential) deadlock between accounts
        - show how to get locks in order (is there a new thing for this?)
          - `std::lock()` and `std::scoped_lock` to look at
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

Ideas for named params

- need motivating example for defaults?
```cpp
void trade(BuySell s, Stock stock, Price target, Qty qty,
           optional<Price> minPx,
           optional<Price> maxPx,
           optional<duration> blah);
struct AlgoParams {
    AlgoParams(required params);
    AlgoParams &withMinPx(...);
};

trade(Buy, GOOG, 12_dollars, 50_qty,
     AlgoParams()
        .withMinPx(12).withMaxPx(123);

```

maybe?

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
  - this is the TypeRegistry/Scope thing?
  
- auto and expensive copy construction.
  
CppCast with Hana on C++20 talked about deprecating, making `bool` param from `const char *` etc bad
Maybe look into and show this?

### principal of least surprise

...

the "assert(false);" antipattern https://github.com/NREL/EnergyPlus/blob/develop/third_party/ObjexxFCL/src/ObjexxFCL/IOFlags.cc#L47-L67

* maybe can use kids as "spanish inquisition" live gag?



New list:
* INTRO
* Pontification
  * Good code is like Lego
  * Bad code should be hard to write
  * API design can help that
  * "if it compiles, it works" good to aim at
  * Principal of least surprise (maybe?)
    * minimise side effects (logging, printing, etc)
  * Comments as a smell?
* Strong value types
  * motivating examples
* Two phase construction? avoid? (set up for below)
* Parameters
  * Use strong types
  * Avoid bools, same type twice
  * Reduce number of params
    * parameter holders?
    * builders?
* lock...unlock
  * RAII
  * pre/post conditions? 
    * runUnderLock
* references? pointers?
  * using const ref
    * keeping a ref...
  * Using u_ptr and s_ptr or non_owning ptr etc
* templatery
  * static assert
  * concepts?
* Conclusion!
  * One line recap for each?
  * Thank you


- work in progress on price and quantity classes:
  - https://godbolt.org/z/j56zuY

- work in progress on message
  - https://godbolt.org/z/nMp3nI


### first run at home
- timings
  - 18m to "Performance"
  - 25m to "Market Data"
  - 32m to lambdas
  - 40m clearly "done" but not really done well 
