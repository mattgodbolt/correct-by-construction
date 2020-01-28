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

* TODO come up with motivating example:
  - atomic updates required
  - probably read-modify-update
  - more complex than just += or -=
  - NO `Foo` or `Bar`, all must be real things
  
---

<pre><code class="cpp" data-trim>
class Splee
{
  std::mutex lock_;
  int a_{};
  int b_{};

public:
  void lock();
  void unlock();
  void setA(int a);
  void setB(int b);
};
</code></pre>

---

* atomic update function
* RAII return
* withLock()

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
