## Hello!

* Games
* C++ Tools
* Finance

---

## Correct by construction?

<span class="fragment">If it compiles, it's<span class="fragment" data-fragment-index="2"> (probably) </span>right</span>

---

## C++ has

* Strong types
* RAII
* `const` & `constexpr`
* Lambdas

---

## "But I don't make libraries"

* amusing stuffz here? 

---

## Strong Types

---

## Disaster waiting to happen

<pre><code class="cpp" data-line-numbers="|1|3-5|6-8" data-trim>
void sendOrder(const char *symbol, bool buy, int qty, double price);
/* ... */
void sellMyGoogleShares() {
  sendOrder("GOOG", false, 100, 1000);
}
void expensiveMistake() {
  sendOrder("GOOG", false, 1000, 100);
}
</code></pre>
